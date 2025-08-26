import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedLeaderboard from '@/components/EnhancedLeaderboard';
import { TrendingUp, AlertTriangle, Users, FileText, BarChart3, Activity, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const InsightDashboard = () => {
  const misinformationTrends = [
    {
      topic: 'Health Misinformation',
      trend: '+15%',
      riskLevel: 'High',
      reports: 2847,
      regions: ['North America', 'Europe'],
      color: 'text-destructive'
    },
    {
      topic: 'Political Deepfakes',
      trend: '+8%',
      riskLevel: 'Medium',
      reports: 1523,
      regions: ['Global'],
      color: 'text-warning'
    },
    {
      topic: 'Climate Denial',
      trend: '-3%',
      riskLevel: 'Medium',
      reports: 934,
      regions: ['North America'],
      color: 'text-warning'
    },
    {
      topic: 'Financial Scams',
      trend: '+25%',
      riskLevel: 'Critical',
      reports: 3421,
      regions: ['Asia', 'Africa'],
      color: 'text-destructive'
    }
  ];

  const reports = [
    {
      title: 'Youth Digital Literacy Report 2024',
      audience: 'NGOs',
      downloads: '12.3K',
      type: 'Annual Report',
      featured: true
    },
    {
      title: 'School Misinformation Challenge Study',
      audience: 'Schools',
      downloads: '8.7K',
      type: 'Research Study'
    },
    {
      title: 'Policy Recommendations for Digital Literacy',
      audience: 'Policymakers',
      downloads: '5.2K',
      type: 'Policy Brief'
    },
    {
      title: 'Community Resilience Against Misinformation',
      audience: 'NGOs',
      downloads: '9.8K',
      type: 'Best Practices'
    }
  ];

  const metrics = [
    {
      label: 'Active Users',
      value: '247K',
      change: '+12%',
      icon: <Users className="h-5 w-5" />
    },
    {
      label: 'Content Analyzed',
      value: '1.2M',
      change: '+28%',
      icon: <FileText className="h-5 w-5" />
    },
    {
      label: 'Fake News Detected',
      value: '89K',
      change: '+15%',
      icon: <AlertTriangle className="h-5 w-5" />
    },
    {
      label: 'User Reports',
      value: '34K',
      change: '+7%',
      icon: <Eye className="h-5 w-5" />
    }
  ];

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
                Insight Dashboard
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Real-time intelligence on misinformation trends, impact metrics, and comprehensive reports for organizations and policymakers.
              </p>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold gradient-text mb-4">Platform Overview</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Key performance indicators and impact metrics across our platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {metrics.map((metric, index) => (
                <Card key={index} className="glass-card hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 rounded-lg bg-gradient-primary">
                        {metric.icon}
                      </div>
                      <Badge variant={metric.change.startsWith('+') ? 'default' : 'secondary'}>
                        {metric.change}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="py-20 bg-background-alt">
          <div className="container">
            <Tabs defaultValue="trends" className="w-full">
              <TabsList className="grid w-full grid-cols-4 max-w-3xl mx-auto mb-12">
                <TabsTrigger value="trends" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trends
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Reports
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Leaderboard
                </TabsTrigger>
              </TabsList>

              {/* Misinformation Trends */}
              <TabsContent value="trends">
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold gradient-text mb-2">
                      Global Misinformation Trends
                    </h3>
                    <p className="text-muted-foreground">
                      Real-time analysis of emerging misinformation patterns worldwide
                    </p>
                  </div>

                  <div className="grid gap-6">
                    {misinformationTrends.map((trend, index) => (
                      <Card key={index} className="glass-card hover-lift">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="p-3 rounded-lg bg-gradient-primary">
                                <TrendingUp className="h-6 w-6 text-primary-foreground" />
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold">{trend.topic}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge 
                                    variant={trend.riskLevel === 'Critical' ? 'destructive' : 
                                           trend.riskLevel === 'High' ? 'destructive' : 'secondary'}
                                  >
                                    {trend.riskLevel} Risk
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {trend.reports.toLocaleString()} reports
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${trend.color}`}>
                                {trend.trend}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                30-day change
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Activity Level</span>
                              <span className="font-medium">{trend.reports.toLocaleString()} reports</span>
                            </div>
                            <Progress value={Math.min(trend.reports / 50, 100)} className="h-2" />
                            <div className="flex flex-wrap gap-1">
                              <span className="text-sm text-muted-foreground mr-2">Affected regions:</span>
                              {trend.regions.map((region, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {region}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Reports */}
              <TabsContent value="reports">
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold gradient-text mb-2">
                      Impact Reports & Research
                    </h3>
                    <p className="text-muted-foreground">
                      Comprehensive reports for NGOs, schools, and policymakers
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report, index) => (
                      <Card key={index} className={`glass-card hover-lift group cursor-pointer ${report.featured ? 'border-primary/50 bg-primary/5' : ''}`}>
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={report.featured ? "default" : "secondary"}>
                              {report.audience}
                            </Badge>
                            {report.featured && <Badge variant="outline">Featured</Badge>}
                          </div>
                          <CardTitle className="text-lg group-hover:gradient-text transition-all duration-300">
                            {report.title}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs w-fit">
                            {report.type}
                          </Badge>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <FileText className="h-4 w-4" />
                              {report.downloads} downloads
                            </div>
                            <button className="px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity">
                              Download
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Analytics */}
              <TabsContent value="analytics">
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold gradient-text mb-2">
                      Platform Analytics
                    </h3>
                    <p className="text-muted-foreground">
                      Detailed insights into platform usage and effectiveness
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          User Engagement Trends
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Daily Active Users</span>
                            <span className="font-bold">48.2K</span>
                          </div>
                          <Progress value={75} />
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Content Verifications</span>
                            <span className="font-bold">1.2K/day</span>
                          </div>
                          <Progress value={60} />
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Educational Sessions</span>
                            <span className="font-bold">856/day</span>
                          </div>
                          <Progress value={45} />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Detection Accuracy
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-4xl font-bold gradient-text mb-2">94.7%</div>
                            <p className="text-sm text-muted-foreground">Overall Accuracy</p>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span>Text Analysis</span>
                              <span className="font-bold">96.2%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Image Verification</span>
                              <span className="font-bold">92.8%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Source Credibility</span>
                              <span className="font-bold">95.1%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Leaderboard */}
              <TabsContent value="leaderboard">
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold gradient-text mb-2">
                      Community Leaderboard
                    </h3>
                    <p className="text-muted-foreground">
                      Top contributors in the fight against misinformation
                    </p>
                  </div>
                  
                  <EnhancedLeaderboard />
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
              Need Custom Analytics?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Partner with us to get customized insights and reports tailored to your organization's needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-primary font-semibold rounded-lg hover-lift hover:shadow-glow transition-all duration-300">
                Request Partnership
              </button>
              <button className="px-8 py-4 border border-white/20 bg-white/10 text-white font-semibold rounded-lg hover-lift hover:bg-white/20 transition-all duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default InsightDashboard;