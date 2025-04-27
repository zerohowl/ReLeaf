import { 
  Sidebar, 
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { 
  Home, 
  Upload, 
  History, 
  Award, 
  Settings, 
  LogOut,
  Calendar,
  PanelLeft
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSidebar } from "@/components/ui/sidebar";
import { logout } from '@/services/authService';

export function AppSidebar() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state } = useSidebar();
  
  // Menu items
  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/dashboard"
    },
    {
      title: "Upload Item",
      icon: Upload,
      path: "/upload"
    },
    {
      title: "History",
      icon: History,
      path: "/history"
    },
    {
      title: "Leaderboard",
      icon: Award,
      path: "/leaderboard"
    },
    {
      title: "Streaks",
      icon: Calendar,
      path: "/streaks"
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings"
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
      localStorage.removeItem('user');
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };

  return (
    <Sidebar>
      <div className="flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-2 transition-colors hover:text-eco-green">
          <img
            src="/newLogo.png"        
            alt="Releaf Logo"  
            className="h-16 w-auto"  
          />
          <span className="font-bold text-sidebar-foreground text-xl">Releaf</span>
        </Link>
        <SidebarTrigger 
          className={`
            ${state === 'collapsed' ? 'bg-eco-green text-white' : ''} 
            hover:bg-eco-green hover:text-white transition-colors duration-200
          `}
        />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center gap-3 transition duration-200 text-base font-medium">
                      <item.icon className="h-6 w-6" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4">
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-base font-medium"
            onClick={handleLogout}
          >
            <LogOut className="h-6 w-6" />
            <span>Logout</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
