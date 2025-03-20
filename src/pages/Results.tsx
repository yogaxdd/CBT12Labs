import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Test, TestResult, Question, UserAnswer } from '@/types';
import QuestionDisplay from '@/components/QuestionDisplay';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  ArrowLeft, 
  ListFilter,
  FileText,
  User,
  AlertCircle
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';

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
const mockCompletedResults: TestResult[] = [
  {
    id: '1',
    testId: '1',
    userId: '2',
    startTime: '2023-07-10T14:30:00Z',
    endTime: '2023-07-10T15:25:00Z',
    score: 85,
    totalQuestions: 15,
    correctAnswers: 13,
    answers: mockTests[0].questions.map((question, index) => {
      // Simulate correct answers for most questions, but some wrong ones
      const isCorrect = index % 7 !== 0;
      
      const correctOptionIds = question.options
        .filter(option => option.isCorrect)
        .map(option => option.id);
      
      // For wrong answers, select incorrect options
      const selectedOptions = isCorrect 
        ? [...correctOptionIds]
        : question.options
            .filter(option => !option.isCorrect)
            .slice(0, 1)
            .map(option => option.id);
      
      return {
        questionId: question.id,
        selectedOptions,
      };
    }),
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
    answers: mockTests[1].questions.map((question, index) => {
      // Simulate correct answers for most questions, but some wrong ones
      const isCorrect = index % 5 !== 0;
      
      const correctOptionIds = question.options
        .filter(option => option.isCorrect)
        .map(option => option.id);
      
      // For wrong answers, select incorrect options
      const selectedOptions = isCorrect 
        ? [...correctOptionIds]
        : question.options
            .filter(option => !option.isCorrect)
            .slice(0, 1)
            .map(option => option.id);
      
      return {
        questionId: question.id,
        selectedOptions,
      };
    }),
    completed: true,
  },
];

// Calculate time spent
const calculateTimeSpent = (startTime: string, endTime: string | null) => {
  if (!endTime) return 'N/A';
  
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const diffSeconds = Math.floor((end - start) / 1000);
  
  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
};

const ResultsPage = () => {
  const { user, logout } = useAuth();
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuestionListOpen, setIsQuestionListOpen] = useState(false);
  
  // Get test by ID
  const getTestById = (testId: string) => {
    return mockTests.find(test => test.id === testId) || null;
  };
  
  // Get user's answer for a specific question
  const getUserAnswer = (questionId: string): string[] => {
    if (!selectedResult) return [];
    
    const answer = selectedResult.answers.find(a => a.questionId === questionId);
    return answer ? answer.selectedOptions : [];
  };
  
  // Check if answer is correct
  const isAnswerCorrect = (question: Question, userAnswer: UserAnswer): boolean => {
    const correctOptionIds = question.options
      .filter(option => option.isCorrect)
      .map(option => option.id);
    
    if (question.type === 'single') {
      return (
        userAnswer.selectedOptions.length === 1 && 
        correctOptionIds.includes(userAnswer.selectedOptions[0])
      );
    } else {
      // For multiple choice, all correct options must be selected and no incorrect ones
      const allCorrectSelected = correctOptionIds.every(id => 
        userAnswer.selectedOptions.includes(id)
      );
      
      const noIncorrectSelected = userAnswer.selectedOptions.every(id => 
        correctOptionIds.includes(id)
      );
      
      return allCorrectSelected && noIncorrectSelected;
    }
  };
  
  // Get current question
  const getCurrentQuestion = () => {
    if (!currentTest) return null;
    return currentTest.questions[currentQuestionIndex];
  };
  
  const currentQuestion = getCurrentQuestion();
  
  // View result details
  const viewResultDetails = (result: TestResult) => {
    const test = getTestById(result.testId);
    setSelectedResult(result);
    setCurrentTest(test);
    setCurrentQuestionIndex(0);
  };
  
  // Navigate to next question
  const goToNextQuestion = () => {
    if (!currentTest) return;
    
    if (currentQuestionIndex < currentTest.questions.length - 1) {
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
    if (!currentTest) return;
    
    if (index >= 0 && index < currentTest.questions.length) {
      setCurrentQuestionIndex(index);
      setIsQuestionListOpen(false);
    }
  };
  
  // Close result details view
  const closeResultDetails = () => {
    setSelectedResult(null);
    setCurrentTest(null);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={logout} />
      
      <main className="flex-1 container mx-auto px-4 pt-20 pb-12">
        {!selectedResult ? (
          // Results list view
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Your Test Results</h1>
              <p className="text-muted-foreground mt-1">
                View your performance on completed tests
              </p>
            </div>
            
            {mockCompletedResults.length === 0 ? (
              <div className="bg-muted/50 rounded-lg p-8 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't completed any tests yet.
                </p>
                <Button asChild>
                  <Link to="/tests">View Available Tests</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {mockCompletedResults.map(result => {
                  const test = getTestById(result.testId);
                  if (!test) return null;
                  
                  const scorePercentage = (result.score / result.totalQuestions) * 100;
                  let scoreClass = "text-green-600 bg-green-50";
                  let scoreIconColor = "text-green-600";
                  let scoreIcon = <CheckCircle2 className={`h-6 w-6 ${scoreIconColor}`} />;
                  
                  if (scorePercentage < 60) {
                    scoreClass = "text-red-600 bg-red-50";
                    scoreIconColor = "text-red-600";
                    scoreIcon = <XCircle className={`h-6 w-6 ${scoreIconColor}`} />;
                  } else if (scorePercentage < 80) {
                    scoreClass = "text-yellow-600 bg-yellow-50";
                    scoreIconColor = "text-yellow-600";
                  }
                  
                  return (
                    <Card key={result.id} className="overflow-hidden card-hover">
                      <CardHeader className="pb-4">
                        <CardTitle>{test.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium">Date Completed</p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDate(result.endTime || result.startTime)}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium">Time Spent</p>
                                  <p className="text-sm text-muted-foreground">
                                    {calculateTimeSpent(result.startTime, result.endTime)}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium">Questions</p>
                                  <p className="text-sm text-muted-foreground">
                                    {result.totalQuestions} questions
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium">Student</p>
                                  <p className="text-sm text-muted-foreground">
                                    {user?.name || "Unknown"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="pt-2">
                              <Button onClick={() => viewResultDetails(result)}>
                                View Detailed Results
                              </Button>
                            </div>
                          </div>
                          
                          <div className="md:w-56 flex flex-col items-center justify-center p-4 rounded-lg border">
                            <div className="mb-3">{scoreIcon}</div>
                            <div className={`text-xl font-bold mb-1 ${scoreIconColor}`}>
                              {Math.round(scorePercentage)}%
                            </div>
                            <div className="text-sm text-muted-foreground mb-3">
                              {result.correctAnswers}/{result.totalQuestions} correct
                            </div>
                            <div className="w-full">
                              <Progress 
                                value={scorePercentage} 
                                className="h-2" 
                                indicatorClassName={
                                  scorePercentage < 60 
                                    ? "bg-red-500" 
                                    : scorePercentage < 80 
                                      ? "bg-yellow-500" 
                                      : "bg-green-500"
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          // Result details view
          <>
            <div className="mb-6 flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={closeResultDetails} 
                className="gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Results</span>
              </Button>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setIsQuestionListOpen(true)}
                >
                  <ListFilter className="mr-2 h-4 w-4" />
                  Questions
                </Button>
              </div>
            </div>
            
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{currentTest?.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(selectedResult.endTime || selectedResult.startTime)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{calculateTimeSpent(selectedResult.startTime, selectedResult.endTime)}</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-cbt-800">Score:</span>
                  <span className="font-medium">
                    {Math.round(selectedResult.score)}% ({selectedResult.correctAnswers}/{selectedResult.totalQuestions})
                  </span>
                </div>
              </div>
            </div>
            
            {/* Question display */}
            <div className="max-w-4xl mx-auto">
              {currentQuestion && (
                <div className="bg-white rounded-lg shadow-subtle border p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">
                      Question {currentQuestionIndex + 1} of {currentTest?.questions.length}
                    </span>
                    
                    {(() => {
                      const questionId = currentQuestion.id;
                      const userAnswer = selectedResult.answers.find(a => a.questionId === questionId);
                      
                      if (userAnswer) {
                        const isCorrect = isAnswerCorrect(currentQuestion, userAnswer);
                        
                        if (isCorrect) {
                          return (
                            <div className="flex items-center gap-1.5 text-green-600 text-sm">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Correct</span>
                            </div>
                          );
                        } else {
                          return (
                            <div className="flex items-center gap-1.5 text-red-600 text-sm">
                              <XCircle className="h-4 w-4" />
                              <span>Incorrect</span>
                            </div>
                          );
                        }
                      }
                      
                      return null;
                    })()}
                  </div>
                  
                  <QuestionDisplay
                    question={currentQuestion}
                    selectedOptions={getUserAnswer(currentQuestion.id)}
                    onAnswer={() => {}}
                    disabled={true}
                    showCorrectAnswers={true}
                  />
                </div>
              )}
              
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
                
                <Button
                  onClick={goToNextQuestion}
                  disabled={!currentTest || currentQuestionIndex === currentTest.questions.length - 1}
                >
                  Next
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
      
      {/* Question List Dialog */}
      <Dialog open={isQuestionListOpen} onOpenChange={setIsQuestionListOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Question Navigator</DialogTitle>
            <DialogDescription>
              Jump to any question to review your answers
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-5 gap-2">
              {currentTest?.questions.map((question, index) => {
                const userAnswer = selectedResult?.answers.find(a => a.questionId === question.id);
                const isAnswered = userAnswer && userAnswer.selectedOptions.length > 0;
                const isCurrent = index === currentQuestionIndex;
                const isCorrect = userAnswer ? isAnswerCorrect(question, userAnswer) : false;
                
                let buttonVariant: "default" | "outline" | "secondary" | "destructive" | "ghost" = "outline";
                if (isCurrent) {
                  buttonVariant = "default";
                } else if (isAnswered) {
                  buttonVariant = isCorrect ? "secondary" : "destructive";
                }
                
                return (
                  <Button
                    key={question.id}
                    variant={buttonVariant}
                    className={`h-10 w-10 p-0 font-medium ${isCurrent ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => goToQuestion(index)}
                  >
                    {index + 1}
                  </Button>
                );
              })}
            </div>
            
            <div className="mt-6 flex flex-wrap items-center justify-between text-sm gap-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-primary rounded-sm"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-secondary rounded-sm"></div>
                <span>Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-destructive rounded-sm"></div>
                <span>Incorrect</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border border-input rounded-sm"></div>
                <span>Unanswered</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResultsPage;