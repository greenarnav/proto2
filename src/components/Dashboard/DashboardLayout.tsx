
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';
import { 
  Twitter, Facebook, Instagram, Linkedin, 
  Mail, Home, BarChart, Map, Activity, Smile, 
  Calendar, Settings, Shield, HelpCircle, 
  Menu, X, ChevronRight
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number | string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardLayout = ({ children, className }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);
  
  // Check if mobile on mount and when window resizes
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const mainNavItems: NavItem[] = [
    { label: 'Dashboard', icon: <Home className="h-5 w-5" />, href: '/' },
    { label: 'Social Feeds', icon: <Twitter className="h-5 w-5" />, href: '/social', badge: 4 },
    { label: 'Calendar', icon: <Calendar className="h-5 w-5" />, href: '/calendar' },
    { label: 'Activity', icon: <Activity className="h-5 w-5" />, href: '/activity' },
    { label: 'Sentiment', icon: <Smile className="h-5 w-5" />, href: '/sentiment' },
    { label: 'Locations', icon: <Map className="h-5 w-5" />, href: '/locations' },
    { label: 'Reports', icon: <BarChart className="h-5 w-5" />, href: '/reports' },
  ];
  
  const otherNavItems: NavItem[] = [
    { label: 'Settings', icon: <Settings className="h-5 w-5" />, href: '/settings' },
    { label: 'Privacy', icon: <Shield className="h-5 w-5" />, href: '/privacy' },
    { label: 'Help & Support', icon: <HelpCircle className="h-5 w-5" />, href: '/help' },
  ];
  
  const connectedApps = [
    { name: 'Twitter', icon: <Twitter className="h-4 w-4" />, color: 'text-blue-400' },
    { name: 'Facebook', icon: <Facebook className="h-4 w-4" />, color: 'text-blue-600' },
    { name: 'Instagram', icon: <Instagram className="h-4 w-4" />, color: 'text-pink-500' },
    { name: 'LinkedIn', icon: <Linkedin className="h-4 w-4" />, color: 'text-blue-700' },
    { name: 'Email', icon: <Mail className="h-4 w-4" />, color: 'text-gray-500' },
  ];
  
  const NavLink = ({ item }: { item: NavItem }) => (
    <a
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
        "transition-colors duration-200",
        "hover:bg-muted",
        item.href === '/' ? "bg-muted font-medium" : "text-muted-foreground"
      )}
    >
      {item.icon}
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-auto h-5 min-w-5 rounded-full bg-primary/15 text-primary text-xs flex items-center justify-center px-1.5">
          {item.badge}
        </span>
      )}
    </a>
  );
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-40 rounded-full shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "border-r bg-card w-72 transition-all duration-300 ease-in-out",
          isMobile ? "fixed inset-y-0 left-0 z-30" : "relative",
          sidebarOpen ? "translate-x-0" : isMobile ? "-translate-x-full" : "w-0"
        )}
      >
        <div className="flex h-full flex-col gap-2">
          <div className="border-b py-4 px-5">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary rounded-lg p-1">
                <Map className="h-6 w-6" />
              </div>
              <h2 className="font-semibold text-lg">City-Mood</h2>
            </div>
          </div>
          
          <ScrollArea className="flex-1 py-3 px-4">
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
            
            <div className="mt-8 space-y-2">
              <div className="text-xs font-medium text-muted-foreground px-3">
                CONNECTED APPS
              </div>
              <div className="space-y-1">
                {connectedApps.map((app) => (
                  <div
                    key={app.name}
                    className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground"
                  >
                    <span className={app.color}>{app.icon}</span>
                    <span>{app.name}</span>
                    <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  </div>
                ))}
                
                <Button variant="ghost" size="sm" className="w-full justify-start mt-1">
                  <span>Connect more</span>
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-8 space-y-1">
              {otherNavItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          </ScrollArea>
          
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                JD
              </div>
              <div>
                <div className="font-medium text-sm">John Doe</div>
                <div className="text-xs text-muted-foreground">john@example.com</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Overlay for mobile sidebar */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main content */}
      <main 
        className={cn(
          "flex-1 overflow-auto",
          className
        )}
      >
        <div className="container py-6 sm:py-10 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
