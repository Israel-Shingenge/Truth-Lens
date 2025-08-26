import React from 'react';
import { ArrowDown, CheckCircle, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import './Hero/Hero.css'; 

const Hero: React.FC = () => {
  const scrollToDetector = () => {
    document.getElementById('detector')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      
      <div className="absolute inset-0 bg-gradient-hero opacity-5" />
      
      {/* Orb 1: Top left side */}
      <div 
        className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-random-move-slow"
        style={{ animationDelay: '2s' }}
      ></div>
      
      {/* Orb 2: Bottom right */}
      <div 
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-random-move-fast"
        style={{ animationDelay: '0s' }}
      ></div>
      
      {/* Orb 3: In the middle */}
      <div 
        className="absolute top-1/3 left-1/2 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl animate-random-move-medium"
        style={{ animationDelay: '4s' }}
      ></div>
      
      <div className="container relative px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            <Shield className="mr-2 h-4 w-4" />
            Powered by Advanced AI Detection
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
            Detect AI-Generated Content with{' '}
            <span className="gradient-text">Confidence</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Advanced AI credibility analysis that identifies machine-generated content, 
            analyzes authenticity patterns, and provides actionable insights for content verification.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>99.3% Accuracy Rate</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>Detailed Reports</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              onClick={scrollToDetector}
              className="hover-lift hover-glow px-8 py-6 text-lg"
            >
              <Zap className="mr-2 h-5 w-5" />
              Start Detection
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="hover-lift px-8 py-6 text-lg"
            >
              Watch Demo
            </Button>
          </div>

          {/* Scroll Indicator */}
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToDetector}
            className="mx-auto animate-bounce hover-lift"
          >
            <ArrowDown className="h-5 w-5" />
            <span className="sr-only">Scroll to detector</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;