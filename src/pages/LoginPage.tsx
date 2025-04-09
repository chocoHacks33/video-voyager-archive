
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-bg">
      <div className="w-full max-w-md">
        <div className="bg-navy rounded-lg shadow-md p-6">
          <div className="bg-white rounded-lg p-6">
            <h1 className="text-2xl font-bold text-center mb-6">LOGIN</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-app hover:bg-blue-500"
              >
                Login
              </Button>
            </form>
            <div className="mt-4 text-sm text-gray-500 text-center">
              <p>Demo Credentials:</p>
              <p>Username: admin / Password: password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
