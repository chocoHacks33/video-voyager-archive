
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
}

const AppLayout = ({ children, title }: AppLayoutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-bg dark:bg-navy-dark transition-colors duration-300">
      <header className="bg-white dark:bg-navy shadow-sm dark:shadow-black/20 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-xl font-bold text-navy dark:text-white">Video Voyager Archive</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-navy dark:text-white flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-navy-dark"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-navy rounded-lg shadow-md dark:shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-8 text-navy dark:text-white">{title}</h2>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
