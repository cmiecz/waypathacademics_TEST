import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTestStore } from '../state/testStore';
import { saveTestResult } from '../api/supabase';

interface FinalResultsScreenProps {
  navigation: any;
}

export default function FinalResultsScreen({ navigation }: FinalResultsScreenProps) {
  const { currentSession, endTestSession } = useTestStore();

  if (!currentSession) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-lg text-gray-600">No test session found</Text>
        <Pressable
          onPress={() => navigation.navigate('TestSelection')}
          className="mt-4 bg-blue-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const totalQuestions = currentSession.attempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
  const totalCorrect = currentSession.attempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const totalTime = currentSession.attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
  const overallPercentage = Math.round((totalCorrect / totalQuestions) * 100);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getGradeMessage = (percentage: number) => {
    if (percentage >= 90) return { message: "Outstanding! You're ready for the ACT.", color: "text-green-600" };
    if (percentage >= 80) return { message: "Great work! Continue practicing to excel.", color: "text-blue-600" };
    if (percentage >= 70) return { message: "Good job! Focus on your weak areas.", color: "text-yellow-600" };
    if (percentage >= 60) return { message: "Keep practicing! You're improving.", color: "text-orange-600" };
    return { message: "More practice needed. Don't give up!", color: "text-red-600" };
  };

  const handleFinish = async () => {
    // Save results to Supabase (mock)
    for (const attempt of currentSession.attempts) {
      await saveTestResult(attempt);
    }

    endTestSession();
    navigation.navigate('TestSelection');
  };

  const handleRetry = () => {
    endTestSession();
    navigation.navigate('TestSelection');
  };

  const gradeInfo = getGradeMessage(overallPercentage);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-6 border-b border-gray-200">
        <View className="items-center">
          <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="trophy-outline" size={40} color="#3B82F6" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 web:text-3xl">
            Test Complete!
          </Text>
          <Text className="text-gray-600 mt-1 web:text-lg">
            {currentSession.subject} Practice Test Results
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <View className="web:max-w-passage web:mx-auto web:w-full">
          {/* Overall Score */}
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm web:p-8">
            <Text className="text-lg font-semibold text-gray-900 mb-4 text-center web:text-xl">
              Overall Performance
            </Text>
            
            <View className="items-center mb-4">
              <Text className="text-5xl font-bold text-blue-600 mb-2 web:text-6xl">
                {overallPercentage}%
              </Text>
              <Text className="text-xl font-semibold text-gray-900 web:text-2xl">
                {totalCorrect} out of {totalQuestions} correct
              </Text>
            </View>

            <Text className={`text-center text-base font-medium web:text-lg ${gradeInfo.color}`}>
              {gradeInfo.message}
            </Text>
          </View>

          {/* Stats */}
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm web:p-8">
            <Text className="text-lg font-semibold text-gray-900 mb-4 web:text-xl">
              Session Stats
            </Text>
            
            <View className="space-y-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="document-text-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-700 ml-2 web:text-lg">Passages Completed</Text>
                </View>
                <Text className="text-gray-900 font-semibold web:text-lg">
                  {currentSession.attempts.length}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-700 ml-2 web:text-lg">Total Time</Text>
                </View>
                <Text className="text-gray-900 font-semibold web:text-lg">
                  {formatTime(totalTime)}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="calculator-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-700 ml-2 web:text-lg">Average per Question</Text>
                </View>
                <Text className="text-gray-900 font-semibold web:text-lg">
                  {Math.round(totalTime / totalQuestions)}s
                </Text>
              </View>
            </View>
          </View>

          {/* Passage Breakdown */}
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm web:p-8">
            <Text className="text-lg font-semibold text-gray-900 mb-4 web:text-xl">
              Passage Breakdown
            </Text>
            
            {currentSession.attempts.map((attempt, index) => {
              const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
              return (
                <View key={attempt.id} className="flex-row items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <View>
                    <Text className="text-gray-900 font-medium web:text-lg">
                      Passage {index + 1}
                    </Text>
                    <Text className="text-gray-600 text-sm web:text-base">
                      {formatTime(attempt.timeSpent)}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-gray-900 font-semibold web:text-lg">
                      {attempt.score}/{attempt.totalQuestions}
                    </Text>
                    <Text className="text-gray-600 text-sm web:text-base">
                      {percentage}%
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 pb-6 pt-4 bg-white border-t border-gray-200 web:max-w-passage web:mx-auto web:w-full">
        <View className="space-y-3">
          <Pressable
            onPress={handleFinish}
            className="bg-blue-600 py-4 px-6 rounded-xl items-center web:py-3"
          >
            <Text className="text-white font-semibold text-lg">
              Finish & Save Results
            </Text>
          </Pressable>

          <Pressable
            onPress={handleRetry}
            className="bg-gray-200 py-4 px-6 rounded-xl items-center web:py-3"
          >
            <Text className="text-gray-800 font-semibold text-lg">
              Take Another Test
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}