import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  Shield, 
  Moon, 
  Sun, 
  User, 
  LogOut, 
  Settings,
  Crown
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOut, isAdmin } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

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

        <div className="flex items-center space-x-4">
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
          </Button>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Link to="/account" className="flex items-center space-x-2 hover:text-primary transition-colors">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{profile?.display_name || profile?.username}</span>
                </Link>
                {isAdmin && (
                  <Badge variant="default" className="text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;