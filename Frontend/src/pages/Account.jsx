import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Achievements from '@/components/Achievements';
import { useAuth } from '@/components/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { User, FileText, Trophy, Settings, Upload, Edit, Eye, Download, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

const Account = () => {
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState([]);
  const [profileData, setProfileData] = useState({
    bio: '',
    location: '',
    website: '',
    display_name: ''
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    publicProfile: true,
    shareStatistics: false,
    weeklyDigest: true
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user && profile) {
      setProfileData({
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        display_name: profile.display_name || ''
      });
      fetchUserSubmissions();
    }
  }, [user, profile]);

  const fetchUserSubmissions = async () => {
    try {
      setLoadingData(true);
      const { data, error } = await supabase
        .from('case_attempts')
        .select(`
          *,
          case_files (
            title,
            category
          )
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const updateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          bio: profileData.bio,
          location: profileData.location,
          display_name: profileData.display_name
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please sign in to view your account</h2>
            <Button asChild>
              <a href="/auth">Sign In</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full" />
                  ) : (
                    '👤'
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{profile?.display_name || user.email}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="outline" className="border-white/20 bg-white/10 text-white">
                      Level {profile?.level || 1}
                    </Badge>
                    <span className="text-white/80">
                      Joined {new Date(profile?.created_at || user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Total Points</span>
                      <span>{profile?.total_points || 0} points</span>
                    </div>
                    <Progress 
                      value={Math.min(((profile?.total_points || 0) % 1000) / 10, 100)} 
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
                          value={profileData.display_name} 
                          onChange={(e) => setProfileData({...profileData, display_name: e.target.value})}
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
                        <label className="text-sm font-medium mb-2 block">Email</label>
                        <Input 
                          value={user.email}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                      
                      <Button className="w-full hover-lift" onClick={updateProfile}>
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
                          <div className="text-2xl font-bold gradient-text">{profile?.total_points || 0}</div>
                          <div className="text-sm text-muted-foreground">Total Points</div>
                        </div>
                        <div className="text-center p-4 bg-background-alt rounded-lg">
                          <div className="text-2xl font-bold gradient-text">{submissions.length}</div>
                          <div className="text-sm text-muted-foreground">Case Attempts</div>
                        </div>
                        <div className="text-center p-4 bg-background-alt rounded-lg">
                          <div className="text-2xl font-bold gradient-text">{profile?.level || 1}</div>
                          <div className="text-sm text-muted-foreground">Current Level</div>
                        </div>
                        <div className="text-center p-4 bg-background-alt rounded-lg">
                          <div className="text-2xl font-bold gradient-text">
                            {submissions.length > 0 ? Math.round(submissions.reduce((acc, s) => acc + s.score, 0) / submissions.length) : 0}%
                          </div>
                          <div className="text-sm text-muted-foreground">Avg Score</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Profile Info</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Bio:</strong> {profile?.bio || 'No bio added yet'}</p>
                          <p><strong>Location:</strong> {profile?.location || 'Not specified'}</p>
                          <p><strong>Member since:</strong> {new Date(profile?.created_at || user?.created_at).toLocaleDateString()}</p>
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
                    <h3 className="text-2xl font-bold gradient-text">Your Case Attempts</h3>
                    <Button className="hover-lift" asChild>
                      <a href="/case-files">
                        <Upload className="mr-2 h-4 w-4" />
                        Try New Cases
                      </a>
                    </Button>
                  </div>

                  {loadingData ? (
                    <div className="text-center py-8">Loading your attempts...</div>
                  ) : submissions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No case attempts yet!</p>
                      <Button asChild>
                        <a href="/case-files">Start Your First Case</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {submissions.map((attempt) => (
                        <Card key={attempt.id} className="glass-card hover-lift">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold mb-2">
                                  {attempt.case_files?.title || 'Unknown Case'}
                                </h4>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                  <Badge variant="outline">{attempt.case_files?.category || 'General'}</Badge>
                                  <span>{new Date(attempt.completed_at).toLocaleDateString()}</span>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {Math.floor(attempt.time_taken / 60)}:{(attempt.time_taken % 60).toString().padStart(2, '0')}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right space-y-2">
                                <Badge variant={attempt.score >= 80 ? "default" : attempt.score >= 60 ? "secondary" : "destructive"}>
                                  {attempt.score}% Score
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements">
                <Achievements />
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