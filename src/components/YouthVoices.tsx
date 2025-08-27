import { useState } from 'react';
import { Users, Trophy, Target, Calendar, TrendingUp, Award } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { DiscussionForum } from './DiscussionForum';
import { Post } from '../App';

interface YouthVoicesProps {
  initialPosts: Post[];
}

export function YouthVoices({ initialPosts }: YouthVoicesProps) {
  const [activeTab, setActiveTab] = useState('discussions');

  const leaderboardData = [
    { rank: 1, name: "Alex M.", avatar: "/api/placeholder/32/32", points: 2840, badge: "Truth Seeker", posts: 45, comments: 123 },
    { rank: 2, name: "Jordan Rivera", avatar: "/api/placeholder/32/32", points: 2156, badge: "Fact Hunter", posts: 38, comments: 98 },
    { rank: 3, name: "Emma Chen", avatar: "/api/placeholder/32/32", points: 1892, badge: "Digital Guardian", posts: 32, comments: 87 },
    { rank: 4, name: "Maya P.", avatar: "/api/placeholder/32/32", points: 1674, badge: "Info Warrior", posts: 28, comments: 76 },
    { rank: 5, name: "Tech Student", avatar: "/api/placeholder/32/32", points: 1423, badge: "Cyber Sleuth", posts: 25, comments: 65 }
  ];

  const challenges = [
    {
      id: 1,
      title: "Weekly Fact-Check Challenge",
      description: "Verify and share 5 fact-checked pieces of information this week",
      progress: 60,
      reward: "50 Truth Points",
      participants: 234,
      timeLeft: "3 days left"
    },
    {
      id: 2,
      title: "Digital Wellness Champion",
      description: "Share tips and experiences about healthy digital habits",
      progress: 25,
      reward: "Digital Wellness Badge",
      participants: 156,
      timeLeft: "5 days left"
    },
    {
      id: 3,
      title: "Community Teacher",
      description: "Help other users by providing helpful comments and resources",
      progress: 80,
      reward: "Mentor Badge + 100 Points",
      participants: 89,
      timeLeft: "1 week left"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Virtual Media Literacy Workshop",
      date: "March 25, 2024",
      time: "3:00 PM EST",
      description: "Learn advanced fact-checking techniques with industry experts",
      participants: 156,
      type: "Workshop"
    },
    {
      id: 2,
      title: "Youth Voices Panel Discussion",
      date: "March 30, 2024", 
      time: "2:00 PM EST",
      description: "Join a panel of young digital literacy advocates",
      participants: 89,
      type: "Panel"
    },
    {
      id: 3,
      title: "Community Challenge Showcase",
      date: "April 5, 2024",
      time: "4:00 PM EST", 
      description: "Present your digital literacy projects to the community",
      participants: 67,
      type: "Showcase"
    }
  ];

  const communityStats = {
    totalMembers: 4051,
    onlineNow: 324,
    postsToday: 42,
    discussionsThisWeek: 189,
    factChecksShared: 1256,
    misinformationReported: 78
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-16 shadow-md">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Youth Voices Community</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Connect, discuss, and learn with young digital citizens fighting misinformation together.
            Share knowledge, earn recognition, and make a real impact.
          </p>
          <div className="flex justify-center items-center space-x-8 mt-10 text-blue-100">
            <div className="text-center">
              <div className="text-3xl font-semibold">{communityStats.totalMembers.toLocaleString()}</div>
              <div className="text-sm">Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold">{communityStats.onlineNow}</div>
              <div className="text-sm">Online Now</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold">{communityStats.factChecksShared.toLocaleString()}</div>
              <div className="text-sm">Facts Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-white/70 backdrop-blur-md border rounded-xl shadow-md p-2 mb-10 max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-4 bg-transparent gap-2">
              <TabsTrigger value="discussions" className="rounded-lg py-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Users className="h-4 w-4 mr-2" />
                Discussions
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="rounded-lg py-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </TabsTrigger>
              <TabsTrigger value="challenges" className="rounded-lg py-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Target className="h-4 w-4 mr-2" />
                Challenges
              </TabsTrigger>
              <TabsTrigger value="events" className="rounded-lg py-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold">Community Discussions</h2>
              <p className="text-muted-foreground">
                Join conversations about digital literacy, share experiences, and learn from fellow truth-seekers.
              </p>
            </div>
            <Card className="shadow-lg rounded-xl">
              <CardContent>
                <DiscussionForum initialPosts={initialPosts} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold">Community Leaders</h2>
              <p className="text-muted-foreground">
                Recognizing our most active and helpful community members who are making a difference.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span>Top Contributors This Month</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {leaderboardData.map((user) => (
                    <div key={user.rank} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        user.rank === 1 ? 'bg-yellow-500 text-white' :
                        user.rank === 2 ? 'bg-gray-400 text-white' :
                        user.rank === 3 ? 'bg-orange-600 text-white' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {user.rank}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{user.name}</span>
                          <Badge variant="secondary" className="text-xs">{user.badge}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.posts} posts • {user.comments} comments
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-indigo-600">{user.points.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Points</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="shadow-lg rounded-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Your Progress</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <Avatar className="h-16 w-16 mx-auto mb-2 ring-2 ring-indigo-500">
                          <AvatarFallback>CU</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">Current User</div>
                        <Badge variant="outline">New Member</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Truth Points</span>
                          <span>150 / 500</span>
                        </div>
                        <Progress value={30} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          350 points to reach "Fact Hunter"
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg rounded-xl">
                  <CardHeader>
                    <CardTitle>Achievement Badges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <Award className="h-8 w-8 mx-auto text-blue-500 mb-1" />
                        <div className="text-xs font-medium">First Post</div>
                      </div>
                      <div className="text-center opacity-50">
                        <Award className="h-8 w-8 mx-auto text-slate-400 mb-1" />
                        <div className="text-xs">Fact Hunter</div>
                      </div>
                      <div className="text-center opacity-50">
                        <Award className="h-8 w-8 mx-auto text-slate-400 mb-1" />
                        <div className="text-xs">Truth Seeker</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold">Community Challenges</h2>
              <p className="text-muted-foreground">
                Participate in challenges to earn points, badges, and make a positive impact.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="shadow-lg rounded-xl hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-medium">{challenge.title}</CardTitle>
                      <Badge variant="outline">{challenge.timeLeft}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{challenge.participants} participants</span>
                      <span className="font-semibold text-indigo-600">{challenge.reward}</span>
                    </div>
                    
                    <Button className="w-full rounded-lg" variant={challenge.progress > 0 ? "outline" : "default"}>
                      {challenge.progress > 0 ? "Continue Challenge" : "Join Challenge"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold">Upcoming Events</h2>
              <p className="text-muted-foreground">
                Join workshops, panels, and community events to expand your skills.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="shadow-lg rounded-xl hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-medium">{event.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">{event.type}</Badge>
                          <span className="text-sm text-muted-foreground">{event.participants} attending</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="ml-6">{event.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button className="flex-1 rounded-lg">Register</Button>
                      <Button variant="outline" className="rounded-lg">Learn More</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
