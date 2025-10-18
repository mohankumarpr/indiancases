# libsodium Integration for Judgment Decryption

This document explains how libsodium has been integrated into your Indian Cases application to handle encrypted judgment data.

## Overview

The application now supports decrypting judgment data that is encrypted using libsodium. When you make a call to fetch judgment data, you receive a response like:

```json
{
  "uuid": "0199bdee-730e-724d-a9a3-f4c07c2f3e43",
  "path": "https://la01-s3public.whiteband.ai/judgments/0199bdee-730e-724d-a9a3-f4c07c2f3e43.json.enc",
  "key": "def000009652d68a4dd78b97dbc7dc1909425266f0a716fa26f5047eee34f1758afa544a5eff3eb7e5481ad63c25560d85dbc6e176bf8415b749a77e9dcb3560f055a40e"
}
```

The application automatically fetches the encrypted data from the `path` URL and decrypts it using the provided `key`.

## Files Added/Modified

### New Files:
1. **`src/utils/judgmentDecrypt.ts`** - Core decryption utility using libsodium
2. **`src/services/judgmentService.ts`** - Service layer for judgment operations
3. **`src/utils/testDecryption.ts`** - Testing utilities for decryption functionality

### Modified Files:
1. **`src/screens/JudgmentScreen.tsx`** - Updated to use decrypted judgment data
2. **`App.tsx`** - Added service initialization
3. **`package.json`** - Added libsodium-wrappers dependency

## How It Works

### 1. Service Initialization
When the app starts, the judgment service initializes libsodium:

```typescript
import { initializeJudgmentService } from './src/services/judgmentService';

// This happens automatically in App.tsx
await initializeJudgmentService();
```

### 2. Judgment Data Fetching
When you need to fetch judgment data:

```typescript
import { getJudgmentData } from './src/services/judgmentService';

const judgmentId = "0199bdee-730e-724d-a9a3-f4c07c2f3e43";
const judgmentData = await getJudgmentData(judgmentId);

// judgmentData contains:
// - uuid: The judgment ID
// - data: The decrypted JSON content
// - originalPath: The original encrypted file URL
// - metadata: Extracted judgment metadata (title, court, date, etc.)
```

### 3. Supported Encryption Methods
The decryption utility supports multiple libsodium encryption methods:

1. **ChaCha20-Poly1305** (Primary - most common)
2. **AES256-GCM** (Fallback)
3. **XChaCha20-Poly1305** (Fallback)

The utility automatically tries each method until one succeeds.

## Usage Examples

### Basic Usage
```typescript
import { getJudgmentData } from '../services/judgmentService';

const MyComponent = () => {
  const [judgment, setJudgment] = useState(null);
  
  useEffect(() => {
    const fetchJudgment = async () => {
      try {
        const data = await getJudgmentData('0199bdee-730e-724d-a9a3-f4c07c2f3e43');
        setJudgment(data);
      } catch (error) {
        console.error('Failed to fetch judgment:', error);
      }
    };
    
    fetchJudgment();
  }, []);
  
  return (
    <View>
      {judgment && (
        <Text>{judgment.data.text || judgment.data.judgment || judgment.data.content}</Text>
      )}
    </View>
  );
};
```

### Batch Processing
```typescript
import { getMultipleJudgments } from '../services/judgmentService';

const judgmentIds = ['id1', 'id2', 'id3'];
const judgments = await getMultipleJudgments(judgmentIds);
```

### Testing
```typescript
import { runAllTests } from '../utils/testDecryption';

// Run all decryption tests
await runAllTests();
```

## Error Handling

The system includes comprehensive error handling:

1. **Network Errors** - If the encrypted file can't be fetched
2. **Decryption Errors** - If the key is invalid or encryption method is unsupported
3. **JSON Parsing Errors** - If decrypted data isn't valid JSON
4. **Service Initialization Errors** - If libsodium fails to initialize

All errors are logged with detailed information and user-friendly messages are displayed.

## Security Considerations

1. **Key Handling** - The decryption keys are only used temporarily and not stored
2. **Memory Safety** - libsodium handles secure memory management
3. **Authenticated Encryption** - All supported methods provide both encryption and authentication
4. **No Key Storage** - Keys are never persisted, only used for immediate decryption

## Performance

- **Lazy Loading** - libsodium is only initialized when needed
- **Caching** - Decrypted data can be cached by your application logic
- **Batch Processing** - Multiple judgments can be processed efficiently
- **Fallback Methods** - Automatic fallback ensures compatibility

## Troubleshooting

### Common Issues:

1. **"Failed to fetch encrypted data"**
   - Check network connectivity
   - Verify the URL in the response is accessible

2. **"Decryption failed"**
   - Verify the key format (should be hex string with optional 'def' prefix)
   - Check if the encryption method matches your server implementation

3. **"JSON parsing failed"**
   - The decrypted data might not be JSON format
   - Check the raw_data field in the response

### Debug Mode:
Enable detailed logging by checking the console output. All operations are logged with emojis for easy identification:
- 🔐 Libsodium operations
- 📡 Network requests
- 🔓 Decryption processes
- ✅ Success indicators
- ❌ Error indicators

## Integration with Existing Code

The libsodium integration is designed to be non-intrusive:

1. **No Changes to API Calls** - Your existing API endpoints remain unchanged
2. **Backward Compatible** - Falls back to static content if decryption fails
3. **Optional Usage** - Only affects judgment data, not the rest of your application
4. **Progressive Enhancement** - Works alongside your existing authentication system

## Next Steps

1. **Test with Real Data** - Use the provided test utilities with actual judgment responses
2. **Customize Metadata Extraction** - Modify `extractJudgmentMetadata()` to match your data structure
3. **Add Caching** - Implement caching for frequently accessed judgments
4. **Error Recovery** - Add retry mechanisms for failed decryptions

The integration is now ready to use! The JudgmentScreen will automatically handle encrypted judgment data when available.
