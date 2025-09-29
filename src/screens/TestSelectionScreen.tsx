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
  
  // Test if component mounts
  console.log('TestSelectionScreen mounted successfully');

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
    <View style={{ flex: 1, backgroundColor: '#f9fafb', padding: 24, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>
        Test Selection
      </Text>
      <Text style={{ fontSize: 16, color: '#6b7280', marginBottom: 32 }}>
        Welcome, {currentUser?.name}!
      </Text>
      <Pressable
        onPress={() => handleSubjectSelect('English')}
        style={{
          backgroundColor: '#3b82f6',
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 12
        }}
      >
        <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>
          Start English Test
        </Text>
      </Pressable>
    </View>
  );
}