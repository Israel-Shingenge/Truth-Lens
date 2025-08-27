import { Users, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface ForumSidebarProps {
  filterBy: string;
  setFilterBy: (filter: string) => void;
}

export function ForumSidebar({ filterBy, setFilterBy }: ForumSidebarProps) {
  const communities = [
    { name: 'Media Literacy', members: 1240, color: 'bg-blue-500' },
    { name: 'Digital Safety', members: 987, color: 'bg-green-500' },
    { name: 'Environmental Action', members: 756, color: 'bg-emerald-500' },
    { name: 'Tech Education', members: 623, color: 'bg-purple-500' },
    { name: 'Youth Advocacy', members: 445, color: 'bg-orange-500' },
  ];

  const trendingTopics = [
    { tag: 'fact-checking', posts: 24 },
    { tag: 'deepfakes', posts: 18 },
    { tag: 'climate', posts: 15 },
    { tag: 'social-media', posts: 12 },
    { tag: 'privacy', posts: 9 },
  ];

  // Calculate community stats
  const totalMembers = communities.reduce((sum, c) => sum + c.members, 0);
  const onlineNow = Math.floor(totalMembers * 0.08); // Simulate 8% online
  const totalDiscussions = 156; // Mock data
  const totalComments = 892; // Mock data
  const activeToday = 42; // Mock data

  return (
    <div className="space-y-4">
      {/* Community Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Community Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Members</span>
            <span className="font-medium">{totalMembers.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Online Now</span>
            <span className="font-medium text-green-600">{onlineNow}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Discussions</span>
            <span className="font-medium">{totalDiscussions}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Comments</span>
            <span className="font-medium">{totalComments}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Active Today</span>
            <span className="font-medium">{activeToday}</span>
          </div>
        </CardContent>
      </Card>

      {/* Communities */}
      <Card>
        <CardHeader>
          <CardTitle>Discussion Communities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant={filterBy === 'all' ? 'default' : 'ghost'}
            className="w-full justify-start space-x-3 h-auto p-3"
            onClick={() => setFilterBy('all')}
          >
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <div className="flex-1 text-left">
              <div className="font-medium">All Communities</div>
              <div className="text-sm text-muted-foreground">
                View all discussions
              </div>
            </div>
          </Button>
          
          {communities.map((community) => (
            <Button
              key={community.name}
              variant={filterBy === community.name ? 'default' : 'ghost'}
              className="w-full justify-start space-x-3 h-auto p-3"
              onClick={() => setFilterBy(community.name)}
            >
              <div className={`w-3 h-3 rounded-full ${community.color}`} />
              <div className="flex-1 text-left">
                <div className="font-medium">{community.name}</div>
                <div className="text-sm text-muted-foreground">
                  {community.members.toLocaleString()} members
                </div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Trending Topics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {trendingTopics.map((topic, index) => (
            <div key={topic.tag} className="flex items-center justify-between">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                #{topic.tag}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {topic.posts} posts
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Discussion Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Discussion Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div>• Share credible sources</div>
          <div>• Be respectful and constructive</div>
          <div>• Fact-check before posting</div>
          <div>• Report misinformation</div>
          <div>• Support fellow truth-seekers</div>
        </CardContent>
      </Card>

      {/* Safety Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Safe Community</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div>All content is automatically moderated for hate speech and harmful content.</div>
          <div>Report inappropriate content to help keep our community safe.</div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Upcoming Events
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Users className="h-4 w-4 mr-2" />
            Find Study Groups
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <MessageSquare className="h-4 w-4 mr-2" />
            Help & Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}