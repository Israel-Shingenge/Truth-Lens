import { Search, Users, MessageCircle, Trophy, Calendar } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-medium text-primary">YouthHub</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Discussions</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Events</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span>Achievements</span>
              </Button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search discussions..." 
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}