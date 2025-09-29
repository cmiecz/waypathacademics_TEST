import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTestStore } from '../state/testStore';
import { User } from '../types/act';
import { saveUserData } from '../api/supabase';

interface RegistrationScreenProps {
  navigation: any;
}

export default function RegistrationScreen({ navigation }: RegistrationScreenProps) {
  console.log('RegistrationScreen rendering...');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const { setUser } = useTestStore();

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const user: User = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        registeredAt: new Date(),
      };

      // Save user to Supabase
      const result = await saveUserData(user);
      
      if (result.error) {
        // Check if it's a conflict (user already exists)
        if (result.error.code === '23505' || result.error.message?.includes('duplicate')) {
          // User already exists, just log them in
          console.log('User already exists, logging in...');
          console.log('Setting user:', user);
          setUser(user);
          console.log('Navigating to TestSelection...');
          navigation.navigate('TestSelection');
          return;
        } else {
          throw new Error('Failed to save user data');
        }
      }

      console.log('New user registered, setting user:', user);
      setUser(user);
      console.log('Navigating to TestSelection...');
      navigation.navigate('TestSelection');
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 web:bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 web:items-center web:justify-center"
      >
        <View className="flex-1 px-6 pt-8 web:max-w-md web:w-full web:mx-auto web:pt-0">
          {/* Header */}
          <View className="items-center mb-12 web:mb-8">
            <Ionicons name="school-outline" size={80} color="#007AFF" />
            <Text className="text-3xl font-bold text-gray-900 mt-4">
              ACT Test Prep
            </Text>
            <Text className="text-lg text-gray-600 mt-2 text-center">
              Register to start your practice tests
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-6">
            {/* Name Input */}
            <View>
              <Text className="text-base font-semibold text-gray-700 mb-2">
                Full Name
              </Text>
              <TextInput
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) {
                    setErrors(prev => ({ ...prev, name: undefined }));
                  }
                }}
                placeholder="Enter your full name"
                className={`border rounded-xl px-4 py-4 text-base web:py-3 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                autoComplete="name"
              />
              {errors.name && (
                <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>
              )}
            </View>

            {/* Email Input */}
            <View>
              <Text className="text-base font-semibold text-gray-700 mb-2">
                Email Address
              </Text>
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: undefined }));
                  }
                }}
                placeholder="Enter your email address"
                className={`border rounded-xl px-4 py-4 text-base web:py-3 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
              />
              {errors.email && (
                <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
              )}
            </View>

            {/* Register Button */}
            <Pressable
              onPress={handleRegister}
              disabled={isLoading}
              className={`rounded-xl py-4 px-6 items-center mt-8 ${
                isLoading ? 'bg-gray-300' : 'bg-blue-600'
              }`}
            >
              {isLoading ? (
                <Text className="text-white font-semibold text-lg">
                  Registering...
                </Text>
              ) : (
                <Text className="text-white font-semibold text-lg">
                  Start Testing
                </Text>
              )}
            </Pressable>

            {/* Testing Mode Button */}
            <Pressable
              onPress={() => {
                const testUser: User = {
                  id: 'test_user_123',
                  name: 'Test User',
                  email: 'test@example.com',
                  registeredAt: new Date(),
                };
                setUser(testUser);
                navigation.navigate('TestSelection');
              }}
              className="rounded-xl py-3 px-6 items-center mt-4 bg-gray-500"
            >
              <Text className="text-white font-semibold text-base">
                Testing Mode (Skip Registration)
              </Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View className="flex-1 justify-end pb-8">
            <Text className="text-center text-gray-500 text-sm">
              By registering, you agree to practice responsibly and track your progress.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}