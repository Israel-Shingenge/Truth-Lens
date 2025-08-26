import React, { useState } from 'react';
import { Scan, Upload, X, AlertCircle, CheckCircle, AlertTriangle, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AnalysisDetails from './AnalysisDetails';

interface AnalysisResult {
  credibilityScore: number;
  aiDetected: boolean;
  confidence: number;
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
  recommendations: string[];
}

const ContentDetector: React.FC = () => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');

  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

  const analyzeContent = async () => {
    if (content.length < 50) {
      setError('Please enter at least 50 characters for accurate analysis.');
      return;
    }

    setError('');
    setIsAnalyzing(true);

    // Mock analysis - replace with real API call
    setTimeout(() => {
      const wordCount = content.split(/\s+/).length;
      const avgSentenceLength = content.split(/[.!?]+/).length > 1 
        ? Math.round(wordCount / content.split(/[.!?]+/).length) 
        : wordCount;
      
      const mockResult: AnalysisResult = {
        credibilityScore: Math.floor(Math.random() * 40) + 60, // 60-99%
        aiDetected: Math.random() > 0.6,
        confidence: Math.floor(Math.random() * 20) + 80, // 80-99%
        analysis: {
          patterns: {
            repetitiveStructure: Math.floor(Math.random() * 50) + 25,
            vocabularyDiversity: Math.floor(Math.random() * 40) + 60,
            sentenceComplexity: Math.floor(Math.random() * 35) + 45,
          },
          technical: {
            perplexity: Math.random() * 30 + 15,
            burstiness: Math.random() * 25 + 35,
            coherenceScore: Math.floor(Math.random() * 20) + 75,
          },
          statistics: {
            wordCount,
            readingTime: `${Math.ceil(wordCount / 200)} min`,
            avgSentenceLength,
          },
        },
        recommendations: [
          'Cross-reference key claims with authoritative sources',
          'Verify author credentials and publication date',
          'Look for supporting evidence and citations',
          'Check for emotional manipulation or bias indicators',
          'Search for peer reviews or expert opinions',
          'Examine potential conflicts of interest'
        ],
      };

      setResult(mockResult);
      setIsAnalyzing(false);
    }, 2500);
  };

  const clearContent = () => {
    setContent('');
    setResult(null);
    setError('');
    setShowDetailedAnalysis(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text);
      };
      reader.readAsText(file);
    } else {
      setError('Please upload a plain text file (.txt)');
    }
  };

  const exportReport = () => {
    if (!result) return;
    
    const report = {
      timestamp: new Date().toISOString(),
      content: content.substring(0, 100) + '...',
      credibilityScore: result.credibilityScore,
      aiDetected: result.aiDetected,
      confidence: result.confidence,
      analysis: result.analysis,
      recommendations: result.recommendations
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `truth-lens-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'High Credibility';
    if (score >= 60) return 'Moderate Credibility';
    return 'Low Credibility';
  };

  return (
    <section id="detector" className="py-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="absolute inset-0">
          {/* Floating AI/Tech Elements */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-pulse" 
               style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent/40 rounded-full animate-pulse" 
               style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-primary/20 rounded-full animate-pulse" 
               style={{ animationDelay: '2s', animationDuration: '5s' }} />
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-accent/30 rounded-full animate-pulse" 
               style={{ animationDelay: '1.5s', animationDuration: '3.5s' }} />
          
          {/* Scanning Lines */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent w-1/3 animate-scan" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-accent/10 to-transparent w-1/4 animate-scan-reverse" />
        </div>
      </div>
      
      <div className="container px-4 relative z-10">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">AI Content Detection</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Paste your content below to analyze its authenticity, detect AI generation patterns, 
              and receive detailed credibility insights.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Input Section */}
            <Card className="glass border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5 text-primary" />
                  Content Analysis
                </CardTitle>
                <CardDescription>
                  Enter the text content you want to analyze for AI generation patterns.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="Paste your content here for analysis..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={`min-h-[300px] resize-none ${isAnalyzing ? 'scan-line' : ''}`}
                    disabled={isAnalyzing}
                  />
                  {content && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={clearContent}
                      disabled={isAnalyzing}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{content.length} characters</span>
                  <span>{content.split(/\s+/).filter(Boolean).length} words</span>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 text-destructive bg-destructive/10 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={analyzeContent}
                    disabled={isAnalyzing || content.length < 10}
                    className="flex-1 hover-lift"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Scan className="mr-2 h-4 w-4" />
                        Analyze Content
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="hover-lift"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className={`glass border-card-border ${result ? 'animate-fade-in' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result?.aiDetected ? (
                    <AlertTriangle className="h-5 w-5 text-warning" />
                  ) : result ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <Scan className="h-5 w-5 text-muted-foreground" />
                  )}
                  Analysis Results
                </CardTitle>
                <CardDescription>
                  {result ? 'Detailed breakdown of content authenticity' : 'Results will appear here after analysis'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="text-center p-6 bg-background-alt rounded-lg relative">
                      <div className={`text-3xl font-bold ${getScoreColor(result.credibilityScore)}`}>
                        {result.credibilityScore}%
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        {getScoreLabel(result.credibilityScore)}
                      </div>
                      <Progress 
                        value={result.credibilityScore} 
                        className="h-2"
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={exportReport}
                        className="absolute top-4 right-4 hover-lift"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>

                    {/* AI Detection */}
                    <div className="flex items-center justify-between p-4 border border-card-border rounded-lg">
                      <div>
                        <div className="font-medium">AI Detection</div>
                        <div className="text-sm text-muted-foreground">
                          Confidence: {result.confidence}%
                        </div>
                      </div>
                      <Badge variant={result.aiDetected ? "destructive" : "secondary"}>
                        {result.aiDetected ? 'AI Detected' : 'Human-like'}
                      </Badge>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-background-alt rounded-lg">
                        <div className="font-medium">{result.analysis.statistics.wordCount}</div>
                        <div className="text-xs text-muted-foreground">Words</div>
                      </div>
                      <div className="p-3 bg-background-alt rounded-lg">
                        <div className="font-medium">{result.analysis.statistics.readingTime}</div>
                        <div className="text-xs text-muted-foreground">Reading</div>
                      </div>
                      <div className="p-3 bg-background-alt rounded-lg">
                        <div className="font-medium">{result.analysis.statistics.avgSentenceLength}</div>
                        <div className="text-xs text-muted-foreground">Avg Length</div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Verification Steps</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
                          className="text-xs"
                        >
                          {showDetailedAnalysis ? 'Hide' : 'Show'} Details
                        </Button>
                      </div>
                      <ul className="space-y-1">
                        {result.recommendations.slice(0, showDetailedAnalysis ? undefined : 4).map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 mt-0.5 text-success flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Detailed Analysis */}
                    {showDetailedAnalysis && (
                      <AnalysisDetails 
                        analysis={result.analysis}
                        credibilityScore={result.credibilityScore}
                        aiDetected={result.aiDetected}
                        confidence={result.confidence}
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Scan className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter content above and click "Analyze" to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentDetector;