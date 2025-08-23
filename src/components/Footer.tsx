import React from 'react';
import { Shield, Github, Twitter, Mail, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-card-border bg-background">
      <div className="container px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold gradient-text">Truth-Lens</h3>
                <p className="text-xs text-muted-foreground">AI Content Credibility</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Advanced AI detection technology that helps you identify machine-generated content 
              and verify information authenticity with confidence.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" className="hover-lift">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="hover-lift">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="hover-lift">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-card-border flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Truth-Lens. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;