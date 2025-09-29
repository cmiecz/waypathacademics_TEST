import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTestStore } from '../state/testStore';
import Timer from '../components/Timer';
import WebHelp from '../components/WebHelp';
import { isWeb } from '../utils/webUtils';
import { saveTestResult } from '../api/supabase';

interface TestScreenProps {
  navigation: any;
}

export default function TestScreen({ navigation }: TestScreenProps) {
  const { 
    getCurrentPassage, 
    currentSession, 
    submitAnswers,
    passages,
    sessionTime 
  } = useTestStore();

  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [passageStartTime] = useState(sessionTime);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const currentPassage = getCurrentPassage();

  console.log('TestScreen - currentPassage:', currentPassage);
  console.log('TestScreen - currentSession:', currentSession);
  console.log('TestScreen - passages:', passages);

  if (!currentPassage || !currentSession) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-lg text-gray-600">No test session active</Text>
        <Text className="text-sm text-gray-500 mt-2">
          Passage: {currentPassage ? 'Found' : 'Not found'}
        </Text>
        <Text className="text-sm text-gray-500">
          Session: {currentSession ? 'Found' : 'Not found'}
        </Text>
        <Pressable
          onPress={() => navigation.navigate('TestSelection')}
          className="mt-4 bg-blue-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleAnswerSelect = (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentPassage.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitPassage = async () => {
    try {
      const timeSpent = sessionTime - passageStartTime;
      const attempt = submitAnswers(currentPassage.id, answers, timeSpent);
      
      // Save test result to Supabase
      if (attempt && currentSession) {
        await saveTestResult(attempt);
      }
      
      // Navigate to results screen
      navigation.navigate('PassageResults', { attempt, passage: currentPassage });
    } catch (error) {
      console.error('Error submitting passage:', error);
    }
  };

  const currentQuestion = currentPassage.questions[currentQuestionIndex];
  const isComplete = currentPassage.questions.every(q => answers[q.id]);
  const isLastQuestion = currentQuestionIndex === currentPassage.questions.length - 1;

  // Keyboard shortcuts for web
  useEffect(() => {
    if (!isWeb) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Allow A, B, C, D keys to select answers for current question
      if (['a', 'b', 'c', 'd'].includes(event.key.toLowerCase())) {
        event.preventDefault();
        handleAnswerSelect(currentQuestion.id, event.key.toUpperCase() as 'A' | 'B' | 'C' | 'D');
      }

      // Arrow keys for navigation
      if (event.key === 'ArrowRight' && !isLastQuestion) {
        event.preventDefault();
        handleNextQuestion();
      }
      if (event.key === 'ArrowLeft' && currentQuestionIndex > 0) {
        event.preventDefault();
        handlePreviousQuestion();
      }

      // Enter to submit if complete
      if (event.key === 'Enter' && isComplete) {
        event.preventDefault();
        handleSubmitPassage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [answers, currentQuestion, isComplete, isLastQuestion, currentQuestionIndex, handleSubmitPassage]);
  const currentPassageNumber = (currentSession.currentPassageIndex || 0) + 1;
  const totalPassages = passages.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </Pressable>
          <View style={{ marginLeft: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>
              {currentSession.subject} Test
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>
              Passage {currentPassageNumber} of {totalPassages}
            </Text>
          </View>
        </View>
        
        <Timer />
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Question Navigation */}
        <View style={{ paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#f9fafb', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>
              Question {currentQuestionIndex + 1} of {currentPassage.questions.length}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              {currentPassage.questions.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: index === currentQuestionIndex
                      ? '#3b82f6'
                      : answers[currentPassage.questions[index].id]
                      ? '#10b981'
                      : '#d1d5db',
                    marginLeft: index > 0 ? 8 : 0
                  }}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Main Content - Side by Side Layout */}
        <View style={{ flexDirection: 'row', minHeight: 500 }}>
          {/* Passage - Left Side (50%) */}
          <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>
              {currentPassage.title}
            </Text>
            
            <View style={{ backgroundColor: '#f9fafb', padding: 24, borderRadius: 12 }}>
              <Text style={{ fontSize: 16, lineHeight: 24, color: '#1f2937' }}>
                {currentPassage.content}
              </Text>
            </View>
          </View>

          {/* Question - Right Side (50%) */}
          <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24, borderLeftWidth: 1, borderLeftColor: '#e5e7eb' }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 16 }}>
              {currentQuestion.questionNumber}. {currentQuestion.text}
            </Text>

            <View>
              {Object.entries(currentQuestion.options).map(([letter, option]) => (
                <Pressable
                  key={letter}
                  onPress={() => handleAnswerSelect(currentQuestion.id, letter as 'A' | 'B' | 'C' | 'D')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: answers[currentQuestion.id] === letter ? '#3b82f6' : '#e5e7eb',
                    backgroundColor: answers[currentQuestion.id] === letter ? '#eff6ff' : '#ffffff',
                    marginBottom: 8
                  }}
                >
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: answers[currentQuestion.id] === letter ? '#3b82f6' : '#d1d5db',
                    backgroundColor: answers[currentQuestion.id] === letter ? '#3b82f6' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8
                  }}>
                    <Text style={{
                      color: answers[currentQuestion.id] === letter ? '#ffffff' : '#6b7280',
                      fontWeight: 'bold',
                      fontSize: 12
                    }}>
                      {letter}
                    </Text>
                  </View>
                  <Text style={{
                    flex: 1,
                    fontSize: 14,
                    color: answers[currentQuestion.id] === letter ? '#1e3a8a' : '#374151'
                  }}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb', backgroundColor: '#ffffff' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Pressable
            onPress={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 12,
              backgroundColor: currentQuestionIndex === 0 ? '#e5e7eb' : '#6b7280'
            }}
          >
            <Text style={{
              fontWeight: '600',
              color: currentQuestionIndex === 0 ? '#9ca3af' : '#ffffff'
            }}>
              Previous
            </Text>
          </Pressable>

          {isLastQuestion ? (
            <Pressable
              onPress={handleSubmitPassage}
              disabled={!isComplete}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 12,
                backgroundColor: isComplete ? '#3b82f6' : '#d1d5db'
              }}
            >
              <Text style={{
                fontWeight: '600',
                color: isComplete ? '#ffffff' : '#6b7280'
              }}>
                Submit Passage
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleNextQuestion}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 12,
                backgroundColor: '#3b82f6'
              }}
            >
              <Text style={{ fontWeight: '600', color: '#ffffff' }}>
                Next
              </Text>
            </Pressable>
          )}
        </View>
      </View>
      
      <WebHelp />
    </SafeAreaView>
  );
}