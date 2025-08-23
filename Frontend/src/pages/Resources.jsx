import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BookOpen, Download, ExternalLink, Search, Filter, CheckCircle, FileText, Video, Headphones } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const factCheckingGuides = [
    {
      title: 'The Complete Fact-Checking Handbook',
      description: 'A comprehensive guide to verifying information online and offline.',
      type: 'PDF',
      category: 'Beginner',
      downloadCount: '15.2K',
      icon: <FileText className="h-5 w-5" />,
      featured: true
    },
    {
      title: 'Social Media Verification Toolkit',
      description: 'Tools and techniques for verifying content on social platforms.',
      type: 'Interactive',
      category: 'Intermediate',
      downloadCount: '8.7K',
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      title: 'Image and Video Verification Guide',
      description: 'Learn to spot manipulated media and verify visual content.',
      type: 'Video Course',
      category: 'Advanced',
      downloadCount: '12.1K',
      icon: <Video className="h-5 w-5" />
    },
    {
      title: 'Quick Reference Checklist',
      description: 'A handy checklist for quick fact-checking on the go.',
      type: 'Checklist',
      category: 'All Levels',
      downloadCount: '22.5K',
      icon: <FileText className="h-5 w-5" />
    }
  ];

  const digitalLiteracyTools = [
    {
      title: 'Source Credibility Analyzer',
      description: 'Browser extension that rates news sources in real-time.',
      type: 'Browser Extension',
      category: 'Tool',
      users: '45K+',
      icon: <ExternalLink className="h-5 w-5" />,
      featured: true
    },
    {
      title: 'Bias Detection Dashboard',
      description: 'Analyze text for political bias and emotional manipulation.',
      type: 'Web App',
      category: 'Analysis',
      users: '28K+',
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      title: 'Media Literacy Quiz Builder',
      description: 'Create custom quizzes to test media literacy skills.',
      type: 'Educational Tool',
      category: 'Education',
      users: '15K+',
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      title: 'Fact-Check API',
      description: 'Developer API for integrating fact-checking into apps.',
      type: 'API',
      category: 'Developer',
      users: '3.2K+',
      icon: <ExternalLink className="h-5 w-5" />
    }
  ];

  const partnerMaterials = [
    {
      title: 'Educator Training Modules',
      description: 'Complete curriculum for teaching media literacy in schools.',
      partner: 'UNESCO Education',
      type: 'Curriculum',
      downloads: '9.8K',
      icon: <BookOpen className="h-5 w-5" />,
      featured: true
    },
    {
      title: 'Parent Guide to Digital Safety',
      description: 'Help parents navigate digital challenges with their children.',
      partner: 'Family Safety Coalition',
      type: 'Guide',
      downloads: '14.3K',
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: 'Workplace Misinformation Training',
      description: 'Corporate training materials for information security.',
      partner: 'Business Ethics Institute',
      type: 'Training',
      downloads: '5.7K',
      icon: <Video className="h-5 w-5" />
    },
    {
      title: 'Community Workshop Kit',
      description: 'Materials for organizing local media literacy workshops.',
      partner: 'Civic Engagement Network',
      type: 'Workshop Kit',
      downloads: '7.2K',
      icon: <BookOpen className="h-5 w-5" />
    }
  ];

  const categories = ['all', 'Beginner', 'Intermediate', 'Advanced', 'Tool', 'Education'];

  const filterResources = (resources) => {
    return resources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glass" />
          <div className="container relative z-10 text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Resource Library
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Comprehensive collection of tools, guides, and materials to enhance your media literacy skills and help others do the same.
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-12 bg-background-alt">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search resources..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 bg-background border border-input rounded-md text-sm"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Content */}
        <section className="py-20">
          <div className="container">
            <Tabs defaultValue="guides" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-12">
                <TabsTrigger value="guides" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Fact-Checking Guides
                </TabsTrigger>
                <TabsTrigger value="toolkit" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Digital Literacy Toolkit
                </TabsTrigger>
                <TabsTrigger value="partners" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Partner Materials
                </TabsTrigger>
              </TabsList>

              {/* Fact-Checking Guides */}
              <TabsContent value="guides">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filterResources(factCheckingGuides).map((guide, index) => (
                    <Card key={index} className={`glass-card hover-lift group cursor-pointer ${guide.featured ? 'border-primary/50 bg-primary/5' : ''}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={guide.featured ? "default" : "secondary"}>
                            {guide.category}
                          </Badge>
                          {guide.featured && <Badge variant="outline">Featured</Badge>}
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-gradient-primary">
                            {guide.icon}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg group-hover:gradient-text transition-all duration-300">
                              {guide.title}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {guide.type}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                          {guide.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Download className="h-4 w-4" />
                            {guide.downloadCount} downloads
                          </div>
                          <Button size="sm" className="hover-lift">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Digital Literacy Toolkit */}
              <TabsContent value="toolkit">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filterResources(digitalLiteracyTools).map((tool, index) => (
                    <Card key={index} className={`glass-card hover-lift group cursor-pointer ${tool.featured ? 'border-primary/50 bg-primary/5' : ''}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={tool.featured ? "default" : "secondary"}>
                            {tool.category}
                          </Badge>
                          {tool.featured && <Badge variant="outline">Featured</Badge>}
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-gradient-accent">
                            {tool.icon}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg group-hover:gradient-text transition-all duration-300">
                              {tool.title}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {tool.type}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                          {tool.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4" />
                            {tool.users} users
                          </div>
                          <Button size="sm" className="hover-lift">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Access Tool
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Partner Materials */}
              <TabsContent value="partners">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filterResources(partnerMaterials).map((material, index) => (
                    <Card key={index} className={`glass-card hover-lift group cursor-pointer ${material.featured ? 'border-primary/50 bg-primary/5' : ''}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{material.type}</Badge>
                          {material.featured && <Badge variant="outline">Featured</Badge>}
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-gradient-success">
                            {material.icon}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg group-hover:gradient-text transition-all duration-300">
                              {material.title}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                              by {material.partner}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                          {material.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Download className="h-4 w-4" />
                            {material.downloads} downloads
                          </div>
                          <Button size="sm" className="hover-lift">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glass" />
          <div className="container relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Need Custom Resources?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              We can create customized materials for your organization, school, or community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-primary font-semibold hover-lift hover:shadow-glow">
                Request Custom Materials
              </Button>
              <Button variant="outline" className="border-white/20 bg-white/10 text-white hover-lift hover:bg-white/20">
                Contact Partnership Team
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Resources;