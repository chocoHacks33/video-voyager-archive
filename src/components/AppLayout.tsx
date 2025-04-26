import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Moon, Sun } from 'lucide-react';
import Image from '@/components/ui/image';
import { useTheme } from '@/hooks/useTheme';
import { Switch } from '@/components/ui/switch';
import Sidebar from '@/components/Sidebar';
import { SidebarProvider, SidebarRail } from '@/components/ui/sidebar';
import CreditsDisplay from '@/components/CreditsDisplay';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
}

const AppLayout = ({ children, title }: AppLayoutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-bg dark:bg-background">
        <Sidebar />
        <SidebarRail />
        
        <div className="flex-1 flex flex-col w-full">
          <header className="bg-white dark:bg-gray-900 p-4 shadow-sm dark:shadow-gray-800 w-full">
            <div className="container mx-auto flex justify-between items-center">
              <CreditsDisplay className="text-lg" />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Sun size={16} className="text-navy dark:text-gray-400" />
                  <Switch 
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <Moon size={16} className="text-navy dark:text-gray-300" />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-navy dark:text-gray-300 flex items-center gap-1"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 flex items-center justify-center p-4 md:p-8 w-full">
            <div className="w-full max-w-full">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-8 w-full">
                <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">{title}</h2>
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
