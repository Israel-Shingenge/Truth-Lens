import { useState } from 'react';
import { ArrowUp, ArrowDown, MessageSquare, Share2, Bookmark, BookmarkCheck, Flag, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';
import { Post, Comment, UserState } from '../App';
import { ContentModerationService, UserViolationTracker, ModerationResult } from './ContentModerationService';

interface PostCardProps {
  post: Post;
  currentUser: UserState;
  onVote: (postId: number, voteType: 'up' | 'down') => void;
  onSave: (postId: number) => void;
  onAddComment: (postId: number, content: string) => void;
  onVoteComment: (postId: number, commentId: number, voteType: 'up' | 'down', isReply?: boolean, parentId?: number) => void;
  onUserViolation: (reason: string) => void;
  savedPosts: Set<number>;
}

export function PostCard({ 
  post, 
  currentUser, 
  onVote, 
  onSave, 
  onAddComment, 
  onVoteComment, 
  onUserViolation,
  savedPosts 
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [moderationWarning, setModerationWarning] = useState<ModerationResult | null>(null);

  const moderationService = ContentModerationService.getInstance();
  const isSaved = savedPosts.has(post.id);

  const handleUpvote = () => {
    onVote(post.id, 'up');
  };

  const handleDownvote = () => {
    onVote(post.id, 'down');
  };

  const handleSave = () => {
    onSave(post.id);
    toast.success(isSaved ? 'Discussion removed from saved' : 'Discussion saved!');
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/discussion/${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Discussion link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleCommentChange = (value: string) => {
    setNewComment(value);
    
    if (value.length > 20) {
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

  const handleReplyChange = (value: string) => {
    setReplyContent(value);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);

    try {
      // Check for content violations
      const result = moderationService.checkForInappropriateContent(newComment);
      
      if (result.isViolation) {
        // Record the violation
        UserViolationTracker.addViolation(
          currentUser.id,
          newComment,
          result.violationType,
          result.severity
        );

        if (result.severity === 'high') {
          toast.error('Comment blocked: Serious community guideline violation detected');
          
          if (UserViolationTracker.shouldLogoutUser(currentUser.id)) {
            onUserViolation('Multiple serious violations of community guidelines detected.');
            return;
          }
        } else {
          toast.error(`Comment blocked: ${result.reason}`);
        }

        setIsSubmittingComment(false);
        return;
      }

      // Content passed moderation
      onAddComment(post.id, newComment.trim());
      setNewComment('');
      setModerationWarning(null);
      toast.success('Comment added successfully!');
      
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleAddReply = async (commentId: number) => {
    if (!replyContent.trim()) return;

    try {
      // Check for content violations
      const result = moderationService.checkForInappropriateContent(replyContent);
      
      if (result.isViolation) {
        UserViolationTracker.addViolation(
          currentUser.id,
          replyContent,
          result.violationType,
          result.severity
        );

        if (result.severity === 'high') {
          toast.error('Reply blocked: Serious community guideline violation detected');
          
          if (UserViolationTracker.shouldLogoutUser(currentUser.id)) {
            onUserViolation('Multiple serious violations of community guidelines detected.');
            return;
          }
        } else {
          toast.error(`Reply blocked: ${result.reason}`);
        }
        return;
      }

      // For now, we'll treat replies as regular comments since we need to update the data structure
      onAddComment(post.id, `@${post.comments.find(c => c.id === commentId)?.author} ${replyContent.trim()}`);
      setReplyContent('');
      setReplyingTo(null);
      toast.success('Reply added successfully!');
      
    } catch (error) {
      toast.error('Failed to add reply');
    }
  };

  const CommentComponent = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`space-y-3 ${isReply ? 'ml-8 border-l-2 border-muted pl-4' : ''}`}>
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.authorAvatar} />
          <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">{comment.author}</span>
            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
          </div>
          <p className="text-sm">{comment.content}</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 px-2 ${comment.isUpvoted ? 'text-green-600 bg-green-50' : ''}`}
                onClick={() => onVoteComment(post.id, comment.id, 'up')}
              >
                <ArrowUp className="h-3 w-3 mr-1" />
                <span className="text-xs">{comment.upvotes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 px-2 ${comment.isDownvoted ? 'text-red-600 bg-red-50' : ''}`}
                onClick={() => onVoteComment(post.id, comment.id, 'down')}
              >
                <ArrowDown className="h-3 w-3 mr-1" />
                <span className="text-xs">{comment.downvotes}</span>
              </Button>
            </div>
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              >
                Reply
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground">
              <Flag className="h-3 w-3 mr-1" />
              Report
            </Button>
          </div>

          {replyingTo === comment.id && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder={`Reply to ${comment.author}...`}
                value={replyContent}
                onChange={(e) => handleReplyChange(e.target.value)}
                rows={2}
                className="text-sm"
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleAddReply(comment.id)}
                  disabled={!replyContent.trim()}
                >
                  Reply
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.map((reply) => (
        <CommentComponent key={reply.id} comment={reply} isReply={true} />
      ))}
    </div>
  );

  const totalComments = post.comments.length + 
    post.comments.reduce((sum, comment) => sum + (comment.replies?.length || 0), 0);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.authorAvatar} />
              <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{post.author}</span>
                <Badge variant="outline" className="text-xs">
                  {post.community}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">{post.timestamp}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-medium text-lg leading-tight">{post.title}</h3>
          <p className="text-muted-foreground">{post.content}</p>
          
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Separator className="mb-4" />
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className={`${post.isUpvoted ? 'text-green-600 bg-green-50' : ''}`}
              onClick={handleUpvote}
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              {post.upvotes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`${post.isDownvoted ? 'text-red-600 bg-red-50' : ''}`}
              onClick={handleDownvote}
            >
              <ArrowDown className="h-4 w-4 mr-1" />
              {post.downvotes}
            </Button>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className={showComments ? 'bg-accent' : ''}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              {totalComments}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className={isSaved ? 'text-blue-600 bg-blue-50' : ''}
            >
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-6 space-y-4">
            <Separator />
            
            {/* Add Comment */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{currentUser.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Add a thoughtful comment..."
                    value={newComment}
                    onChange={(e) => handleCommentChange(e.target.value)}
                    rows={3}
                    maxLength={1000}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {newComment.length}/1000
                  </div>
                  
                  {moderationWarning && (
                    <Alert variant={moderationWarning.severity === 'high' ? 'destructive' : 'default'}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-1">
                          <p className="font-medium">Content Warning</p>
                          <p className="text-sm">{moderationWarning.reason}</p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      Comments are moderated for community safety
                    </p>
                    <Button
                      size="sm"
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || isSubmittingComment || (moderationWarning && moderationWarning.severity === 'high')}
                    >
                      {isSubmittingComment ? 'Checking...' : 'Comment'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            {post.comments.length > 0 && (
              <div className="space-y-4">
                <Separator />
                {post.comments.map((comment) => (
                  <CommentComponent key={comment.id} comment={comment} />
                ))}
              </div>
            )}

            {post.comments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}