import { useState } from 'react';
import { Search, TrendingUp, Clock, Award } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CreatePostCard } from './CreatePostCard';
import { PostCard } from './PostCard';
import { Post, UserState } from '../App';

interface PostFeedProps {
  posts: Post[];
  sortBy: 'hot' | 'new' | 'top';
  setSortBy: (sort: 'hot' | 'new' | 'top') => void;
  filterBy: string;
  onCreatePost: (post: Omit<Post, 'id' | 'timestamp' | 'upvotes' | 'downvotes' | 'comments' | 'isUpvoted' | 'isDownvoted'>) => void;
  currentUser: UserState;
  onUserViolation: (reason: string) => void;
  onVote: (postId: number, voteType: 'up' | 'down') => void;
  onSave: (postId: number) => void;
  onAddComment: (postId: number, content: string) => void;
  onVoteComment: (postId: number, commentId: number, voteType: 'up' | 'down', isReply?: boolean, parentId?: number) => void;
  savedPosts: Set<number>;
}

export function PostFeed({ 
  posts, 
  sortBy, 
  setSortBy, 
  filterBy, 
  onCreatePost, 
  currentUser, 
  onUserViolation,
  onVote,
  onSave,
  onAddComment,
  onVoteComment,
  savedPosts
}: PostFeedProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const getSortIcon = (sort: string) => {
    switch (sort) {
      case 'hot': return <TrendingUp className="h-4 w-4" />;
      case 'new': return <Clock className="h-4 w-4" />;
      case 'top': return <Award className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesFilter = filterBy === 'all' || post.community === filterBy;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'new':
        // For demo purposes, we'll use post ID as a proxy for time
        return b.id - a.id;
      case 'top':
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      case 'hot':
      default:
        // Simple hot algorithm: combine votes and comments with recency bias
        const aScore = (a.upvotes - a.downvotes) + (a.comments.length * 2) + (a.id > 1000000000000 ? 10 : 0); // Recent posts get boost
        const bScore = (b.upvotes - b.downvotes) + (b.comments.length * 2) + (b.id > 1000000000000 ? 10 : 0);
        return bScore - aScore;
    }
  });

  return (
    <div className="space-y-6">
      <CreatePostCard 
        onCreatePost={onCreatePost} 
        currentUser={currentUser}
        onUserViolation={onUserViolation}
      />
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search discussions..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={sortBy} onValueChange={(value: 'hot' | 'new' | 'top') => setSortBy(value)}>
          <SelectTrigger className="w-32">
            <div className="flex items-center space-x-2">
              {getSortIcon(sortBy)}
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hot">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Hot</span>
              </div>
            </SelectItem>
            <SelectItem value="new">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>New</span>
              </div>
            </SelectItem>
            <SelectItem value="top">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>Top</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          {sortedPosts.length} result{sortedPosts.length !== 1 ? 's' : ''} for "{searchQuery}"
        </div>
      )}

      <div className="space-y-4">
        {sortedPosts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            currentUser={currentUser}
            onVote={onVote}
            onSave={onSave}
            onAddComment={onAddComment}
            onVoteComment={onVoteComment}
            onUserViolation={onUserViolation}
            savedPosts={savedPosts}
          />
        ))}
        
        {sortedPosts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {searchQuery ? (
              <p>No discussions found matching "{searchQuery}". Try different keywords or check your spelling.</p>
            ) : (
              <p>No discussions found. Be the first to start a conversation!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}