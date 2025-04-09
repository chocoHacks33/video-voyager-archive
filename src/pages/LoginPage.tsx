
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { User, KeyRound, LogIn } from 'lucide-react';
import Image from '@/components/ui/image';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate('/upload');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-bg to-navy/10">
      <Card className="w-full max-w-md overflow-hidden shadow-xl border-0">
        <div className="bg-navy text-white p-6 flex flex-col items-center">
          <div className="bg-white rounded-full h-16 w-16 flex items-center justify-center mb-4">
            <Image 
              src="/lovable-uploads/58e6d853-f703-47e3-9d69-340b6149ed8b.png" 
              alt="Hype Print Logo" 
              className="h-12 w-12"
            />
          </div>
          <h1 className="text-2xl font-bold">Welcome to Hype Print</h1>
          <p className="text-white/70 text-sm mt-1">Sign in to your account</p>
        </div>
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-navy font-medium">Username</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-app focus:ring-blue-app"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-navy font-medium">Password</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <KeyRound size={18} />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-app focus:ring-blue-app"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-app hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 py-6"
            >
              <LogIn size={18} />
              Sign In
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-navy text-sm font-medium">Demo Credentials:</p>
            <p className="text-gray-500 text-sm">Username: admin / Password: password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
