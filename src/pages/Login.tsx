import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const { login, loading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/dashboard' : '/tests'} />;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Reset error
      setError('');
      
      // Input validation
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
      
      await login({ email, password });
      // Redirect will be handled by the AuthContext
    } catch (err) {
      console.error('Login error:', err);
      // Error is already handled by the AuthContext (displays toast)
    }
  };
  
  const handleDemoLogin = async (role: 'admin' | 'student') => {
    try {
      if (role === 'admin') {
        await login({ email: 'admin@example.com', password: 'password' });
      } else {
        await login({ email: 'student@example.com', password: 'password' });
      }
    } catch (err) {
      console.error('Demo login error:', err);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted px-4 animate-fade-in">
      <div className="absolute top-0 left-0 right-0 p-4">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <div className="h-8 w-8 rounded-md bg-cbt-500 flex items-center justify-center text-white font-bold">
            CBT
          </div>
          <span className="font-medium">ExamPortal</span>
        </Link>
      </div>
      
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Log in to your account</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your credentials to access the platform
          </p>
        </div>
        
        {error && (
          <div className="bg-destructive/10 text-destructive rounded-md p-3 flex items-center gap-2 animate-scale-in">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full h-11 text-base"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </Button>
          
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/" className="text-primary hover:underline">
              Contact administrator
            </Link>
          </div>
        </form>
        
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                Or continue with demo account
              </span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoLogin('admin')}
              className="w-full"
              disabled={loading}
            >
              Admin Demo
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoLogin('student')}
              className="w-full"
              disabled={loading}
            >
              Student Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;