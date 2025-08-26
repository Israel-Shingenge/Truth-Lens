import React from 'react';
import { Brain, Search, Shield, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const steps = [
  {
    icon: Brain,
    title: 'AI Pattern Analysis',
    description: 'Advanced neural networks analyze linguistic patterns, sentence structures, and semantic coherence to identify machine-generated characteristics.',
    metrics: ['Perplexity Analysis', 'Burstiness Detection', 'Semantic Consistency']
  },
  {
    icon: Search,
    title: 'Statistical Evaluation',
    description: 'Comprehensive statistical analysis examines vocabulary diversity, sentence complexity, and repetitive patterns typical of AI generation.',
    metrics: ['Vocabulary Richness', 'Syntactic Variety', 'Content Originality']
  },
  {
    icon: Target,
    title: 'Credibility Scoring',
    description: 'Multi-factor credibility assessment combines authenticity indicators with source reliability and factual consistency checks.',
    metrics: ['Source Verification', 'Fact Consistency', 'Authority Signals']
  },
  {
    icon: Shield,
    title: 'Verification Report',
    description: 'Detailed analysis report with confidence scores, risk assessments, and actionable recommendations for content verification.',
    metrics: ['Confidence Score', 'Risk Assessment', 'Action Items']
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-background-alt">
      <div className="container px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Truth-Lens Works</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our advanced AI detection system combines multiple analysis techniques to provide 
              comprehensive content authenticity assessment with industry-leading accuracy.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Card key={index} className="glass hover-lift border-card-border relative overflow-hidden group">
                {/* Step Number */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{index + 1}</span>
                </div>

                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                    <step.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="mb-4 leading-relaxed">
                    {step.description}
                  </CardDescription>
                  
                  <div className="space-y-2">
                    {step.metrics.map((metric, metricIndex) => (
                      <div 
                        key={metricIndex} 
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                        {metric}
                      </div>
                    ))}
                  </div>
                </CardContent>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
              </Card>
            ))}
          </div>

          {/* Technical Details */}
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <Card className="glass border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Detection Technology
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Model Accuracy</span>
                    <span className="font-medium">99.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Processing Speed</span>
                    <span className="font-medium">&lt; 2 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Languages Supported</span>
                    <span className="font-medium">12+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Min Text Length</span>
                    <span className="font-medium">50 characters</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-success" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-sm">End-to-end encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-sm">No data storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-sm">GDPR compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-sm">SOC 2 certified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;