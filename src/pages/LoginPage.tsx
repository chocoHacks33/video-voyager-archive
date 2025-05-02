
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, LogIn, User, Key } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Trigger animation on mount
  useEffect(() => {
    setIsAnimating(true);
  }, []);

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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      {/* Logo / Brand */}
      <div className={`text-center mb-6 transform transition-all duration-1000 ease-out ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400 animate-gradient-shift">
          ADMORPH.AI
        </h1>
        <p className="mt-2 text-gray-400">Transform your advertising with AI</p>
      </div>
      
      <div className={`w-full max-w-md transform transition-all duration-700 ease-out ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="neo-blur rounded-2xl p-1 shadow-xl backdrop-blur-2xl relative overflow-hidden">
          {/* Animated glow effect around the card */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-transparent to-blue-600/10 animate-cosmic-drift"></div>
          
          <div className="relative backdrop-blur-xl bg-black/40 rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white mb-1">
                Welcome Back
              </h2>
              <p className="text-sm text-gray-400">Sign in to continue your creative journey</p>
            </div>
            
            <div className="space-y-5">
              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleGoogleLogin}
                  className="w-full py-5 border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white backdrop-blur-sm"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"></path>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"></path>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"></path>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"></path>
                    </g>
                  </svg>
                  <span className="ml-2">Google</span>
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleAppleLogin}
                  className="w-full py-5 border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white backdrop-blur-sm"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" className="fill-white">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
                  </svg>
                  <span className="ml-2">Apple</span>
                </Button>
              </div>
              
              {/* Separator */}
              <div className="relative">
                <Separator className="bg-white/10" />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 text-xs text-gray-500 bg-black/40 backdrop-blur-md">
                  OR
                </span>
              </div>
              
              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 py-5 bg-white/5 border-white/10 focus:border-purple-500 text-white backdrop-blur-sm"
                    required
                  />
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 py-5 bg-white/5 border-white/10 focus:border-purple-500 text-white backdrop-blur-sm"
                    required
                  />
                  <Key size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white animate-glow shadow-lg shadow-purple-600/30"
                >
                  <LogIn size={18} />
                  Sign In Now
                </Button>
              </form>
              
              <div className="text-center text-xs text-gray-500 mt-2 bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
                  <p>Demo Credentials: Username: admin / Password: password123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-xs text-gray-500 flex gap-6">
        <span className="hover:text-white cursor-pointer transition-colors">Privacy & Terms</span>
        <span className="hover:text-white cursor-pointer transition-colors">Contact Us</span>
      </div>
    </div>
  );
};

export default LoginPage;
