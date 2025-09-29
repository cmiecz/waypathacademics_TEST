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
        <View className="web:max-w-web-content web:mx-auto web:w-full">
          {/* Header */}
          <View className="px-6 pt-8 pb-6 web:pt-12">
            <View className="flex-row items-center justify-between web:flex-col web:items-start web:space-y-4">
              <View className="web:text-center web:w-full">
                <Text className="text-2xl font-bold text-gray-900 web:text-3xl">
                  Welcome back, {currentUser?.name?.split(' ')[0]}!
                </Text>
                <Text className="text-gray-600 mt-1 web:text-lg">
                  Choose a subject to begin your practice test
                </Text>
              </View>
              <Pressable 
                onPress={() => navigation.navigate('Profile')}
                className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center web:absolute web:top-8 web:right-6"
              >
                <Ionicons name="person" size={24} color="#3B82F6" />
              </Pressable>
            </View>
          </View>

          {/* Subject Cards */}
          <View className="px-6 space-y-4 web:grid web:grid-cols-2 web:gap-6 web:space-y-0 desktop:grid-cols-3">
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
          <View className="px-6 mt-8 mb-8">
            <Pressable
              onPress={() => navigation.navigate('AdminLogin')}
              className="bg-gray-800 p-4 rounded-xl flex-row items-center justify-center web:max-w-md web:mx-auto"
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
}