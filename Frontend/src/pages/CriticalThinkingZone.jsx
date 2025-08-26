import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import criticalThinkingHero from '@/assets/critical-thinking-hero.jpg';
import { Brain, Trophy, Target, CheckCircle, X, AlertTriangle, Clock, Star, Play, FileText, Users, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CriticalThinkingZone = () => {
  const leaderboard = [
    { rank: 1, name: 'Alex M.', score: 2850, badge: '🏆' },
    { rank: 2, name: 'Sarah K.', score: 2720, badge: '🥈' },
    { rank: 3, name: 'Jordan P.', score: 2650, badge: '🥉' },
    { rank: 4, name: 'Maya C.', score: 2580, badge: '⭐' },
    { rank: 5, name: 'You', score: 2340, badge: '🎯' },
  ];

  const achievements = [
    { name: 'Fact Checker', description: 'Completed 10 case files', icon: '🕵️', unlocked: true },
    { name: 'Critical Thinker', description: 'Perfect score on quiz', icon: '🧠', unlocked: true },
    { name: 'Debunker', description: 'Identified 50 fake news articles', icon: '🚫', unlocked: false },
    { name: 'Media Guru', description: 'Reached expert level', icon: '👑', unlocked: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={criticalThinkingHero} 
              alt="Critical Thinking Zone" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-dark/70" />
          </div>
          <div className="container relative z-10 text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Critical Thinking Zone
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Sharpen your media literacy skills through interactive games, quizzes, and case studies. Learn to spot misinformation like a pro!
              </p>
            </div>
          </div>
        </section>

        {/* Games Section */}
        <section className="py-20">
          <div className="container">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-12">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Leaderboard
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Badges
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Resources
                </TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview" className="space-y-12">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold gradient-text mb-4">Choose Your Challenge</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Develop your critical thinking skills through interactive games and educational content
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Case Files */}
                  <Card className="glass-card hover-lift group cursor-pointer">
                    <CardHeader className="text-center">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🕵️</div>
                      <CardTitle className="text-2xl gradient-text">Case Files</CardTitle>
                      <p className="text-muted-foreground">
                        Interactive detective-style games with dialogue, full-screen mode, and background music
                      </p>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className="flex justify-around text-sm">
                        <div className="text-center">
                          <div className="font-bold text-lg">15+</div>
                          <div className="text-muted-foreground">Cases</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg">5-10</div>
                          <div className="text-muted-foreground">Minutes</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg">🎵</div>
                          <div className="text-muted-foreground">Music</div>
                        </div>
                      </div>
                      <Button asChild className="w-full hover-lift">
                        <Link to="/case-files">
                          <Play className="mr-2 h-4 w-4" />
                          Start Case Files
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Quizzes */}
                  <Card className="glass-card hover-lift group cursor-pointer">
                    <CardHeader className="text-center">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🧠</div>
                      <CardTitle className="text-2xl gradient-text">Quick Quizzes</CardTitle>
                      <p className="text-muted-foreground">
                        Fast-paced knowledge checks to test your media literacy skills
                      </p>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className="flex justify-around text-sm">
                        <div className="text-center">
                          <div className="font-bold text-lg">20+</div>
                          <div className="text-muted-foreground">Questions</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg">2-3</div>
                          <div className="text-muted-foreground">Minutes</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg">⚡</div>
                          <div className="text-muted-foreground">Quick</div>
                        </div>
                      </div>
                      <Button asChild className="w-full hover-lift">
                        <Link to="/quizzes">
                          <Brain className="mr-2 h-4 w-4" />
                          Start Quiz
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Community Features */}
                <div className="mt-16">
                  <h3 className="text-2xl font-bold text-center gradient-text mb-8">Community Features</h3>
                  <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    <Card className="glass-card hover-lift">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Youth Voices Hub
                        </CardTitle>
                        <p className="text-muted-foreground text-sm">
                          Join discussions, share insights, and collaborate with other critical thinkers
                        </p>
                      </CardHeader>
                      <CardContent>
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/youth-voices">
                            <Users className="mr-2 h-4 w-4" />
                            Join Community
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="glass-card hover-lift">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Learning Resources
                        </CardTitle>
                        <p className="text-muted-foreground text-sm">
                          Access guides, articles, and tools for media literacy education
                        </p>
                      </CardHeader>
                      <CardContent>
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/resources">
                            <BookOpen className="mr-2 h-4 w-4" />
                            View Resources
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Leaderboard */}
              <TabsContent value="leaderboard">
                <Card className="glass-card max-w-2xl mx-auto">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl gradient-text">
                      <Trophy className="inline-block mr-2 h-6 w-6" />
                      Leaderboard
                    </CardTitle>
                    <p className="text-muted-foreground">Top media literacy champions</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {leaderboard.map((player) => (
                        <div 
                          key={player.rank}
                          className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 hover-lift ${
                            player.name === 'You' ? 'bg-gradient-primary/10 border border-primary/20' : 'bg-background-alt'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-2xl">{player.badge}</div>
                            <div>
                              <div className="font-semibold">{player.name}</div>
                              <div className="text-sm text-muted-foreground">Rank #{player.rank}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{player.score.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">points</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Achievements */}
              <TabsContent value="achievements">
                <Card className="glass-card max-w-2xl mx-auto">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl gradient-text">
                      <Star className="inline-block mr-2 h-6 w-6" />
                      Achievement Badges
                    </CardTitle>
                    <p className="text-muted-foreground">Your progress and accomplishments</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-4 p-4 rounded-lg border ${
                            achievement.unlocked
                              ? 'bg-primary/10 border-primary/30'
                              : 'bg-muted/50 border-muted opacity-60'
                          }`}
                        >
                          <div className="text-3xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{achievement.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                          </div>
                          {achievement.unlocked && (
                            <CheckCircle className="h-5 w-5 text-success" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Resources */}
              <TabsContent value="resources">
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold gradient-text mb-4">Learning Resources</h2>
                    <p className="text-muted-foreground">
                      Educational materials to enhance your critical thinking skills
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="glass-card hover-lift">
                      <CardHeader>
                        <CardTitle className="text-lg">Media Literacy Guide</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Complete guide to identifying misinformation
                        </p>
                      </CardHeader>
                      <CardContent>
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/resources">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Read Guide
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="glass-card hover-lift">
                      <CardHeader>
                        <CardTitle className="text-lg">Fact-Checking Tools</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Learn about professional fact-checking methods
                        </p>
                      </CardHeader>
                      <CardContent>
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/resources">
                            <Target className="mr-2 h-4 w-4" />
                            Explore Tools
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="glass-card hover-lift">
                      <CardHeader>
                        <CardTitle className="text-lg">Discussion Forums</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Join conversations about current events
                        </p>
                      </CardHeader>
                      <CardContent>
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/youth-voices">
                            <Users className="mr-2 h-4 w-4" />
                            Join Discussion
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
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

export default CriticalThinkingZone;