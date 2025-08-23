import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { User, FileText, Trophy, Settings, Upload, Edit, Eye, Download, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const Account = () => {
  const [user] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    joinDate: '2023-06-15',
    avatar: '👤',
    level: 'Media Literacy Expert',
    points: 2840,
    nextLevelPoints: 3000
  });

  const submissions = [
    {
      id: 1,
      title: 'Suspicious health claim about miracle cure',
      type: 'User Report',
      status: 'Verified Fake',
      date: '2024-01-20',
      views: 1247,
      accuracy: 95
    },
    {
      id: 2,
      title: 'Political deepfake video analysis',
      type: 'Content Analysis',
      status: 'Under Review',
      date: '2024-01-18',
      views: 834,
      accuracy: null
    },
    {
      id: 3,
      title: 'Climate misinformation on social media',
      type: 'User Report',
      status: 'Verified Real',
      date: '2024-01-15',
      views: 2156,
      accuracy: 88
    }
  ];

  const achievements = [
    {
      name: 'Truth Seeker',
      description: 'Completed first fact-check',
      icon: '🔍',
      unlocked: true,
      date: '2023-06-20'
    },
    {
      name: 'Fact Master',
      description: 'Achieved 90% accuracy in 10 reports',
      icon: '🎯',
      unlocked: true,
      date: '2023-08-15'
    },
    {
      name: 'Community Guardian',
      description: 'Helped verify 50 pieces of content',
      icon: '🛡️',
      unlocked: true,
      date: '2023-11-02'
    },
    {
      name: 'Digital Detective',
      description: 'Detected sophisticated deepfake',
      icon: '🕵️',
      unlocked: false,
      progress: 75
    },
    {
      name: 'Media Mentor',
      description: 'Helped train 100 new users',
      icon: '👨‍🏫',
      unlocked: false,
      progress: 45
    },
    {
      name: 'Truth Champion',
      description: 'Reached expert level verification',
      icon: '👑',
      unlocked: false,
      progress: 20
    }
  ];

  const [profileData, setProfileData] = useState({
    bio: 'Passionate about digital literacy and fighting misinformation. Computer science student with a focus on AI ethics.',
    location: 'San Francisco, CA',
    website: 'https://alexjohnson.dev',
    interests: ['AI Ethics', 'Digital Rights', 'Education Technology']
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    publicProfile: true,
    shareStatistics: false,
    weeklyDigest: true
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified Fake': return 'destructive';
      case 'Verified Real': return 'default';
      case 'Under Review': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glass" />
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-8 text-white">
                <div className="text-8xl animate-pulse-glow">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="outline" className="border-white/20 bg-white/10 text-white">
                      {user.level}
                    </Badge>
                    <span className="text-white/80">
                      Joined {new Date(user.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Level Progress</span>
                      <span>{user.points}/{user.nextLevelPoints} points</span>
                    </div>
                    <Progress 
                      value={(user.points / user.nextLevelPoints) * 100} 
                      className="h-2 bg-white/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Account Content */}
        <section className="py-20">
          <div className="container">
            <Tabs defaultValue="profile" className="w-full max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-12">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="submissions" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Submissions
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Achievements
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        Edit Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Display Name</label>
                        <Input 
                          value={user.name} 
                          onChange={() => {}}
                          placeholder="Your display name"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Bio</label>
                        <Textarea 
                          value={profileData.bio}
                          onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                          placeholder="Tell others about yourself"
                          rows={4}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Location</label>
                        <Input 
                          value={profileData.location}
                          onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                          placeholder="Your location"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Website</label>
                        <Input 
                          value={profileData.website}
                          onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                      
                      <Button className="w-full hover-lift">
                        Save Changes
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Profile Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-background-alt rounded-lg">
                          <div className="text-2xl font-bold gradient-text">2,840</div>
                          <div className="text-sm text-muted-foreground">Total Points</div>
                        </div>
                        <div className="text-center p-4 bg-background-alt rounded-lg">
                          <div className="text-2xl font-bold gradient-text">47</div>
                          <div className="text-sm text-muted-foreground">Submissions</div>
                        </div>
                        <div className="text-center p-4 bg-background-alt rounded-lg">
                          <div className="text-2xl font-bold gradient-text">92%</div>
                          <div className="text-sm text-muted-foreground">Accuracy</div>
                        </div>
                        <div className="text-center p-4 bg-background-alt rounded-lg">
                          <div className="text-2xl font-bold gradient-text">156</div>
                          <div className="text-sm text-muted-foreground">Helps Given</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Interests</h4>
                        <div className="flex flex-wrap gap-2">
                          {profileData.interests.map((interest, index) => (
                            <Badge key={index} variant="secondary">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Submissions Tab */}
              <TabsContent value="submissions">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold gradient-text">Your Submissions</h3>
                    <Button className="hover-lift">
                      <Upload className="mr-2 h-4 w-4" />
                      New Submission
                    </Button>
                  </div>

                  <div className="grid gap-6">
                    {submissions.map((submission) => (
                      <Card key={submission.id} className="glass-card hover-lift">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold mb-2">{submission.title}</h4>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Badge variant="outline">{submission.type}</Badge>
                                <span>{new Date(submission.date).toLocaleDateString()}</span>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  {submission.views.toLocaleString()} views
                                </div>
                              </div>
                            </div>
                            <div className="text-right space-y-2">
                              <Badge variant={getStatusColor(submission.status)}>
                                {submission.status}
                              </Badge>
                              {submission.accuracy && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Accuracy: </span>
                                  <span className="font-bold">{submission.accuracy}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Button size="sm" variant="outline" className="hover-lift">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                            <Button size="sm" variant="outline" className="hover-lift">
                              <Download className="mr-2 h-4 w-4" />
                              Export Report
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements">
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold gradient-text mb-2">Your Achievements</h3>
                    <p className="text-muted-foreground">
                      Unlock badges by contributing to the Truth-Lens community
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map((achievement, index) => (
                      <Card 
                        key={index}
                        className={`glass-card hover-lift transition-all duration-300 ${
                          achievement.unlocked ? 'border-success/50 bg-success/5' : 'opacity-60'
                        }`}
                      >
                        <CardContent className="p-6 text-center">
                          <div className={`text-6xl mb-4 ${achievement.unlocked ? 'animate-pulse-glow' : ''}`}>
                            {achievement.icon}
                          </div>
                          <h4 className="font-bold mb-2">{achievement.name}</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            {achievement.description}
                          </p>
                          
                          {achievement.unlocked ? (
                            <div>
                              <Badge variant="default" className="mb-2">Unlocked</Badge>
                              <p className="text-xs text-muted-foreground">
                                {new Date(achievement.date).toLocaleDateString()}
                              </p>
                            </div>
                          ) : (
                            <div>
                              <Badge variant="secondary" className="mb-2">
                                {achievement.progress}% Complete
                              </Badge>
                              <Progress value={achievement.progress} className="h-2" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <div className="max-w-2xl mx-auto">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Account Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Email Preferences</h4>
                        
                        <div className="flex items-center justify-between p-4 bg-background-alt rounded-lg">
                          <div>
                            <div className="font-medium">Email Notifications</div>
                            <div className="text-sm text-muted-foreground">
                              Receive updates about your submissions
                            </div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={settings.emailNotifications}
                            onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                            className="w-4 h-4"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-background-alt rounded-lg">
                          <div>
                            <div className="font-medium">Weekly Digest</div>
                            <div className="text-sm text-muted-foreground">
                              Get weekly summary of platform activity
                            </div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={settings.weeklyDigest}
                            onChange={(e) => setSettings({...settings, weeklyDigest: e.target.checked})}
                            className="w-4 h-4"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold">Privacy Settings</h4>
                        
                        <div className="flex items-center justify-between p-4 bg-background-alt rounded-lg">
                          <div>
                            <div className="font-medium">Public Profile</div>
                            <div className="text-sm text-muted-foreground">
                              Allow others to view your profile
                            </div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={settings.publicProfile}
                            onChange={(e) => setSettings({...settings, publicProfile: e.target.checked})}
                            className="w-4 h-4"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-background-alt rounded-lg">
                          <div>
                            <div className="font-medium">Share Statistics</div>
                            <div className="text-sm text-muted-foreground">
                              Allow your stats to be included in public reports
                            </div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={settings.shareStatistics}
                            onChange={(e) => setSettings({...settings, shareStatistics: e.target.checked})}
                            className="w-4 h-4"
                          />
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-border">
                        <Button className="w-full hover-lift">
                          Save Settings
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Account;