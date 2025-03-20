import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  PlusCircle, 
  Search, 
  Users, 
  FileText, 
  BarChart3, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import TestCard from '@/components/TestCard';
import QuestionEditor from '@/components/QuestionEditor';
import { Test, Question } from '@/types';
import { toast } from '@/hooks/use-toast';

// Mock data for tests
const mockTests: Test[] = [
  {
    id: '1',
    title: 'Introduction to Computer Science',
    description: 'Basic concepts of computer science, algorithms, and data structures.',
    duration: 60,
    createdBy: '1',
    createdAt: '2023-06-15T08:00:00Z',
    updatedAt: '2023-06-15T08:00:00Z',
    questions: [
      {
        id: '101',
        testId: '1',
        text: 'What is an algorithm?',
        type: 'single',
        options: [
          { id: '101-1', text: 'A step-by-step procedure to solve a problem', isCorrect: true },
          { id: '101-2', text: 'A programming language', isCorrect: false },
          { id: '101-3', text: 'A hardware component', isCorrect: false },
          { id: '101-4', text: 'A type of computer memory', isCorrect: false },
        ],
        createdAt: '2023-06-15T08:00:00Z',
        updatedAt: '2023-06-15T08:00:00Z',
      },
      {
        id: '102',
        testId: '1',
        text: 'Which of the following are examples of data structures?',
        type: 'multiple',
        options: [
          { id: '102-1', text: 'Arrays', isCorrect: true },
          { id: '102-2', text: 'Linked Lists', isCorrect: true },
          { id: '102-3', text: 'Keyboards', isCorrect: false },
          { id: '102-4', text: 'Trees', isCorrect: true },
        ],
        createdAt: '2023-06-15T08:00:00Z',
        updatedAt: '2023-06-15T08:00:00Z',
      },
    ],
    published: true,
  },
  {
    id: '2',
    title: 'Advanced Mathematics',
    description: 'Calculus, linear algebra, and differential equations for advanced students.',
    duration: 90,
    createdBy: '1',
    createdAt: '2023-06-20T10:30:00Z',
    updatedAt: '2023-06-22T14:15:00Z',
    questions: [
      {
        id: '201',
        testId: '2',
        text: 'What is the derivative of f(x) = x²?',
        type: 'single',
        options: [
          { id: '201-1', text: 'f\'(x) = 2x', isCorrect: true },
          { id: '201-2', text: 'f\'(x) = x²', isCorrect: false },
          { id: '201-3', text: 'f\'(x) = 2', isCorrect: false },
          { id: '201-4', text: 'f\'(x) = x', isCorrect: false },
        ],
        createdAt: '2023-06-20T10:30:00Z',
        updatedAt: '2023-06-20T10:30:00Z',
      },
    ],
    published: false,
  },
  {
    id: '3',
    title: 'English Literature',
    description: 'Analysis of classic literary works and writing techniques.',
    duration: 120,
    createdBy: '1',
    createdAt: '2023-07-05T09:45:00Z',
    updatedAt: '2023-07-05T09:45:00Z',
    questions: [
      {
        id: '301',
        testId: '3',
        text: 'Who wrote "Pride and Prejudice"?',
        type: 'single',
        options: [
          { id: '301-1', text: 'Jane Austen', isCorrect: true },
          { id: '301-2', text: 'Charles Dickens', isCorrect: false },
          { id: '301-3', text: 'George Orwell', isCorrect: false },
          { id: '301-4', text: 'Virginia Woolf', isCorrect: false },
        ],
        createdAt: '2023-07-05T09:45:00Z',
        updatedAt: '2023-07-05T09:45:00Z',
      },
    ],
    published: true,
  },
];

// Mock data for recent results
const mockRecentResults = [
  {
    id: '1',
    testName: 'Introduction to Computer Science',
    studentName: 'John Doe',
    score: 85,
    totalQuestions: 10,
    date: '2023-08-15T14:30:00Z',
  },
  {
    id: '2',
    testName: 'Advanced Mathematics',
    studentName: 'Jane Smith',
    score: 92,
    totalQuestions: 15,
    date: '2023-08-14T11:15:00Z',
  },
  {
    id: '3',
    testName: 'English Literature',
    studentName: 'Mark Johnson',
    score: 78,
    totalQuestions: 12,
    date: '2023-08-14T09:45:00Z',
  },
  {
    id: '4',
    testName: 'Introduction to Computer Science',
    studentName: 'Sarah Williams',
    score: 90,
    totalQuestions: 10,
    date: '2023-08-13T16:20:00Z',
  },
  {
    id: '5',
    testName: 'English Literature',
    studentName: 'Michael Brown',
    score: 65,
    totalQuestions: 12,
    date: '2023-08-13T10:30:00Z',
  },
];

// Dashboard statistics
const dashboardStats = [
  {
    title: 'Total Tests',
    value: '24',
    icon: <FileText className="h-6 w-6 text-cbt-500" />,
  },
  {
    title: 'Total Students',
    value: '156',
    icon: <Users className="h-6 w-6 text-cbt-500" />,
  },
  {
    title: 'Tests Taken',
    value: '487',
    icon: <BarChart3 className="h-6 w-6 text-cbt-500" />,
  },
  {
    title: 'Avg. Completion Time',
    value: '42m',
    icon: <Clock className="h-6 w-6 text-cbt-500" />,
  },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tests, setTests] = useState<Test[]>(mockTests);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateTestModalOpen, setIsCreateTestModalOpen] = useState(false);
  const [isEditTestModalOpen, setIsEditTestModalOpen] = useState(false);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [editTestFormData, setEditTestFormData] = useState({
    title: '',
    description: '',
    duration: 60,
  });
  
  // Test management functions
  const handleCreateTest = () => {
    const newTest: Test = {
      id: Date.now().toString(),
      title: editTestFormData.title,
      description: editTestFormData.description,
      duration: editTestFormData.duration,
      createdBy: user?.id || '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      questions: [],
      published: false,
    };
    
    setTests([...tests, newTest]);
    setIsCreateTestModalOpen(false);
    resetTestForm();
    
    toast({
      title: 'Test created',
      description: 'New test has been created successfully.',
    });
  };
  
  const handleEditTest = () => {
    if (!currentTest) return;
    
    const updatedTests = tests.map(test => 
      test.id === currentTest.id 
        ? { 
            ...test, 
            title: editTestFormData.title, 
            description: editTestFormData.description,
            duration: editTestFormData.duration,
            updatedAt: new Date().toISOString(),
          } 
        : test
    );
    
    setTests(updatedTests);
    setIsEditTestModalOpen(false);
    resetTestForm();
    
    toast({
      title: 'Test updated',
      description: 'Test has been updated successfully.',
    });
  };
  
  const handleDeleteTest = (id: string) => {
    const updatedTests = tests.filter(test => test.id !== id);
    setTests(updatedTests);
    
    toast({
      title: 'Test deleted',
      description: 'Test has been deleted successfully.',
      variant: 'destructive',
    });
  };
  
  const handleOpenEditModal = (test: Test) => {
    setCurrentTest(test);
    setEditTestFormData({
      title: test.title,
      description: test.description,
      duration: test.duration,
    });
    setIsEditTestModalOpen(true);
  };
  
  const handleAddQuestion = (test: Test) => {
    setCurrentTest(test);
    setIsAddQuestionModalOpen(true);
  };
  
  const handleSaveQuestion = (question: Omit<Question, 'id' | 'testId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentTest) return;
    
    const newQuestion: Question = {
      id: Date.now().toString(),
      testId: currentTest.id,
      text: question.text,
      type: question.type,
      options: question.options,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedTest = {
      ...currentTest,
      questions: [...currentTest.questions, newQuestion],
      updatedAt: new Date().toISOString(),
    };
    
    const updatedTests = tests.map(test => 
      test.id === currentTest.id ? updatedTest : test
    );
    
    setTests(updatedTests);
    setIsAddQuestionModalOpen(false);
    
    toast({
      title: 'Question added',
      description: 'New question has been added to the test.',
    });
  };
  
  const resetTestForm = () => {
    setEditTestFormData({
      title: '',
      description: '',
      duration: 60,
    });
    setCurrentTest(null);
  };
  
  const toggleTestPublished = (id: string) => {
    const updatedTests = tests.map(test => 
      test.id === id 
        ? { ...test, published: !test.published } 
        : test
    );
    
    setTests(updatedTests);
    
    const test = updatedTests.find(t => t.id === id);
    
    toast({
      title: test?.published ? 'Test published' : 'Test unpublished',
      description: test?.published 
        ? 'Test is now available to students.' 
        : 'Test is now hidden from students.',
    });
  };
  
  // Filter tests based on search term
  const filteredTests = tests.filter(test => 
    test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={logout} />
      
      <main className="flex-1 container mx-auto px-4 pt-20 pb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your tests, questions, and monitor student progress
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0" 
            onClick={() => setIsCreateTestModalOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Test
          </Button>
        </div>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {dashboardStats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-subtle p-4 border border-border card-hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="bg-primary/10 rounded-full p-3">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Tabs defaultValue="tests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tests">Tests Management</TabsTrigger>
            <TabsTrigger value="results">Recent Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tests" className="space-y-6">
            {/* Search and Filters */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search tests by title or description..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {filteredTests.length === 0 && (
              <div className="bg-muted/50 rounded-lg p-8 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tests found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? `No tests matching "${searchTerm}"`
                    : "You haven't created any tests yet."}
                </p>
                <Button onClick={() => setIsCreateTestModalOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Test
                </Button>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map(test => (
                <TestCard 
                  key={test.id} 
                  test={test} 
                  variant="admin" 
                  onEdit={() => handleOpenEditModal(test)}
                  onDelete={() => handleDeleteTest(test.id)}
                  onView={() => handleAddQuestion(test)}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            <div className="bg-white rounded-lg shadow-subtle border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Student</th>
                      <th className="text-left py-3 px-4 font-medium">Test</th>
                      <th className="text-left py-3 px-4 font-medium">Score</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRecentResults.map((result) => {
                      const date = new Date(result.date);
                      const formattedDate = date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });
                      
                      const scorePercentage = (result.score / result.totalQuestions) * 100;
                      let scoreClass = 'text-green-600';
                      if (scorePercentage < 60) {
                        scoreClass = 'text-red-600';
                      } else if (scorePercentage < 80) {
                        scoreClass = 'text-yellow-600';
                      }
                      
                      return (
                        <tr key={result.id} className="border-b hover:bg-muted/30">
                          <td className="py-3 px-4">{result.studentName}</td>
                          <td className="py-3 px-4">{result.testName}</td>
                          <td className="py-3 px-4">
                            <span className={`font-medium ${scoreClass}`}>
                              {result.score}/{result.totalQuestions} ({Math.round(scorePercentage)}%)
                            </span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {formattedDate}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Create Test Modal */}
      <Dialog open={isCreateTestModalOpen} onOpenChange={setIsCreateTestModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Test</DialogTitle>
          </DialogHeader>
          
          <form className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Test Title</Label>
              <Input
                id="title"
                value={editTestFormData.title}
                onChange={(e) => setEditTestFormData({
                  ...editTestFormData,
                  title: e.target.value
                })}
                placeholder="Enter test title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editTestFormData.description}
                onChange={(e) => setEditTestFormData({
                  ...editTestFormData,
                  description: e.target.value
                })}
                placeholder="Enter test description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={editTestFormData.duration}
                onChange={(e) => setEditTestFormData({
                  ...editTestFormData,
                  duration: parseInt(e.target.value) || 60
                })}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreateTestModalOpen(false);
                  resetTestForm();
                }}
                type="button"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateTest}
                type="button"
                disabled={!editTestFormData.title}
              >
                Create Test
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Test Modal */}
      <Dialog open={isEditTestModalOpen} onOpenChange={setIsEditTestModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Test</DialogTitle>
          </DialogHeader>
          
          <form className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Test Title</Label>
              <Input
                id="edit-title"
                value={editTestFormData.title}
                onChange={(e) => setEditTestFormData({
                  ...editTestFormData,
                  title: e.target.value
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editTestFormData.description}
                onChange={(e) => setEditTestFormData({
                  ...editTestFormData,
                  description: e.target.value
                })}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duration (minutes)</Label>
              <Input
                id="edit-duration"
                type="number"
                min="1"
                value={editTestFormData.duration}
                onChange={(e) => setEditTestFormData({
                  ...editTestFormData,
                  duration: parseInt(e.target.value) || 60
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Test Status</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant={currentTest?.published ? "default" : "outline"}
                  size="sm"
                  onClick={() => currentTest && toggleTestPublished(currentTest.id)}
                >
                  {currentTest?.published ? "Published" : "Draft"}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentTest?.published 
                    ? "Test is visible to students" 
                    : "Test is hidden from students"}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditTestModalOpen(false);
                  resetTestForm();
                }}
                type="button"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEditTest}
                type="button"
                disabled={!editTestFormData.title}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Add Question Modal */}
      <Dialog 
        open={isAddQuestionModalOpen} 
        onOpenChange={setIsAddQuestionModalOpen}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Add Question to {currentTest?.title}
            </DialogTitle>
          </DialogHeader>
          
          <QuestionEditor 
            onSave={handleSaveQuestion}
            onCancel={() => setIsAddQuestionModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;