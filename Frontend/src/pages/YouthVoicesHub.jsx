import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import youthVoicesHero from '@/assets/youth-voices-hero.jpg';
import { Play, Mic, FileText, Star, Calendar, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const YouthVoicesHub = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const podcasts = [
    {
      id: 1,
      title: 'Debunking Deep Fakes',
      host: 'Maya Chen',
      duration: '32 min',
      listens: '15.2K',
      category: 'Technology',
      featured: true
    },
    {
      id: 2,
      title: 'Social Media & Mental Health',
      host: 'Jordan Smith',
      duration: '28 min',
      listens: '12.8K',
      category: 'Health'
    },
    {
      id: 3,
      title: 'Climate Change Misinformation',
      host: 'Alex Rodriguez',
      duration: '45 min',
      listens: '18.5K',
      category: 'Environment'
    }
  ];

  const videos = [
    {
      id: 1,
      title: 'How to Spot Fake News in 60 Seconds',
      creator: 'TechSavvy Teen',
      views: '89K',
      duration: '1:15',
      thumbnail: '📱'
    },
    {
      id: 2,
      title: 'My Experience with Online Trolls',
      creator: 'Digital Native',
      views: '45K',
      duration: '8:32',
      thumbnail: '💬'
    },
    {
      id: 3,
      title: 'Breaking Down Bias in News',
      creator: 'Young Journalist',
      views: '67K',
      duration: '12:18',
      thumbnail: '📰'
    }
  ];

  const articles = [
    {
      id: 1,
      title: 'The Psychology Behind Viral Misinformation',
      author: 'Sarah Kim',
      readTime: '8 min',
      category: 'Psychology',
      date: '2024-01-15',
      featured: true
    },
    {
      id: 2,
      title: 'Building Media Literacy in Schools',
      author: 'Marcus Johnson',
      readTime: '6 min',
      category: 'Education',
      date: '2024-01-12'
    },
    {
      id: 3,
      title: 'Youth Activism in the Digital Age',
      author: 'Priya Patel',
      readTime: '10 min',
      category: 'Activism',
      date: '2024-01-10'
    }
  ];

  const featuredYouth = [
    {
      name: 'Maya Chen',
      age: 19,
      location: 'San Francisco, CA',
      specialty: 'AI Ethics',
      bio: 'Computer Science student passionate about ethical AI and fighting deepfakes.',
      achievements: ['AI Ethics Award 2023', 'TEDx Speaker'],
      avatar: '👩‍💻'
    },
    {
      name: 'Jordan Smith',
      age: 17,
      location: 'Toronto, ON',
      specialty: 'Mental Health Advocacy',
      bio: 'High school activist focused on digital wellness and mental health awareness.',
      achievements: ['Youth Mental Health Champion', 'Podcast Host'],
      avatar: '🧑‍🎓'
    },
    {
      name: 'Alex Rodriguez',
      age: 20,
      location: 'Mexico City, MX',
      specialty: 'Climate Communication',
      bio: 'Environmental science major combating climate misinformation.',
      achievements: ['Climate Action Leader', 'Research Published'],
      avatar: '🌱'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={youthVoicesHero} 
              alt="Youth Voices Hub" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-dark/70" />
          </div>
          <div className="container relative z-10 text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Youth Voices Hub
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Amplifying young voices in the fight against misinformation. Discover podcasts, videos, and articles created by and for young digital citizens.
              </p>
            </div>
          </div>
        </section>

        {/* Content Tabs */}
        <section className="py-20">
          <div className="container">
            <Tabs defaultValue="podcasts" className="w-full">
              <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-12">
                <TabsTrigger value="podcasts" className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Podcasts
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Videos
                </TabsTrigger>
                <TabsTrigger value="articles" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Articles
                </TabsTrigger>
                <TabsTrigger value="featured" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Featured
                </TabsTrigger>
              </TabsList>

              {/* Podcasts */}
              <TabsContent value="podcasts">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {podcasts.map((podcast) => (
                    <Card key={podcast.id} className="glass-card hover-lift group cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={podcast.featured ? "default" : "secondary"}>
                            {podcast.category}
                          </Badge>
                          {podcast.featured && <Star className="h-4 w-4 text-warning" />}
                        </div>
                        <CardTitle className="text-lg group-hover:gradient-text transition-all duration-300">
                          {podcast.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            {podcast.host}
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {podcast.duration}
                            </div>
                            <div className="flex items-center gap-2">
                              <Play className="h-4 w-4" />
                              {podcast.listens}
                            </div>
                          </div>
                          <button className="w-full mt-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                            Listen Now
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Videos */}
              <TabsContent value="videos">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {videos.map((video) => (
                    <Card key={video.id} className="glass-card hover-lift group cursor-pointer">
                      <CardContent className="p-0">
                        <div className="aspect-video bg-gradient-primary rounded-t-lg flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                          {video.thumbnail}
                        </div>
                        <div className="p-6">
                          <h3 className="font-semibold mb-2 group-hover:gradient-text transition-all duration-300">
                            {video.title}
                          </h3>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {video.creator}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Play className="h-4 w-4" />
                                {video.views} views
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {video.duration}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Articles */}
              <TabsContent value="articles">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.map((article) => (
                    <Card key={article.id} className="glass-card hover-lift group cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={article.featured ? "default" : "secondary"}>
                            {article.category}
                          </Badge>
                          {article.featured && <Star className="h-4 w-4 text-warning" />}
                        </div>
                        <CardTitle className="text-lg group-hover:gradient-text transition-all duration-300">
                          {article.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            {article.author}
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {article.readTime} read
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {new Date(article.date).toLocaleDateString()}
                            </div>
                          </div>
                          <button className="w-full mt-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                            Read Article
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Featured Youth */}
              <TabsContent value="featured">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredYouth.map((youth, index) => (
                    <Card key={index} className="glass-card hover-lift group">
                      <CardHeader className="text-center">
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                          {youth.avatar}
                        </div>
                        <CardTitle className="gradient-text">{youth.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Age {youth.age} • {youth.location}
                        </p>
                        <Badge variant="outline" className="mx-auto">
                          {youth.specialty}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {youth.bio}
                        </p>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Achievements:</h4>
                          {youth.achievements.map((achievement, i) => (
                            <Badge key={i} variant="secondary" className="text-xs mr-1">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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

export default YouthVoicesHub;