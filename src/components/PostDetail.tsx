import { useState } from 'react';
import { ArrowLeft, ArrowUp, ArrowDown, MessageCircle, Share2, Bookmark, Send } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { Post, Comment } from '../App';

interface PostDetailProps {
  post: Post;
  onBack: () => void;
  onAddComment: (postId: number, content: string, parentCommentId?: number) => void;
  onCommentVote: (postId: number, commentId: number, type: 'up' | 'down') => void;
}

export function PostDetail({ post, onBack, onAddComment, onCommentVote }: PostDetailProps) {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(post.id, newComment.trim());
      setNewComment('');
      toast.success('Comment added!');
    }
  };

  const handleSubmitReply = (commentId: number) => {
    if (replyText.trim()) {
      onAddComment(post.id, replyText.trim(), commentId);
      setReplyText('');
      setReplyTo(null);
      toast.success('Reply added!');
    }
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setReplyText('');
  };

  const CommentComponent = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const netVotes = comment.upvotes - comment.downvotes;
    
    return (
      <div className={`space-y-3 ${isReply ? 'ml-12 border-l-2 border-muted pl-4' : ''}`}>
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.authorAvatar} />
            <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{comment.author}</span>
              <span className="text-sm text-muted-foreground">{comment.timestamp}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-6 px-2 text-xs ${comment.isUpvoted ? 'text-green-600 bg-green-50' : ''}`}
                onClick={() => onCommentVote(post.id, comment.id, 'up')}
              >
                <ArrowUp className="h-3 w-3 mr-1" />
                {comment.upvotes}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-6 px-2 text-xs ${comment.isDownvoted ? 'text-red-600 bg-red-50' : ''}`}
                onClick={() => onCommentVote(post.id, comment.id, 'down')}
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
              <span className={`text-xs font-medium ${
                netVotes > 0 ? 'text-green-600' : netVotes < 0 ? 'text-red-600' : 'text-muted-foreground'
              }`}>
                {netVotes !== 0 && (netVotes > 0 ? '+' : '') + netVotes}
              </span>
              {!isReply && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={() => setReplyTo(comment.id)}
                >
                  Reply
                </Button>
              )}
            </div>

            {replyTo === comment.id && (
              <div className="space-y-2 mt-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={!replyText.trim()}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelReply}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-3">
            {comment.replies.map((reply) => (
              <CommentComponent key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const getTotalCommentCount = (comments: Comment[]): number => {
    return comments.reduce((total, comment) => {
      return total + 1 + (comment.replies ? getTotalCommentCount(comment.replies) : 0);
    }, 0);
  };

  const totalComments = getTotalCommentCount(post.comments);
  const netVotes = post.upvotes - post.downvotes;

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to feed
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.authorAvatar} />
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{post.author}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <Badge variant="secondary">{post.community}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{post.timestamp}</div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <h1 className="text-xl font-medium">{post.title}</h1>
          
          <div className="prose prose-sm max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-3 last:mb-0 whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className={post.isUpvoted ? "text-green-600 bg-green-50" : ""}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <span className={`text-sm font-medium px-2 ${
                netVotes > 0 ? 'text-green-600' : netVotes < 0 ? 'text-red-600' : 'text-muted-foreground'
              }`}>
                {netVotes}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                className={post.isDownvoted ? "text-red-600 bg-red-50" : ""}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {totalComments} comment{totalComments !== 1 ? 's' : ''}
              </span>
              <Button variant="ghost" size="sm" onClick={() => toast.info('Share functionality coming soon!')}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toast.info('Bookmark functionality coming soon!')}>
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <h3 className="font-medium">
            Comments ({totalComments})
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Comment */}
          <div className="flex space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleSubmitComment} 
                disabled={!newComment.trim()}
                size="sm"
              >
                <Send className="h-4 w-4 mr-2" />
                Comment
              </Button>
            </div>
          </div>

          <Separator />

          {/* Comments List */}
          <div className="space-y-6">
            {post.comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No comments yet. Be the first to share your thoughts!
              </div>
            ) : (
              post.comments.map((comment) => (
                <CommentComponent key={comment.id} comment={comment} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}