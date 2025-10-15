// Device Token Management
// Generates and persists a UUID for device identification

import AsyncStorage from '@react-native-async-storage/async-storage';
import { v7 as uuidv7 } from 'uuid';

const DEVICE_TOKEN_KEY = 'device_token';

/**
 * Generates a UUID v7 (timestamp-based)
 */
export const generateUUID = (): string => {
  return uuidv7();
};

/**
 * Check if a UUID is version 7
 */
const isUUIDv7 = (uuid: string): boolean => {
  // UUID v7 has '7' as the first character of the third group
  // Format: xxxxxxxx-xxxx-7xxx-xxxx-xxxxxxxxxxxx
  const parts = uuid.split('-');
  if (parts.length !== 5) return false;
  return parts[2].charAt(0) === '7';
};

/**
 * Get the device token from storage, or generate a new one if it doesn't exist
 * Automatically migrates UUID v4 to UUID v7
 */
export const getDeviceToken = async (): Promise<string> => {
  try {
    let deviceToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY);
    
    if (!deviceToken) {
      // No token exists, generate new UUID v7
      deviceToken = generateUUID();
      await AsyncStorage.setItem(DEVICE_TOKEN_KEY, deviceToken);
      console.log('✨ Generated new UUID v7:', deviceToken);
    } else if (!isUUIDv7(deviceToken)) {
      // Old UUID v4 detected, upgrade to v7
      console.log('🔄 Detected old UUID v4:', deviceToken);
      deviceToken = generateUUID();
      await AsyncStorage.setItem(DEVICE_TOKEN_KEY, deviceToken);
      console.log('✅ Upgraded to UUID v7:', deviceToken);
    } else {
      // Valid UUID v7 exists
      console.log('✅ Using existing UUID v7:', deviceToken);
    }
    
    return deviceToken;
  } catch (error) {
    console.error('Error getting device token:', error);
    // Fallback to generating a temporary token
    return generateUUID();
  }
};

/**
 * Clear the device token (useful for testing or logout)
 */
export const clearDeviceToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(DEVICE_TOKEN_KEY);
    console.log('Device token cleared');
  } catch (error) {
    console.error('Error clearing device token:', error);
  }
};

/**
 * Set a specific device token (useful for testing)
 */
export const setDeviceToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(DEVICE_TOKEN_KEY, token);
    console.log('Device token set:', token);
  } catch (error) {
    console.error('Error setting device token:', error);
  }
};

