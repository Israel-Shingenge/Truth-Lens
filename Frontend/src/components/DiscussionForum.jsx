import React, { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, Reply, Flag, Clock, User, Award, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DiscussionForum = ({ caseFileId, caseFileTitle }) => {
  const [discussions, setDiscussions] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (caseFileId) {
      fetchDiscussions();
    }
  }, [caseFileId, sortBy]);

  const fetchDiscussions = async () => {
    try {
      const { data: discussionsData, error } = await supabase
        .from('discussions')
        .select(`
          *,
          profiles (
            username,
            display_name,
            avatar_url,
            total_points,
            level
          )
        `)
        .eq('case_file_id', caseFileId)
        .is('parent_id', null)
        .order(sortBy === 'newest' ? 'created_at' : 'upvotes', { ascending: false });

      if (error) throw error;

      // Fetch replies for each discussion
      const discussionsWithReplies = await Promise.all(
        discussionsData.map(async (discussion) => {
          const { data: replies, error: repliesError } = await supabase
            .from('discussions')
            .select(`
              *,
              profiles (
                username,
                display_name,
                avatar_url,
                total_points,
                level
              )
            `)
            .eq('parent_id', discussion.id)
            .order('created_at', { ascending: true });

          if (repliesError) throw repliesError;
          return { ...discussion, replies: replies || [] };
        })
      );

      setDiscussions(discussionsWithReplies);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load discussions",
        variant: "destructive"
      });
    }
  };

  const submitComment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to participate in discussions",
        variant: "destructive"
      });
      return;
    }

    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('discussions')
        .insert({
          content: newComment,
          case_file_id: caseFileId,
          user_id: user.id,
          parent_id: replyingTo
        });

      if (error) throw error;

      setNewComment('');
      setReplyingTo(null);
      fetchDiscussions();
      
      toast({
        title: "Success",
        description: replyingTo ? "Reply posted!" : "Comment posted!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const vote = async (discussionId, voteType) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to vote",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if user has already voted
      const { data: existingVote } = await supabase
        .from('discussion_votes')
        .select('*')
        .eq('discussion_id', discussionId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        // Update existing vote or remove if same vote
        if (existingVote.vote_type === voteType) {
          await supabase
            .from('discussion_votes')
            .delete()
            .eq('id', existingVote.id);
        } else {
          await supabase
            .from('discussion_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
        }
      } else {
        // Create new vote
        await supabase
          .from('discussion_votes')
          .insert({
            discussion_id: discussionId,
            user_id: user.id,
            vote_type: voteType
          });
      }

      fetchDiscussions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to vote",
        variant: "destructive"
      });
    }
  };

  const flagContent = async (discussionId) => {
    if (!user) return;
    
    try {
      await supabase
        .from('discussions')
        .update({ is_flagged: true })
        .eq('id', discussionId);
        
      toast({
        title: "Content Flagged",
        description: "Thank you for reporting. Our team will review this content.",
      });
      
      fetchDiscussions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to flag content",
        variant: "destructive"
      });
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getUserBadge = (points, level) => {
    if (level >= 10) return { icon: Crown, color: 'text-yellow-500', label: 'Expert' };
    if (level >= 5) return { icon: Award, color: 'text-purple-500', label: 'Advanced' };
    if (level >= 2) return { icon: User, color: 'text-blue-500', label: 'Regular' };
    return { icon: User, color: 'text-gray-500', label: 'Novice' };
  };

  const DiscussionItem = ({ discussion, isReply = false }) => {
    const userBadge = getUserBadge(discussion.profiles?.total_points || 0, discussion.profiles?.level || 1);
    const BadgeIcon = userBadge.icon;

    return (
      <Card className={`${isReply ? 'ml-8 border-l-2 border-primary/20' : ''} glass-card`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={discussion.profiles?.avatar_url} />
                <AvatarFallback>{discussion.profiles?.display_name?.[0] || 'A'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {discussion.profiles?.display_name || 'Anonymous'}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    <BadgeIcon className={`h-3 w-3 mr-1 ${userBadge.color}`} />
                    {userBadge.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(discussion.created_at)}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
              onClick={() => flagContent(discussion.id)}
            >
              <Flag className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm mb-4 leading-relaxed">{discussion.content}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => vote(discussion.id, 'upvote')}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                {discussion.upvotes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => vote(discussion.id, 'downvote')}
              >
                <ThumbsDown className="h-3 w-3 mr-1" />
                {discussion.downvotes}
              </Button>
            </div>
            
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setReplyingTo(replyingTo === discussion.id ? null : discussion.id)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
          </div>

          {replyingTo === discussion.id && (
            <div className="mt-4 p-3 bg-background-alt rounded-lg">
              <Textarea
                placeholder="Write your reply..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-3 min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={submitComment} disabled={loading}>
                  Post Reply
                </Button>
                <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {discussion.replies?.map((reply) => (
            <div key={reply.id} className="mt-4">
              <DiscussionItem discussion={reply} isReply={true} />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            Discussion Forum
          </h3>
          <p className="text-muted-foreground">Share insights about "{caseFileTitle}"</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 bg-background border border-input rounded-md text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* New Comment Form */}
      {user ? (
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>{profile?.display_name?.[0] || 'Y'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Share your thoughts about this case..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-3 min-h-[100px]"
                />
                <Button onClick={submitComment} disabled={loading || !newComment.trim()}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Post Comment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              Sign in to join the discussion and share your insights!
            </p>
            <Button onClick={() => window.location.href = '/auth'}>
              Sign In to Comment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Discussions List */}
      <div className="space-y-4">
        {discussions.length > 0 ? (
          discussions.map((discussion) => (
            <DiscussionItem key={discussion.id} discussion={discussion} />
          ))
        ) : (
          <Card className="glass-card">
            <CardContent className="pt-6 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                No discussions yet. Be the first to share your thoughts!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DiscussionForum;