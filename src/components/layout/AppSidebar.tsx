import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import client from '@/config/sanity';
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
  { title: 'United Voices', url: '/content/united-voices', icon: Quote },
  { title: 'Real Winners', url: '/content/real-winners', icon: Trophy },
  { title: 'FAQs', url: '/content/faqs', icon: HelpCircle },
  { title: 'Create a New account', url: '/content/users', icon: Users },
];

const otherNavItems = [
  { title: 'Contacts ', url: '/contacts', icon: Users },
  { title: 'Settings', url: '/settings', icon: Settings }
];


 

interface Service {
  _id: string;
  title: string;
}

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  
  const isContentActive = contentItems.some(item => 
    location.pathname.startsWith(item.url)
  );
  
  const isServicesActive = location.pathname.startsWith('/content/services');
  
  const [contentOpen, setContentOpen] = useState(isContentActive);
  const [servicesOpen, setServicesOpen] = useState(isServicesActive);

  // Fetch services from Sanity
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const query = `*[_type == "services"]{ _id, title } | order(title asc)`;
        const data = await client.fetch(query);
        setServices(data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border scrollbar-hide">
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
              
              {/* Services Collapsible */}
              <Collapsible
                open={servicesOpen}
                onOpenChange={setServicesOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip="Services"
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent w-full",
                        isServicesActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                    >
                      <Wrench className="h-4 w-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">Services</span>
                          <ChevronDown className={cn(
                            "h-4 w-4 transition-transform",
                            servicesOpen && "rotate-180"
                          )} />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {!collapsed && (
                    <CollapsibleContent>
                      <div className="ml-1 mt-1 space-y-1 pl-2 max-h-60 overflow-y-auto scrollbar-hide">
                        {loadingServices ? (
                          <div className="py-2 text-xs text-muted-foreground">Loading...</div>
                        ) : services.length === 0 ? (
                          <div className="py-2 text-xs text-muted-foreground">No services found</div>
                        ) : (
                          services.map((service) => (
                            <button
                              key={service._id}
                              onClick={() => navigate(`/content/services/${service._id}`)}
                              className={cn(
                                "w-full text-left px-3 py-2 text-sm rounded-md transition-colors hover:bg-sidebar-accent",
                                location.pathname === `/content/services/${service._id}` &&
                                  "bg-sidebar-accent text-sidebar-accent-foreground"
                              )}
                            >
                              {service.title}
                            </button>
                          ))
                        )}
                      </div>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
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
            © {new Date().getFullYear()} Friends United
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
