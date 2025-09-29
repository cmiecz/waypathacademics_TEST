import React from 'react';
import { Passage, Question, AdminState } from '../types/act';

// Simple admin state management without Zustand
let adminState: AdminState = {
  isAdmin: false,
  uploadedPassages: [],
};

const adminListeners = new Set<() => void>();

const notifyAdminListeners = () => {
  adminListeners.forEach(listener => listener());
};

interface AdminStore extends AdminState {
  // Admin authentication
  setAdminStatus: (isAdmin: boolean) => void;
  
  // Passage management
  addPassage: (passage: Omit<Passage, 'id'>) => void;
  updatePassage: (id: string, passage: Partial<Passage>) => void;
  deletePassage: (id: string) => void;
  
  // Question management within passages
  addQuestionToPassage: (passageId: string, question: Omit<Question, 'id'>) => void;
  updateQuestionInPassage: (passageId: string, questionId: string, question: Partial<Question>) => void;
  deleteQuestionFromPassage: (passageId: string, questionId: string) => void;
}

// Admin store actions
const adminActions = {
  setAdminStatus: (isAdmin: boolean) => {
    adminState.isAdmin = isAdmin;
    notifyAdminListeners();
  },

  addPassage: (passageData: Omit<Passage, 'id'>) => {
    const passage: Passage = {
      ...passageData,
      id: `passage_${Date.now()}`,
    };
    
    adminState.uploadedPassages = [...adminState.uploadedPassages, passage];
    notifyAdminListeners();
  },

  updatePassage: (id: string, updates: Partial<Passage>) => {
    adminState.uploadedPassages = adminState.uploadedPassages.map((passage) =>
      passage.id === id ? { ...passage, ...updates } : passage
    );
    notifyAdminListeners();
  },

  deletePassage: (id: string) => {
    adminState.uploadedPassages = adminState.uploadedPassages.filter((passage) => passage.id !== id);
    notifyAdminListeners();
  },

  addQuestionToPassage: (passageId: string, questionData: Omit<Question, 'id'>) => {
    const question: Question = {
      ...questionData,
      id: `question_${Date.now()}`,
    };

    adminState.uploadedPassages = adminState.uploadedPassages.map((passage) =>
      passage.id === passageId
        ? { ...passage, questions: [...passage.questions, question] }
        : passage
    );
    notifyAdminListeners();
  },

  updateQuestionInPassage: (passageId: string, questionId: string, updates: Partial<Question>) => {
    adminState.uploadedPassages = adminState.uploadedPassages.map((passage) =>
      passage.id === passageId
        ? {
            ...passage,
            questions: passage.questions.map((question) =>
              question.id === questionId ? { ...question, ...updates } : question
            ),
          }
        : passage
    );
    notifyAdminListeners();
  },

  deleteQuestionFromPassage: (passageId: string, questionId: string) => {
    adminState.uploadedPassages = adminState.uploadedPassages.map((passage) =>
      passage.id === passageId
        ? {
            ...passage,
            questions: passage.questions.filter((question) => question.id !== questionId),
          }
        : passage
    );
    notifyAdminListeners();
  },
};

// React hook to use the admin store
export const useAdminStore = (selector?: (state: AdminState) => any) => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
  React.useEffect(() => {
    const listener = () => forceUpdate();
    adminListeners.add(listener);
    return () => adminListeners.delete(listener);
  }, []);

  if (selector) {
    return selector(adminState);
  }
  
  return { ...adminState, ...adminActions };
};