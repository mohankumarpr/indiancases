import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import { RootStackParamList } from '../types';
import BottomNavigation from '../components/BottomNavigation';
import LogoSVG from '../components/LogoSVG';
import { getJudgmentData, initializeJudgmentService } from '../services/judgmentService';
import { getDeviceToken } from '../utils/deviceToken';
import { useToastMessage } from '../hooks/useToastMessage';

type JudgmentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Judgment'>;
type JudgmentScreenRouteProp = RouteProp<RootStackParamList, 'Judgment'>;

const JudgmentScreen = () => {
  const navigation = useNavigation<JudgmentScreenNavigationProp>();
  const route = useRoute<JudgmentScreenRouteProp>();
  const { showSuccess, showError, showWarning, showInfo } = useToastMessage();

  const caseData = route.params?.caseData || {};
  const [judgmentData, setJudgmentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize judgment service and fetch data
  useEffect(() => {
    const fetchJudgment = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Initialize the judgment service (libsodium)
        await initializeJudgmentService();
        
        // Use judgment ID from case data, or fall back to device UUID v7
        const deviceToken = await getDeviceToken();
        const judgmentId = caseData.judgmentId || caseData.uuid || deviceToken;
        
        console.log('📋 Case data received:', JSON.stringify(caseData, null, 2));
        console.log('🔍 Using judgment ID from case data:', judgmentId);
        console.log('🔍 Fetching judgment data for ID:', judgmentId);
        
        // Fetch and decrypt judgment data
        const data = await getJudgmentData(judgmentId);
        setJudgmentData(data);
        
        console.log('✅ Judgment data loaded successfully');
        
      } catch (err) {
        console.error('❌ Failed to load judgment data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load judgment data');
        
        // Show user-friendly error message
        showError(
          'Load Error',
          'Failed to load judgment data. Please try again later.',
          {
            duration: 5000,
            action: {
              label: 'Retry',
              onPress: () => {
                setError(null);
                setLoading(true);
                setJudgmentData(null);
              }
            }
          }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJudgment();
  }, [caseData]);

  const handleEmailJudgment = () => {
    // TODO: Implement email functionality
    console.log('Email judgment');
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download functionality
    console.log('Download PDF');
  };

  const renderHighlightedText = (text: string) => {
    if (!text) return <Text>No judgment text available</Text>;
    
    const legalTerms = [
      'Motor Accidents Claims Tribunal',
      'High Court',
      'Indian Succession Act, 1925',
      'Madhya Pradesh High Court',
      'Motor Vehicles Act, 1988',
      'Section 166',
      'Act 32 of 2019',
      'Section 167',
      'Kahlon @ Jasmail Singh Kahlon',
      'Meena',
      'Oriental Insurance Company Limited',
      'Supreme Court',
      'Constitution',
      'Article',
      'Section',
      'Act',
      'Code',
      'IPC',
      'CrPC',
      'Sections?',
      'Articles?'
    ];

    let highlightedText = text;
    legalTerms.forEach(term => {
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `__HIGHLIGHT__$&__END_HIGHLIGHT__`);
    });

    const parts = highlightedText.split(/(__HIGHLIGHT__.*?__END_HIGHLIGHT__)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('__HIGHLIGHT__') && part.endsWith('__END_HIGHLIGHT__')) {
        const cleanText = part.replace(/__HIGHLIGHT__|__END_HIGHLIGHT__/g, '');
        return (
          <Text key={index} style={styles.highlightedText}>
            {cleanText}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  // Get judgment text from decrypted data or fallback to static text
  const getJudgmentText = () => {
    // Log the judgment data structure for debugging
    if (judgmentData) {
      console.log('🔍 JudgmentScreen - judgmentData structure:', JSON.stringify(judgmentData, null, 2));
    }
    
    // Parse the JSON string in judgmentData.data if it exists
    let parsedData = null;
    if (typeof judgmentData?.data === 'string') {
      try {
        parsedData = JSON.parse(judgmentData.data);
        console.log('✅ Parsed JSON data from judgmentData.data:', parsedData);
      } catch (error) {
        console.log('⚠️ Failed to parse judgmentData.data as JSON:', error);
        return judgmentData.data; // Return as string if not JSON
      }
    } else if (judgmentData?.data && typeof judgmentData.data === 'object') {
      parsedData = judgmentData.data;
    }
    
    // Try to get contents (base64 encoded HTML)
    if (parsedData?.contents) {
      try {
        console.log('✅ Found contents field, decoding base64 HTML...');
        const decodedContents = atob(parsedData.contents);
        console.log('✅ Decoded HTML contents:', decodedContents.substring(0, 200) + '...');
        
        // Convert HTML to plain text by removing HTML tags
        const textContent = decodedContents
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
          .replace(/&amp;/g, '&') // Replace &amp; with &
          .replace(/&lt;/g, '<') // Replace &lt; with <
          .replace(/&gt;/g, '>') // Replace &gt; with >
          .replace(/&quot;/g, '"') // Replace &quot; with "
          .replace(/&#39;/g, "'") // Replace &#39; with '
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .trim();
        
        console.log('✅ Converted HTML to text:', textContent.substring(0, 200) + '...');
        return textContent;
      } catch (error) {
        console.log('⚠️ Failed to decode base64 contents:', error);
      }
    }
    
    // Try to extract text from various possible data structures
    if (parsedData?.text) {
      console.log('✅ Using parsedData.text');
      return parsedData.text;
    }
    if (parsedData?.judgment) {
      console.log('✅ Using parsedData.judgment');
      return parsedData.judgment;
    }
    if (parsedData?.content) {
      console.log('✅ Using parsedData.content');
      return parsedData.content;
    }
    if (parsedData?.body) {
      console.log('✅ Using parsedData.body');
      return parsedData.body;
    }
    if (parsedData?.fullText) {
      console.log('✅ Using parsedData.fullText');
      return parsedData.fullText;
    }
    
    // Try direct fields on judgmentData
    if (judgmentData?.data?.text) {
      console.log('✅ Using judgmentData.data.text');
      return judgmentData.data.text;
    }
    if (judgmentData?.data?.judgment) {
      console.log('✅ Using judgmentData.data.judgment');
      return judgmentData.data.judgment;
    }
    if (judgmentData?.data?.content) {
      console.log('✅ Using judgmentData.data.content');
      return judgmentData.data.content;
    }
    if (judgmentData?.data?.body) {
      console.log('✅ Using judgmentData.data.body');
      return judgmentData.data.body;
    }
    if (judgmentData?.data?.fullText) {
      console.log('✅ Using judgmentData.data.fullText');
      return judgmentData.data.fullText;
    }
    
    // If the data is a string directly
    if (typeof judgmentData?.data === 'string') {
      console.log('✅ Using judgmentData.data as string');
      return judgmentData.data;
    }
    
    console.log('⚠️ No judgment content found, using fallback text');
    
    // Fallback to static text if no decrypted data available
    return `1. The present appeal arises out of the judgment and order dated 21.02.2020 passed by the Motor Accidents Claims Tribunal, Indore in Claim Case No. 248/2018, whereby the Tribunal has awarded a compensation of Rs. 8,00,000/- along with interest @ 9% per annum from the date of filing of the claim petition till realization.

2. The brief facts of the case are that on 06.06.2018, the deceased was traveling in a car bearing registration No. MP-09-CA-1234, when the said car met with an accident with a truck bearing registration No. MP-09-GA-5678. The deceased succumbed to the injuries sustained in the accident.

3. The claimants filed a claim petition before the Motor Accidents Claims Tribunal, Indore claiming compensation under various heads. The Tribunal after considering the evidence on record, awarded a total compensation of Rs. 8,00,000/-.

4. The learned counsel for the appellant has submitted that the Tribunal has not properly considered the income of the deceased and has awarded inadequate compensation. It is submitted that the deceased was working as a Software Engineer in a reputed IT company and was earning Rs. 25,000/- per month.

5. The learned counsel for the respondent Insurance Company has submitted that the Tribunal has already awarded just and reasonable compensation and there is no need to interfere with the same.

6. We have heard the learned counsel for the parties and perused the material on record. The Motor Vehicles Act, 1988 provides for compensation to the victims of motor vehicle accidents. Section 166 of the Act provides for application for compensation.

7. The Supreme Court in various decisions has held that the compensation should be just and reasonable and should not be either inadequate or excessive. The principles for determination of compensation have been laid down in various decisions of the Supreme Court.

8. In the present case, the deceased was 28 years old at the time of accident and was working as a Software Engineer. The Tribunal has considered the income of the deceased as Rs. 15,000/- per month. However, considering the evidence on record, we are of the opinion that the income should be considered as Rs. 20,000/- per month.

9. The future prospects at the rate of 40% should be added to the income of the deceased as he was below 40 years of age. Thus, the monthly income would be Rs. 28,000/- (Rs. 20,000/- + 40% of Rs. 20,000/-).

10. The annual income would be Rs. 3,36,000/- (Rs. 28,000/- × 12). After deducting 1/4th towards personal expenses, the annual dependency would be Rs. 2,52,000/-.

11. The multiplier of 17 should be applied considering the age of the deceased. Thus, the compensation under the head of loss of dependency would be Rs. 42,84,000/- (Rs. 2,52,000/- × 17).

12. In addition to the above, the claimants are entitled to compensation under conventional heads like loss of estate, loss of consortium, and funeral expenses.

13. Accordingly, the total compensation is enhanced to Rs. 45,00,000/- along with interest @ 9% per annum from the date of filing of the claim petition till realization.

14. The appeal is allowed in part. The impugned judgment and order of the Tribunal is modified to the extent that the total compensation is enhanced from Rs. 8,00,000/- to Rs. 45,00,000/- along with interest @ 9% per annum from the date of filing of the claim petition till realization.

15. The respondent Insurance Company is directed to deposit the enhanced amount of compensation within a period of two months from today, failing which the same shall carry interest @ 12% per annum from the date of this order till realization.`;
  };

  // Get judgment metadata from decrypted data or fallback to static values
  const getJudgmentMetadata = () => {
    // Log metadata for debugging
    if (judgmentData?.metadata) {
      console.log('🔍 JudgmentScreen - metadata found:', JSON.stringify(judgmentData.metadata, null, 2));
    }
    
    // Parse the JSON string in judgmentData.data if it exists
    let parsedData = null;
    if (typeof judgmentData?.data === 'string') {
      try {
        parsedData = JSON.parse(judgmentData.data);
        console.log('🔍 JudgmentScreen - parsed data for metadata:', parsedData);
      } catch (error) {
        console.log('⚠️ Failed to parse judgmentData.data as JSON for metadata:', error);
      }
    } else if (judgmentData?.data && typeof judgmentData.data === 'object') {
      parsedData = judgmentData.data;
    }
    
    if (judgmentData?.metadata) {
      return {
        citation: judgmentData.metadata.citation || judgmentData.metadata.caseNumber || '2025 (KER) ICO 88888',
        court: judgmentData.metadata.court || judgmentData.metadata.tribunal || 'Supreme Court of India',
        date: judgmentData.metadata.date || judgmentData.metadata.decidedOn || 'Decided on 15-05-2025',
        judges: judgmentData.metadata.judges || judgmentData.metadata.bench || 'Justice Bela M Trivedi, Justice Prasanna B Varale',
        title: judgmentData.metadata.title || judgmentData.metadata.caseTitle || 'In Re Alarming Rise In The Number of Reported Child Rape Incidents Vs. Pratishtha Thakur Haritwal'
      };
    }
    
    // Extract metadata from parsed data object
    if (parsedData) {
      console.log('🔍 JudgmentScreen - extracting metadata from parsed data object');
      
      // Format judges array if it exists
      let judgesText = '';
      if (parsedData.judges && Array.isArray(parsedData.judges)) {
        judgesText = parsedData.judges.map(judge => 
          `${judge.designation || 'Justice'} ${judge.name}`
        ).join(', ');
      } else if (parsedData.judges && typeof parsedData.judges === 'string') {
        judgesText = parsedData.judges;
      }
      
      return {
        citation: parsedData.iconumber || parsedData.citation || parsedData.caseNumber || caseData.caseId || '2025 (KER) ICO 88888',
        court: parsedData.court || parsedData.tribunal || caseData.court || 'Supreme Court of India',
        date: parsedData.date || parsedData.decidedOn || 'Decided on 15-05-2025',
        judges: judgesText || 'Justice Bela M Trivedi, Justice Prasanna B Varale',
        title: parsedData.title || parsedData.caseTitle || 'In Re Alarming Rise In The Number of Reported Child Rape Incidents Vs. Pratishtha Thakur Haritwal'
      };
    }
    
    // Also try to extract metadata from the main data object (fallback)
    if (judgmentData?.data) {
      console.log('🔍 JudgmentScreen - trying to extract metadata from data object');
      return {
        citation: judgmentData.data.citation || judgmentData.data.caseNumber || caseData.caseId || '2025 (KER) ICO 88888',
        court: judgmentData.data.court || judgmentData.data.tribunal || caseData.court || 'Supreme Court of India',
        date: judgmentData.data.date || judgmentData.data.decidedOn || 'Decided on 15-05-2025',
        judges: judgmentData.data.judges || judgmentData.data.bench || 'Justice Bela M Trivedi, Justice Prasanna B Varale',
        title: judgmentData.data.title || judgmentData.data.caseTitle || 'In Re Alarming Rise In The Number of Reported Child Rape Incidents Vs. Pratishtha Thakur Haritwal'
      };
    }
    
    // Fallback metadata
    return {
      citation: '2025 (KER) ICO 88888',
      court: 'Supreme Court of India',
      date: 'Decided on 15-05-2024',
      judges: 'Justice Bela M Trivedi, Justice Prasanna B Varale',
      title: 'In Re Alarming Rise In The Number of Reported Child Rape Incidents Vs. Pratishtha Thakur Haritwal'
    };
  };

  // Show loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.topHeader}>
          <View style={styles.headerLeft}>
            <LogoSVG 
              width={24} 
              height={24} 
              color="#333333" 
            />
            <Text style={styles.headerTitle}>Indian Cases</Text>
          </View>
        </View>

        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Judgement</Text>
          <TouchableOpacity style={styles.bookmarkButton}>
            <Ionicons name="bookmark-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading judgment data...</Text>
          <Text style={styles.loadingSubtext}>Decrypting and processing content</Text>
        </View>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.topHeader}>
          <View style={styles.headerLeft}>
            <LogoSVG 
              width={24} 
              height={24} 
              color="#333333" 
            />
            <Text style={styles.headerTitle}>Indian Cases</Text>
          </View>
        </View>

        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Judgement</Text>
          <TouchableOpacity style={styles.bookmarkButton}>
            <Ionicons name="bookmark-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Failed to Load Judgment</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setLoading(true);
              // Re-trigger the useEffect by updating a state
              setJudgmentData(null);
            }}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Get current judgment data
  const metadata = getJudgmentMetadata();
  const judgmentText = getJudgmentText();

  return (
    <View style={styles.container}>
      {/* Top Header with Logo */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <LogoSVG 
            width={32} 
            height={32} 
            color="#333333" 
          />
          <Text style={styles.headerTitle}>Indian Cases</Text>
        </View>
      </View>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Judgement</Text>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Ionicons name="bookmark-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content Area */}
      <View style={styles.scrollContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={Platform.OS !== 'web'}
          bounces={true}
          scrollEnabled={true}
          nestedScrollEnabled={true}
        >
          {/* Judgment Header */}
          <View style={styles.judgmentHeader}>
            <Text style={styles.judgmentId}>{metadata.citation}</Text>
            <Text style={styles.courtName}>{metadata.court}</Text>
            <Text style={styles.decisionDate}>{metadata.date}</Text>
            <Text style={styles.judges}>{metadata.judges}</Text>
            <Text style={styles.caseTitle}>
              {metadata.title}
            </Text>
            {judgmentData && (
              <View style={styles.decryptionStatus}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.decryptionStatusText}>Content decrypted successfully</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.emailButton} onPress={handleEmailJudgment}>
              <Ionicons name="mail-outline" size={20} color={COLORS.white} />
              <Text style={styles.emailButtonText}>Email Judgement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadPDF}>
              <Ionicons name="download-outline" size={20} color="#333" />
              <Text style={styles.downloadButtonText}>Download PDF</Text>
            </TouchableOpacity>
          </View>

          {/* Case Details Section */}
          {judgmentData && (() => {
            let parsedData = null;
            if (typeof judgmentData.data === 'string') {
              try {
                parsedData = JSON.parse(judgmentData.data);
              } catch (error) {
                parsedData = null;
              }
            } else if (judgmentData.data && typeof judgmentData.data === 'object') {
              parsedData = judgmentData.data;
            }

            if (parsedData && (parsedData.parties || parsedData.lawyers || parsedData.headnotes)) {
              return (
                <View style={styles.caseDetailsContainer}>
                  {/* Parties Section */}
                  {parsedData.parties && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>PARTIES</Text>
                      <View style={styles.partiesContainer}>
                        {parsedData.parties.left && parsedData.parties.left.length > 0 && (
                          <View style={styles.partyColumn}>
                            <Text style={styles.partyLabel}>PETITIONER(S):</Text>
                            {parsedData.parties.left.map((party: string, index: number) => (
                              <Text key={index} style={styles.partyName}>• {party}</Text>
                            ))}
                          </View>
                        )}
                        {parsedData.parties.right && parsedData.parties.right.length > 0 && (
                          <View style={styles.partyColumn}>
                            <Text style={styles.partyLabel}>RESPONDENT(S):</Text>
                            {parsedData.parties.right.map((party: string, index: number) => (
                              <Text key={index} style={styles.partyName}>• {party}</Text>
                            ))}
                          </View>
                        )}
                      </View>
                    </View>
                  )}

                  {/* Lawyers Section */}
                  {parsedData.lawyers && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>ADVOCATES</Text>
                      <View style={styles.lawyersContainer}>
                        {parsedData.lawyers.left && parsedData.lawyers.left.length > 0 && (
                          <View style={styles.lawyerColumn}>
                            <Text style={styles.lawyerLabel}>FOR PETITIONER(S):</Text>
                            {parsedData.lawyers.left.map((lawyer: any, index: number) => (
                              <Text key={index} style={styles.lawyerName}>
                                • {lawyer.designation || 'Adv.'} {lawyer.name}
                              </Text>
                            ))}
                          </View>
                        )}
                        {parsedData.lawyers.right && parsedData.lawyers.right.length > 0 && (
                          <View style={styles.lawyerColumn}>
                            <Text style={styles.lawyerLabel}>FOR RESPONDENT(S):</Text>
                            {parsedData.lawyers.right.map((lawyer: any, index: number) => (
                              <Text key={index} style={styles.lawyerName}>
                                • {lawyer.designation || 'Adv.'} {lawyer.name}
                              </Text>
                            ))}
                          </View>
                        )}
                      </View>
                    </View>
                  )}

                  {/* Headnotes Section */}
                  {parsedData.headnotes && parsedData.headnotes.length > 0 && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>HEADNOTES</Text>
                      {parsedData.headnotes.map((headnote: string, index: number) => (
                        <Text key={index} style={styles.headnoteText}>
                          {index + 1}. {headnote}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              );
            }
            return null;
          })()}

          {/* Judgment Text */}
          <View style={styles.judgmentTextContainer}>
            <Text style={styles.judgmentLabel}>JUDGEMENT:</Text>
            <Text style={styles.judgmentTextContent}>
              {renderHighlightedText(judgmentText)}
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab="search"
        onNavigate={(tab) => {
          if (tab === 'home') {
            navigation.navigate('Home');
          } else if (tab === 'search') {
            navigation.navigate('Search', {
              query: '',
              filters: {
                court: undefined,
                year: new Date().getFullYear(),
                category: undefined,
              }
            });
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  topHeader: {
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'web' ? 20 : Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
    width: 32,
    height: 32,
    marginRight: 12,
    tintColor: '#333',
  },
  headerTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  navBar: {
    backgroundColor: COLORS.white,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 4,
  },
  navTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  bookmarkButton: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingBottom: 100, // Space for footer
    paddingHorizontal: 40, // Left and right indentation
  },
  judgmentHeader: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  judgmentId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  courtName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  decisionDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  judges: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  caseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    gap: 16,
  },
  emailButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emailButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  downloadButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  downloadButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  judgmentTextContainer: {
    paddingVertical: 20,
  },
  judgmentLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  judgmentTextContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  highlightedText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginTop: 24,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  decryptionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  decryptionStatusText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 6,
    fontWeight: '500',
  },
  caseDetailsContainer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  partiesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  partyColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  partyLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  partyName: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    marginBottom: 4,
  },
  lawyersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lawyerColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  lawyerLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  lawyerName: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    marginBottom: 4,
  },
  headnoteText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
    paddingLeft: 8,
  },
});

export default JudgmentScreen;
