// API Configuration
// Update these values with your actual API endpoints

import { getApiBaseUrl } from './environment';

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    // Auth endpoints
    SESSION_NEW: '/v1/auth/session/new',
    AUTH_INIT: '/v1/auth/device/authenticate/init',
    AUTH_VERIFY: '/v1/auth/device/authenticate',
    AUTH_ME: '/v1/auth/device/me',
    
    // Other endpoints
    SEARCH_CASES: '/v1/cases/search',
    GET_CASE: '/v1/cases/:id',
    GET_JUDGMENT: '/v1/judgment/:id',
  },
  
  // Timeouts
  REQUEST_TIMEOUT: 30000, // 30 seconds
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

export default API_CONFIG;
