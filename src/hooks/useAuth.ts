import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  createNewSession, 
  initAuthentication, 
  verifyOTP, 
  getUserInfo
} from '../services/auth';
import { getIPAddress } from '../utils/apiClient';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  sessionToken: string | null;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: Boolean(false),
    isLoading: Boolean(true),
    user: null,
    sessionToken: null,
    error: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem('session_token');
      const userData = await AsyncStorage.getItem('user_data');

      if (sessionToken && userData) {
        setAuthState({
          isAuthenticated: Boolean(true),
          isLoading: Boolean(false),
          user: JSON.parse(userData),
          sessionToken,
          error: null,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: Boolean(false) }));
      }
    } catch (error) {
      console.error('Check session error:', error);
      setAuthState(prev => ({ ...prev, isLoading: Boolean(false) }));
    }
  };

  /**
   * Step 1: Request OTP
   */
  const requestOTP = async (email: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: Boolean(true), error: null }));

      // Get IP address
      const ipAddress = await getIPAddress();

      // Create new session
      const sessionData = await createNewSession();
      const sessionToken = sessionData.session_token;

      // Initialize authentication (request OTP)
      const authInitData = await initAuthentication(email, sessionToken);

      // Store session token temporarily
      await AsyncStorage.setItem('temp_session_token', sessionToken);
      await AsyncStorage.setItem('temp_email', email);

      setAuthState(prev => ({ 
        ...prev, 
        isLoading: Boolean(false),
        sessionToken,
      }));

      return true;
    } catch (error: any) {
      console.error('Request OTP error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: Boolean(false), 
        error: error.message || 'Failed to send OTP' 
      }));
      return false;
    }
  };

  /**
   * Step 2: Verify OTP and login
   */
  const verifyOTPAndLogin = async (otp: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: Boolean(true), error: null }));

      // Get stored session token and email
      const sessionToken = await AsyncStorage.getItem('temp_session_token');
      const email = await AsyncStorage.getItem('temp_email');

      if (!sessionToken || !email) {
        throw new Error('Session expired. Please request OTP again.');
      }

      // Verify OTP
      const authData = await verifyOTP(email, otp, sessionToken);
      const newSessionToken = authData.session_token;

      // Get user information
      const userData = await getUserInfo(newSessionToken);

      // Store authentication data
      await AsyncStorage.setItem('session_token', newSessionToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));

      // Clean up temporary data
      await AsyncStorage.removeItem('temp_session_token');
      await AsyncStorage.removeItem('temp_email');

      setAuthState({
        isAuthenticated: Boolean(true),
        isLoading: Boolean(false),
        user: userData,
        sessionToken: newSessionToken,
        error: null,
      });

      return true;
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: Boolean(false), 
        error: error.message || 'Invalid OTP' 
      }));
      return false;
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('session_token');
      await AsyncStorage.removeItem('user_data');
      await AsyncStorage.removeItem('temp_session_token');
      await AsyncStorage.removeItem('temp_email');

      setAuthState({
        isAuthenticated: Boolean(false),
        isLoading: Boolean(false),
        user: null,
        sessionToken: null,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Clear error
   */
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    requestOTP,
    verifyOTPAndLogin,
    logout,
    clearError,
  };
};

export default useAuth;
