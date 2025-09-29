import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAdminStore } from '../state/adminStore';

interface AdminLoginScreenProps {
  navigation: any;
}

const ADMIN_PASSWORD = 'admin123'; // In production, this would be handled securely

export default function AdminLoginScreen({ navigation }: AdminLoginScreenProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setAdminStatus } = useAdminStore();

  const handleLogin = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter the admin password');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (password === ADMIN_PASSWORD) {
        setAdminStatus(true);
        navigation.navigate('AdminDashboard');
      } else {
        Alert.alert('Error', 'Incorrect password');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
      setPassword('');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white web:bg-gray-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 web:items-center web:justify-center"
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </Pressable>
          <Text className="text-lg font-semibold text-gray-900 ml-2">
            Admin Access
          </Text>
        </View>

        <View className="flex-1 px-6 justify-center web:max-w-md web:w-full web:mx-auto web:bg-white web:rounded-2xl web:shadow-lg web:p-8 web:my-8">
          {/* Icon */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-gray-800 rounded-2xl items-center justify-center mb-4">
              <Ionicons name="shield-checkmark" size={40} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-900">
              Admin Login
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              Enter the admin password to access content management
            </Text>
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-2">
              Admin Password
            </Text>
            <View className="relative">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter admin password"
                secureTextEntry={!showPassword}
                className="border border-gray-300 rounded-xl px-4 py-4 pr-12 text-base"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                autoComplete="password"
                onSubmitEditing={handleLogin}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-0 bottom-0 justify-center"
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#6B7280" 
                />
              </Pressable>
            </View>
          </View>

          {/* Login Button */}
          <Pressable
            onPress={handleLogin}
            disabled={isLoading}
            className={`rounded-xl py-4 px-6 items-center ${
              isLoading ? 'bg-gray-300' : 'bg-gray-800'
            }`}
          >
            {isLoading ? (
              <Text className="text-white font-semibold text-lg">
                Logging in...
              </Text>
            ) : (
              <Text className="text-white font-semibold text-lg">
                Access Admin Panel
              </Text>
            )}
          </Pressable>

          {/* Demo Info */}
          <View className="mt-8 p-4 bg-blue-50 rounded-xl">
            <Text className="text-blue-800 text-sm text-center">
              <Text className="font-semibold">Demo Password: </Text>
              {ADMIN_PASSWORD}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}