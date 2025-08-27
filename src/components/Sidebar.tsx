import { Users, Calendar, BookOpen, Heart, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Post } from '../App';

interface SidebarProps {
  posts: Post[];
}

export function Sidebar({ posts }: SidebarProps) {
  const communities = [
    { name: 'Youth Leaders', members: 234, icon: Users, color: 'bg-blue-500' },
    { name: 'Community Service', members: 189, icon: Heart, color: 'bg-green-500' },
    { name: 'Study Groups', members: 156, icon: BookOpen, color: 'bg-purple-500' },
    { name: 'Sports & Recreation', members: 203, icon: Star, color: 'bg-orange-500' },
  ];

  const upcomingEvents = [
    { name: 'Community Cleanup', date: 'Mar 15', participants: 24 },
    { name: 'Study Session', date: 'Mar 18', participants: 12 },
    { name: 'Game Night', date: 'Mar 22', participants: 18 },
  ];

  // Calculate real stats from posts
  const totalMembers = communities.reduce((sum, c) => sum + c.members, 0);
  const onlineNow = Math.floor(totalMembers * 0.07); // Simulate 7% online
  const postsToday = posts.filter(post => 
    post.timestamp.includes('hour') || post.timestamp.includes('Just now')
  ).length;

  return (
    <aside className="w-80 p-4 space-y-4">
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
            <span className="text-muted-foreground">Active Members</span>
            <span className="font-medium">{totalMembers.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Online Now</span>
            <span className="font-medium text-green-600">{onlineNow}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Posts Today</span>
            <span className="font-medium">{postsToday}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Posts</span>
            <span className="font-medium">{posts.length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Communities */}
      <Card>
        <CardHeader>
          <CardTitle>Communities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {communities.map((community) => {
            const communityPosts = posts.filter(post => post.community === community.name).length;
            return (
              <Button
                key={community.name}
                variant="ghost"
                className="w-full justify-start space-x-3 h-auto p-3"
              >
                <div className={`w-3 h-3 rounded-full ${community.color}`} />
                <div className="flex-1 text-left">
                  <div className="font-medium">{community.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {community.members} members • {communityPosts} posts
                  </div>
                </div>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Upcoming Events</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-start">
                <span className="font-medium">{event.name}</span>
                <Badge variant="outline" className="text-xs">{event.date}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {event.participants} participants
              </div>
              {index < upcomingEvents.length - 1 && <Separator className="mt-3" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Community Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Community Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div>1. Be respectful and supportive</div>
          <div>2. No spam or self-promotion</div>
          <div>3. Keep discussions constructive</div>
          <div>4. Report inappropriate content</div>
          <div>5. Have fun and learn together!</div>
        </CardContent>
      </Card>
    </aside>
  );
}