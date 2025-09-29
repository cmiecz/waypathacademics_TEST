export interface User {
  id: string;
  name: string;
  email: string;
  registeredAt: Date;
}

export interface Question {
  id: string;
  questionNumber: number;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface Passage {
  id: string;
  title: string;
  content: string;
  questions: Question[];
  subject: 'English' | 'Math' | 'Reading' | 'Science';
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface TestAttempt {
  id: string;
  userId: string;
  passageId: string;
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  score: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  completedAt: Date;
}

export interface TestSession {
  id: string;
  userId: string;
  subject: 'English' | 'Math' | 'Reading' | 'Science';
  currentPassageIndex: number;
  startedAt: Date;
  isActive: boolean;
  attempts: TestAttempt[];
}

export interface TestState {
  currentUser: User | null;
  currentSession: TestSession | null;
  passages: Passage[];
  isTimerVisible: boolean;
  sessionTime: number; // in seconds
}

export interface AdminState {
  isAdmin: boolean;
  uploadedPassages: Passage[];
}