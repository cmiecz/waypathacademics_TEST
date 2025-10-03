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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8, textAlign: 'center' }}>
          Choose Your Test Subject
        </Text>
        <Text style={{ fontSize: 16, color: '#6b7280', marginBottom: 48, textAlign: 'center' }}>
          Welcome, {currentUser?.name}! Select a subject to begin your practice test.
        </Text>
        
        <View style={{ gap: 24 }}>
          {subjects.map((subject) => (
            <View
              key={subject.name}
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 24,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
                borderWidth: subject.name === 'English' ? 2 : 0,
                borderColor: '#3b82f6',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Ionicons 
                  name={subject.icon as any} 
                  size={24} 
                  color={subject.name === 'English' ? '#3b82f6' : '#9ca3af'} 
                  style={{ marginRight: 12 }}
                />
                <Text style={{ 
                  fontSize: 20, 
                  fontWeight: '600', 
                  color: '#111827',
                  flex: 1 
                }}>
                  {subject.name}
                </Text>
              </View>
              
              <Text style={{ 
                fontSize: 14, 
                color: '#6b7280', 
                marginBottom: 16,
                lineHeight: 20
              }}>
                {subject.description}
              </Text>
              
              <Pressable
                onPress={() => subject.available ? handleSubjectSelect(subject.name as any) : null}
                disabled={!subject.available}
                style={{
                  backgroundColor: subject.available ? '#10b981' : '#e5e7eb',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  alignSelf: 'flex-start',
                  opacity: subject.available ? 1 : 0.7
                }}
              >
                <Text style={{ 
                  color: subject.available ? 'white' : '#6b7280', 
                  fontWeight: '500', 
                  fontSize: 14
                }}>
                  {subject.available ? 'Available' : 'Coming Soon'}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}