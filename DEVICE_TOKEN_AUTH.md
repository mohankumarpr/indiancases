# Device Token & Authentication Implementation

## Overview

This document describes the complete authentication implementation for the Indian Cases application, including device token management and the authentication flow based on the bc02-api specification.

## Architecture

### Key Components

1. **Device Token Management** (`src/utils/deviceToken.ts`)
   - Generates and persists a unique UUID for device identification
   - Token is stored in AsyncStorage and reused across app sessions
   - Generated once on first app launch

2. **API Client** (`src/utils/apiClient.ts`)
   - Centralized API request handler
   - Automatically includes required headers for all API calls:
     - `DeviceToken`: UUID for device identification
     - `SessionToken`: User session token (after authentication)
     - `CF-Connecting-IP`: User's IP address
     - `Content-Type`: application/json

3. **Authentication Service** (`src/services/auth.ts`)
   - Implements the complete authentication flow
   - Functions for session creation, OTP request, and verification
   - Uses the API client for all requests

4. **Auth Context** (`src/context/AuthContext.tsx`)
   - React context for managing authentication state
   - Initializes device token on app load
   - Manages user session and authentication status

## Authentication Flow

### 1. App Initialization
```
App Load → AuthProvider → initializeDevice()
  ↓
Generate/Load Device Token (UUID)
  ↓
Initialize API Client with Device Token
  ↓
Cache IP Address
```

### 2. User Login Flow

#### Step 1: Create New Session
```javascript
POST /v1/auth/session/new
Headers:
  - DeviceToken: <uuid>
  - CF-Connecting-IP: <ip-address>
Body:
  {
    "ip_address": "xxx.xxx.xxx.xxx",
    "ip_info": { /* ipinfo.io data */ }
  }
Response:
  {
    "session_token": "token-string"
  }
```

#### Step 2: Request OTP
```javascript
POST /v1/auth/device/authenticate/init
Headers:
  - DeviceToken: <uuid>
  - SessionToken: <session-token>
  - CF-Connecting-IP: <ip-address>
Body:
  {
    "iden": "user@example.com"
  }
Response:
  {
    "session_token": "token-string",
    "message": "OTP sent"
  }
```

#### Step 3: Verify OTP
```javascript
POST /v1/auth/device/authenticate
Headers:
  - DeviceToken: <uuid>
  - SessionToken: <session-token>
  - CF-Connecting-IP: <ip-address>
Body:
  {
    "iden": "user@example.com",
    "token": "1234"
  }
Response:
  {
    "session_token": "new-token-string",
    "user": { /* user data */ }
  }
```

#### Step 4: Get User Info
```javascript
GET /v1/auth/device/me
Headers:
  - DeviceToken: <uuid>
  - SessionToken: <session-token>
  - CF-Connecting-IP: <ip-address>
Response:
  {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    ...
  }
```

## Configuration

### Base URL

The API base URL is configured in `src/config/environment.ts`:

```typescript
export const getApiBaseUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  
  if (envUrl) {
    return envUrl;
  }
  
  // Fallback to production API URL
  return 'https://prod-apse-la01.whiteband.ai';
};
```

### Environment Variables

Create a `.env` file in the project root:

```env
# API Configuration
EXPO_PUBLIC_API_URL=https://prod-apse-la01.whiteband.ai

# Environment
EXPO_PUBLIC_ENV=production

# App Configuration
EXPO_PUBLIC_APP_NAME=IndianCases Research
EXPO_PUBLIC_APP_VERSION=1.0.0
```

## Usage Examples

### Making Authenticated API Calls

After implementing the authentication flow, all API calls automatically include the required headers:

```typescript
import { apiGet, apiPost } from '../utils/apiClient';
import { useAuthContext } from '../context/AuthContext';

// In your component
const { sessionToken } = useAuthContext();

// GET request with authentication
const data = await apiGet('/v1/cases/search', sessionToken);

// POST request with authentication
const result = await apiPost(
  '/v1/cases/search',
  { query: 'constitutional law' },
  sessionToken
);
```

### Accessing Device Token

```typescript
import { getDeviceToken } from '../utils/deviceToken';

// Get the current device token
const deviceToken = await getDeviceToken();
console.log('Device Token:', deviceToken);
```

### Using Auth Context

```typescript
import { useAuthContext } from '../context/AuthContext';

function MyComponent() {
  const {
    user,
    sessionToken,
    deviceToken,
    isAuthenticated,
    isLoading,
    login,
    logout
  } = useAuthContext();
  
  // Your component logic
}
```

## Key Features

1. **Automatic Device Token Generation**
   - UUID is generated on first app launch
   - Stored persistently in AsyncStorage
   - Automatically included in all API requests

2. **Centralized API Client**
   - Single point for all API requests
   - Consistent header management
   - Error handling and logging

3. **Session Management**
   - Session tokens stored securely
   - Automatic session restoration on app restart
   - Clean logout functionality

4. **IP Address Handling**
   - Automatic IP detection using ipify.org
   - IP info enrichment from ipinfo.io
   - Cached for performance

## Security Considerations

1. **Device Token**
   - Unique per device/installation
   - Persists across app sessions
   - Can be cleared during logout or reinstall

2. **Session Token**
   - Stored securely in AsyncStorage
   - Included in all authenticated requests
   - Updated after successful OTP verification

3. **Headers**
   - All API requests include DeviceToken
   - SessionToken only included when available
   - IP address included for security tracking

## Testing

### Test the Authentication Flow

1. **Start the app** - Device token should be generated automatically
2. **Open Login Screen** - Enter email/mobile number
3. **Request OTP** - Check console for session creation and OTP request logs
4. **Verify OTP** - Enter OTP code to complete authentication
5. **Check Auth State** - User should be logged in and redirected to Home

### Console Logs

The implementation includes comprehensive logging:
- Device token generation
- API request/response logging
- Authentication flow steps
- Error messages

Look for logs like:
```
Device initialized with token: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
API Request: POST https://prod-apse-la01.whiteband.ai/v1/auth/session/new
Session created successfully
OTP sent successfully
OTP verified successfully
User info retrieved successfully
```

## Troubleshooting

### Device Token Not Generated
- Check AsyncStorage permissions
- Verify app has storage access
- Clear app data and reinstall

### API Calls Failing
- Verify base URL is correct
- Check network connectivity
- Verify device token is being sent in headers
- Check API server logs

### Session Not Persisting
- Verify AsyncStorage is working
- Check if logout was called
- Verify session token is being saved

## File Structure

```
src/
├── utils/
│   ├── deviceToken.ts       # Device token management
│   └── apiClient.ts         # Centralized API client
├── services/
│   └── auth.ts              # Authentication service
├── context/
│   └── AuthContext.tsx      # Authentication context
├── config/
│   ├── environment.ts       # Environment configuration
│   └── api.ts              # API endpoints configuration
└── screens/
    └── LoginScreen.tsx      # Login UI implementation
```

## API Endpoints

All endpoints are defined in `src/config/api.ts`:

```typescript
ENDPOINTS: {
  SESSION_NEW: '/v1/auth/session/new',
  AUTH_INIT: '/v1/auth/device/authenticate/init',
  AUTH_VERIFY: '/v1/auth/device/authenticate',
  AUTH_ME: '/v1/auth/device/me',
  // Add more endpoints as needed
}
```

## Next Steps

1. **Implement Other API Calls**
   - Use the API client for all backend requests
   - Automatically includes DeviceToken and SessionToken

2. **Add Token Refresh Logic**
   - Implement automatic token refresh when expired
   - Handle token expiration gracefully

3. **Enhance Error Handling**
   - Add retry logic for failed requests
   - Better user feedback for errors

4. **Add Biometric Authentication**
   - Store session securely with biometric protection
   - Quick login with fingerprint/face recognition

## References

- Bruno API Collection: `bc02-api/`
- Environment Setup: `ENV_SETUP.md`
- Authentication Implementation: `AUTH_IMPLEMENTATION.md`

