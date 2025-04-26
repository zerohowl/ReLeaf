
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
  Calendar
} from "lucide-react";

import { Link } from "react-router-dom";

export function AppSidebar() {
  // Menu items
  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/"
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

  return (
    <Sidebar>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full eco-gradient flex items-center justify-center">
            <span className="text-white font-bold">RS</span>
          </div>
          <span className="font-bold text-sidebar-foreground">RecycleSmart</span>
        </div>
        <SidebarTrigger />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
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
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
