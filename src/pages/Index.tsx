import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { 
  CheckCircle2, 
  Shield, 
  Clock, 
  FileText, 
  BarChart3, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mocking framer-motion since we don't have it as a dependency
const motion = {
  div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
};

const Index = () => {
  const { user, logout } = useAuth();
  
  const features = [
    {
      title: 'Secure Testing',
      description: 'Anti-cheating measures including tab-switching detection and copy-paste prevention.',
      icon: <Shield className="h-12 w-12 text-cbt-500" />,
    },
    {
      title: 'Timed Assessments',
      description: 'Automatic countdown timers with configurable durations for each test.',
      icon: <Clock className="h-12 w-12 text-cbt-500" />,
    },
    {
      title: 'Question Bank',
      description: 'Create and manage comprehensive question libraries with different question types.',
      icon: <FileText className="h-12 w-12 text-cbt-500" />,
    },
    {
      title: 'Instant Grading',
      description: 'Automatic scoring and detailed analytics for every test submission.',
      icon: <BarChart3 className="h-12 w-12 text-cbt-500" />,
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={logout} />
      
      {/* Hero Section */}
      <section className="mt-16 pt-12 pb-16 md:pt-20 md:pb-24 px-4">
        <div className="container max-w-6xl">
          <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16">
            <div className="w-full md:w-1/2 text-center md:text-left animate-fade-in">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Modern<br />
                <span className="text-cbt-600">Online Testing</span><br />
                Platform
              </motion.h1>
              <motion.p 
                className="text-lg text-muted-foreground mb-8 max-w-md mx-auto md:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                A secure, flexible, and powerful computer-based testing system for educators and institutions.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4 justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {user ? (
                  <Button asChild size="lg" className="gap-2">
                    <Link to={user.role === 'admin' ? '/dashboard' : '/tests'}>
                      Go to {user.role === 'admin' ? 'Dashboard' : 'Tests'}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="gap-2">
                      <Link to="/login">
                        Get Started
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild size="lg">
                      <Link to="/login">
                        Learn More
                      </Link>
                    </Button>
                  </>
                )}
              </motion.div>
            </div>
            <div className="w-full md:w-1/2 animate-fade-in">
              <div className="glass-panel p-6 relative overflow-hidden rounded-2xl">
                <div className="absolute -top-20 -right-20 h-40 w-40 bg-cbt-400 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 h-40 w-40 bg-cbt-500 rounded-full opacity-20 blur-3xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" 
                  alt="Students taking an online test" 
                  className="w-full h-auto rounded-lg shadow-elevation-1"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-transparent to-secondary/50">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform offers everything you need for secure and efficient online testing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-panel p-6 card-hover">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform makes the testing process simple and efficient.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-14 w-14 rounded-full bg-cbt-100 flex items-center justify-center mb-4">
                <span className="text-cbt-700 text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Create Tests</h3>
              <p className="text-muted-foreground">
                Admins can create tests with various question types and configure settings.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-14 w-14 rounded-full bg-cbt-100 flex items-center justify-center mb-4">
                <span className="text-cbt-700 text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Take Exams</h3>
              <p className="text-muted-foreground">
                Students access and complete tests with secure anti-cheating measures.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-14 w-14 rounded-full bg-cbt-100 flex items-center justify-center mb-4">
                <span className="text-cbt-700 text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-medium mb-2">View Results</h3>
              <p className="text-muted-foreground">
                Immediate grading and detailed analytics for performance review.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-cbt-500 text-white">
        <div className="container max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-white/80">
              Join thousands of educators and institutions already using our platform for secure online testing.
            </p>
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link to="/login">
                Try It Now
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-md bg-cbt-500 flex items-center justify-center text-white font-bold mr-2">
                  CBT
                </div>
                <span className="font-medium">ExamPortal</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} ExamPortal. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
