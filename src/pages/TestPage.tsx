import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import QuestionDisplay from '@/components/QuestionDisplay';
import { Test, Question, UserAnswer, TabSwitchEvent } from '@/types';
import { 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  CheckSquare, 
  AlertTriangle,
  AlertCircle,
  Loader2,
  ListFilter
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

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
    questions: new Array(15).fill(null).map((_, i) => ({
      id: `101-${i}`,
      testId: '1',
      text: `What is the correct definition of ${['an algorithm', 'a data structure', 'a variable', 'a function', 'a loop', 'a conditional statement', 'a class', 'an object', 'inheritance', 'polymorphism', 'encapsulation', 'abstraction', 'a compiler', 'an interpreter', 'a program'][i]}?`,
      type: i % 3 === 0 ? 'multiple' : 'single',
      options: [
        { id: `101-${i}-1`, text: 'First possible answer for this question', isCorrect: i % 4 === 0 },
        { id: `101-${i}-2`, text: 'Second possible answer for this question', isCorrect: i % 4 === 1 },
        { id: `101-${i}-3`, text: 'Third possible answer for this question', isCorrect: i % 4 === 2 },
        { id: `101-${i}-4`, text: 'Fourth possible answer for this question', isCorrect: i % 4 === 3 },
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

const TestPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Find the test based on the ID
  const test = mockTests.find(test => test.id === id);
  
  // State variables
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isQuestionListOpen, setIsQuestionListOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tabSwitches, setTabSwitches] = useState<TabSwitchEvent[]>([]);
  const [showTabWarning, setShowTabWarning] = useState(false);
  
  // References
  const timerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef(Date.now());
  const visibilityWarningsRef = useRef(0);
  
  // Initialize test
  useEffect(() => {
    if (!test) {
      navigate('/tests');
      return;
    }
    
    // Shuffle questions
    const shuffled = [...test.questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    
    // Initialize empty answers for all questions
    const initialAnswers = shuffled.map(question => ({
      questionId: question.id,
      selectedOptions: [],
    }));
    setUserAnswers(initialAnswers);
    
    // Set timer
    setRemainingTime(test.duration * 60); // Convert minutes to seconds
    
    // Set loading to false
    setLoading(false);
    
    // Prevent right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    
    // Detect tab switch or visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        visibilityWarningsRef.current += 1;
        const warningEvent: TabSwitchEvent = {
          timestamp: Date.now(),
          count: visibilityWarningsRef.current,
        };
        setTabSwitches(prev => [...prev, warningEvent]);
        setShowTabWarning(true);
      }
    };
    
    // Prevent copy-paste
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };
    
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };
    
    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    
    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [test, navigate]);
  
  // Start timer
  useEffect(() => {
    if (loading || !test) return;
    
    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          // Time's up, submit the test
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [loading, test]);
  
  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours > 0 ? hours.toString().padStart(2, '0') : null,
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0'),
    ].filter(Boolean).join(':');
  };
  
  // Get current question
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  
  // Handle answering a question
  const handleAnswer = (questionId: string, selectedOptions: string[]) => {
    setUserAnswers(prev => 
      prev.map(answer => 
        answer.questionId === questionId 
          ? { ...answer, selectedOptions } 
          : answer
      )
    );
  };
  
  // Calculate progress
  const answeredQuestions = userAnswers.filter(answer => answer.selectedOptions.length > 0);
  const progress = answeredQuestions.length / shuffledQuestions.length * 100;
  
  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Navigate to previous question
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Go to specific question
  const goToQuestion = (index: number) => {
    if (index >= 0 && index < shuffledQuestions.length) {
      setCurrentQuestionIndex(index);
      setIsQuestionListOpen(false);
    }
  };
  
  // Get user's answer for current question
  const getCurrentQuestionAnswer = () => {
    if (!currentQuestion) return [];
    const answer = userAnswers.find(a => a.questionId === currentQuestion.id);
    return answer ? answer.selectedOptions : [];
  };
  
  // Handle submitting the test
  const handleSubmitTest = async () => {
    try {
      if (submitting) return;
      
      setSubmitting(true);
      
      // Calculate score
      let correctAnswers = 0;
      
      shuffledQuestions.forEach(question => {
        const userAnswer = userAnswers.find(a => a.questionId === question.id);
        
        if (!userAnswer) return;
        
        const correctOptionIds = question.options
          .filter(option => option.isCorrect)
          .map(option => option.id);
        
        // For single-choice questions, only one correct answer
        if (question.type === 'single') {
          if (userAnswer.selectedOptions.length === 1 && 
              correctOptionIds.includes(userAnswer.selectedOptions[0])) {
            correctAnswers++;
          }
        } 
        // For multiple-choice questions, all correct options must be selected and no incorrect ones
        else if (question.type === 'multiple') {
          const allCorrectSelected = correctOptionIds.every(id => 
            userAnswer.selectedOptions.includes(id)
          );
          
          const noIncorrectSelected = userAnswer.selectedOptions.every(id => 
            correctOptionIds.includes(id)
          );
          
          if (allCorrectSelected && noIncorrectSelected) {
            correctAnswers++;
          }
        }
      });
      
      // Calculate score as percentage
      const score = (correctAnswers / shuffledQuestions.length) * 100;
      
      // Simulate API call to save the result
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful submission
      toast({
        title: 'Test submitted successfully',
        description: `Your score: ${Math.round(score)}% (${correctAnswers}/${shuffledQuestions.length})`,
      });
      
      // Navigate to results page
      navigate('/results');
      
    } catch (error) {
      console.error('Error submitting test:', error);
      toast({
        title: 'Error submitting test',
        description: 'There was an error submitting your test. Please try again.',
        variant: 'destructive',
      });
      setSubmitting(false);
    }
  };
  
  // Render loading state
  if (loading || !test) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg text-muted-foreground">Loading test...</p>
      </div>
    );
  }
  
  // Find the user's current answer
  const currentAnswer = getCurrentQuestionAnswer();
  
  return (
    <div className="min-h-screen flex flex-col bg-muted/30 animate-fade-in">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-cbt-500 flex items-center justify-center text-white font-bold">
              CBT
            </div>
            <h1 className="text-lg font-medium">{test.title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">
                  {user?.name}
                </span>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              remainingTime < 300 ? 'bg-red-100 text-red-700' : 'bg-cbt-100 text-cbt-700'
            }`}>
              <Clock className="h-4 w-4" />
              <span className="font-medium">
                {formatTime(remainingTime)}
              </span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Progress Bar */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              Completed: {answeredQuestions.length}/{shuffledQuestions.length}
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-1 py-6 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Question content */}
          <div className="bg-white rounded-lg shadow-subtle border p-6 mb-6">
            {currentQuestion && (
              <QuestionDisplay
                question={currentQuestion}
                selectedOptions={currentAnswer}
                onAnswer={handleAnswer}
              />
            )}
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={goToPrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsQuestionListOpen(true)}
              >
                <ListFilter className="mr-2 h-4 w-4" />
                Questions
              </Button>
              
              <Button
                variant="destructive"
                onClick={() => setIsSubmitDialogOpen(true)}
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                Submit Test
              </Button>
            </div>
            
            <Button
              variant={currentQuestionIndex === shuffledQuestions.length - 1 ? "default" : "outline"}
              onClick={goToNextQuestion}
              disabled={currentQuestionIndex === shuffledQuestions.length - 1}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      
      {/* Submit Test Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Test</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your test?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="bg-muted rounded-md p-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Questions Answered:</span>
                <span className="font-medium">{answeredQuestions.length}/{shuffledQuestions.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            {answeredQuestions.length < shuffledQuestions.length && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-800">
                      You haven't answered all questions
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      You still have {shuffledQuestions.length - answeredQuestions.length} unanswered questions. Are you sure you want to submit?
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Notes:</p>
              <ul className="text-sm text-muted-foreground list-disc ml-5 space-y-1">
                <li>Once submitted, you cannot return to the test</li>
                <li>Your results will be available immediately after submission</li>
              </ul>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsSubmitDialogOpen(false)}
                disabled={submitting}
              >
                Continue Test
              </Button>
              <Button 
                onClick={handleSubmitTest}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Submit Test
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Question List Dialog */}
      <Dialog open={isQuestionListOpen} onOpenChange={setIsQuestionListOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Question Navigator</DialogTitle>
            <DialogDescription>
              Jump to any question or see which ones you've answered
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-5 gap-2">
              {shuffledQuestions.map((question, index) => {
                const userAnswer = userAnswers.find(a => a.questionId === question.id);
                const isAnswered = userAnswer && userAnswer.selectedOptions.length > 0;
                const isCurrent = index === currentQuestionIndex;
                
                return (
                  <Button
                    key={question.id}
                    variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
                    className={`h-10 w-10 p-0 font-medium ${isCurrent ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => goToQuestion(index)}
                  >
                    {index + 1}
                  </Button>
                );
              })}
            </div>
            
            <div className="mt-6 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-primary rounded-sm"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-secondary rounded-sm"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border border-input rounded-sm"></div>
                <span>Unanswered</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Tab Switch Warning */}
      <Dialog open={showTabWarning} onOpenChange={setShowTabWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Navigation Detected
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-4">
              We detected that you navigated away from the test page. This activity has been logged.
            </p>
            <p className="text-sm text-muted-foreground">
              Repeatedly leaving the test may be flagged as suspicious activity. Please remain on the test page until you've completed the exam.
            </p>
            
            {tabSwitches.length > 1 && (
              <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md">
                <p className="font-medium">Warning</p>
                <p className="text-sm">
                  This is violation #{tabSwitches.length}. Further violations may result in automatic test submission.
                </p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowTabWarning(false)}>
                Continue Test
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestPage;