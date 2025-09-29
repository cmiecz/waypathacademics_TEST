import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTestStore } from '../state/testStore';
import { mockPassages } from '../data/mockData';
import { saveSession } from '../api/supabase';

interface TestSelectionScreenProps {
  navigation: any;
}

const subjects = [
  {
    name: 'English',
    icon: 'book-outline',
    color: 'bg-blue-500',
    description: 'Grammar, punctuation, and rhetorical skills',
    available: true,
  },
  {
    name: 'Math',
    icon: 'calculator-outline', 
    color: 'bg-green-500',
    description: 'Algebra, geometry, and trigonometry',
    available: false,
  },
  {
    name: 'Reading',
    icon: 'library-outline',
    color: 'bg-purple-500',
    description: 'Reading comprehension and analysis',
    available: false,
  },
  {
    name: 'Science',
    icon: 'flask-outline',
    color: 'bg-orange-500', 
    description: 'Scientific reasoning and data interpretation',
    available: false,
  },
] as const;

export default function TestSelectionScreen({ navigation }: TestSelectionScreenProps) {
  const { currentUser, startTestSession, setPassages } = useTestStore();
  
  console.log('TestSelectionScreen rendering, currentUser:', currentUser);

  // Add error boundary for this component
  try {

  const handleSubjectSelect = async (subject: 'English' | 'Math' | 'Reading' | 'Science') => {
    try {
      // Set the passages for the test
      const subjectPassages = mockPassages.filter(p => p.subject === subject);
      setPassages(subjectPassages);
      
      // Start the test session
      const session = startTestSession(subject);
      
      // Save session to Supabase
      if (session && currentUser) {
        await saveSession(session);
      }
      
      // Navigate to test screen
      navigation.navigate('TestScreen');
    } catch (error) {
      console.error('Error starting test session:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="px-6 pt-8 pb-6">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {currentUser?.name?.split(' ')[0]}!
            </Text>
            <Text className="text-gray-600">
              Choose a subject to begin your practice test
            </Text>
          </View>

          {/* Subject Cards */}
          <View className="space-y-4">
          {subjects.map((subject) => (
            <Pressable
              key={subject.name}
              onPress={() => subject.available && handleSubjectSelect(subject.name as any)}
              disabled={!subject.available}
              className={`p-6 rounded-2xl border-2 ${
                subject.available 
                  ? 'bg-white border-gray-200' 
                  : 'bg-gray-100 border-gray-200 opacity-60'
              }`}
            >
              <View className="flex-row items-center">
                <View className={`w-16 h-16 ${subject.color} rounded-2xl items-center justify-center mr-4`}>
                  <Ionicons 
                    name={subject.icon as any} 
                    size={32} 
                    color="white" 
                  />
                </View>
                
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-xl font-bold text-gray-900">
                      {subject.name}
                    </Text>
                    {!subject.available && (
                      <Text className="ml-2 text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                        COMING SOON
                      </Text>
                    )}
                  </View>
                  <Text className="text-gray-600 mt-1">
                    {subject.description}
                  </Text>
                  
                  {subject.available && (
                    <View className="flex-row items-center mt-3">
                      <Ionicons name="play-circle" size={20} color="#3B82F6" />
                      <Text className="text-blue-600 font-semibold ml-2">
                        Start Practice Test
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </View>

          {/* Admin Access */}
          <View className="mt-8 mb-8">
            <Pressable
              onPress={() => navigation.navigate('AdminLogin')}
              className="bg-gray-800 p-4 rounded-xl flex-row items-center justify-center"
            >
              <Ionicons name="settings-outline" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">
                Admin Access
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
  } catch (error) {
    console.error('TestSelectionScreen error:', error);
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-xl font-bold text-red-600 mb-4">Test Selection Error</Text>
          <Text className="text-gray-600 text-center mb-4">
            There was an error loading the test selection screen.
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            Check the console for details.
          </Text>
          <Pressable
            onPress={() => navigation.goBack()}
            className="mt-6 bg-blue-600 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }
}