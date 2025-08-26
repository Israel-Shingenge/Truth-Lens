import React, { useState, useEffect } from 'react';
import { Trophy, Award, Star, Lock, CheckCircle, Zap, Target, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/components/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rarity');
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchAchievements();
    if (user) {
      fetchUserAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('points_reward', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchUserAchievements = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserAchievements(data || []);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
    }
  };

  const getRarityInfo = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return {
          icon: Crown,
          color: 'text-purple-500',
          bgColor: 'bg-purple-500/20',
          borderColor: 'border-purple-500/50',
          label: 'Legendary',
          gradient: 'from-purple-500 to-pink-500'
        };
      case 'epic':
        return {
          icon: Star,
          color: 'text-orange-500',
          bgColor: 'bg-orange-500/20',
          borderColor: 'border-orange-500/50',
          label: 'Epic',
          gradient: 'from-orange-500 to-red-500'
        };
      case 'rare':
        return {
          icon: Award,
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/50',
          label: 'Rare',
          gradient: 'from-blue-500 to-cyan-500'
        };
      case 'uncommon':
        return {
          icon: Target,
          color: 'text-green-500',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/50',
          label: 'Uncommon',
          gradient: 'from-green-500 to-emerald-500'
        };
      default:
        return {
          icon: Trophy,
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/20',
          borderColor: 'border-gray-500/50',
          label: 'Common',
          gradient: 'from-gray-500 to-slate-500'
        };
    }
  };

  const isUnlocked = (achievementId) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId);
  };

  const getFilteredAchievements = () => {
    let filtered = achievements;

    switch (filter) {
      case 'unlocked':
        filtered = achievements.filter(achievement => isUnlocked(achievement.id));
        break;
      case 'locked':
        filtered = achievements.filter(achievement => !isUnlocked(achievement.id));
        break;
      case 'legendary':
        filtered = achievements.filter(achievement => achievement.rarity_level === 'legendary');
        break;
      case 'epic':
        filtered = achievements.filter(achievement => achievement.rarity_level === 'epic');
        break;
    }

    // Sort achievements
    switch (sortBy) {
      case 'rarity':
        const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
        filtered = filtered.sort((a, b) => rarityOrder[a.rarity_level] - rarityOrder[b.rarity_level]);
        break;
      case 'points':
        filtered = filtered.sort((a, b) => (b.points_reward || 0) - (a.points_reward || 0));
        break;
      case 'name':
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  };

  const calculateProgress = (achievement) => {
    // Mock progress calculation - in real app, this would be based on user stats
    if (isUnlocked(achievement.id)) return 100;
    
    const condition = achievement.unlock_condition;
    if (typeof condition === 'object' && condition.type) {
      // This would be calculated based on actual user progress
      return Math.floor(Math.random() * 80); // Mock progress
    }
    return 0;
  };

  const triggerAchievementUnlock = (achievement) => {
    toast({
      title: "🎉 Achievement Unlocked!",
      description: `${achievement.name} - ${achievement.points_reward} points earned!`,
      duration: 5000,
    });
  };

  const AchievementCard = ({ achievement }) => {
    const rarity = getRarityInfo(achievement.rarity_level);
    const Icon = rarity.icon;
    const unlocked = isUnlocked(achievement.id);
    const progress = calculateProgress(achievement);
    const unlockedDate = userAchievements.find(ua => ua.achievement_id === achievement.id)?.unlocked_at;

    return (
      <Card 
        className={`glass-card hover-lift transition-all duration-500 ${
          unlocked 
            ? `${rarity.borderColor} ${rarity.bgColor} shadow-glow` 
            : 'border-card-border opacity-75 grayscale hover:grayscale-0'
        }`}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${unlocked ? `bg-gradient-to-r ${rarity.gradient}` : 'bg-muted'} relative`}>
                {unlocked ? (
                  <Icon className="h-6 w-6 text-white animate-pulse" />
                ) : (
                  <Lock className="h-6 w-6 text-muted-foreground" />
                )}
                {unlocked && (
                  <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-500 bg-background rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <CardTitle className={`text-lg ${unlocked ? 'gradient-text' : 'text-muted-foreground'}`}>
                  {achievement.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${rarity.color} ${rarity.borderColor}`}
                  >
                    {rarity.label}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {achievement.points_reward || 0} pts
                  </Badge>
                </div>
              </div>
            </div>
            
            {unlocked && unlockedDate && (
              <div className="text-xs text-muted-foreground text-right">
                <div>Unlocked</div>
                <div>{new Date(unlockedDate).toLocaleDateString()}</div>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {achievement.description}
          </p>
          
          {!unlocked && progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2"
              />
            </div>
          )}
          
          {unlocked && (
            <div className={`flex items-center justify-center p-3 rounded-lg ${rarity.bgColor} ${rarity.borderColor} border`}>
              <Zap className={`h-4 w-4 mr-2 ${rarity.color}`} />
              <span className={`font-semibold ${rarity.color}`}>
                Achievement Unlocked!
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const stats = {
    total: achievements.length,
    unlocked: userAchievements.length,
    totalPoints: userAchievements.reduce((sum, ua) => {
      const achievement = achievements.find(a => a.id === ua.achievement_id);
      return sum + (achievement?.points_reward || 0);
    }, 0),
    legendaryUnlocked: userAchievements.filter(ua => {
      const achievement = achievements.find(a => a.id === ua.achievement_id);
      return achievement?.rarity_level === 'legendary';
    }).length
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-primary" />
          Achievement Gallery
        </h2>
        <p className="text-muted-foreground">
          Unlock achievements by completing challenges and demonstrating expertise
        </p>
      </div>

      {/* Stats Overview */}
      {user && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold gradient-text">{stats.unlocked}</div>
              <div className="text-xs text-muted-foreground">of {stats.total}</div>
              <div className="text-sm font-medium">Unlocked</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-500">{stats.totalPoints}</div>
              <div className="text-xs text-muted-foreground">total</div>
              <div className="text-sm font-medium">Points</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-500">{stats.legendaryUnlocked}</div>
              <div className="text-xs text-muted-foreground">legendary</div>
              <div className="text-sm font-medium">Rare Finds</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-500">
                {Math.round((stats.unlocked / stats.total) * 100) || 0}%
              </div>
              <div className="text-xs text-muted-foreground">complete</div>
              <div className="text-sm font-medium">Progress</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
            <TabsTrigger value="locked">Locked</TabsTrigger>
            <TabsTrigger value="legendary">Legendary</TabsTrigger>
            <TabsTrigger value="epic">Epic</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 bg-background border border-input rounded-md text-sm"
        >
          <option value="rarity">Sort by Rarity</option>
          <option value="points">Sort by Points</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredAchievements().map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>

      {getFilteredAchievements().length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold mb-2">No achievements found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or start completing challenges to unlock achievements!
            </p>
          </CardContent>
        </Card>
      )}

      {!user && (
        <Card className="glass-card border-primary/50 bg-primary/5">
          <CardContent className="p-8 text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Start Your Achievement Journey</h3>
            <p className="text-muted-foreground mb-6">
              Sign in to track your progress and unlock achievements as you master media literacy skills.
            </p>
            <Button onClick={() => window.location.href = '/auth'} className="hover-lift">
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Achievements;