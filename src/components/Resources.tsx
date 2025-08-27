import { useState } from 'react';
import { Mic, Play, FileText, Star, Search, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const contentData = {
  podcasts: [
    {
      id: 1,
      title: "Debunking Deep Fakes",
      category: "Technology",
      duration: "24 min",
      featured: true,
      description: "Learn how to identify and understand deep fake technology and its implications for digital media literacy.",
      difficulty: "Intermediate",
      tags: ["AI", "Deepfakes", "Detection"]
    },
    {
      id: 2,
      title: "Social Media Algorithms Explained",
      category: "Technology", 
      duration: "18 min",
      description: "Understanding how social media feeds work and how they can create echo chambers.",
      difficulty: "Beginner",
      tags: ["Social Media", "Algorithms", "Echo Chambers"]
    },
    {
      id: 3,
      title: "Youth Activism in the Digital Age",
      category: "Social Impact",
      duration: "31 min", 
      description: "How young people are using technology to drive social change and combat misinformation.",
      difficulty: "Beginner",
      tags: ["Activism", "Digital Rights", "Social Change"]
    },
    {
      id: 4,
      title: "The Psychology of Misinformation",
      category: "Psychology",
      duration: "26 min",
      description: "Understanding why people believe and share false information, and how to combat cognitive biases.",
      difficulty: "Advanced",
      tags: ["Psychology", "Cognitive Bias", "Misinformation"]
    }
  ],
  videos: [
    {
      id: 1,
      title: "Social Media & Mental Health", 
      category: "Health",
      duration: "12 min",
      featured: true,
      description: "Exploring the relationship between social media usage and mental health in young people.",
      difficulty: "Beginner",
      tags: ["Mental Health", "Social Media", "Wellness"]
    },
    {
      id: 2,
      title: "Fact-Checking 101",
      category: "Media Literacy",
      duration: "8 min",
      description: "Essential skills for verifying information online and identifying reliable sources.",
      difficulty: "Beginner",
      tags: ["Fact-Checking", "Verification", "Sources"]
    },
    {
      id: 3,
      title: "Digital Privacy Basics",
      category: "Technology",
      duration: "15 min",
      description: "Protecting your personal information and understanding digital privacy rights.",
      difficulty: "Beginner",
      tags: ["Privacy", "Data Protection", "Digital Rights"]
    },
    {
      id: 4,
      title: "Spotting AI-Generated Content",
      category: "Technology",
      duration: "20 min",
      featured: true,
      description: "Learn to identify AI-generated text, images, and videos in your daily digital consumption.",
      difficulty: "Intermediate",
      tags: ["AI Detection", "Content Analysis", "Critical Thinking"]
    }
  ],
  articles: [
    {
      id: 1,
      title: "Climate Change Misinformation",
      category: "Environment", 
      readTime: "6 min read",
      featured: true,
      description: "Identifying and countering common climate change myths and misinformation campaigns.",
      difficulty: "Intermediate",
      tags: ["Climate Change", "Environmental Science", "Myth-busting"]
    },
    {
      id: 2,
      title: "Election Integrity and Youth Voices",
      category: "Politics",
      readTime: "4 min read", 
      description: "How young people can participate in protecting election integrity and democratic processes.",
      difficulty: "Beginner",
      tags: ["Elections", "Democracy", "Civic Engagement"]
    },
    {
      id: 3,
      title: "AI and the Future of Information",
      category: "Technology",
      readTime: "8 min read",
      description: "Understanding how AI is changing how we create, consume, and verify information.",
      difficulty: "Advanced",
      tags: ["Artificial Intelligence", "Information", "Future Tech"]
    },
    {
      id: 4,
      title: "Building Media Literacy in Schools",
      category: "Education",
      readTime: "10 min read",
      description: "A comprehensive guide for educators on integrating media literacy into curriculum.",
      difficulty: "Intermediate",
      tags: ["Education", "Curriculum", "Teaching"]
    },
    {
      id: 5,
      title: "The Economics of Misinformation",
      category: "Economics",
      readTime: "7 min read",
      description: "How false information spreads through economic incentives and what we can do about it.",
      difficulty: "Advanced",
      tags: ["Economics", "Business Models", "Incentives"]
    }
  ]
};

export function Resources() {
  const [activeTab, setActiveTab] = useState('podcasts');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  // Get all unique categories across all content types
  const getAllCategories = () => {
    const categories = new Set<string>();
    Object.values(contentData).forEach(items => {
      items.forEach(item => categories.add(item.category));
    });
    return Array.from(categories).sort();
  };

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  // Filter content based on search and filters
  const filterContent = (items: any[]) => {
    return items.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === 'all' || item.difficulty === difficultyFilter;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  };

  const ContentCard = ({ item, type }: { item: any; type: string }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {item.category}
          </Badge>
          <div className="flex space-x-1">
            {item.featured && (
              <Badge variant="default" className="bg-yellow-500 text-yellow-900 text-xs">
                <Star className="h-2 w-2 mr-1" />
                Featured
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {item.difficulty}
            </Badge>
          </div>
        </div>
        <CardTitle className="group-hover:text-primary transition-colors">
          {item.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {item.description}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{item.tags.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            {type === 'articles' ? item.readTime : item.duration}
          </span>
          <Button variant="ghost" size="sm">
            {type === 'podcasts' && <Mic className="h-4 w-4 mr-2" />}
            {type === 'videos' && <Play className="h-4 w-4 mr-2" />}
            {type === 'articles' && <FileText className="h-4 w-4 mr-2" />}
            {type === 'podcasts' ? 'Listen' : type === 'videos' ? 'Watch' : 'Read'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const getFeaturedContent = () => {
    const featured: any[] = [];
    Object.entries(contentData).forEach(([type, items]) => {
      items.forEach(item => {
        if (item.featured) {
          featured.push({ ...item, type });
        }
      });
    });
    return featured;
  };

  const getContentStats = () => {
    const totalContent = Object.values(contentData).reduce((sum, items) => sum + items.length, 0);
    const featuredCount = getFeaturedContent().length;
    const categories = getAllCategories().length;
    
    return { totalContent, featuredCount, categories };
  };

  const stats = getContentStats();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-400 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-medium mb-4">Learning Resources</h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">
            Discover curated content to build your digital literacy skills. From beginner guides to advanced techniques,
            find the resources that match your learning journey.
          </p>
          <div className="flex justify-center items-center space-x-8 text-purple-100">
            <div className="text-center">
              <div className="text-2xl font-medium">{stats.totalContent}</div>
              <div className="text-sm">Total Resources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium">{stats.featuredCount}</div>
              <div className="text-sm">Featured Content</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium">{stats.categories}</div>
              <div className="text-sm">Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search resources by title, description, or tags..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getAllCategories().map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setDifficultyFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-card rounded-lg p-1 mb-8 max-w-2xl mx-auto">
            <TabsList className="grid w-full grid-cols-4 bg-transparent">
              <TabsTrigger value="podcasts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Mic className="h-4 w-4 mr-2" />
                Podcasts
              </TabsTrigger>
              <TabsTrigger value="videos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Play className="h-4 w-4 mr-2" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="articles" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileText className="h-4 w-4 mr-2" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="featured" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Star className="h-4 w-4 mr-2" />
                Featured
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="podcasts" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium mb-2">Educational Podcasts</h2>
              <p className="text-muted-foreground">
                Listen to expert discussions and insights on digital literacy and misinformation topics.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterContent(contentData.podcasts).map((item) => (
                <ContentCard key={item.id} item={item} type="podcasts" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium mb-2">Educational Videos</h2>
              <p className="text-muted-foreground">
                Watch engaging video content covering essential digital literacy skills and concepts.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterContent(contentData.videos).map((item) => (
                <ContentCard key={item.id} item={item} type="videos" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium mb-2">In-Depth Articles</h2>
              <p className="text-muted-foreground">
                Read comprehensive articles and research on critical digital literacy topics.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterContent(contentData.articles).map((item) => (
                <ContentCard key={item.id} item={item} type="articles" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium mb-2">Featured Content</h2>
              <p className="text-muted-foreground">
                Our top recommendations for essential digital literacy learning, curated by experts.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterContent(getFeaturedContent()).map((item) => (
                <ContentCard key={`${item.type}-${item.id}`} item={item} type={item.type} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Show no results message */}
        {Object.values(contentData).every(items => filterContent(items).length === 0) && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              No resources found matching your filters. Try adjusting your search criteria.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}