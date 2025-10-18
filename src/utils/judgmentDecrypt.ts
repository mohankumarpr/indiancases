import sodium from 'libsodium-wrappers';

/**
 * Interface for judgment response from API
 */
export interface JudgmentResponse {
  uuid: string;
  path: string;
  key: string;
  nonce: string;
}

/**
 * Interface for decrypted judgment data
 */
export interface DecryptedJudgment {
  uuid: string;
  data: any;
  originalPath: string;
  decryptionMethod?: string;
}

/**
 * Initialize libsodium
 */
export const initializeLibsodium = async (): Promise<void> => {
  await sodium.ready;
  console.log('✅ Libsodium initialized successfully');
};

/**
 * Convert base64 string to Uint8Array with fallback handling
 */
const base64ToUint8Array = (base64: string): Uint8Array => {
  try {
    // Try libsodium's base64 conversion first
    console.log('🔄 Trying libsodium base64 conversion...');
    const result = sodium.from_base64(base64);
    console.log('✅ Libsodium base64 conversion successful');
    return result;
  } catch (error) {
    console.log('⚠️ Libsodium base64 failed, trying manual conversion:', error);
    
    try {
      // Manual base64 conversion with padding
      console.log('🔄 Trying manual base64 conversion with padding...');
      let paddedBase64 = base64;
      
      // Add padding if needed
      while (paddedBase64.length % 4 !== 0) {
        paddedBase64 += '=';
      }
      
      // Convert URL-safe base64 to standard base64
      paddedBase64 = paddedBase64.replace(/-/g, '+').replace(/_/g, '/');
      
      const binaryString = atob(paddedBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      console.log('✅ Base64 decoded successfully with padding, new length:', bytes.length);
      return bytes;
    } catch (manualError) {
      console.error('❌ Manual base64 conversion failed:', manualError);
      throw new Error(`Failed to decode base64: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

/**
 * Fetch encrypted data from URL
 */
const fetchEncryptedData = async (url: string): Promise<Uint8Array> => {
  console.log('📡 Fetching encrypted data from:', url);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const encryptedData = new Uint8Array(arrayBuffer);
    
    console.log('📦 Encrypted data type:', typeof encryptedData);
    console.log('📦 Encrypted data constructor:', encryptedData.constructor.name);
    console.log('📦 Encrypted data first 50 bytes:', Array.from(encryptedData.slice(0, 50)).map(b => b.toString(16).padStart(2, '0')).join(' '));
    
    // Check if the data is base64 encoded
    const firstBytesAsString = String.fromCharCode(...encryptedData.slice(0, 50));
    const looksLikeBase64 = /^[A-Za-z0-9+/=]*$/.test(firstBytesAsString);
    console.log('📦 First 50 bytes as string:', firstBytesAsString);
    console.log('📦 Looks like base64?', looksLikeBase64);
    
    if (looksLikeBase64) {
      console.log('🔄 Data appears to be base64 encoded, decoding...');
      const base64String = new TextDecoder().decode(encryptedData);
      console.log('📦 Base64 string length:', base64String.length);
      return base64ToUint8Array(base64String);
    }
    
    return encryptedData;
  } catch (error) {
    console.error('❌ Failed to fetch encrypted data:', error);
    throw new Error(`Failed to fetch encrypted data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Decrypt judgment data using libsodium
 */
export const decryptJudgmentData = async (judgmentResponse: JudgmentResponse): Promise<DecryptedJudgment> => {
  try {
    console.log('🔓 Starting decryption for judgment:', judgmentResponse.uuid);
    console.log('🔍 PHP Backend Analysis:');
    console.log('🔍 - Using: sodium_crypto_aead_chacha20poly1305_decrypt');
    console.log('🔍 - Additional data: json_encode([])');
    console.log('🔍 - Key: base64_decode($this->key)');
    console.log('🔍 - Nonce: base64_decode($this->nonce)');
    
    // Convert key to Uint8Array
    const key = base64ToUint8Array(judgmentResponse.key);
    console.log('🔑 Using key:', judgmentResponse.key.substring(0, 20) + '...');
    
    // Fetch encrypted data from the provided URL
    const ciphertext = await fetchEncryptedData(judgmentResponse.path);
    console.log('✅ Encrypted data fetched, size:', ciphertext.length, 'bytes');
    
    // Convert nonce to Uint8Array
    const nonce = base64ToUint8Array(judgmentResponse.nonce || '');
    console.log('🔑 Using provided nonce from response:', judgmentResponse.nonce?.substring(0, 20) + '...');
    
    console.log('🔄 Attempting PHP-compatible ChaCha20-Poly1305 decryption...');
    console.log('🔑 Nonce length:', nonce.length, 'bytes');
    console.log('🔑 Key length:', key.length, 'bytes');
    console.log('🔑 Ciphertext length:', ciphertext.length, 'bytes');
    
    // Debug: Check available sodium functions
    console.log('🔍 Available sodium functions:', Object.keys(sodium).filter(key => key.includes('aead')));
    console.log('🔍 crypto_aead_chacha20poly1305_decrypt available:', typeof sodium.crypto_aead_chacha20poly1305_decrypt);
    console.log('🔍 crypto_aead_chacha20poly1305_ietf_decrypt available:', typeof sodium.crypto_aead_chacha20poly1305_ietf_decrypt);
    
    // Debug: Check nonce format
    console.log('🔍 Nonce bytes:', Array.from(nonce).map(b => b.toString(16).padStart(2, '0')).join(' '));
    console.log('🔍 Expected nonce length for ChaCha20-Poly1305:', sodium.crypto_aead_chacha20poly1305_NPUBBYTES);
    console.log('🔍 Expected nonce length for ChaCha20-Poly1305 IETF:', sodium.crypto_aead_chacha20poly1305_ietf_NPUBBYTES);
    
    // Debug: Check key format
    console.log('🔍 Key bytes (first 16):', Array.from(key.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(' '));
    console.log('🔍 Expected key length for ChaCha20-Poly1305:', sodium.crypto_aead_chacha20poly1305_KEYBYTES);
    console.log('🔍 Expected key length for ChaCha20-Poly1305 IETF:', sodium.crypto_aead_chacha20poly1305_ietf_KEYBYTES);
    
    // Debug: Check ciphertext format
    console.log('🔍 Ciphertext bytes (first 32):', Array.from(ciphertext.slice(0, 32)).map(b => b.toString(16).padStart(2, '0')).join(' '));
    console.log('🔍 Ciphertext bytes (last 32):', Array.from(ciphertext.slice(-32)).map(b => b.toString(16).padStart(2, '0')).join(' '));
    
    let decryptedData: Uint8Array;
    let decryptionMethod = '';
    
    // Method 1: Exact PHP match - crypto_aead_chacha20poly1305_decrypt with json_encode([]) as additional data
    try {
      console.log('🔄 Method 1: Trying exact PHP match - crypto_aead_chacha20poly1305_decrypt...');
      
      // The PHP code uses json_encode([]) as additional data, which is "[]"
      const additionalData = sodium.from_string('[]');
      console.log('🔑 Additional data:', '[]');
      
      // Use the exact same function as PHP: crypto_aead_chacha20poly1305_decrypt
      decryptedData = sodium.crypto_aead_chacha20poly1305_decrypt(
        null,
        ciphertext,
        additionalData,
        nonce,
        key
      );
      decryptionMethod = 'crypto_aead_chacha20poly1305_decrypt_exact_php_match';
      console.log('✅ crypto_aead_chacha20poly1305_decrypt (exact PHP match) successful');
    } catch (error1) {
      console.log('⚠️ Method 1 failed:', error1);
      
      // Method 2: Try with empty additional data (sodium.from_string(''))
      try {
        console.log('🔄 Method 2: Trying with empty additional data...');
        
        decryptedData = sodium.crypto_aead_chacha20poly1305_decrypt(
          null,
          ciphertext,
          sodium.from_string(''),
          nonce,
          key
        );
        decryptionMethod = 'crypto_aead_chacha20poly1305_decrypt_empty_ad';
        console.log('✅ crypto_aead_chacha20poly1305_decrypt with empty additional data successful');
      } catch (error2) {
        console.log('⚠️ Method 2 failed:', error2);
        
        // Method 3: Try IETF version with empty additional data
        try {
          console.log('🔄 Method 3: Trying IETF version with empty additional data...');
          
          decryptedData = sodium.crypto_aead_chacha20poly1305_ietf_decrypt(
            null,
            ciphertext,
            sodium.from_string(''),
            nonce,
            key
          );
          decryptionMethod = 'crypto_aead_chacha20poly1305_ietf_decrypt_empty_ad';
          console.log('✅ crypto_aead_chacha20poly1305_ietf_decrypt with empty additional data successful');
        } catch (error3) {
          console.log('⚠️ Method 3 failed:', error3);
          
          // Method 4: Try IETF version with json_encode([]) as additional data
          try {
            console.log('🔄 Method 4: Trying IETF version with json_encode([])...');
            
            decryptedData = sodium.crypto_aead_chacha20poly1305_ietf_decrypt(
              null,
              ciphertext,
              sodium.from_string('[]'),
              nonce,
              key
            );
            decryptionMethod = 'crypto_aead_chacha20poly1305_ietf_decrypt_json_ad';
            console.log('✅ crypto_aead_chacha20poly1305_ietf_decrypt with json additional data successful');
          } catch (error4) {
            console.log('⚠️ Method 4 failed:', error4);
            
            // Method 5: Try with padded nonce (in case nonce is too short)
            try {
              console.log('🔄 Method 5: Trying with padded nonce...');
              
              // Check if nonce needs padding
              const requiredNonceLength = sodium.crypto_aead_chacha20poly1305_NPUBBYTES;
              console.log('🔑 Required nonce length for ChaCha20-Poly1305:', requiredNonceLength);
              
              if (nonce.length < requiredNonceLength) {
                const paddedNonce = new Uint8Array(requiredNonceLength);
                paddedNonce.set(nonce);
                // Fill remaining with zeros
                for (let i = nonce.length; i < requiredNonceLength; i++) {
                  paddedNonce[i] = 0;
                }
                console.log('🔑 Padded nonce length:', paddedNonce.length);
                console.log('🔑 Padded nonce bytes:', Array.from(paddedNonce).map(b => b.toString(16).padStart(2, '0')).join(' '));
                
                decryptedData = sodium.crypto_aead_chacha20poly1305_decrypt(
                  null,
                  ciphertext,
                  sodium.from_string('[]'),
                  paddedNonce,
                  key
                );
                decryptionMethod = 'crypto_aead_chacha20poly1305_decrypt_padded_nonce';
                console.log('✅ crypto_aead_chacha20poly1305_decrypt with padded nonce successful');
              } else {
                throw new Error('Nonce is already long enough');
              }
            } catch (error5) {
              console.log('⚠️ Method 5 failed:', error5);
              
              throw new Error(`All PHP-compatible decryption methods failed. The PHP backend uses sodium_crypto_aead_chacha20poly1305_decrypt with json_encode([]) as additional data, but none of our attempts worked.

PHP Backend Analysis:
- Function: sodium_crypto_aead_chacha20poly1305_decrypt
- Additional data: json_encode([]) = "[]"
- Key: base64_decode($this->key)
- Nonce: base64_decode($this->nonce)

Current data:
- Key: ${judgmentResponse.key} (${key.length} bytes)
- Nonce: ${judgmentResponse.nonce} (${nonce.length} bytes)
- Ciphertext: ${ciphertext.length} bytes

All methods failed. Please verify:
1. The exact encryption parameters used by the PHP backend
2. Whether the nonce length is correct (current: ${nonce.length} bytes)
3. Whether there are any additional processing steps

This suggests a mismatch between the PHP encryption and our decryption attempts.`);
            }
          }
        }
      }
    }
    
    // Convert decrypted data to string and parse as JSON
    const decryptedString = sodium.to_string(decryptedData);
    console.log('✅ Decryption successful with method:', decryptionMethod);
    console.log('🔍 Decrypted string length:', decryptedString.length);
    console.log('🔍 Decrypted string preview:', decryptedString.substring(0, 200));
    
    // Log the FULL decrypted content
    console.log('🔓 FULL DECRYPTED CONTENT:');
    console.log('='.repeat(80));
    console.log(decryptedString);
    console.log('='.repeat(80));
    
    try {
      const jsonData = JSON.parse(decryptedString);
      console.log('✅ JSON parsing successful');
      
      // Also log the parsed JSON data
      console.log('📋 PARSED JSON DATA:');
      console.log('='.repeat(80));
      console.log(JSON.stringify(jsonData, null, 2));
      console.log('='.repeat(80));
      
      return {
        uuid: judgmentResponse.uuid,
        data: jsonData,
        originalPath: judgmentResponse.path,
        decryptionMethod: decryptionMethod
      };
    } catch (parseError) {
      console.error('❌ Failed to parse decrypted data as JSON:', parseError);
      console.error('❌ Raw decrypted string that failed to parse:', decryptedString);
      throw new Error(`Failed to parse decrypted data as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('❌ Decryption failed:', error);
    throw error;
  }
};

/**
 * Test decryption functionality
 */
export const testDecryption = async (): Promise<void> => {
  try {
    await initializeLibsodium();
    
    // Test with sample data
    const testMessage = 'Hello, World! This is a test message for encryption.';
    const key = sodium.crypto_aead_chacha20poly1305_keygen();
    const nonce = sodium.randombytes_buf(sodium.crypto_aead_chacha20poly1305_NPUBBYTES);
    
    console.log('🧪 Testing encryption/decryption...');
    
    // Encrypt
    const encrypted = sodium.crypto_aead_chacha20poly1305_encrypt(
      testMessage,
      sodium.from_string('[]'), // Use same additional data as PHP
      null,
      nonce,
      key
    );
    
    console.log('✅ Encryption successful');
    
    // Decrypt
    const decrypted = sodium.crypto_aead_chacha20poly1305_decrypt(
      null,
      encrypted,
      sodium.from_string('[]'), // Use same additional data as PHP
      nonce,
      key
    );
    
    const decryptedString = sodium.to_string(decrypted);
    console.log('✅ Decryption successful');
    console.log('🔍 Original message:', testMessage);
    console.log('🔍 Decrypted message:', decryptedString);
    console.log('🔍 Messages match:', testMessage === decryptedString);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
};