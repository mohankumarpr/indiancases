import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApiClient, setSessionToken as setGlobalSessionToken } from '../utils/apiClient';
import { getDeviceToken } from '../utils/deviceToken';
import { createNewSession } from '../services/auth';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  sessionToken: string | null;
  deviceToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (sessionToken: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  initializeDevice: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('🚀 Starting app initialization...');
      
      // Step 1: Initialize device token and API client first
      await initializeDevice();
      
      // Step 2: Create or restore session token (this will fetch IP info and call /v1/auth/session/new)
      await initializeSession();
      
      // Step 3: Check for existing user authentication
      await checkExistingAuth();
      
      console.log('✅ App initialization complete');
    } catch (error) {
      console.error('App initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeDevice = async () => {
    try {
      console.log('📱 Step 1: Initializing device...');
      
      // Initialize API client with device token (UUID)
      await initializeApiClient();
      
      // Get and store device token (UUID)
      const token = await getDeviceToken();
      setDeviceToken(token);
      
      console.log('✅ Device initialized with UUID:', token);
    } catch (error) {
      console.error('Device initialization error:', error);
      throw error;
    }
  };

  const initializeSession = async () => {
    try {
      console.log('🔐 Step 2: Initializing session...');
      
      // Check if we have an existing session token
      const storedSessionToken = await AsyncStorage.getItem('app_session_token');
      
      if (storedSessionToken) {
        setSessionToken(storedSessionToken);
        setGlobalSessionToken(storedSessionToken);
        console.log('✅ Existing session token restored:', storedSessionToken.substring(0, 20) + '...');
      } else {
        // Create a new session (will call /v1/auth/session/new)
        console.log('🆕 No existing session, creating new one...');
        await refreshSession();
      }
    } catch (error) {
      console.error('❌ Session initialization error:', error);
      // Try to create a new session as fallback
      try {
        console.log('🔄 Retrying session creation...');
        await refreshSession();
      } catch (retryError) {
        console.error('❌ Failed to create session on retry:', retryError);
      }
    }
  };

  const refreshSession = async () => {
    try {
      console.log('🔄 Creating new session...');
      
      const response = await createNewSession();
      if (response.session_token) {
        await AsyncStorage.setItem('app_session_token', response.session_token);
        setSessionToken(response.session_token);
        setGlobalSessionToken(response.session_token);
        console.log('✅ New session created and saved:', response.session_token.substring(0, 20) + '...');
      }
    } catch (error) {
      console.error('❌ Failed to create session:', error);
      throw error;
    }
  };

  const checkExistingAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user_data');

      if (storedUser) {
        setUser(JSON.parse(storedUser));
        console.log('Existing user authentication restored');
      }
    } catch (error) {
      console.error('Check auth error:', error);
    }
  };

  const login = async (token: string, userData: User) => {
    try {
      // Store user data
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      setUser(userData);
      
      // Update session token if provided (from auth flow)
      if (token && token !== sessionToken) {
        await AsyncStorage.setItem('app_session_token', token);
        setSessionToken(token);
        setGlobalSessionToken(token);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Remove user data but keep session token for app-level requests
      await AsyncStorage.removeItem('user_data');
      setUser(null);
      
      // Optionally refresh session token on logout
      await refreshSession();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    sessionToken,
    deviceToken,
    isAuthenticated: !!sessionToken && !!user,
    isLoading,
    login,
    logout,
    initializeDevice,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
