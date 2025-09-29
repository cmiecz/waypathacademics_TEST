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

  if (!currentPassage || !currentSession) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-lg text-gray-600">No test session active</Text>
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
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </Pressable>
          <View className="ml-2">
            <Text className="text-lg font-semibold text-gray-900">
              {currentSession.subject} Test
            </Text>
            <Text className="text-sm text-gray-600">
              Passage {currentPassageNumber} of {totalPassages}
            </Text>
          </View>
        </View>
        
        <Timer />
      </View>

      <ScrollView 
        ref={scrollViewRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="web:max-w-7xl web:mx-auto web:w-full">
          {/* Question Navigation */}
          <View className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {currentPassage.questions.length}
              </Text>
              <View className="flex-row space-x-2">
                {currentPassage.questions.map((_, index) => (
                  <View
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentQuestionIndex
                        ? 'bg-blue-500'
                        : answers[currentPassage.questions[index].id]
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Main Content - Side by Side Layout */}
          <View className="flex-1 web:flex-row">
            {/* Passage - Left Side (50%) */}
            <View className="flex-1 px-6 pt-6 web:pr-4 web:w-1/2">
              <Text className="text-xl font-bold text-gray-900 mb-4 web:text-2xl">
                {currentPassage.title}
              </Text>
              
              <View className="bg-gray-50 p-4 rounded-xl web:p-6">
                <Text className="text-base leading-relaxed text-gray-800 web:text-lg web:leading-relaxed select-text">
                  {currentPassage.content}
                </Text>
              </View>
            </View>

            {/* Question - Right Side (50%) */}
            <View className="flex-1 px-6 pt-6 web:pl-4 web:border-l web:border-gray-200 web:w-1/2">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                {currentQuestion.questionNumber}. {currentQuestion.text}
              </Text>

              <View className="space-y-2">
                {Object.entries(currentQuestion.options).map(([letter, option]) => (
                  <Pressable
                    key={letter}
                    onPress={() => handleAnswerSelect(currentQuestion.id, letter as 'A' | 'B' | 'C' | 'D')}
                    className={`flex-row items-center p-3 rounded-xl border-2 ${
                      answers[currentQuestion.id] === letter
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <View className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-2 ${
                      answers[currentQuestion.id] === letter
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestion.id] === letter ? (
                        <Text className="text-white font-bold text-xs">{letter}</Text>
                      ) : (
                        <Text className="text-gray-500 font-bold text-xs">{letter}</Text>
                      )}
                    </View>
                    <Text className={`flex-1 text-sm ${
                      answers[currentQuestion.id] === letter ? 'text-blue-900' : 'text-gray-700'
                    }`}>
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View className="px-6 pb-6 pt-4 border-t border-gray-200 bg-white">
        <View className="flex-row justify-between items-center">
          <Pressable
            onPress={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`py-3 px-6 rounded-xl ${
              currentQuestionIndex === 0 ? 'bg-gray-200' : 'bg-gray-500'
            }`}
          >
            <Text className={`font-semibold ${
              currentQuestionIndex === 0 ? 'text-gray-400' : 'text-white'
            }`}>
              Previous
            </Text>
          </Pressable>

          {isLastQuestion ? (
            <Pressable
              onPress={handleSubmitPassage}
              disabled={!isComplete}
              className={`py-3 px-6 rounded-xl ${
                isComplete ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <Text className={`font-semibold ${
                isComplete ? 'text-white' : 'text-gray-500'
              }`}>
                Submit Passage
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleNextQuestion}
              className="py-3 px-6 rounded-xl bg-blue-600"
            >
              <Text className="font-semibold text-white">
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