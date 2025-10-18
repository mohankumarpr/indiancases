// Judgment Service
// Handles fetching and decrypting judgment data

import API_CONFIG from '../config/api';
import { apiGet } from '../utils/apiClient';
import { decryptJudgmentData, initializeLibsodium } from '../utils/judgmentDecrypt';

interface JudgmentResponse {
  uuid: string;
  path: string;
  key: string;
  nonce: string; // Required nonce field to match judgmentDecrypt.ts
}

interface JudgmentData {
  uuid: string;
  data: any;
  originalPath: string;
  metadata?: {
    title?: string;
    court?: string;
    date?: string;
    judges?: string;
    citation?: string;
  };
}

/**
 * Initialize the judgment service (call this once at app startup)
 */
export const initializeJudgmentService = async (): Promise<void> => {
  try {
    await initializeLibsodium();
    console.log('✅ Judgment service initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize judgment service:', error);
    throw error;
  }
};

/**
 * Fetch judgment metadata from API
 */
const fetchJudgmentMetadata = async (judgmentId: string): Promise<JudgmentResponse> => {
  try {
    console.log('📡 Fetching judgment metadata for ID:', judgmentId);
    console.log('📡 API_CONFIG.ENDPOINTS.GET_JUDGMENT:', API_CONFIG.ENDPOINTS.GET_JUDGMENT);
    
    const endpoint = API_CONFIG.ENDPOINTS.GET_JUDGMENT.replace(':id', judgmentId);
    console.log('📡 Full endpoint URL:', endpoint);
    
    const response = await apiGet<JudgmentResponse>(endpoint);
    
    console.log('✅ Judgment metadata received:', {
      uuid: response.uuid,
      path: response.path,
      keyLength: response.key?.length || 0
    });
    
    return response;
  } catch (error) {
    console.error('❌ Failed to fetch judgment metadata:', error);
    console.error('❌ Error details:', JSON.stringify(error, null, 2));
    throw new Error(`Failed to fetch judgment metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get judgment data (fetches metadata and decrypts content)
 */
export const getJudgmentData = async (judgmentId: string): Promise<JudgmentData> => {
  try {
    console.log('🔍 Getting judgment data for ID:', judgmentId);
    
    // Step 1: Fetch judgment metadata (contains encrypted file path and key)
    const judgmentResponse = await fetchJudgmentMetadata(judgmentId);
    
    // Step 2: Decrypt the judgment content
    const decryptedJudgment = await decryptJudgmentData(judgmentResponse);
    
    // Log the decrypted judgment data
    console.log('🔓 DECRYPTED JUDGMENT RECEIVED:');
    console.log('='.repeat(80));
    console.log('UUID:', decryptedJudgment.uuid);
    console.log('Decryption Method:', decryptedJudgment.decryptionMethod);
    console.log('Original Path:', decryptedJudgment.originalPath);
    console.log('Data:', JSON.stringify(decryptedJudgment.data, null, 2));
    console.log('='.repeat(80));
    
    // Step 3: Extract metadata from decrypted content
    const metadata = extractJudgmentMetadata(decryptedJudgment.data);
    
    console.log('✅ Judgment data retrieved and decrypted successfully');
    
    return {
      uuid: decryptedJudgment.uuid,
      data: decryptedJudgment.data,
      originalPath: decryptedJudgment.originalPath,
      metadata
    };
    
  } catch (error) {
    console.error('❌ Failed to get judgment data:', error);
    throw new Error(`Failed to get judgment data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Extract metadata from judgment data
 */
const extractJudgmentMetadata = (judgmentData: any): JudgmentData['metadata'] => {
  try {
    // Try to extract common judgment metadata fields
    // This will depend on the structure of your judgment data
    const metadata: JudgmentData['metadata'] = {};
    
    if (judgmentData.title) {
      metadata.title = judgmentData.title;
    }
    
    if (judgmentData.court) {
      metadata.court = judgmentData.court;
    }
    
    if (judgmentData.date) {
      metadata.date = judgmentData.date;
    }
    
    if (judgmentData.judges) {
      metadata.judges = judgmentData.judges;
    }
    
    if (judgmentData.citation) {
      metadata.citation = judgmentData.citation;
    }
    
    // If the judgment data has a different structure, you might need to parse it
    // For example, if it's a text-based judgment, you might extract metadata from the text
    
    return metadata;
    
  } catch (error) {
    console.warn('⚠️ Could not extract judgment metadata:', error);
    return {};
  }
};

/**
 * Get multiple judgments in batch
 */
export const getMultipleJudgments = async (judgmentIds: string[]): Promise<JudgmentData[]> => {
  try {
    console.log(`🔍 Getting ${judgmentIds.length} judgments in batch`);
    
    const results: JudgmentData[] = [];
    
    for (const judgmentId of judgmentIds) {
      try {
        const judgmentData = await getJudgmentData(judgmentId);
        results.push(judgmentData);
      } catch (error) {
        console.error(`❌ Failed to get judgment ${judgmentId}:`, error);
        // Continue with other judgments even if one fails
      }
    }
    
    console.log(`✅ Batch judgment retrieval completed: ${results.length}/${judgmentIds.length} successful`);
    return results;
    
  } catch (error) {
    console.error('❌ Failed to get multiple judgments:', error);
    throw error;
  }
};

/**
 * Check if a judgment ID is valid
 */
export const isValidJudgmentId = (judgmentId: string): boolean => {
  // Check if it's a valid UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(judgmentId);
};

/**
 * Get judgment preview (just metadata, without decryption)
 */
export const getJudgmentPreview = async (judgmentId: string): Promise<JudgmentResponse> => {
  try {
    console.log('👁️ Getting judgment preview for ID:', judgmentId);
    
    const judgmentResponse = await fetchJudgmentMetadata(judgmentId);
    
    console.log('✅ Judgment preview retrieved');
    return judgmentResponse;
    
  } catch (error) {
    console.error('❌ Failed to get judgment preview:', error);
    throw error;
  }
};
