import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { 
  Users, 
  FileText, 
  Trophy, 
  BarChart3, 
  Settings, 
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Plus
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AdminPanel = () => {
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [caseFiles, setCaseFiles] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [newCaseFile, setNewCaseFile] = useState({
    title: '',
    description: '',
    difficulty_level: 1,
    category: 'general',
    content: {
      type: 'selection',
      question: '',
      options: [],
      correct_answer: '',
      explanation: ''
    }
  });
  const [newAchievement, setNewAchievement] = useState({
    name: '',
    description: '',
    case_file_id: '',
    points_reward: 0,
    rarity_level: 'common',
    unlock_condition: { type: 'complete_case', threshold: 1 }
  });

  // Check if user is admin
  if (!loading && (!user || !profile?.is_admin)) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (profile?.is_admin) {
      fetchUsers();
      fetchCaseFiles();
      fetchAchievements();
      fetchDiscussions();
    }
  }, [profile]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const fetchCaseFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('case_files')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCaseFiles(data || []);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*, case_files(title)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const fetchDiscussions = async () => {
    try {
      const { data, error } = await supabase
        .from('discussions')
        .select('*, profiles(display_name), case_files(title)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setDiscussions(data || []);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const toggleUserShadowBan = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_shadow_banned: !currentStatus })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `User ${!currentStatus ? 'shadow banned' : 'unbanned'} successfully`
      });
      
      fetchUsers();
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const toggleUserAdmin = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `User admin status ${!currentStatus ? 'granted' : 'revoked'} successfully`
      });
      
      fetchUsers();
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const createCaseFile = async () => {
    try {
      const { error } = await supabase
        .from('case_files')
        .insert({
          ...newCaseFile,
          created_by: profile.id
        });
      
      if (error) throw error;
      
      toast({ title: "Success", description: "Case file created successfully" });
      setNewCaseFile({
        title: '',
        description: '',
        difficulty_level: 1,
        category: 'general',
        content: {
          type: 'selection',
          question: '',
          options: [],
          correct_answer: '',
          explanation: ''
        }
      });
      fetchCaseFiles();
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const createAchievement = async () => {
    try {
      const { error } = await supabase
        .from('achievements')
        .insert(newAchievement);
      
      if (error) throw error;
      
      toast({ title: "Success", description: "Achievement created successfully" });
      setNewAchievement({
        name: '',
        description: '',
        case_file_id: '',
        points_reward: 0,
        rarity_level: 'common',
        unlock_condition: { type: 'complete_case', threshold: 1 }
      });
      fetchAchievements();
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const toggleDiscussionFlag = async (discussionId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('discussions')
        .update({ is_flagged: !currentStatus })
        .eq('id', discussionId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Discussion ${!currentStatus ? 'flagged' : 'unflagged'} successfully`
      });
      
      fetchDiscussions();
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-xl text-muted-foreground">Manage users, content, and platform settings</p>
        </div>

        <Tabs defaultValue="users" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="moderation" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Moderation
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold">{user.display_name || user.username}</h3>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={user.is_admin ? "default" : "secondary"}>
                              {user.is_admin ? "Admin" : "User"}
                            </Badge>
                            {user.is_shadow_banned && (
                              <Badge variant="destructive">Shadow Banned</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserAdmin(user.user_id, user.is_admin)}
                        >
                          {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                        </Button>
                        <Button
                          variant={user.is_shadow_banned ? "default" : "destructive"}
                          size="sm"
                          onClick={() => toggleUserShadowBan(user.user_id, user.is_shadow_banned)}
                        >
                          {user.is_shadow_banned ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Create Case File</CardTitle>
                  <CardDescription>Add new interactive case files</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newCaseFile.title}
                      onChange={(e) => setNewCaseFile({...newCaseFile, title: e.target.value})}
                      placeholder="Case file title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newCaseFile.description}
                      onChange={(e) => setNewCaseFile({...newCaseFile, description: e.target.value})}
                      placeholder="Brief description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty (1-5)</Label>
                      <Input
                        id="difficulty"
                        type="number"
                        min="1"
                        max="5"
                        value={newCaseFile.difficulty_level}
                        onChange={(e) => setNewCaseFile({...newCaseFile, difficulty_level: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newCaseFile.category}
                        onChange={(e) => setNewCaseFile({...newCaseFile, category: e.target.value})}
                        placeholder="Category"
                      />
                    </div>
                  </div>

                  <Button onClick={createCaseFile} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Case File
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Case Files</CardTitle>
                  <CardDescription>Manage existing case files</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {caseFiles.map((caseFile) => (
                      <div key={caseFile.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h4 className="font-medium">{caseFile.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Difficulty: {caseFile.difficulty_level}/5 | {caseFile.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={caseFile.is_active ? "default" : "secondary"}>
                            {caseFile.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Create Achievement</CardTitle>
                  <CardDescription>Add new achievements and badges</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="achName">Achievement Name</Label>
                    <Input
                      id="achName"
                      value={newAchievement.name}
                      onChange={(e) => setNewAchievement({...newAchievement, name: e.target.value})}
                      placeholder="Achievement name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="achDesc">Description</Label>
                    <Textarea
                      id="achDesc"
                      value={newAchievement.description}
                      onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
                      placeholder="Achievement description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="points">Points Reward</Label>
                      <Input
                        id="points"
                        type="number"
                        value={newAchievement.points_reward}
                        onChange={(e) => setNewAchievement({...newAchievement, points_reward: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rarity">Rarity</Label>
                      <select
                        id="rarity"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newAchievement.rarity_level}
                        onChange={(e) => setNewAchievement({...newAchievement, rarity_level: e.target.value})}
                      >
                        <option value="common">Common</option>
                        <option value="uncommon">Uncommon</option>
                        <option value="rare">Rare</option>
                        <option value="epic">Epic</option>
                        <option value="legendary">Legendary</option>
                      </select>
                    </div>
                  </div>

                  <Button onClick={createAchievement} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Achievement
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Achievements</CardTitle>
                  <CardDescription>Manage existing achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h4 className="font-medium">{achievement.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {achievement.points_reward} points | {achievement.rarity_level}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {achievement.rarity_level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation">
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>Review and moderate user discussions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {discussions.map((discussion) => (
                    <div key={discussion.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{discussion.profiles?.display_name}</span>
                            <span className="text-sm text-muted-foreground">
                              in {discussion.case_files?.title}
                            </span>
                            {discussion.is_flagged && (
                              <Badge variant="destructive">Flagged</Badge>
                            )}
                          </div>
                          <p className="text-sm mb-2">{discussion.content}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(discussion.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={discussion.is_flagged ? "default" : "destructive"}
                            size="sm"
                            onClick={() => toggleDiscussionFlag(discussion.id, discussion.is_flagged)}
                          >
                            {discussion.is_flagged ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold">{users.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Case Files</p>
                      <p className="text-2xl font-bold">{caseFiles.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                      <p className="text-2xl font-bold">{achievements.length}</p>
                    </div>
                    <Trophy className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Discussions</p>
                      <p className="text-2xl font-bold">{discussions.length}</p>
                    </div>
                    <Shield className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPanel;