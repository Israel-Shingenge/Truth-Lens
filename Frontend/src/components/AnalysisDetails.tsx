import React from 'react';
import { TrendingUp, BarChart3, Brain, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AnalysisDetailsProps {
  analysis: {
    patterns: {
      repetitiveStructure: number;
      vocabularyDiversity: number;
      sentenceComplexity: number;
    };
    technical: {
      perplexity: number;
      burstiness: number;
      coherenceScore: number;
    };
    statistics: {
      wordCount: number;
      readingTime: string;
      avgSentenceLength: number;
    };
  };
  credibilityScore: number;
  aiDetected: boolean;
  confidence: number;
}

const AnalysisDetails: React.FC<AnalysisDetailsProps> = ({ 
  analysis, 
  credibilityScore, 
  aiDetected, 
  confidence 
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  const riskFactors = [
    {
      name: 'Repetitive Patterns',
      score: analysis.patterns.repetitiveStructure,
      description: 'Analysis of sentence structure repetition typical of AI generation',
      threshold: 70,
      icon: TrendingUp
    },
    {
      name: 'Vocabulary Diversity',
      score: analysis.patterns.vocabularyDiversity,
      description: 'Measurement of word variety and lexical richness',
      threshold: 60,
      icon: BarChart3,
      inverted: true // Higher is better for this metric
    },
    {
      name: 'Coherence Score',
      score: analysis.technical.coherenceScore,
      description: 'Semantic consistency and logical flow analysis',
      threshold: 75,
      icon: Brain,
      inverted: true
    }
  ];

  const technicalMetrics = [
    {
      label: 'Perplexity',
      value: analysis.technical.perplexity.toFixed(1),
      description: 'Measures predictability of text patterns',
      status: analysis.technical.perplexity < 30 ? 'good' : analysis.technical.perplexity < 50 ? 'warning' : 'risk'
    },
    {
      label: 'Burstiness',
      value: analysis.technical.burstiness.toFixed(1),
      description: 'Variation in sentence length and structure',
      status: analysis.technical.burstiness > 40 ? 'good' : analysis.technical.burstiness > 25 ? 'warning' : 'risk'
    },
    {
      label: 'Sentence Complexity',
      value: analysis.patterns.sentenceComplexity.toFixed(1),
      description: 'Average syntactic complexity score',
      status: analysis.patterns.sentenceComplexity > 60 ? 'good' : analysis.patterns.sentenceComplexity > 40 ? 'warning' : 'risk'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'risk':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Assessment */}
      <Card className="glass border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Detailed Analysis
          </CardTitle>
          <CardDescription>
            Comprehensive breakdown of content authenticity indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="patterns" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="patterns" className="mt-6">
              <div className="space-y-4">
                {riskFactors.map((factor, index) => {
                  const Icon = factor.icon;
                  const isRisk = factor.inverted 
                    ? factor.score < factor.threshold 
                    : factor.score > factor.threshold;
                  
                  return (
                    <div key={index} className="p-4 border border-card-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{factor.name}</span>
                        </div>
                        <Badge variant={isRisk ? "destructive" : "secondary"}>
                          {factor.score}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {factor.description}
                      </p>
                      <Progress 
                        value={factor.score} 
                        className="h-2"
                      />
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="technical" className="mt-6">
              <div className="grid gap-4 md:grid-cols-3">
                {technicalMetrics.map((metric, index) => (
                  <Card key={index} className="border-card-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                        {getStatusIcon(metric.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold mb-2 ${getScoreColor(parseFloat(metric.value))}`}>
                        {metric.value}
                      </div>
                      <CardDescription className="text-xs">
                        {metric.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-6 border-card-border">
                <CardHeader>
                  <CardTitle className="text-base">AI Detection Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-background-alt rounded-lg">
                    <div>
                      <div className="font-medium">
                        {aiDetected ? 'AI-Generated Content Detected' : 'Human-like Content'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Model confidence: {confidence}%
                      </div>
                    </div>
                    <Badge 
                      variant={aiDetected ? "destructive" : "secondary"}
                      className="px-3 py-1"
                    >
                      {aiDetected ? 'AI Likely' : 'Human Likely'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statistics" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-card-border">
                  <CardHeader>
                    <CardTitle className="text-base">Content Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Word Count</span>
                      <span className="font-medium">{analysis.statistics.wordCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Reading Time</span>
                      <span className="font-medium">{analysis.statistics.readingTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Avg Sentence Length</span>
                      <span className="font-medium">{analysis.statistics.avgSentenceLength} words</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-card-border">
                  <CardHeader>
                    <CardTitle className="text-base">Quality Indicators</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Readability</span>
                      <Badge variant="secondary">
                        {analysis.statistics.avgSentenceLength > 20 ? 'Complex' : 
                         analysis.statistics.avgSentenceLength > 15 ? 'Moderate' : 'Simple'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Content Length</span>
                      <Badge variant="secondary">
                        {analysis.statistics.wordCount > 500 ? 'Long-form' : 
                         analysis.statistics.wordCount > 150 ? 'Medium' : 'Short'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Overall Quality</span>
                      <Badge variant={credibilityScore > 80 ? "default" : credibilityScore > 60 ? "secondary" : "destructive"}>
                        {credibilityScore > 80 ? 'High' : credibilityScore > 60 ? 'Moderate' : 'Low'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisDetails;