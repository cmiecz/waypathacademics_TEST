import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isWeb } from '../utils/webUtils';

export default function WebHelp() {
  const [showHelp, setShowHelp] = useState(false);

  if (!isWeb) return null;

  return (
    <>
      <Pressable
        onPress={() => setShowHelp(true)}
        className="web:fixed web:bottom-4 web:right-4 web:bg-blue-600 web:w-12 web:h-12 web:rounded-full web:items-center web:justify-center web:shadow-lg web:z-50"
      >
        <Ionicons name="help-outline" size={24} color="white" />
      </Pressable>

      <Modal
        visible={showHelp}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHelp(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center p-6">
          <View className="bg-white rounded-2xl p-6 max-w-md w-full">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900">
                Keyboard Shortcuts
              </Text>
              <Pressable
                onPress={() => setShowHelp(false)}
                className="w-8 h-8 items-center justify-center"
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </Pressable>
            </View>

            <View className="space-y-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-700">Select answer option</Text>
                <View className="flex-row space-x-1">
                  {['A', 'B', 'C', 'D'].map((key) => (
                    <View key={key} className="bg-gray-100 px-2 py-1 rounded">
                      <Text className="text-sm font-mono">{key}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-gray-700">Submit answers</Text>
                <View className="bg-gray-100 px-2 py-1 rounded">
                  <Text className="text-sm font-mono">Enter</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-gray-700">Toggle timer</Text>
                <View className="bg-gray-100 px-2 py-1 rounded">
                  <Text className="text-sm font-mono">T</Text>
                </View>
              </View>
            </View>

            <View className="mt-6 pt-4 border-t border-gray-200">
              <Text className="text-sm text-gray-600 text-center">
                Press ESC to close this help dialog
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}