import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTestStore } from '../state/testStore';

// Import screens
import RegistrationScreen from '../screens/RegistrationScreen';
import TestSelectionScreen from '../screens/TestSelectionScreen';
import TestScreen from '../screens/TestScreen';
import PassageResultsScreen from '../screens/PassageResultsScreen';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AddPassageScreen from '../screens/AddPassageScreen';
import FinalResultsScreen from '../screens/FinalResultsScreen';

export type RootStackParamList = {
  Registration: undefined;
  TestSelection: undefined;
  TestScreen: undefined;
  PassageResults: {
    attempt: any;
    passage: any;
  };
  AdminLogin: undefined;
  AdminDashboard: undefined;
  AddPassage: undefined;
  ManagePassages: undefined;
  FinalResults: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  try {
    const { currentUser } = useTestStore();

    console.log('AppNavigator rendering, currentUser:', currentUser);

    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!currentUser ? (
          <Stack.Screen name="Registration" component={RegistrationScreen} />
        ) : (
          <>
            <Stack.Screen name="TestSelection" component={TestSelectionScreen} />
            <Stack.Screen name="TestScreen" component={TestScreen} />
            <Stack.Screen name="PassageResults" component={PassageResultsScreen} />
            <Stack.Screen name="FinalResults" component={FinalResultsScreen} />
            <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="AddPassage" component={AddPassageScreen} />
          </>
        )}
      </Stack.Navigator>
    );
  } catch (error) {
    console.error('AppNavigator error:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Navigation Error</h1>
        <p>Please check the console for details.</p>
        <pre>{error?.toString()}</pre>
      </div>
    );
  }
}