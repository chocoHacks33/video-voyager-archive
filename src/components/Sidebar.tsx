
import { useAuth } from "@/contexts/AuthContext";
import { 
  Sidebar as ShadcnSidebar, 
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { Plus, ChartLine, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState("/upload");
  const { state, toggleSidebar } = useSidebar();
  
  // Update active path when location changes
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const menuItems = [
    {
      title: "New Campaign",
      path: "/upload",
      icon: Plus,
    },
    {
      title: "Campaign Evolution",
      path: "/campaign-evolution",
      icon: ChartLine,
    }
  ];

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <ShadcnSidebar>
      <SidebarHeader className="py-6">
        <div className="px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 dark:bg-purple-900 rounded-full h-8 w-8 flex items-center justify-center">
              <img
                src="/lovable-uploads/d8943401-0113-4c61-affd-6a12aae85ea0.png"
                alt="ADMORPH.AI Logo"
                className="h-6 w-6 object-contain"
              />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">ADMORPH.AI</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="h-8 w-8 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle sidebar"
          >
            {state === "expanded" ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={activePath === item.path}
                    onClick={() => item.path && navigate(item.path)}
                    tooltip={item.title}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-800 animate-pulse hover:animate-none transition-all">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                  {getInitials(user?.username || 'Admin')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Welcome, {user?.username || 'Admin'}</p>
              <p className="text-xs text-muted-foreground">Active now</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;
