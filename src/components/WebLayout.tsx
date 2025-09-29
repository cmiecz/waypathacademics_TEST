import React from 'react';
import { View, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WebLayoutProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  scrollable?: boolean;
  style?: ViewStyle;
}

const maxWidthClasses = {
  sm: 'web:max-w-sm',
  md: 'web:max-w-md', 
  lg: 'web:max-w-lg',
  xl: 'web:max-w-web-content',
  full: 'web:max-w-full',
};

export default function WebLayout({ 
  children, 
  maxWidth = 'xl', 
  className = '', 
  scrollable = true,
  style
}: WebLayoutProps) {
  const containerClass = `flex-1 ${maxWidthClasses[maxWidth]} web:mx-auto web:w-full ${className}`;

  if (scrollable) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 web:bg-gray-100" style={style}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className={containerClass}>
            {children}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 web:bg-gray-100" style={style}>
      <View className={containerClass}>
        {children}
      </View>
    </SafeAreaView>
  );
}