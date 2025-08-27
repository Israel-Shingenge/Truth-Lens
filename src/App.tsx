import { useState, useEffect } from 'react';
import { Mic, Play, FileText, Star, MessageSquare, Search, Sun, Moon, User, Shield, AlertTriangle } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Alert, AlertDescription } from './components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/dialog';
import { DiscussionForum } from './components/DiscussionForum';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { UserViolationTracker } from './components/ContentModerationService';

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  community: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  tags: string[];
  isUpvoted?: boolean;
  isDownvoted?: boolean;
}

export interface Comment {
  id: number;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  replies?: Comment[];
  isUpvoted?: boolean;
  isDownvoted?: boolean;
}

export interface UserState {
  id: string;
  username: string;
  email: string;
  isLoggedIn: boolean;
  violationCount: number;
  isSuspended: boolean;
  lastViolationTime?: string;
}

const contentData = {
  podcasts: [
    {
      id: 1,
      title: "Debunking Deep Fakes",
      category: "Technology",
      duration: "24 min",
      featured: true,
      description: "Learn how to identify and understand deep fake technology and its implications for digital media literacy."
    },
    {
      id: 2,
      title: "Social Media Algorithms Explained",
      category: "Technology", 
      duration: "18 min",
      description: "Understanding how social media feeds work and how they can create echo chambers."
    },
    {
      id: 3,
      title: "Youth Activism in the Digital Age",
      category: "Social Impact",
      duration: "31 min", 
      description: "How young people are using technology to drive social change and combat misinformation."
    }
  ],
  videos: [
    {
      id: 1,
      title: "Social Media & Mental Health", 
      category: "Health",
      duration: "12 min",
      featured: true,
      description: "Exploring the relationship between social media usage and mental health in young people."
    },
    {
      id: 2,
      title: "Fact-Checking 101",
      category: "Media Literacy",
      duration: "8 min",
      description: "Essential skills for verifying information online and identifying reliable sources."
    },
    {
      id: 3,
      title: "Digital Privacy Basics",
      category: "Technology",
      duration: "15 min",
      description: "Protecting your personal information and understanding digital privacy rights."
    }
  ],
  articles: [
    {
      id: 1,
      title: "Climate Change Misinformation",
      category: "Environment", 
      readTime: "6 min read",
      featured: true,
      description: "Identifying and countering common climate change myths and misinformation campaigns."
    },
    {
      id: 2,
      title: "Election Integrity and Youth Voices",
      category: "Politics",
      readTime: "4 min read", 
      description: "How young people can participate in protecting election integrity and democratic processes."
    },
    {
      id: 3,
      title: "AI and the Future of Information",
      category: "Technology",
      readTime: "8 min read",
      description: "Understanding how AI is changing how we create, consume, and verify information."
    }
  ]
};

const initialPosts: Post[] = [
  {
    id: 1,
    title: "How do you fact-check information you see on social media?",
    content: "I've been seeing a lot of conflicting information about various topics on my feeds lately. What are your go-to methods for verifying if something is true before sharing it? Would love to hear different approaches!",
    author: "Alex M.",
    authorAvatar: "/api/placeholder/32/32",
    community: "Media Literacy",
    timestamp: "2 hours ago",
    upvotes: 34,
    downvotes: 2,
    tags: ["fact-checking", "social-media", "verification"],
    isUpvoted: true,
    comments: [
      {
        id: 1,
        author: "Sarah K.",
        authorAvatar: "/api/placeholder/32/32", 
        content: "I always check multiple sources, especially official websites and well-known fact-checking sites like Snopes. Also reverse image searching is super helpful!",
        timestamp: "1 hour ago",
        upvotes: 12,
        downvotes: 0,
        replies: [
          {
            id: 11,
            author: "Mike T.",
            authorAvatar: "/api/placeholder/32/32",
            content: "Great tip about reverse image search! I never thought of that. Which fact-checking sites do you trust most?",
            timestamp: "30 minutes ago",
            upvotes: 5,
            downvotes: 0
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Youth climate activism - sharing reliable resources",
    content: "I'm organizing a climate awareness event at my school and want to make sure all the information we share is accurate and well-sourced. Can anyone recommend reliable climate science resources that are youth-friendly?",
    author: "Jordan Rivera",
    authorAvatar: "/api/placeholder/32/32",
    community: "Environmental Action",
    timestamp: "4 hours ago",
    upvotes: 28,
    downvotes: 1,
    tags: ["climate", "activism", "resources", "education"],
    comments: [
      {
        id: 2,
        author: "Emma Chen",
        authorAvatar: "/api/placeholder/32/32",
        content: "NASA's climate kids website is amazing! Also check out the IPCC reports - they have summary documents that are more accessible.",
        timestamp: "2 hours ago",
        upvotes: 15,
        downvotes: 0
      }
    ]
  },
  {
    id: 3,
    title: "Deepfakes are getting scary good - how can we protect ourselves?",
    content: "Just saw some deepfake videos that were almost impossible to detect. This technology is advancing so fast. What should young people know about protecting ourselves from being deceived by deepfakes?",
    author: "Tech Student",
    authorAvatar: "/api/placeholder/32/32",
    community: "Digital Safety",
    timestamp: "6 hours ago",
    upvotes: 45,
    downvotes: 3,
    tags: ["deepfakes", "ai", "digital-literacy", "safety"],
    comments: []
  }
];

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('podcasts');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<UserState>({
    id: 'user_12345',
    username: 'Current User',
    email: 'user@example.com',
    isLoggedIn: true,
    violationCount: 0,
    isSuspended: false
  });
  const [showViolationDialog, setShowViolationDialog] = useState(false);
  const [violationMessage, setViolationMessage] = useState('');

  // Check for user violations on load and update periodically
  useEffect(() => {
    const checkViolations = () => {
      if (user.isLoggedIn) {
        const violationCount = UserViolationTracker.getViolationCount(user.id);
        setUser(prev => ({ ...prev, violationCount }));
        
        if (UserViolationTracker.shouldLogoutUser(user.id)) {
          handleForceLogout('Multiple community guideline violations detected.');
        }
      }
    };

    checkViolations();
    
    // Check every 30 seconds for violations (in case they occur in comments)
    const interval = setInterval(checkViolations, 30000);
    
    return () => clearInterval(interval);
  }, [user.id, user.isLoggedIn]);

  const handleForceLogout = (reason: string) => {
    setUser(prev => ({ ...prev, isLoggedIn: false, isSuspended: true }));
    setViolationMessage(reason);
    setShowViolationDialog(true);
    toast.error('Account suspended due to community guideline violations');
  };

  // Enhanced user violation handler that updates the violation count immediately
  const handleUserViolation = (reason: string) => {
    const violationCount = UserViolationTracker.getViolationCount(user.id);
    setUser(prev => ({ ...prev, violationCount }));
    
    if (UserViolationTracker.shouldLogoutUser(user.id)) {
      handleForceLogout(reason);
    }
  };

  const handleLogin = () => {
    if (user.isSuspended) {
      toast.error('Account is suspended. Please contact support.');
      return;
    }
    setUser(prev => ({ ...prev, isLoggedIn: true }));
  };

  const handleLogout = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
  };

  const ContentCard = ({ item, type }: { item: any; type: string }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Badge variant="secondary" className="mb-2">
            {item.category}
          </Badge>
          {item.featured && (
            <Badge variant="default" className="bg-yellow-500 text-yellow-900">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
        <CardTitle className="group-hover:text-primary transition-colors">
          {item.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
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
    const featured = [];
    Object.entries(contentData).forEach(([type, items]) => {
      items.forEach(item => {
        if (item.featured) {
          featured.push({ ...item, type });
        }
      });
    });
    return featured;
  };

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'dark' : ''}`}>
      {/* Violation Dialog */}
      <Dialog open={showViolationDialog} onOpenChange={setShowViolationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span>Account Suspended</span>
            </DialogTitle>
            <DialogDescription>
              Your account has been suspended due to multiple violations of our community guidelines.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{violationMessage}</p>
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Truth-Lens is committed to maintaining a safe and respectful environment for all users, 
                especially young people. Hate speech, harassment, and harmful content are not tolerated.
              </AlertDescription>
            </Alert>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowViolationDialog(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-medium">T</span>
                </div>
                <div>
                  <h1 className="font-medium text-foreground">Truth-Lens</h1>
                  <p className="text-xs text-muted-foreground">AI Content Credibility</p>
                </div>
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <Button variant="ghost" size="sm">Detector</Button>
                <Button variant="ghost" size="sm" className="bg-accent">Youth Voices</Button>
                <Button variant="ghost" size="sm">Games</Button>
                <Button variant="ghost" size="sm">Resources</Button>
                <Button variant="ghost" size="sm">Insights</Button>
                <Button variant="ghost" size="sm">About</Button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDark(!isDark)}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              {user.isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  {user.violationCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {user.violationCount} Warning{user.violationCount > 1 ? 's' : ''}
                    </Badge>
                  )}
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <User className="h-4 w-4 mr-2" />
                    {user.username}
                  </Button>
                </div>
              ) : (
                <Button variant="default" size="sm" onClick={handleLogin}>
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content Moderation Alert */}
      {user.isLoggedIn && user.violationCount > 0 && (
        <div className="bg-destructive/10 border-b border-destructive/20">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium">Community Guidelines Warning:</span> You have {user.violationCount} recent violation{user.violationCount > 1 ? 's' : ''}. 
                Additional violations may result in account suspension. Please review our community guidelines.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-medium mb-4">Youth Voices Hub</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Amplifying young voices in the fight against misinformation. Discover podcasts, 
            videos, and articles created by and for young digital citizens.
          </p>
          {user.isLoggedIn && (
            <div className="mt-6 flex items-center justify-center space-x-4 text-blue-100">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Safe Community Environment</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!user.isLoggedIn ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-medium mb-2">Please Log In</h2>
                <p className="text-muted-foreground mb-6">
                  Join our community to participate in discussions and access all features.
                </p>
                {user.isSuspended && (
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Your account has been suspended due to community guideline violations. 
                      Please contact support if you believe this is an error.
                    </AlertDescription>
                  </Alert>
                )}
                <Button onClick={handleLogin} disabled={user.isSuspended}>
                  <User className="h-4 w-4 mr-2" />
                  {user.isSuspended ? 'Account Suspended' : 'Log In to Continue'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-card rounded-lg p-1 mb-8 max-w-2xl mx-auto">
              <TabsList className="grid w-full grid-cols-5 bg-transparent">
               
                <TabsTrigger value="discussions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discussions
                </TabsTrigger>
                
              </TabsList>
            </div>

            <TabsContent value="podcasts" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-medium mb-2">Youth Podcasts</h2>
                <p className="text-muted-foreground">
                  Listen to conversations and insights from young voices on digital literacy and misinformation.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentData.podcasts.map((item) => (
                  <ContentCard key={item.id} item={item} type="podcasts" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-medium mb-2">Educational Videos</h2>
                <p className="text-muted-foreground">
                  Watch engaging videos created by young content creators on important digital topics.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentData.videos.map((item) => (
                  <ContentCard key={item.id} item={item} type="videos" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="articles" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-medium mb-2">Youth Articles</h2>
                <p className="text-muted-foreground">
                  Read in-depth articles and research by young writers on critical digital literacy topics.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentData.articles.map((item) => (
                  <ContentCard key={item.id} item={item} type="articles" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="discussions" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-medium mb-2">Youth Discussions</h2>
                <p className="text-muted-foreground">
                  Join conversations with other young people about digital literacy, misinformation, and online safety.
                </p>
              </div>
              <DiscussionForum 
                initialPosts={initialPosts} 
                currentUser={user}
                onUserViolation={handleUserViolation}
              />
            </TabsContent>

            <TabsContent value="featured" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-medium mb-2">Featured Content</h2>
                <p className="text-muted-foreground">
                  Our top picks for essential content on digital literacy and misinformation awareness.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFeaturedContent().map((item) => (
                  <ContentCard key={`${item.type}-${item.id}`} item={item} type={item.type} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>

      <Toaster />
    </div>
  );
}