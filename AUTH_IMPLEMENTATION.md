# Authentication Implementation Guide

## Overview
This document explains the authentication flow implemented based on the bc02-api authentication service.

## Authentication Flow

### Step 1: Create Session
**Endpoint:** `POST /v1/auth/session/new`

**Request:**
```json
{
  "ip_address": "user_ip_address",
  "ip_info": null
}
```

**Response:**
```json
{
  "session_token": "session_token_string"
}
```

### Step 2: Initialize Authentication (Request OTP)
**Endpoint:** `POST /v1/auth/device/authenticate/init`

**Headers:**
```
Authorization: Bearer {session_token}
```

**Request:**
```json
{
  "iden": "user@example.com"
}
```

**Response:**
```json
{
  "session_token": "session_token_string",
  "message": "OTP sent successfully"
}
```

### Step 3: Verify OTP
**Endpoint:** `POST /v1/auth/device/authenticate`

**Headers:**
```
Authorization: Bearer {session_token}
```

**Request:**
```json
{
  "iden": "user@example.com",
  "token": "FRZCKO"
}
```

**Response:**
```json
{
  "session_token": "new_session_token_string",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    ...
  }
}
```

## Implementation Files

### 1. `src/config/api.ts`
- API configuration and endpoints
- Base URL configuration
- Request timeout and retry settings

### 2. `src/services/auth.ts`
- `createNewSession()` - Creates a new session with IP address
- `initAuthentication()` - Requests OTP for email
- `verifyOTP()` - Verifies OTP and completes authentication
- `getUserInfo()` - Gets user information after authentication
- `getIPAddress()` - Helper to get user's IP address

### 3. `src/hooks/useAuth.ts`
- React hook for authentication state management
- Handles OTP request and verification
- Manages session persistence with AsyncStorage
- Provides logout functionality

### 4. `src/context/AuthContext.tsx`
- Global authentication context
- Provides authentication state to entire app
- Manages session persistence across app restarts

## Usage in LoginScreen

```typescript
import { useAuth } from '../hooks/useAuth';

const LoginScreen = () => {
  const { requestOTP, verifyOTPAndLogin, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');

  const handleRequestOTP = async () => {
    const success = await requestOTP(email);
    if (success) {
      setStep('otp');
    }
  };

  const handleVerifyOTP = async () => {
    const success = await verifyOTPAndLogin(otp);
    if (success) {
      // Navigate to Home screen
      navigation.navigate('Home');
    }
  };

  // ... rest of the component
};
```

## Required Package Installation

```bash
npm install @react-native-async-storage/async-storage
```

## Environment Variables

Create a `.env` file in the root directory:

```
EXPO_PUBLIC_API_URL=https://your-api-domain.com
```

## Next Steps

1. **Install AsyncStorage**: Run `npm install @react-native-async-storage/async-storage`
2. **Update API URL**: Set the correct API base URL in `src/config/api.ts`
3. **Wrap App with AuthProvider**: Update `App.tsx` to include AuthProvider
4. **Update LoginScreen**: Integrate the authentication hooks
5. **Test Authentication Flow**: Test email → OTP → login → home navigation

## Error Handling

The implementation includes:
- Network error handling
- Session expiry handling
- Invalid OTP handling
- Loading states
- Error messages for user feedback

## Security Notes

- Session tokens are stored securely using AsyncStorage
- Tokens are sent via Authorization header
- Temporary session data is cleaned up after successful authentication
- All API calls use HTTPS (ensure BASE_URL uses https://)

