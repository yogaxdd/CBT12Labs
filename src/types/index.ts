export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'student';
    createdAt: string;
  }
  
  export interface Test {
    id: string;
    title: string;
    description: string;
    duration: number; // in minutes
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    questions: Question[];
    published: boolean;
  }
  
  export interface Question {
    id: string;
    testId: string;
    text: string;
    type: 'single' | 'multiple';
    options: Option[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Option {
    id: string;
    text: string;
    isCorrect: boolean;
  }
  
  export interface TestResult {
    id: string;
    testId: string;
    userId: string;
    startTime: string;
    endTime: string | null;
    score: number | null;
    totalQuestions: number;
    correctAnswers: number;
    answers: UserAnswer[];
    completed: boolean;
  }
  
  export interface UserAnswer {
    questionId: string;
    selectedOptions: string[];
  }
  
  export interface LoginFormData {
    email: string;
    password: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: LoginFormData) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
  }
  
  export interface TestCardProps {
    test: Test;
    onStart?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onView?: () => void;
    variant?: 'admin' | 'student';
  }
  
  export interface QuestionEditorProps {
    initialQuestion?: Question;
    onSave: (question: Omit<Question, 'id' | 'testId' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
  }
  
  export interface QuestionDisplayProps {
    question: Question;
    selectedOptions: string[];
    onAnswer: (questionId: string, optionIds: string[]) => void;
    disabled?: boolean;
    showCorrectAnswers?: boolean;
  }
  
  export interface NavbarProps {
    user: User | null;
    onLogout: () => void;
  }
  
  export interface TabSwitchEvent {
    timestamp: number;
    count: number;
  }