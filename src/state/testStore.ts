import React from 'react';
import { User, TestSession, Passage, TestAttempt, TestState } from '../types/act';

// Simple state management without Zustand to avoid import.meta issues
let currentState: TestState = {
  currentUser: null,
  currentSession: null,
  passages: [],
  isTimerVisible: true,
  sessionTime: 0,
};

const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

interface TestStore extends TestState {
  // User actions
  setUser: (user: User) => void;
  clearUser: () => void;
  
  // Test session actions
  startTestSession: (subject: 'English' | 'Math' | 'Reading' | 'Science') => void;
  endTestSession: () => void;
  nextPassage: () => void;
  
  // Test attempt actions
  submitAnswers: (passageId: string, answers: Record<string, 'A' | 'B' | 'C' | 'D'>, timeSpent: number) => TestAttempt;
  
  // Timer actions
  toggleTimer: () => void;
  updateSessionTime: (time: number) => void;
  
  // Passage actions
  setPassages: (passages: Passage[]) => void;
  getCurrentPassage: () => Passage | null;
}

// Store actions
const storeActions = {
  setUser: (user: User) => {
    console.log('Store: Setting user to:', user);
    currentState.currentUser = user;
    console.log('Store: Current state after setUser:', currentState);
    notifyListeners();
  },
  
  clearUser: () => {
    currentState.currentUser = null;
    currentState.currentSession = null;
    notifyListeners();
  },

  startTestSession: (subject: 'English' | 'Math' | 'Reading' | 'Science') => {
    if (!currentState.currentUser) return;

    const session: TestSession = {
      id: `session_${Date.now()}`,
      userId: currentState.currentUser.id,
      subject,
      currentPassageIndex: 0,
      startedAt: new Date(),
      isActive: true,
      attempts: [],
    };
    
    currentState.currentSession = session;
    currentState.sessionTime = 0;
    notifyListeners();
  },

  endTestSession: () => {
    if (currentState.currentSession) {
      currentState.currentSession = { ...currentState.currentSession, isActive: false };
      notifyListeners();
    }
  },

  nextPassage: () => {
    if (currentState.currentSession && currentState.currentSession.currentPassageIndex < currentState.passages.length - 1) {
      currentState.currentSession = {
        ...currentState.currentSession,
        currentPassageIndex: currentState.currentSession.currentPassageIndex + 1,
      };
      notifyListeners();
    }
  },

  submitAnswers: (passageId: string, answers: Record<string, 'A' | 'B' | 'C' | 'D'>, timeSpent: number) => {
    if (!currentState.currentSession) throw new Error("No active session");

    const passage = currentState.passages.find(p => p.id === passageId);
    if (!passage) throw new Error("Passage not found");

    let score = 0;
    passage.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        score++;
      }
    });

    const attempt: TestAttempt = {
      id: `attempt_${Date.now()}`,
      userId: currentState.currentSession.userId,
      passageId,
      answers,
      score,
      totalQuestions: passage.questions.length,
      timeSpent,
      completedAt: new Date(),
    };

    currentState.currentSession = {
      ...currentState.currentSession,
      attempts: [...currentState.currentSession.attempts, attempt],
    };

    notifyListeners();
    return attempt;
  },

  toggleTimer: () => {
    currentState.isTimerVisible = !currentState.isTimerVisible;
    notifyListeners();
  },

  updateSessionTime: (time: number) => {
    currentState.sessionTime = time;
    notifyListeners();
  },

  setPassages: (passages: Passage[]) => {
    currentState.passages = passages;
    notifyListeners();
  },

  getCurrentPassage: () => {
    if (!currentState.currentSession) return null;
    return currentState.passages[currentState.currentSession.currentPassageIndex] || null;
  },
};

// React hook to use the store
export const useTestStore = (selector?: (state: TestState) => any) => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
  React.useEffect(() => {
    const listener = () => forceUpdate();
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  if (selector) {
    return selector(currentState);
  }
  
  return { ...currentState, ...storeActions };
};