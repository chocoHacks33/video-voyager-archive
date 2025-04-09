
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Moon, Sun } from 'lucide-react';
import Image from '@/components/ui/image';
import { useTheme } from '@/hooks/useTheme';
import { Switch } from '@/components/ui/switch';

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
    <div className="min-h-screen bg-gray-bg dark:bg-background">
      <header className="bg-white dark:bg-gray-900 p-4 shadow-sm dark:shadow-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center">
              <Image 
                src="/lovable-uploads/58e6d853-f703-47e3-9d69-340b6149ed8b.png" 
                alt="ADMORPH.AI Logo" 
                className="h-8 w-8"
              />
            </div>
            <h1 className="text-xl font-bold text-navy dark:text-white">ADMORPH.AI</h1>
          </div>
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
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-8">
            <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">{title}</h2>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
