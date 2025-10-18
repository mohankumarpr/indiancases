// Authentication Service
// Based on bc02-api authentication flow

import API_CONFIG from '../config/api';
import { apiPost, apiGet, getIPInfo, getIPAddress } from '../utils/apiClient';

interface SessionResponse {
  session_token: string;
}

interface AuthInitResponse {
  session_token: string;
  message?: string;
}

interface AuthenticateResponse {
  session_token: string;
  user?: any;
  instructions?: string[];
}

interface UserInfo {
  id: string;
  email: string;
  name?: string;
  [key: string]: any;
}

/**
 * Step 1: Create a new session
 * POST /v1/auth/session/new
 */
export const createNewSession = async (): Promise<SessionResponse> => {
  try {
    console.log('📞 Step 3: Creating new session with /v1/auth/session/new...');
    
    // Get IP info (already fetched and cached during initialization)
    const ipInfo = await getIPInfo();
    console.log('📊 Using IP Info:', ipInfo ? 'Available' : 'Not available');
    
    // Extract IP address from ipInfo.io response
    let ipAddress = 'unknown';
    if (ipInfo?.ip) {
      ipAddress = ipInfo.ip;
      console.log('📍 Using IP Address from ipinfo.io:', ipAddress);
    } else {
      // Fallback to ipify.org if ipinfo.io doesn't have IP
      ipAddress = await getIPAddress();
      console.log('📍 Using IP Address from ipify.org (fallback):', ipAddress);
    }
    
    // Remove ip from ipInfo object as per the API structure (don't include it in ip_info)
    const ipInfoData = ipInfo ? { ...ipInfo } : null;
    if (ipInfoData?.ip) {
      delete ipInfoData.ip;
    }
    
    const payload = {
      ip_address: ipAddress,
      ip_info: ipInfoData,
    };
    
    console.log('📤 Session API payload:', JSON.stringify(payload, null, 2));
    console.log('📋 Headers will include: DeviceToken (UUID), CF-Connecting-IP, SessionToken');
    
    const data = await apiPost<SessionResponse>(
      API_CONFIG.ENDPOINTS.SESSION_NEW,
      payload
    );
    
    console.log('✅ Session created successfully with token:', data.session_token);
    return data;
  } catch (error) {
    console.error('❌ Create session error:', error);
    throw error;
  }
};

/**
 * Step 2: Initialize authentication (Request OTP)
 * POST /v1/auth/device/authenticate/init
 */
export const initAuthentication = async (
  email: string,
  sessionToken?: string | null
): Promise<AuthInitResponse> => {
  try {
    const data = await apiPost<AuthInitResponse>(
      API_CONFIG.ENDPOINTS.AUTH_INIT,
      { iden: email },
      sessionToken
    );
    
    console.log('Authentication initialized successfully');
    return data;
  } catch (error) {
    console.error('Init authentication error:', error);
    throw error;
  }
};

/**
 * Step 3: Verify OTP and complete authentication
 * POST /v1/auth/device/authenticate
 */
export const verifyOTP = async (
  email: string,
  otp: string,
  sessionToken?: string | null
): Promise<AuthenticateResponse> => {
  try {
    const data = await apiPost<AuthenticateResponse>(
      API_CONFIG.ENDPOINTS.AUTH_VERIFY,
      {
        iden: email,
        token: otp,
      },
      sessionToken
    );
    
    console.log('OTP verified successfully');
    return data;
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw error;
  }
};

/**
 * Get user information
 * GET /v1/auth/device/me
 */
export const getUserInfo = async (sessionToken: string): Promise<UserInfo> => {
  try {
    const data = await apiGet<UserInfo>(
      API_CONFIG.ENDPOINTS.AUTH_ME,
      sessionToken
    );
    
    console.log('User info retrieved successfully');
    return data;
  } catch (error) {
    console.error('Get user info error:', error);
    throw error;
  }
};
