import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Moon, Sun, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTheme } from '@/hooks/useTheme';

const routeNames: Record<string, string> = {
  '/': 'Dashboard',
  '/content/banner': 'Banner',
  '/content/our-story': 'Our Story',
  '/content/the-fight': 'The Fight',
  '/content/services': 'Services',
  '/content/united-voices': 'United Voices',
  '/content/real-winners': 'Real Winners',
  '/content/faqs': 'FAQs',
  '/contacts': 'Contacts & Forms',
  '/settings': 'Settings',
};

export function DashboardHeader() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const currentPageName = routeNames[location.pathname] || 'Dashboard';

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return [];
    
    const parts = path.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    if (parts[0] === 'content') {
      breadcrumbs.push({ name: 'Content', path: '' });
      if (parts[1]) {
        const pageName = routeNames[path] || parts[1];
        breadcrumbs.push({ name: pageName, path });
      }
    } else {
      breadcrumbs.push({ name: currentPageName, path });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 gap-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-8 w-8" />
        
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Home</span>
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-2">
              <span className="text-muted-foreground">/</span>
              <span className={index === breadcrumbs.length - 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                {crumb.name}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-64 h-9"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2">
              <div className="h-7 w-7 rounded-full bg-foreground flex items-center justify-center">
                <User className="h-4 w-4 text-background" />
              </div>
              <span className="hidden sm:inline text-sm font-medium">
                {user?.email?.split('@')[0] || 'Admin'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.email?.split('@')[0] || 'Admin'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
