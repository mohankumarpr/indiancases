# Environment Variables Setup

## How to Configure API Base URL

### Step 1: Create .env File

Create a `.env` file in the **root directory** of the project (same level as `package.json`):

```bash
# Navigate to project root
cd D:\Mohan\Projects\indiancases

# Create .env file
# Use your text editor or create manually
```

### Step 2: Add Environment Variables

Add the following content to your `.env` file:

```env
# API Configuration
EXPO_PUBLIC_API_URL=https://your-api-domain.com

# Environment
EXPO_PUBLIC_ENV=development

# App Configuration
EXPO_PUBLIC_APP_NAME=IndiLegal Research
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### Step 3: Update API URL

Replace `https://your-api-domain.com` with your actual API base URL.

For example:
```env
EXPO_PUBLIC_API_URL=https://api.indiancases.com
```

Or if using localhost for development:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Step 4: Restart Development Server

After creating/updating the `.env` file, restart the Expo development server:

```bash
# Stop current server (Ctrl+C)
# Then restart
npx expo start
```

## Environment Variable Naming

**Important:** Expo requires environment variables to be prefixed with `EXPO_PUBLIC_` to be accessible in the app.

✅ **Correct:** `EXPO_PUBLIC_API_URL`
❌ **Wrong:** `API_URL` or `REACT_APP_API_URL`

## How It Works

1. **Environment file** (`.env`) contains the API URL
2. **environment.ts** reads the value using `process.env.EXPO_PUBLIC_API_URL`
3. **api.ts** uses the environment configuration
4. **auth.ts** imports from api.ts and uses the BASE_URL for all API calls

## File Structure

```
indiancases/
├── .env                          # Your local environment variables (gitignored)
├── src/
│   ├── config/
│   │   ├── environment.ts        # Environment variable management
│   │   └── api.ts               # API configuration using environment
│   └── services/
│       └── auth.ts              # Auth service using API config
```

## Checking Current Configuration

You can check which API URL is being used by adding this to any component:

```typescript
import ENV from './src/config/environment';

console.log('API URL:', ENV.API_URL);
```

## Different Environments

You can create different environment files for different environments:

- `.env.development` - Development settings
- `.env.production` - Production settings
- `.env.staging` - Staging settings

Then use them with Expo:
```bash
# Development
npx expo start

# Production
EXPO_PUBLIC_ENV=production npx expo start --no-dev
```

## Troubleshooting

**Issue:** Environment variables not working?

**Solution:**
1. Ensure variable names start with `EXPO_PUBLIC_`
2. Restart the Expo development server
3. Clear cache: `npx expo start --clear`
4. Check if `.env` file is in the root directory (same level as package.json)

## Security Note

**Never commit `.env` file to git!**

The `.env` file should already be in `.gitignore`. Always use `.env.example` for sharing configuration structure without exposing actual values.

