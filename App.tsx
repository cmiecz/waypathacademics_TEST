import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./src/navigation/AppNavigator";

/*
IMPORTANT NOTICE: DO NOT REMOVE
There are already environment keys in the project. 
Before telling the user to add them, check if you already have access to the required keys through bash.
Directly access them with process.env.${key}

Correct usage:
process.env.EXPO_PUBLIC_VIBECODE_{key}
//directly access the key

Incorrect usage:
import { OPENAI_API_KEY } from '@env';
//don't use @env, its depreicated

Incorrect usage:
import Constants from 'expo-constants';
const openai_api_key = Constants.expoConfig.extra.apikey;
//don't use expo-constants, its depreicated

*/

export default function App() {
  console.log('App component rendering...');

  // Simple test component to isolate the issue
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
      <h1 style={{ color: '#333', marginBottom: '20px' }}>ACT Test Prep</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>App is loading successfully!</p>
      <button 
        style={{
          padding: '10px 20px',
          backgroundColor: '#007AFF',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Button works!')}
      >
        Test Button
      </button>
    </div>
  );
}
