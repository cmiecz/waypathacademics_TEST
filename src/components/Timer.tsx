import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTestStore } from '../state/testStore';
import { isWeb } from '../utils/webUtils';

interface TimerProps {
  onTimeUpdate?: (time: number) => void;
}

export default function Timer({ onTimeUpdate }: TimerProps) {
  const { isTimerVisible, toggleTimer, updateSessionTime, sessionTime } = useTestStore();
  const [localTime, setLocalTime] = useState(sessionTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setLocalTime((prev) => {
        const newTime = prev + 1;
        updateSessionTime(newTime);
        onTimeUpdate?.(newTime);
        return newTime;
      });
    }, 1000);

    // Web keyboard shortcut for toggling timer
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 't' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const activeElement = document.activeElement;
        // Don't trigger if user is typing in an input
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          event.preventDefault();
          toggleTimer();
        }
      }
    };

    if (isWeb) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      clearInterval(interval);
      if (isWeb) {
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [updateSessionTime, onTimeUpdate, toggleTimer]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View className="flex-row items-center">
      {isTimerVisible && (
        <View className="bg-gray-100 px-3 py-2 rounded-lg mr-2">
          <Text className="text-gray-800 font-mono text-base font-semibold">
            {formatTime(localTime)}
          </Text>
        </View>
      )}
      
      <Pressable
        onPress={toggleTimer}
        className="w-10 h-10 items-center justify-center"
      >
        <Ionicons 
          name={isTimerVisible ? "eye-outline" : "eye-off-outline"} 
          size={20} 
          color="#6B7280" 
        />
      </Pressable>
    </View>
  );
}