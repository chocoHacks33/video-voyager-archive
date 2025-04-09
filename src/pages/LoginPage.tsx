import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, LogIn } from 'lucide-react';

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

  const handleGoogleLogin = () => {
    // In a real implementation, this would connect to Google OAuth
    const success = login('admin', 'password123');
    if (success) {
      navigate('/upload');
    }
  };

  const handleAppleLogin = () => {
    // In a real implementation, this would connect to Apple OAuth
    const success = login('admin', 'password123');
    if (success) {
      navigate('/upload');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      {/* Logo section removed */}
      
      {/* Main content with gradient box */}
      <div className="w-full max-w-md bg-gradient-to-br from-purple-100 via-purple-50 to-white rounded-xl p-1 shadow-lg">
        <div className="bg-white rounded-lg p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Sign in to AdMorph.AI</h1>
            <p className="text-gray-600 mt-2">We suggest using the account credentials provided below.</p>
          </div>
          
          <div className="space-y-4">
            {/* Google Button */}
            <Button 
              type="button" 
              variant="outline"
              className="w-full py-6 flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50 text-gray-700"
              onClick={handleGoogleLogin}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"></path>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"></path>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"></path>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"></path>
                </g>
              </svg>
              Sign In With Google
            </Button>
            
            {/* Apple Button */}
            <Button 
              type="button" 
              variant="outline"
              className="w-full py-6 flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50 text-gray-700"
              onClick={handleAppleLogin}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
              </svg>
              Sign In With Apple
            </Button>
            
            {/* Separator */}
            <div className="relative my-6">
              <Separator />
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                OR
              </span>
            </div>
            
            {/* Email Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Input
                  id="username"
                  type="text"
                  placeholder="name@work-email.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full py-6 border-gray-300 rounded-md focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-6 border-gray-300 rounded-md focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-6 bg-purple-700 hover:bg-purple-800 flex items-center justify-center gap-2 text-white"
              >
                <Mail size={18} />
                Sign In With Email
              </Button>
            </form>
            
            <div className="text-center text-gray-500 text-sm mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="h-4 w-4 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="h-1 w-1 rounded-full bg-purple-500"></span>
                </span>
                <p>We'll email you a magic code for a password-free sign in.</p>
              </div>
              <p>Or, you can <span className="text-blue-500">sign in manually instead</span>.</p>
            </div>
            
            <div className="text-center mt-8 text-gray-500 text-sm">
              <p className="mb-2">Demo Credentials:</p>
              <p>Username: admin / Password: password123</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-gray-500 flex gap-4">
        <span>Privacy & Terms</span>
        <span>Contact Us</span>
      </div>
    </div>
  );
};

export default LoginPage;
