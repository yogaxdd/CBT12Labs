import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContextType, LoginFormData, User } from '@/types';
import { toast } from '@/hooks/use-toast';

// This is a mock of the authentication API
// In a real app, this would be replaced with actual API calls
const mockAuth = {
  login: async (email: string, password: string): Promise<User | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@example.com' && password === 'password') {
      return {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
    } else if (email === 'student@example.com' && password === 'password') {
      return {
        id: '2',
        name: 'Student User',
        email: 'student@example.com',
        role: 'student',
        createdAt: new Date().toISOString(),
      };
    }
    
    throw new Error('Invalid credentials');
  },
  logout: async (): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem('user');
  },
  getUser: (): User | null => {
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
      try {
        return JSON.parse(userJSON);
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        return null;
      }
    }
    return null;
  },
  saveUser: (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
  },
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = mockAuth.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginFormData): Promise<void> => {
    try {
      setLoading(true);
      const user = await mockAuth.login(data.email, data.password);
      if (user) {
        mockAuth.saveUser(user);
        setUser(user);
        toast({
          title: 'Login successful',
          description: `Welcome back, ${user.name}!`,
        });
        
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/tests');
        }
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await mockAuth.logout();
      setUser(null);
      navigate('/login');
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
