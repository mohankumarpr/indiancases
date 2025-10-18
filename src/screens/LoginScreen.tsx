import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { useAuthContext } from '../context/AuthContext';
import { initAuthentication, verifyOTP, getUserInfo, createNewSession } from '../services/auth';
import { setSessionToken } from '../utils/apiClient';
import LogoSVG from '../components/LogoSVG';
import { useToastMessage } from '../hooks/useToastMessage';

const { width, height } = Dimensions.get('window');

// Responsive breakpoints
const isMobile = width < 768;
const isTablet = width >= 768 && width < 1024;
const isDesktop = width >= 1024;

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, sessionToken } = useAuthContext();
  const { showSuccess, showError, showWarning, showInfo } = useToastMessage();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginClick = async () => {
    if (!showLoginForm) {
      setShowLoginForm(true);
      return;
    }

    if (!showOTPForm) {
      // Request OTP
      await handleRequestOTP();
    } else {
      // Verify OTP
      await handleVerifyOTP();
    }
  };

  const handleRequestOTP = async () => {
    if (!email.trim()) {
      showError('Validation Error', 'Please enter your email or mobile number');
      return;
    }

    if (!agreeToTerms) {
      showError('Validation Error', 'Please agree to the Terms & Conditions');
      return;
    }

    if (!sessionToken) {
      showError('Session Error', 'Session not ready. Please wait and try again.');
      return;
    }

    setIsLoading(true);
    try {
      // Initialize authentication (request OTP)
      console.log('Requesting OTP with session token...');
      
      await initAuthentication(email, sessionToken);
      
      console.log('OTP sent successfully');

      // Show OTP form
      setShowOTPForm(true);
      showSuccess('OTP Sent', 'OTP has been sent to your email/mobile number');
    } catch (error: any) {
      console.error('Request OTP error:', error);
      
      // Handle specific error cases
      if (error?.response?.status === 404) {
        showError('User Not Found', 'This email/mobile number is not registered. Please contact support or try a different account.');
      } else if (error?.response?.status === 400) {
        showError('Invalid Request', 'Please check your email/mobile number format and try again.');
      } else if (error?.response?.status === 429) {
        showError('Too Many Requests', 'Please wait a few minutes before requesting another OTP.');
      } else if (error?.response?.status >= 500) {
        showError('Server Error', 'Our servers are temporarily unavailable. Please try again later.');
      } else if (error?.message?.includes('Network')) {
        showError('Connection Error', 'Please check your internet connection and try again.');
      } else {
        showError('OTP Failed', 'Failed to send OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length < 4) {
      showError('Validation Error', 'Please enter a valid OTP (4-6 characters)');
      return;
    }

    if (!sessionToken) {
      showError('Session Error', 'Session expired. Please try again.');
      setShowOTPForm(false);
      setShowLoginForm(false);
      return;
    }

    setIsLoading(true);
    try {
      // Verify OTP
      console.log('Verifying OTP...');
      
      const authResponse = await verifyOTP(email, otp, sessionToken);
      console.log('OTP verified successfully');
      
      // Check if we need to create a new session (API instruction)
      let finalSessionToken = authResponse.session_token;
      
      if (authResponse.instructions && authResponse.instructions.includes('Create a new session')) {
        console.log('Creating new session as instructed by API...');
        const sessionResponse = await createNewSession();
        finalSessionToken = sessionResponse.session_token;
        console.log('New session created, token:', finalSessionToken?.substring(0, 20) + '...');
      } else {
        console.log('No session creation instruction found, using existing token:', finalSessionToken?.substring(0, 20) + '...');
      }
      
      // Set the session token globally
      if (finalSessionToken) {
        setSessionToken(finalSessionToken);
        console.log('Session token set globally');
      }
      
      // Get user info
      console.log('Fetching user info...');
      const userInfo = await getUserInfo(finalSessionToken);
      console.log('User info retrieved:', userInfo);

      // Save to context
      await login(finalSessionToken, {
        id: userInfo.id || userInfo.email,
        email: userInfo.email,
        name: userInfo.name,
      });

      // Navigate to Search screen (shows database search form)
      navigation.navigate('Search', {});
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      
      // Handle specific error cases
      if (error?.response?.status === 400) {
        showError('Invalid OTP', 'The OTP you entered is incorrect. Please try again.');
      } else if (error?.response?.status === 401) {
        showError('Session Expired', 'Your session has expired. Please request a new OTP.');
        setShowOTPForm(false);
        setShowLoginForm(false);
      } else if (error?.response?.status === 404) {
        showError('User Not Found', 'User account not found. Please contact support.');
      } else if (error?.response?.status >= 500) {
        showError('Server Error', 'Our servers are temporarily unavailable. Please try again later.');
      } else if (error?.message?.includes('Network')) {
        showError('Connection Error', 'Please check your internet connection and try again.');
      } else {
        showError('Verification Failed', 'Failed to verify OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      
      {/* Background Pattern with Logo */}
      <View style={styles.backgroundPattern}>
        <View style={styles.backgroundLogoContainer}>
          <LogoSVG 
            width={isMobile ? 500 : isTablet ? 700 : 800} 
            height={isMobile ? 500 : isTablet ? 700 : 800} 
            color="#FFFFFF" 
          />
        </View>
      </View>
      
      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <LogoSVG 
            width={isMobile ? 70 : isTablet ? 90 : 100} 
            height={isMobile ? 70 : isTablet ? 90 : 100} 
            color="#FFFFFF" 
          />
        </View>

        {/* App Name */}
        <View style={styles.appNameContainer}>
          <Text style={styles.appNameText}>Indian Cases</Text>
        </View>

        {/* Welcome Text, Login Form, or OTP Form */}
        {!showLoginForm ? (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome to Indian cases!</Text>
            <Text style={styles.taglineText}>India's Largest Case Database</Text>
          </View>
        ) : !showOTPForm ? (
          <View style={styles.loginFormContainer}>
            <Text style={styles.loginTitle}>Login</Text>
            <Text style={styles.loginSubtitle}>Experience the future of legal AI</Text>
            
            {/* Email/Mobile Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your Email or Mobile number"
                placeholderTextColor="#AAAAAA"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => {}}
                onBlur={() => {}}
                selectionColor="#007AFF"
                underlineColorAndroid="transparent"
                autoCorrect={false}
                spellCheck={false}
              />
            </View>

            {/* Terms Checkbox */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity 
                style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
              >
                {agreeToTerms && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </TouchableOpacity>
              <Text style={styles.checkboxText}>I agree with Terms & Conditions</Text>
            </View>
          </View>
        ) : (
          <View style={styles.otpFormContainer}>
            <Text style={styles.otpTitle}>Enter OTP</Text>
            <Text style={styles.otpSubtitle}>Enter code sent to your email or mobile number</Text>
            
            {/* OTP Input */}
            <View style={styles.otpInputContainer}>
              <TextInput
                style={styles.otpInput}
                placeholder="ABC123"
                placeholderTextColor="#007AFF"
                value={otp}
                onChangeText={setOtp}
                keyboardType="default"
                maxLength={6}
                textAlign="center"
                autoCapitalize="characters"
                autoCorrect={false}
                spellCheck={false}
              />
            </View>
          </View>
        )}

        {/* Login Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLoginClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>
                {!showLoginForm ? 'Login' : !showOTPForm ? 'Get OTP' : 'Verify OTP'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Legal Disclaimer - Only show when not in login form */}
        {!showLoginForm && (
          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimerText}>
              By proceeding you agree to the{' '}
              <Text style={styles.linkText}>Terms of Service</Text>,{' '}
              <Text style={styles.linkText}>Privacy Policy</Text> and{' '}
              <Text style={styles.linkText}>Refund Policy</Text>
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    ...(Platform.OS === 'web' && isDesktop ? {
      flexDirection: 'row',
    } : {}),
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web' && isDesktop ? {
      right: '50%',
      left: 0,
    } : {}),
  },
  backgroundLogoContainer: {
    position: 'absolute',
    top: isMobile ? '-25%' : isTablet ? '-20%' : '-25%',
    left: isMobile ? '-30%' : isTablet ? '-20%' : '-25%',
    transform: [{ rotate: '45deg' }],
    opacity: 0.12,
  },
  contentContainer: {
    flex: 1,
    ...(Platform.OS === 'web' && isTablet ? {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    } : {}),
    ...(Platform.OS === 'web' && isDesktop ? {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 60,
    } : {}),
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: isMobile ? height * 0.12 : isTablet ? height * 0.1 : 0,
    marginBottom: isMobile ? 10 : isTablet ? 15 : 20,
  },
  appNameContainer: {
    alignItems: 'center',
    marginBottom: isMobile ? height * 0.12 : isTablet ? 45 : 60,
  },
  appNameText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontWeight: '800',
    letterSpacing: 2,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: isMobile ? height * 0.15 : isTablet ? 65 : 80,
    paddingHorizontal: isMobile ? 30 : isTablet ? 40 : 50,
  },
  welcomeText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 2,
  },
  taglineText: {
    fontSize: isMobile ? 12 : isTablet ? 14 : 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: isMobile ? 18 : isTablet ? 22 : 28,
    letterSpacing: 2,
  },
  buttonContainer: {
    paddingHorizontal: isMobile ? 30 : isTablet ? 40 : 50,
    marginBottom: isMobile ? 20 : isTablet ? 40 : 50,
    ...(Platform.OS === 'web' && (isTablet || isDesktop) ? {
      width: isTablet ? 280 : 300,
      alignSelf: 'center',
    } : {}),
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: isDesktop ? 8 : 12,
    paddingHorizontal: isDesktop ? 24 : 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: isDesktop ? 40 : 48,
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0px 4px 12px rgba(0, 122, 255, 0.3)' }
      : {
          elevation: 8,
          shadowColor: '#007AFF',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }
    ),
  },
  loginButtonDisabled: {
    backgroundColor: '#0056b3',
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  disclaimerContainer: {
    position: Platform.OS === 'web' && width >= 768 ? 'relative' : 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 25,
    left: 30,
    right: 30,
    alignItems: 'center',
    ...(Platform.OS === 'web' && width >= 768 ? {
      position: 'relative',
      bottom: 'auto',
      left: 'auto',
      right: 'auto',
      marginTop: 40,
    } : {}),
  },
  disclaimerText: {
    color: '#AAAAAA',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  loginFormContainer: {
    alignItems: 'center',
    marginBottom: isMobile ? 50 : isTablet ? 65 : 80,
    paddingHorizontal: isMobile ? 30 : isTablet ? 40 : 50,
  },
  loginTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: isMobile ? 12 : isTablet ? 14 : 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: isMobile ? 18 : isTablet ? 22 : 28,
    letterSpacing: 2,
    marginBottom: isMobile ? 30 : isTablet ? 35 : 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 0,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: isMobile ? 15 : 20,
    width: '100%',
    maxWidth: isMobile ? 350 : isTablet ? 380 : 400,
    minHeight: isMobile ? 50 : 56,
    borderWidth: 0,
    borderColor: 'transparent',
    ...(Platform.OS === 'web' ? {
      outline: 'none',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      border: 'none',
      '&:focus-within': {
        outline: 'none',
        border: 'none',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    } : {}),
  },
  textInput: {
    flex: 1,
    fontSize: isMobile ? 14 : 16,
    color: '#000000',
    padding: 8,
    paddingVertical: 4,
    borderWidth: 0,
    borderColor: 'transparent',
    outline: 'none',
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' ? {
      outline: 'none !important',
      border: 'none !important',
      boxShadow: 'none !important',
      borderColor: 'transparent !important',
      '&:focus': {
        outline: 'none !important',
        border: 'none !important',
        boxShadow: 'none !important',
        borderColor: 'transparent !important',
      },
      '&:active': {
        outline: 'none !important',
        border: 'none !important',
        boxShadow: 'none !important',
        borderColor: 'transparent !important',
      },
    } : {}),
  },
  inputIcon: {
    padding: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isMobile ? 15 : 20,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 3,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkboxText: {
    color: '#FFFFFF',
    fontSize: isMobile ? 11 : 12,
    flex: 1,
  },
  otpFormContainer: {
    alignItems: 'center',
    marginBottom: isMobile ? 50 : isTablet ? 65 : 80,
    paddingHorizontal: isMobile ? 30 : isTablet ? 40 : 50,
  },
  otpTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: 'center',
  },
  otpSubtitle: {
    fontSize: isMobile ? 12 : isTablet ? 14 : 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: isMobile ? 18 : isTablet ? 22 : 28,
    letterSpacing: 2,
    marginBottom: isMobile ? 30 : isTablet ? 35 : 40,
  },
  otpInputContainer: {
    width: '100%',
    maxWidth: isMobile ? 350 : isTablet ? 380 : 400,
    alignItems: 'center',
  },
  otpInput: {
    fontSize: isMobile ? 24 : 28,
    color: '#007AFF',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    paddingVertical: isMobile ? 12 : 16,
    paddingHorizontal: 20,
    width: '100%',
    backgroundColor: 'transparent',
  },
});

export default LoginScreen;
