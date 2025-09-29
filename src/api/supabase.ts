// Supabase integration for ACT Test System
import { createClient } from '@supabase/supabase-js';
import { User, TestAttempt, TestSession } from '../types/act';

// Supabase configuration
const supabaseUrl = 'https://glhwxyhhycqytfrsjzyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaHd4eWhoeWNxeXRmcnNqenl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NjQ3MjIsImV4cCI6MjA2OTE0MDcyMn0.4SAwtIdGUgcFGvInISOa4pNUw-RuihSqvnYxDxc-wo0';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Utility functions for database operations
export const saveUserData = async (user: User) => {
  try {
    // Convert camelCase to snake_case for database
    const dbUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      registered_at: user.registeredAt
    };
    const result = await supabase.from('users').insert([dbUser]);
    return result;
  } catch (error) {
    console.error('Error saving user:', error);
    return { data: null, error };
  }
};

export const saveTestResult = async (attempt: TestAttempt) => {
  try {
    // Convert camelCase to snake_case for database
    const dbAttempt = {
      id: attempt.id,
      user_id: attempt.userId,
      passage_id: attempt.passageId,
      answers: attempt.answers,
      score: attempt.score,
      total_questions: attempt.totalQuestions,
      time_spent: attempt.timeSpent,
      completed_at: attempt.completedAt
    };
    const result = await supabase.from('test_attempts').insert([dbAttempt]);
    return result;
  } catch (error) {
    console.error('Error saving test result:', error);
    return { data: null, error };
  }
};

export const saveSession = async (session: TestSession) => {
  try {
    // Convert camelCase to snake_case for database
    const dbSession = {
      id: session.id,
      user_id: session.userId,
      subject: session.subject,
      current_passage_index: session.currentPassageIndex,
      started_at: session.startedAt,
      is_active: session.isActive
    };
    const result = await supabase.from('test_sessions').insert([dbSession]);
    return result;
  } catch (error) {
    console.error('Error saving session:', error);
    return { data: null, error };
  }
};

export const getUserAttempts = async (userId: string) => {
  try {
    const result = await supabase.from('test_attempts').select('*').eq('user_id', userId);
    return result;
  } catch (error) {
    console.error('Error fetching user attempts:', error);
    return { data: [], error };
  }
};

export const getTestAnalytics = async () => {
  try {
    const result = await supabase.from('test_attempts').select('*');
    return result;
  } catch (error) {
    console.error('Error fetching test analytics:', error);
    return { data: [], error };
  }
};

// SQL Schema for Supabase (for reference)
/*

-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test sessions table  
CREATE TABLE test_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  subject TEXT NOT NULL,
  current_passage_index INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Test attempts table
CREATE TABLE test_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  session_id TEXT REFERENCES test_sessions(id),
  passage_id TEXT NOT NULL,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_spent INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Passages table (for admin-uploaded content)
CREATE TABLE passages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  subject TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  questions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

*/