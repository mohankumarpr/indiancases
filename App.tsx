import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Platform, Dimensions } from 'react-native';

// Import context
import { AuthProvider } from './src/context/AuthContext';
import { ToastProvider } from './src/context/ToastContext';

// Import components
import AnimatedSplash from './src/components/AnimatedSplash';
import ToastContainer from './src/components/ToastContainer';

// Import services
import { initializeJudgmentService } from './src/services/judgmentService';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import CaseDetailScreen from './src/screens/CaseDetailScreen';
import JudgmentScreen from './src/screens/JudgmentScreen';
import CitationScreen from './src/screens/CitationScreen';
import JournalDetailScreen from './src/screens/JournalDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();

const { width } = Dimensions.get('window');

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Initialize services when app starts
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Initialize judgment service (libsodium)
        await initializeJudgmentService();
        console.log('✅ All services initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize services:', error);
        // Don't block the app if service initialization fails
      }
    };

    initializeServices();
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <AnimatedSplash onAnimationComplete={handleSplashComplete} />;
  }

  return (
    <ToastProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#1976d2',
                ...(width >= 768 && Platform.OS === 'web' ? {
                  boxShadow: 'none',
                } : {}),
              },
              headerTintColor: '#ffffff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ 
                headerShown: false,
                cardStyle: { flex: 1 }
              }} 
            />
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ 
                headerShown: false,
                cardStyle: { flex: 1 }
              }} 
            />
            <Stack.Screen 
              name="Search" 
              component={SearchScreen} 
              options={{ 
                title: 'Search Cases',
                headerShown: false,
                cardStyle: { flex: 1 }
              }} 
            />
            <Stack.Screen 
              name="CaseDetail" 
              component={CaseDetailScreen} 
              options={{ 
                title: 'Case Details',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="Judgment" 
              component={JudgmentScreen} 
              options={{ 
                title: 'Judgment',
                headerShown: false,
                cardStyle: { flex: 1 }
              }} 
            />
            <Stack.Screen 
              name="Citation" 
              component={CitationScreen} 
              options={{ 
                title: 'Citation',
                headerShown: false,
                cardStyle: { flex: 1 }
              }} 
            />
            <Stack.Screen 
              name="JournalDetail" 
              component={JournalDetailScreen} 
              options={{ 
                title: 'Journal Detail',
                headerShown: false,
                cardStyle: { flex: 1 }
              }} 
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen} 
              options={{ 
                title: 'Profile',
                headerShown: false 
              }} 
            />
            </Stack.Navigator>
            <ToastContainer />
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthProvider>
    </ToastProvider>
  );
}