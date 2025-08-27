import { useState } from 'react';
import { PostFeed } from './PostFeed';
import { ForumSidebar } from './ForumSidebar';
import { Post, Comment, UserState } from '../App';
import { toast } from 'sonner';

interface DiscussionForumProps {
  initialPosts: Post[];
  currentUser: UserState;
  onUserViolation: (reason: string) => void;
}

export function DiscussionForum({ initialPosts, currentUser, onUserViolation }: DiscussionForumProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  const [filterBy, setFilterBy] = useState<string>('all');
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());

  const handleCreatePost = (newPost: Omit<Post, 'id' | 'timestamp' | 'upvotes' | 'downvotes' | 'comments' | 'isUpvoted' | 'isDownvoted'>) => {
    const post: Post = {
      ...newPost,
      id: Date.now(),
      timestamp: 'just now',
      upvotes: 0,
      downvotes: 0,
      comments: []
    };
    setPosts([post, ...posts]);
  };

  const handleVote = (postId: number, voteType: 'up' | 'down') => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const wasUpvoted = post.isUpvoted;
          const wasDownvoted = post.isDownvoted;
          
          let newUpvotes = post.upvotes;
          let newDownvotes = post.downvotes;
          let newIsUpvoted = false;
          let newIsDownvoted = false;

          if (voteType === 'up') {
            if (wasUpvoted) {
              // Remove upvote
              newUpvotes -= 1;
            } else {
              // Add upvote
              newUpvotes += 1;
              newIsUpvoted = true;
              // Remove downvote if it exists
              if (wasDownvoted) {
                newDownvotes -= 1;
              }
            }
          } else {
            if (wasDownvoted) {
              // Remove downvote
              newDownvotes -= 1;
            } else {
              // Add downvote
              newDownvotes += 1;
              newIsDownvoted = true;
              // Remove upvote if it exists
              if (wasUpvoted) {
                newUpvotes -= 1;
              }
            }
          }

          return {
            ...post,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            isUpvoted: newIsUpvoted,
            isDownvoted: newIsDownvoted
          };
        }
        return post;
      })
    );
  };

  const handleSave = (postId: number) => {
    setSavedPosts(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(postId)) {
        newSaved.delete(postId);
      } else {
        newSaved.add(postId);
      }
      return newSaved;
    });
  };

  const handleAddComment = (postId: number, content: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const newComment: Comment = {
            id: Date.now(),
            author: currentUser.username,
            authorAvatar: "/api/placeholder/32/32",
            content,
            timestamp: 'just now',
            upvotes: 0,
            downvotes: 0,
            replies: []
          };
          
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );
  };

  const handleVoteComment = (postId: number, commentId: number, voteType: 'up' | 'down', isReply = false, parentId?: number) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const updateComments = (comments: Comment[]): Comment[] => {
            return comments.map(comment => {
              if (comment.id === commentId) {
                const wasUpvoted = comment.isUpvoted;
                const wasDownvoted = comment.isDownvoted;
                
                let newUpvotes = comment.upvotes;
                let newDownvotes = comment.downvotes;
                let newIsUpvoted = false;
                let newIsDownvoted = false;

                if (voteType === 'up') {
                  if (wasUpvoted) {
                    newUpvotes -= 1;
                  } else {
                    newUpvotes += 1;
                    newIsUpvoted = true;
                    if (wasDownvoted) {
                      newDownvotes -= 1;
                    }
                  }
                } else {
                  if (wasDownvoted) {
                    newDownvotes -= 1;
                  } else {
                    newDownvotes += 1;
                    newIsDownvoted = true;
                    if (wasUpvoted) {
                      newUpvotes -= 1;
                    }
                  }
                }

                return {
                  ...comment,
                  upvotes: newUpvotes,
                  downvotes: newDownvotes,
                  isUpvoted: newIsUpvoted,
                  isDownvoted: newIsDownvoted
                };
              }
              
              // Check replies
              if (comment.replies) {
                return {
                  ...comment,
                  replies: updateComments(comment.replies)
                };
              }
              
              return comment;
            });
          };

          return {
            ...post,
            comments: updateComments(post.comments)
          };
        }
        return post;
      })
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <PostFeed 
          posts={posts} 
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterBy={filterBy}
          onCreatePost={handleCreatePost}
          currentUser={currentUser}
          onUserViolation={onUserViolation}
          onVote={handleVote}
          onSave={handleSave}
          onAddComment={handleAddComment}
          onVoteComment={handleVoteComment}
          savedPosts={savedPosts}
        />
      </div>
      <div className="lg:col-span-1">
        <ForumSidebar filterBy={filterBy} setFilterBy={setFilterBy} />
      </div>
    </div>
  );
}