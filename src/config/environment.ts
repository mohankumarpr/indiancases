// Environment Configuration
// This file manages environment variables and API configuration

/**
 * Get API Base URL from environment variable or use default
 * 
 * To set up environment variables:
 * 1. Create a .env file in the root directory
 * 2. Add: EXPO_PUBLIC_API_URL=https://your-api-domain.com
 * 3. The app will automatically use it
 */
export const getApiBaseUrl = (): string => {
  // Try to get from environment variable
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  
  console.log('📍 EXPO_PUBLIC_API_URL from .env:', envUrl);
  
  if (envUrl) {
    console.log('✅ Using API URL from .env:', envUrl);
    return envUrl;
  }
  
  // Fallback to production API URL with CORS proxy for development
  const fallbackUrl = 'https://cors-anywhere.herokuapp.com/https://prod-apse-la01.whiteband.ai';
  console.log('⚠️ No .env API_URL found, using fallback:', fallbackUrl);
  return fallbackUrl;
};

/**
 * Environment variables
 */
export const ENV = {
  API_URL: getApiBaseUrl(),
  ENV_NAME: process.env.EXPO_PUBLIC_ENV || 'development',
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'IndianCases Research',
  APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
  IS_DEV: Boolean(process.env.EXPO_PUBLIC_ENV === 'development'),
  IS_PROD: Boolean(process.env.EXPO_PUBLIC_ENV === 'production'),
};

export default ENV;
