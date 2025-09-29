import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TestAttempt, Passage } from '../types/act';
import { useTestStore } from '../state/testStore';

interface PassageResultsScreenProps {
  navigation: any;
  route: {
    params: {
      attempt: TestAttempt;
      passage: Passage;
    };
  };
}

export default function PassageResultsScreen({ navigation, route }: PassageResultsScreenProps) {
  const { attempt, passage } = route.params;
  const { currentSession, passages, nextPassage } = useTestStore();
  
  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Excellent work! You're mastering this content.";
    if (score >= 80) return "Great job! You're on the right track.";
    if (score >= 70) return "Good effort! Review the explanations to improve.";
    return "Keep practicing! Focus on the explanations below.";
  };

  const handleContinue = () => {
    if (!currentSession) return;
    
    const isLastPassage = currentSession.currentPassageIndex >= passages.length - 1;
    
    if (isLastPassage) {
      // Go to final results
      navigation.navigate('FinalResults');
    } else {
      // Next passage
      nextPassage();
      navigation.navigate('TestScreen');
    }
  };

  const currentPassageNumber = (currentSession?.currentPassageIndex || 0) + 1;
  const totalPassages = passages.length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-900">
          Passage {currentPassageNumber} Results
        </Text>
        <Text className="text-gray-600">
          {passage.title}
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="web:max-w-passage web:mx-auto web:w-full">
          {/* Score Card */}
          <View className="mx-6 mt-6 bg-white rounded-2xl p-6 shadow-sm web:mx-4 web:p-8">
          <View className="items-center">
            <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Text className={`text-3xl font-bold ${getScoreColor(percentage)}`}>
                {percentage}%
              </Text>
            </View>
            
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              {attempt.score} out of {attempt.totalQuestions}
            </Text>
            
            <Text className="text-gray-600 text-center mb-4">
              {getScoreMessage(percentage)}
            </Text>
            
            <View className="flex-row items-center bg-gray-50 px-4 py-2 rounded-lg">
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-2">
                Time: {formatTime(attempt.timeSpent)}
              </Text>
            </View>
          </View>
        </View>

        {/* Current Overall Score */}
        {currentSession && currentSession.attempts.length > 0 && (
          <View className="mx-6 mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm web:mx-4 web:p-8">
            <View className="items-center">
              <Text className="text-lg font-semibold text-gray-700 mb-2">
                Current Overall Score
              </Text>
              <View className="flex-row items-center justify-center space-x-4">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-blue-600">
                    {currentSession.attempts.reduce((sum, a) => sum + a.score, 0)}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Total Correct
                  </Text>
                </View>
                <View className="w-px h-8 bg-gray-300" />
                <View className="items-center">
                  <Text className="text-2xl font-bold text-blue-600">
                    {currentSession.attempts.reduce((sum, a) => sum + a.totalQuestions, 0)}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Total Questions
                  </Text>
                </View>
                <View className="w-px h-8 bg-gray-300" />
                <View className="items-center">
                  <Text className="text-2xl font-bold text-blue-600">
                    {Math.round((currentSession.attempts.reduce((sum, a) => sum + a.score, 0) / currentSession.attempts.reduce((sum, a) => sum + a.totalQuestions, 0)) * 100)}%
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Overall %
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Question Review */}
        <View className="mx-6 mt-6 bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Question Review
          </Text>
          
          {passage.questions.map((question) => {
            const userAnswer = attempt.answers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <View key={question.id} className="mb-6 last:mb-0">
                <Text className="text-base font-semibold text-gray-900 mb-2">
                  {question.questionNumber}. {question.text}
                </Text>
                
                <View className="space-y-2 mb-3">
                  {Object.entries(question.options).map(([letter, option]) => {
                    const isUserAnswer = userAnswer === letter;
                    const isCorrectAnswer = question.correctAnswer === letter;
                    
                    let bgColor = 'bg-gray-50';
                    let textColor = 'text-gray-700';
                    let borderColor = 'border-gray-200';
                    
                    if (isCorrectAnswer) {
                      bgColor = 'bg-green-50';
                      textColor = 'text-green-800';
                      borderColor = 'border-green-200';
                    } else if (isUserAnswer && !isCorrect) {
                      bgColor = 'bg-red-50';
                      textColor = 'text-red-800';
                      borderColor = 'border-red-200';
                    }
                    
                    return (
                      <View key={letter} className={`p-3 rounded-lg border ${bgColor} ${borderColor}`}>
                        <View className="flex-row items-center">
                          <Text className={`font-bold text-sm mr-2 ${textColor}`}>
                            {letter}.
                          </Text>
                          <Text className={`flex-1 text-sm ${textColor}`}>
                            {option}
                          </Text>
                          {isCorrectAnswer && (
                            <Ionicons name="checkmark-circle" size={20} color="#059669" />
                          )}
                          {isUserAnswer && !isCorrect && (
                            <Ionicons name="close-circle" size={20} color="#DC2626" />
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
                
                <View className="bg-blue-50 p-3 rounded-lg">
                  <Text className="text-blue-800 text-sm">
                    <Text className="font-semibold">Explanation: </Text>
                    {question.explanation}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

          <View className="h-6" />
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View className="px-6 pb-6 pt-4 bg-white border-t border-gray-200">
        <Pressable
          onPress={handleContinue}
          className="bg-blue-600 py-4 px-6 rounded-xl items-center"
        >
          <Text className="text-white font-semibold text-lg">
            {currentPassageNumber >= totalPassages ? 'View Final Results' : 'Continue to Next Passage'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}