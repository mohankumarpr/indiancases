// API Client
// Handles all API requests with proper headers (DeviceToken, SessionToken, CF-Connecting-IP)

import API_CONFIG from '../config/api';
import { getDeviceToken } from './deviceToken';
import { createNewSession } from '../services/auth';

let cachedDeviceToken: string | null = null;
let cachedIpAddress: string | null = null;
let cachedSessionToken: string | null = null;
let cachedIpInfo: any = null;

/**
 * Set the global session token
 */
export const setSessionToken = (token: string | null): void => {
  cachedSessionToken = token;
  console.log('Global session token updated:', token ? `SET (${token.substring(0, 20)}...)` : 'CLEARED');
};

/**
 * Get the cached session token
 */
export const getSessionToken = (): string | null => {
  return cachedSessionToken;
};

/**
 * Get IP address (cached)
 */
export const getIPAddress = async (): Promise<string> => {
  if (cachedIpAddress) {
    return cachedIpAddress;
  }
  
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    cachedIpAddress = data.ip;
    return data.ip;
  } catch (error) {
    console.error('Get IP address error:', error);
    return 'unknown';
  }
};

/**
 * Get IP info from ipinfo.io (optional, falls back gracefully)
 * According to https://ipinfo.io, they provide free IP geolocation data
 */
export const getIPInfo = async (): Promise<any> => {
  // Return cached IP info if available
  if (cachedIpInfo) {
    console.log('📦 Using cached IP info');
    return cachedIpInfo;
  }

  try {
    console.log('🌍 Fetching IP info from ipinfo.io...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏱️ ipinfo.io request timeout after 5 seconds');
      controller.abort();
    }, 5000); // 5 second timeout
    
    const response = await fetch('https://ipinfo.io/json', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    
    console.log('📡 ipinfo.io response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ ipinfo.io data received:', JSON.stringify(data));
    
    // Cache the IP info
    cachedIpInfo = data;
    
    // Store in AsyncStorage for persistence
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('ip_info', JSON.stringify(data));
      console.log('💾 IP info stored in AsyncStorage');
    } catch (storageError) {
      console.warn('Could not store IP info:', storageError);
    }
    
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'unknown error';
    console.warn('⚠️ IP info not available (blocked or timeout):', errorMessage);
    
    // Try to load from storage as fallback
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const stored = await AsyncStorage.getItem('ip_info');
      if (stored) {
        const parsedData = JSON.parse(stored);
        cachedIpInfo = parsedData;
        console.log('📦 Loaded IP info from storage (fallback)');
        return parsedData;
      }
    } catch (storageError) {
      console.warn('Could not load IP info from storage:', storageError);
    }
    
    return null; // Graceful fallback
  }
};

/**
 * Get cached IP info (if available)
 */
export const getCachedIpInfo = (): any => {
  return cachedIpInfo;
};

/**
 * Initialize the API client (should be called on app start)
 * This generates UUID and fetches IP information
 */
export const initializeApiClient = async (): Promise<void> => {
  console.log('🔧 Initializing API Client...');
  
  // Step 1: Generate/Get UUID (DeviceToken)
  cachedDeviceToken = await getDeviceToken();
  console.log('🆔 UUID (DeviceToken) ready:', cachedDeviceToken);
  
  // Step 2: Get IP Address
  cachedIpAddress = await getIPAddress();
  console.log('🌐 IP Address obtained:', cachedIpAddress);
  
  // Step 3: Fetch IP Info from ipinfo.io and store it
  const ipInfo = await getIPInfo();
  if (ipInfo) {
    console.log('✅ IP Info fetched and stored successfully');
  } else {
    console.log('⚠️ IP Info not available, will proceed without it');
  }
  
  console.log('✅ API Client initialized successfully');
};

/**
 * Get the cached device token
 */
export const getCachedDeviceToken = (): string | null => {
  return cachedDeviceToken;
};

/**
 * Build headers for API requests
 */
const buildHeaders = async (
  additionalHeaders: HeadersInit = {},
  sessionToken?: string | null
): Promise<Record<string, string>> => {
  const deviceToken = cachedDeviceToken || await getDeviceToken();
  const ipAddress = cachedIpAddress || await getIPAddress();
  
  console.log('Building headers with DeviceToken (UUID):', deviceToken);
  console.log('Building headers with IP:', ipAddress);
  
  // Use provided sessionToken, or fall back to global cached sessionToken
  const tokenToUse = sessionToken !== undefined ? sessionToken : cachedSessionToken;
  console.log('Using session token:', tokenToUse ? `Provided: ${tokenToUse.substring(0, 20)}...` : `Global: ${cachedSessionToken ? cachedSessionToken.substring(0, 20) + '...' : 'None'}`);
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'DeviceToken': deviceToken,
    //'CF-Connecting-IP': ipAddress,
    'SessionToken': tokenToUse || '',  // Always include SessionToken, even if empty
    ...(additionalHeaders as Record<string, string>),
  };
  
  if (tokenToUse) {
    console.log('Adding SessionToken to headers:', tokenToUse.substring(0, 20) + '...');
  } else {
    console.log('Adding empty SessionToken to headers');
  }
  
  console.log('Final headers:', JSON.stringify(headers));
  
  return headers;
};

interface ApiRequestOptions {
  method?: string;
  body?: any;
  sessionToken?: string | null;
  headers?: HeadersInit;
}

/**
 * Make an API request with proper headers
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const {
    method = 'GET',
    body,
    sessionToken,
    headers: additionalHeaders = {},
  } = options;
  
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_CONFIG.BASE_URL}${endpoint}`;
  
  console.log('🌐 API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
  console.log('🔗 Endpoint:', endpoint);
  console.log('🔗 Full URL:', url);
  
  const headers = await buildHeaders(additionalHeaders, sessionToken);
  
  const requestOptions: RequestInit = {
    method,
    headers,
  };
  
  if (body && method !== 'GET') {
    requestOptions.body = JSON.stringify(body);
  }
  
  try {
    console.log(`API Request: ${method} ${url}`);
    console.log('Request headers:', headers);
    
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} ${response.statusText}`, errorText);
      
      // Handle session token refresh for 401 errors
      if (response.status === 401) {
        console.log('🔄 Received 401 error, checking if session token needs refresh...');
        console.log('🔄 Error text:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          console.log('🔄 Parsed error data:', errorData);
          if (errorData.message === 'SessionToken too old') {
            console.log('🔄 Session token is too old, refreshing...');
            
            // Create a new session
            console.log('🔄 Creating new session...');
            const sessionResponse = await createNewSession();
            const newSessionToken = sessionResponse.session_token;
            console.log('🔄 New session created:', newSessionToken.substring(0, 20) + '...');
            
            // Update the global session token
            setSessionToken(newSessionToken);
            console.log('✅ New session token set:', newSessionToken.substring(0, 20) + '...');
            
            // Retry the original request with the new session token
            console.log('🔄 Retrying API request with new session token...');
            console.log('🔄 Original URL:', url);
            console.log('🔄 Original method:', method);
            const retryHeaders = await buildHeaders(additionalHeaders, newSessionToken);
            
            const retryRequestOptions: RequestInit = {
              method,
              headers: retryHeaders,
            };
            
            if (body && method !== 'GET') {
              retryRequestOptions.body = JSON.stringify(body);
            }
            
            console.log('🔄 Making retry request with headers:', retryHeaders);
            const retryResponse = await fetch(url, retryRequestOptions);
            console.log('🔄 Retry response status:', retryResponse.status);
            
            if (!retryResponse.ok) {
              const retryErrorText = await retryResponse.text();
              console.error(`Retry API Error: ${retryResponse.status} ${retryResponse.statusText}`, retryErrorText);
              const retryError = new Error(`API request failed: ${retryResponse.status} ${retryResponse.statusText}`);
              (retryError as any).response = {
                status: retryResponse.status,
                statusText: retryResponse.statusText,
                data: retryErrorText
              };
              throw retryError;
            }
            
            const retryData = await retryResponse.json();
            console.log('✅ Retry API Response:', retryData);
            return retryData;
          }
        } catch (refreshError) {
          console.error('❌ Failed to refresh session token:', refreshError);
        }
      }
      
      // Create a more detailed error object
      const error = new Error(`API request failed: ${response.status} ${response.statusText}`);
      (error as any).response = {
        status: response.status,
        statusText: response.statusText,
        data: errorText
      };
      throw error;
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('API request error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection and try again.');
    }
    throw error;
  }
};

/**
 * GET request
 */
export const apiGet = async <T = any>(
  endpoint: string,
  sessionToken?: string | null
): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'GET', sessionToken });
};

/**
 * POST request
 */
export const apiPost = async <T = any>(
  endpoint: string,
  body?: any,
  sessionToken?: string | null
): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'POST', body, sessionToken });
};

/**
 * PUT request
 */
export const apiPut = async <T = any>(
  endpoint: string,
  body?: any,
  sessionToken?: string | null
): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'PUT', body, sessionToken });
};

/**
 * DELETE request
 */
export const apiDelete = async <T = any>(
  endpoint: string,
  sessionToken?: string | null
): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'DELETE', sessionToken });
};

