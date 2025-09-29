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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 24, paddingTop: 32, paddingBottom: 24 }}>
          {/* Header */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
              Welcome back, {currentUser?.name?.split(' ')[0]}!
            </Text>
            <Text style={{ fontSize: 16, color: '#6b7280' }}>
              Choose a subject to begin your practice test
            </Text>
          </View>

          {/* Subject Cards */}
          <View>
            {subjects.map((subject, index) => (
              <Pressable
                key={subject.name}
                onPress={() => subject.available && handleSubjectSelect(subject.name as any)}
                disabled={!subject.available}
                style={{
                  padding: 24,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: '#e5e7eb',
                  backgroundColor: subject.available ? '#ffffff' : '#f3f4f6',
                  opacity: subject.available ? 1 : 0.6,
                  marginBottom: index < subjects.length - 1 ? 16 : 0
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ 
                    width: 64, 
                    height: 64, 
                    backgroundColor: subject.color === 'bg-blue-500' ? '#3b82f6' : subject.color === 'bg-green-500' ? '#10b981' : subject.color === 'bg-purple-500' ? '#8b5cf6' : '#f59e0b',
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16
                  }}>
                    <Ionicons 
                      name={subject.icon as any} 
                      size={32} 
                      color="white" 
                    />
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>
                        {subject.name}
                      </Text>
                      {!subject.available && (
                        <Text style={{ 
                          marginLeft: 8, 
                          fontSize: 12, 
                          fontWeight: '600', 
                          color: '#6b7280',
                          backgroundColor: '#e5e7eb',
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 9999
                        }}>
                          COMING SOON
                        </Text>
                      )}
                    </View>
                    <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                      {subject.description}
                    </Text>
                    
                    {subject.available && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                        <Ionicons name="play-circle" size={20} color="#3b82f6" />
                        <Text style={{ color: '#3b82f6', fontWeight: '600', marginLeft: 8 }}>
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
          <View style={{ marginTop: 32, marginBottom: 32 }}>
            <Pressable
              onPress={() => navigation.navigate('AdminLogin')}
              style={{
                backgroundColor: '#1f2937',
                padding: 16,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Ionicons name="settings-outline" size={20} color="white" />
              <Text style={{ color: 'white', fontWeight: '600', marginLeft: 8 }}>
                Admin Access
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}