import React from 'react';
import { Moon, Sun, Shield, Zap } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-card-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Truth-Lens</h1>
            <p className="text-xs text-muted-foreground">AI Content Credibility</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <a 
            href="/#detector" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Detector
          </a>
          <a 
            href="/youth-voices" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Youth Voices
          </a>
          <a 
            href="/critical-thinking" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Games
          </a>
          <a 
            href="/resources" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Resources
          </a>
          <a 
            href="/insight-dashboard" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Insights
          </a>
          <a 
            href="/about" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </a>
        </nav>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover-lift"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <Button variant="default" className="hidden sm:flex hover-lift">
            <Zap className="mr-2 h-4 w-4" />
            <a href="/account" className="text-inherit no-underline">
              Account
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;