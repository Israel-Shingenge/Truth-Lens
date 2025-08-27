import { useState } from 'react';
import { PlusCircle, Image, Link2, AlertTriangle, Shield } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';
import { Post, UserState } from '../App';
import { ContentModerationService, UserViolationTracker, ModerationResult } from './ContentModerationService';

interface CreatePostCardProps {
  onCreatePost: (post: Omit<Post, 'id' | 'timestamp' | 'upvotes' | 'downvotes' | 'comments' | 'isUpvoted' | 'isDownvoted'>) => void;
  currentUser: UserState;
  onUserViolation: (reason: string) => void;
}

export function CreatePostCard({ onCreatePost, currentUser, onUserViolation }: CreatePostCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [community, setCommunity] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moderationWarning, setModerationWarning] = useState<ModerationResult | null>(null);

  const moderationService = ContentModerationService.getInstance();

  const communities = [
    'Media Literacy',
    'Digital Safety', 
    'Environmental Action',
    'Tech Education',
    'Youth Advocacy'
  ];

  const suggestedTags = [
    'fact-checking', 'deepfakes', 'climate', 'social-media', 'privacy',
    'ai', 'misinformation', 'verification', 'education', 'activism'
  ];

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleAddSuggestedTag = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Check content for violations as user types
  const handleContentChange = (value: string) => {
    setContent(value);
    
    if (value.length > 50) { // Only check after meaningful content
      const result = moderationService.checkForInappropriateContent(value);
      if (result.isViolation && result.severity !== 'low') {
        setModerationWarning(result);
      } else {
        setModerationWarning(null);
      }
    } else {
      setModerationWarning(null);
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    
    if (value.length > 10) { // Check title for violations
      const result = moderationService.checkForInappropriateContent(value);
      if (result.isViolation) {
        setModerationWarning(result);
      } else if (!content || content.length <= 50) {
        setModerationWarning(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !community) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Final moderation check
      const titleResult = moderationService.checkForInappropriateContent(title);
      const contentResult = moderationService.checkForInappropriateContent(content);
      
      const hasViolation = titleResult.isViolation || contentResult.isViolation;
      const worstViolation = titleResult.severity === 'high' || contentResult.severity === 'high' ? 
        (titleResult.severity === 'high' ? titleResult : contentResult) :
        (titleResult.isViolation ? titleResult : contentResult);

      if (hasViolation) {
        // Record the violation
        UserViolationTracker.addViolation(
          currentUser.id,
          `${title} ${content}`,
          worstViolation.violationType,
          worstViolation.severity
        );

        // Show different responses based on severity
        if (worstViolation.severity === 'high') {
          toast.error('Content blocked: Serious community guideline violation detected');
          
          // Check if user should be logged out
          if (UserViolationTracker.shouldLogoutUser(currentUser.id)) {
            onUserViolation('Multiple serious violations of community guidelines detected.');
            return;
          }
        } else if (worstViolation.severity === 'medium') {
          toast.error('Content blocked: Community guideline violation detected');
        } else {
          toast.warning('Content flagged: Please review and edit your post');
        }

        // Show specific violation information
        toast.error(`Violation: ${worstViolation.reason}`);
        
        if (worstViolation.flaggedWords.length > 0) {
          toast.info(`Flagged terms: ${worstViolation.flaggedWords.join(', ')}`);
        }

        setIsSubmitting(false);
        return;
      }

      // Content passed moderation, create the post
      const newPost = {
        title: title.trim(),
        content: content.trim(),
        author: currentUser.username,
        authorAvatar: "/api/placeholder/32/32",
        community,
        tags
      };
      
      onCreatePost(newPost);
      
      // Reset form
      setTitle('');
      setContent('');
      setCommunity('');
      setTags([]);
      setModerationWarning(null);
      setIsOpen(false);
      
      toast.success('Discussion posted successfully!');
      
    } catch (error) {
      toast.error('Failed to post discussion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setTitle('');
    setContent('');
    setCommunity('');
    setTags([]);
    setNewTag('');
    setModerationWarning(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <PlusCircle className="h-5 w-5" />
              <span>Start a discussion about digital literacy, misinformation, or youth advocacy...</span>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Start a New Discussion</span>
            <Shield className="h-4 w-4 text-primary" />
          </DialogTitle>
          <DialogDescription>
            Share your thoughts, ask questions, or discuss important topics with the youth community.
            All content is moderated to ensure a safe environment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Moderation Warning */}
          {moderationWarning && (
            <Alert variant={moderationWarning.severity === 'high' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Content Warning</p>
                  <p className="text-sm">{moderationWarning.reason}</p>
                  {moderationWarning.flaggedWords.length > 0 && (
                    <p className="text-xs">Flagged terms: {moderationWarning.flaggedWords.join(', ')}</p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Select value={community} onValueChange={setCommunity}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a community *" />
            </SelectTrigger>
            <SelectContent>
              {communities.map((comm) => (
                <SelectItem key={comm} value={comm}>
                  {comm}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <Input
              placeholder="Discussion title *"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              maxLength={200}
            />
            <div className="text-xs text-muted-foreground text-right">
              {title.length}/200
            </div>
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Share your thoughts, experiences, or questions. Remember to include credible sources when discussing facts or claims... *"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              rows={6}
              maxLength={3000}
            />
            <div className="text-xs text-muted-foreground text-right">
              {content.length}/3000
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex space-x-2">
              <Input
                placeholder="Add custom tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1"
                maxLength={20}
              />
              <Button 
                type="button" 
                onClick={handleAddTag} 
                variant="outline"
                disabled={!newTag.trim() || tags.length >= 5}
              >
                Add
              </Button>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Suggested tags:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={`cursor-pointer hover:bg-accent ${
                      tags.includes(tag) ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => handleAddSuggestedTag(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {tags.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected tags:</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="default"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      #{tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="text-xs text-muted-foreground">
              {tags.length}/5 tags • Click selected tags to remove
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Community Safety Guidelines:</p>
                <p>All content is automatically checked for hate speech, harassment, threats, and inappropriate material. 
                Violations may result in content removal and account suspension. Please keep discussions respectful and constructive.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                <Image className="h-4 w-4 mr-2" />
                Image
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Link2 className="h-4 w-4 mr-2" />
                Link
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!title.trim() || !content.trim() || !community || isSubmitting || (moderationWarning && moderationWarning.severity === 'high')}
              >
                {isSubmitting ? 'Checking Content...' : 'Post Discussion'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}