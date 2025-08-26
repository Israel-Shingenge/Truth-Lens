import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown, Users, Globe, MapPin, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const EnhancedLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [friendsData, setFriendsData] = useState([]);
  const [localData, setLocalData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('global');
  const [timeRange, setTimeRange] = useState('all-time');
  const { user, profile } = useAuth();

  useEffect(() => {
    fetchLeaderboardData();
  }, [timeRange, user]);

  const fetchLeaderboardData = async () => {
    try {
      // Fetch global leaderboard
      const { data: globalData, error: globalError } = await supabase
        .from('profiles')
        .select('*')
        .order('total_points', { ascending: false })
        .limit(50);

      if (globalError) throw globalError;
      setLeaderboardData(globalData || []);

      if (user) {
        // Fetch friends leaderboard
        const { data: friendsData, error: friendsError } = await supabase
          .from('friendships')
          .select(`
            addressee_id,
            requester_id,
            profiles!friendships_addressee_id_fkey (*),
            profiles!friendships_requester_id_fkey (*)
          `)
          .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
          .eq('status', 'accepted');

        if (!friendsError && friendsData) {
          const friendProfiles = friendsData.map(friendship => 
            friendship.requester_id === user.id 
              ? friendship.profiles 
              : friendship.profiles
          ).filter(Boolean);
          
          setFriendsData(friendProfiles);
        }

        // Fetch local leaderboard (same location)
        if (profile?.location) {
          const { data: localData, error: localError } = await supabase
            .from('profiles')
            .select('*')
            .eq('location', profile.location)
            .order('total_points', { ascending: false })
            .limit(20);

          if (!localError) {
            setLocalData(localData || []);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const getRankIcon = (position) => {
    switch (position) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <Trophy className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRankColor = (position) => {
    switch (position) {
      case 1: return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 2: return 'bg-gradient-to-r from-gray-400/20 to-slate-500/20 border-gray-400/30';
      case 3: return 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/30';
      default: return 'bg-background-alt border-card-border';
    }
  };

  const getBadgeForLevel = (level, points) => {
    if (level >= 20) return { text: 'Legend', variant: 'default', color: 'text-purple-500' };
    if (level >= 15) return { text: 'Master', variant: 'secondary', color: 'text-blue-500' };
    if (level >= 10) return { text: 'Expert', variant: 'outline', color: 'text-green-500' };
    if (level >= 5) return { text: 'Advanced', variant: 'outline', color: 'text-orange-500' };
    return { text: 'Novice', variant: 'outline', color: 'text-gray-500' };
  };

  const filterUsers = (users) => {
    if (!searchTerm) return users;
    return users.filter(user => 
      user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const LeaderboardList = ({ users, showLocation = false }) => {
    const filteredUsers = filterUsers(users);
    
    return (
      <div className="space-y-3">
        {filteredUsers.map((user, index) => {
          const position = index + 1;
          const badge = getBadgeForLevel(user.level || 1, user.total_points || 0);
          const isCurrentUser = user.user_id === profile?.user_id;
          
          return (
            <Card 
              key={user.id} 
              className={`${getRankColor(position)} ${isCurrentUser ? 'ring-2 ring-primary' : ''} glass-card hover-lift transition-all duration-300`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[60px]">
                      {getRankIcon(position)}
                      <span className="font-bold text-lg">#{position}</span>
                    </div>
                    
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>{user.display_name?.[0] || 'A'}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">
                          {user.display_name || user.username || 'Anonymous'}
                          {isCurrentUser && <Badge variant="outline" className="ml-2 text-xs">You</Badge>}
                        </h4>
                        <Badge variant={badge.variant} className={`text-xs ${badge.color}`}>
                          {badge.text}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          Level {user.level || 1}
                        </span>
                        {showLocation && user.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {user.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-lg gradient-text">
                      {user.total_points?.toLocaleString() || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {filteredUsers.length === 0 && (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {searchTerm ? 'No users found matching your search.' : 'No data available.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            Leaderboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Compete with truth seekers worldwide
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-background border border-input rounded-md text-sm"
          >
            <option value="all-time">All Time</option>
            <option value="monthly">This Month</option>
            <option value="weekly">This Week</option>
            <option value="daily">Today</option>
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Leaderboard Tabs */}
      <Tabs value={currentView} onValueChange={setCurrentView} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Global
          </TabsTrigger>
          <TabsTrigger value="friends" className="flex items-center gap-2" disabled={!user}>
            <Users className="h-4 w-4" />
            Friends
          </TabsTrigger>
          <TabsTrigger value="local" className="flex items-center gap-2" disabled={!profile?.location}>
            <MapPin className="h-4 w-4" />
            Local
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="mt-6">
          <LeaderboardList users={leaderboardData} showLocation={true} />
        </TabsContent>

        <TabsContent value="friends" className="mt-6">
          {user ? (
            <LeaderboardList users={friendsData} />
          ) : (
            <Card className="glass-card">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4">
                  Sign in to see your friends' rankings
                </p>
                <Button onClick={() => window.location.href = '/auth'}>
                  Sign In
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="local" className="mt-6">
          {profile?.location ? (
            <LeaderboardList users={localData} />
          ) : (
            <Card className="glass-card">
              <CardContent className="p-8 text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4">
                  Add your location to see local rankings
                </p>
                <Button onClick={() => window.location.href = '/account'}>
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Current User Rank Display */}
      {user && profile && (
        <Card className="glass-card border-primary/50 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback>{profile.display_name?.[0] || 'Y'}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">Your Rank</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Trophy className="h-3 w-3" />
                    Level {profile.level || 1} • {profile.total_points?.toLocaleString() || 0} points
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg gradient-text">
                  #{leaderboardData.findIndex(u => u.user_id === profile.user_id) + 1 || 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">global rank</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedLeaderboard;