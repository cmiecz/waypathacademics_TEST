import React from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAdminStore } from '../state/adminStore';
import { useTestStore } from '../state/testStore';

interface AdminDashboardScreenProps {
  navigation: any;
}

export default function AdminDashboardScreen({ navigation }: AdminDashboardScreenProps) {
  const { uploadedPassages, setAdminStatus } = useAdminStore();
  const { setPassages } = useTestStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from admin panel?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            setAdminStatus(false);
            navigation.navigate('TestSelection');
          }
        },
      ]
    );
  };

  const handleSyncPassages = () => {
    setPassages(uploadedPassages);
    Alert.alert('Success', 'Passages synced to test system');
  };

  const menuItems = [
    {
      title: 'Add New Passage',
      subtitle: 'Create passages with questions',
      icon: 'document-text-outline',
      color: 'bg-blue-500',
      action: () => navigation.navigate('AddPassage'),
    },
    {
      title: 'Manage Passages',
      subtitle: `${uploadedPassages.length} passages uploaded`,
      icon: 'library-outline', 
      color: 'bg-green-500',
      action: () => navigation.navigate('ManagePassages'),
    },
    {
      title: 'Sync to Test System',
      subtitle: 'Update live test content',
      icon: 'sync-outline',
      color: 'bg-purple-500',
      action: handleSyncPassages,
    },
    {
      title: 'View Test Data',
      subtitle: 'Student results and analytics',
      icon: 'analytics-outline',
      color: 'bg-orange-500',
      action: () => Alert.alert('Coming Soon', 'Analytics dashboard will be available soon'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </Text>
            <Text className="text-gray-600">
              Manage test content and settings
            </Text>
          </View>
          <Pressable
            onPress={handleLogout}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="log-out-outline" size={24} color="#6B7280" />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1 pt-6">
        <View className="web:max-w-web-content web:mx-auto web:w-full">
          {/* Quick Stats */}
          <View className="px-6 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Quick Stats
            </Text>
            <View className="flex-row space-x-4 web:grid web:grid-cols-2 web:gap-4 web:space-x-0 desktop:grid-cols-4">
            <View className="flex-1 bg-white p-4 rounded-xl shadow-sm">
              <Text className="text-2xl font-bold text-blue-600">
                {uploadedPassages.length}
              </Text>
              <Text className="text-gray-600 text-sm">
                Total Passages
              </Text>
            </View>
            <View className="flex-1 bg-white p-4 rounded-xl shadow-sm">
              <Text className="text-2xl font-bold text-green-600">
                {uploadedPassages.reduce((total, p) => total + p.questions.length, 0)}
              </Text>
              <Text className="text-gray-600 text-sm">
                Total Questions
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Management Tools
          </Text>
          <View className="space-y-3">
            {menuItems.map((item, index) => (
              <Pressable
                key={index}
                onPress={item.action}
                className="bg-white p-4 rounded-xl shadow-sm flex-row items-center"
              >
                <View className={`w-12 h-12 ${item.color} rounded-xl items-center justify-center mr-4`}>
                  <Ionicons name={item.icon as any} size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900">
                    {item.title}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {item.subtitle}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>
            ))}
          </View>
        </View>

          <View className="h-8" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}