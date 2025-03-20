import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Filter, 
  AlertCircle,
  Clock,
  FileText,
  CheckCircle,
  CalendarClock
} from 'lucide-react';
import TestCard from '@/components/TestCard';
import { Test, TestResult } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for available tests
const mockAvailableTests: Test[] = [
  {
    id: '1',
    title: 'Introduction to Computer Science',
    description: 'Basic concepts of computer science, algorithms, and data structures.',
    duration: 60,
    createdBy: '1',
    createdAt: '2023-06-15T08:00:00Z',
    updatedAt: '2023-06-15T08:00:00Z',
    questions: new Array(15).fill(null).map((_, i) => ({
      id: `101-${i}`,
      testId: '1',
      text: `Sample question ${i + 1}`,
      type: i % 3 === 0 ? 'multiple' : 'single',
      options: [
        { id: `101-${i}-1`, text: 'Option A', isCorrect: i % 4 === 0 },
        { id: `101-${i}-2`, text: 'Option B', isCorrect: i % 4 === 1 },
        { id: `101-${i}-3`, text: 'Option C', isCorrect: i % 4 === 2 },
        { id: `101-${i}-4`, text: 'Option D', isCorrect: i % 4 === 3 },
      ],
      createdAt: '2023-06-15T08:00:00Z',
      updatedAt: '2023-06-15T08:00:00Z',
    })),
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
    questions: new Array(20).fill(null).map((_, i) => ({
      id: `201-${i}`,
      testId: '2',
      text: `Sample math question ${i + 1}`,
      type: i % 5 === 0 ? 'multiple' : 'single',
      options: [
        { id: `201-${i}-1`, text: 'Option A', isCorrect: i % 4 === 0 },
        { id: `201-${i}-2`, text: 'Option B', isCorrect: i % 4 === 1 },
        { id: `201-${i}-3`, text: 'Option C', isCorrect: i % 4 === 2 },
        { id: `201-${i}-4`, text: 'Option D', isCorrect: i % 4 === 3 },
      ],
      createdAt: '2023-06-15T08:00:00Z',
      updatedAt: '2023-06-15T08:00:00Z',
    })),
    published: true,
  },
  {
    id: '3',
    title: 'English Literature',
    description: 'Analysis of classic literary works and writing techniques.',
    duration: 120,
    createdBy: '1',
    createdAt: '2023-07-05T09:45:00Z',
    updatedAt: '2023-07-05T09:45:00Z',
    questions: new Array(18).fill(null).map((_, i) => ({
      id: `301-${i}`,
      testId: '3',
      text: `Sample literature question ${i + 1}`,
      type: i % 6 === 0 ? 'multiple' : 'single',
      options: [
        { id: `301-${i}-1`, text: 'Option A', isCorrect: i % 4 === 0 },
        { id: `301-${i}-2`, text: 'Option B', isCorrect: i % 4 === 1 },
        { id: `301-${i}-3`, text: 'Option C', isCorrect: i % 4 === 2 },
        { id: `301-${i}-4`, text: 'Option D', isCorrect: i % 4 === 3 },
      ],
      createdAt: '2023-06-15T08:00:00Z',
      updatedAt: '2023-06-15T08:00:00Z',
    })),
    published: true,
  },
];

// Mock data for completed tests
const mockCompletedTests: TestResult[] = [
  {
    id: '1',
    testId: '1',
    userId: '2',
    startTime: '2023-07-10T14:30:00Z',
    endTime: '2023-07-10T15:25:00Z',
    score: 85,
    totalQuestions: 15,
    correctAnswers: 13,
    answers: [],
    completed: true,
  },
  {
    id: '2',
    testId: '3',
    userId: '2',
    startTime: '2023-07-12T10:15:00Z',
    endTime: '2023-07-12T12:10:00Z',
    score: 72,
    totalQuestions: 18,
    correctAnswers: 13,
    answers: [],
    completed: true,
  },
];

const TestsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showStartTestDialog, setShowStartTestDialog] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  
  // Filter tests based on search term
  const filteredTests = mockAvailableTests.filter(test => 
    test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Check if a test has been completed by the user
  const isTestCompleted = (testId: string) => {
    return mockCompletedTests.some(result => result.testId === testId);
  };
  
  // Get completed test result
  const getTestResult = (testId: string) => {
    return mockCompletedTests.find(result => result.testId === testId);
  };
  
  const handleStartTest = (test: Test) => {
    setSelectedTest(test);
    setShowStartTestDialog(true);
  };
  
  const confirmStartTest = () => {
    if (selectedTest) {
      navigate(`/test/${selectedTest.id}`);
    }
  };
  
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hour${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} minutes` : ''}`;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={logout} />
      
      <main className="flex-1 container mx-auto px-4 pt-20 pb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Available Tests</h1>
            <p className="text-muted-foreground mt-1">
              Select a test to start or view your previous results
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList>
            <TabsTrigger value="available">Available Tests</TabsTrigger>
            <TabsTrigger value="completed">Completed Tests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="space-y-6">
            {/* Search */}
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
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? `No tests matching "${searchTerm}"`
                    : "There are no available tests at the moment."}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map(test => {
                const completed = isTestCompleted(test.id);
                const result = getTestResult(test.id);
                
                return (
                  <TestCard 
                    key={test.id} 
                    test={test}
                    onStart={completed ? undefined : () => handleStartTest(test)}
                  />
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-6">
            {mockCompletedTests.length === 0 ? (
              <div className="bg-muted/50 rounded-lg p-8 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No completed tests</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't completed any tests yet.
                </p>
                <Button variant="outline" onClick={() => document.querySelector('[data-value="available"]')?.dispatchEvent(new Event('click'))}>
                  View Available Tests
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {mockCompletedTests.map(result => {
                  const test = mockAvailableTests.find(t => t.id === result.testId);
                  if (!test) return null;
                  
                  const date = new Date(result.endTime || result.startTime);
                  const formattedDate = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  
                  const scorePercentage = (result.score / result.totalQuestions) * 100;
                  let scoreClass = "text-green-600 bg-green-50";
                  if (scorePercentage < 60) {
                    scoreClass = "text-red-600 bg-red-50";
                  } else if (scorePercentage < 80) {
                    scoreClass = "text-yellow-600 bg-yellow-50";
                  }
                  
                  return (
                    <div key={result.id} className="bg-white rounded-lg shadow-subtle border border-border overflow-hidden">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{test.title}</h3>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <CalendarClock className="h-4 w-4" />
                                <span>{formattedDate}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatDuration(test.duration)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                <span>{result.totalQuestions} questions</span>
                              </div>
                            </div>
                          </div>
                          <div className={`px-4 py-3 rounded-md font-medium ${scoreClass}`}>
                            Score: {Math.round(scorePercentage)}% ({result.correctAnswers}/{result.totalQuestions})
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <Button variant="outline" asChild>
                            <a href={`/results#${result.id}`}>
                              View Detailed Results
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Start Test Dialog */}
      <Dialog open={showStartTestDialog} onOpenChange={setShowStartTestDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Start Test: {selectedTest?.title}</DialogTitle>
            <DialogDescription>
              Please read the information below before starting the test.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="font-medium">Test Information</Label>
              <div className="bg-muted rounded-md p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDuration(selectedTest?.duration || 0)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Questions</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedTest?.questions.length} questions
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Submission</p>
                    <p className="text-sm text-muted-foreground">
                      Once submitted, you cannot retake this test.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-800">Important Notes</p>
                  <ul className="text-sm text-yellow-700 list-disc ml-4 mt-1 space-y-1">
                    <li>Do not refresh or leave the page during the test.</li>
                    <li>The timer will continue to run if you navigate away.</li>
                    <li>Your answers are automatically saved as you progress.</li>
                    <li>The test will be automatically submitted when time expires.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowStartTestDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={confirmStartTest}>
                Start Test
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestsPage;
