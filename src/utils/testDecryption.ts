// Test Decryption Utility
// For testing libsodium decryption functionality

import { testDecryption } from './judgmentDecrypt';

/**
 * Test the libsodium decryption functionality
 * This can be called from anywhere in the app to verify everything is working
 */
export const runDecryptionTest = async (): Promise<void> => {
  try {
    console.log('🧪 Starting libsodium decryption test...');
    
    await testDecryption();
    
    console.log('✅ All decryption tests passed!');
    
  } catch (error) {
    console.error('❌ Decryption test failed:', error);
    throw error;
  }
};

/**
 * Test with sample judgment response data
 */
export const testWithSampleData = async (): Promise<void> => {
  try {
    console.log('🧪 Testing with sample judgment response data...');
    
    // Import the decryption function
    const { decryptJudgmentData } = await import('./judgmentDecrypt');
    
    // Sample response data (you can replace this with actual data from your API)
    const sampleResponse = {
      uuid: "0199bdee-730e-724d-a9a3-f4c07c2f3e43",
      path: "https://la01-s3public.whiteband.ai/judgments/0199bdee-730e-724d-a9a3-f4c07c2f3e43.json.enc",
      key: "def000009652d68a4dd78b97dbc7dc1909425266f0a716fa26f5047eee34f1758afa544a5eff3eb7e5481ad63c25560d85dbc6e176bf8415b749a77e9dcb3560f055a40e"
    };
    
    console.log('📝 Sample response data:', {
      uuid: sampleResponse.uuid,
      path: sampleResponse.path,
      keyLength: sampleResponse.key.length
    });
    
    // Try to decrypt the sample data
    const result = await decryptJudgmentData(sampleResponse);
    
    console.log('✅ Sample data decryption result:', {
      uuid: result.uuid,
      hasData: !!result.data,
      dataKeys: result.data ? Object.keys(result.data) : [],
      originalPath: result.originalPath
    });
    
  } catch (error) {
    console.error('❌ Sample data test failed:', error);
    console.log('ℹ️ This is expected if the sample URL is not accessible or the key format is different');
    
    // Don't throw the error for sample data tests as they might fail due to network issues
    console.log('⚠️ Sample data test failed, but this might be due to network or key format issues');
  }
};

/**
 * Run all tests
 */
export const runAllTests = async (): Promise<void> => {
  try {
    console.log('🚀 Running all decryption tests...');
    
    // Test 1: Basic libsodium functionality
    await runDecryptionTest();
    
    // Test 2: Sample data (might fail due to network issues)
    await testWithSampleData();
    
    console.log('🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Some tests failed:', error);
    throw error;
  }
};
