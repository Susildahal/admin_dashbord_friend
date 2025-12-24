import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Image,
  BookOpen,
  Sword,
  Wrench,
  Quote,
  Trophy,
  HelpCircle,
  Users,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

const mainNavItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
];

const contentItems = [
  { title: 'Banner', url: '/content/banner', icon: Image },
  { title: 'Our Story', url: '/content/our-story', icon: BookOpen },
  { title: 'Services', url: '/content/services', icon: Wrench },
  { title: 'United Voices', url: '/content/united-voices', icon: Quote },
  { title: 'Real Winners', url: '/content/real-winners', icon: Trophy },
  { title: 'FAQs', url: '/content/faqs', icon: HelpCircle },
  { title: 'Create a New account', url: '/content/users', icon: Users },
];

const otherNavItems = [
  { title: 'Contacts ', url: '/contacts', icon: Users },
  { title: 'Settings', url: '/settings', icon: Settings }
];


 

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  
  const isContentActive = contentItems.some(item => 
    location.pathname.startsWith(item.url)
  );
  
  const [contentOpen, setContentOpen] = useState(isContentActive);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-sidebar-border p-4">
        <div className={cn(
          "flex items-center gap-2",
          collapsed && "justify-center"
        )}>
          <div className="h-8 w-8 rounded-md bg-foreground flex items-center justify-center">
            <span className="text-background font-display font-bold text-sm">FU</span>
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-display font-bold text-sm leading-tight">Friends United</h2>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Content
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Other
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!collapsed && (
          <p className="text-xs text-muted-foreground text-center">
            © 2024 Friends United
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
