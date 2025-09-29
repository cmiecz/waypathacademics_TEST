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
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f0f0',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1 style={{ color: '#d32f2f', marginBottom: '20px' }}>Navigation Error</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>Navigation failed to load. Check the console for details.</p>
        <pre style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          borderRadius: '4px', 
          border: '1px solid #ccc',
          textAlign: 'left',
          maxWidth: '600px',
          overflow: 'auto'
        }}>
          {error?.toString()}
        </pre>
      </div>
    );
  }
}