import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS } from '../constants';
import { RootStackParamList } from '../types';
import BottomNavigation from '../components/BottomNavigation';
import LogoSVG from '../components/LogoSVG';

type CitationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Citation'>;

interface JournalItem {
  uuid: string;
  name: string;
  public: boolean;
  path: string;
}

interface PublicationsResponse {
  uuid: string | null;
  name: string | null;
  public: boolean;
  path: string;
  children: JournalItem[];
  judgments: any[];
}

interface ManifestResponse {
  meta: {
    entrypoint: string;
    generated_at: {
      timestamp: number;
      datetime_string_utc: string;
      datetime_string_ist: string;
    };
    version: number;
    uuid: string;
  };
  data: {
    base_path: string;
    search: {
      citation: {
        entrypoint: string;
      };
    };
  };
}

const CitationScreen = () => {
  const navigation = useNavigation<CitationScreenNavigationProp>();
  
  const [icoState, setIcoState] = useState('');
  const [icoYear, setIcoYear] = useState('');
  const [icoNumber, setIcoNumber] = useState('');
  const [icoCode, setIcoCode] = useState('');
  
  const [neutralYear, setNeutralYear] = useState('');
  const [neutralState, setNeutralState] = useState('');
  const [neutralNumber, setNeutralNumber] = useState('');

  const [favoriteJournals, setFavoriteJournals] = useState<string[]>([]);
  const [journals, setJournals] = useState<JournalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch journals data from API
  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Fetch manifest data
      console.log('📡 Fetching manifest data...');
      const manifestResponse = await fetch('https://whiteband-la01-s3public.s3.ap-southeast-1.amazonaws.com/v3manifest.json');
      
      if (!manifestResponse.ok) {
        throw new Error(`Failed to fetch manifest: ${manifestResponse.status}`);
      }

      const manifestData: ManifestResponse = await manifestResponse.json();
      console.log('✅ Manifest data received:', manifestData);

      // Step 2: Fetch publications data from citation entrypoint
      const publicationsUrl = manifestData.data.search.citation.entrypoint;
      console.log('📡 Fetching publications data from:', publicationsUrl);
      
      const publicationsResponse = await fetch(publicationsUrl);
      
      if (!publicationsResponse.ok) {
        throw new Error(`Failed to fetch publications: ${publicationsResponse.status}`);
      }

      const publicationsData: PublicationsResponse = await publicationsResponse.json();
      console.log('✅ Publications data received:', publicationsData);

      // Step 3: Extract journals from children array
      if (publicationsData.children && Array.isArray(publicationsData.children)) {
        setJournals(publicationsData.children);
        console.log('✅ Journals loaded:', publicationsData.children);
      } else {
        console.log('⚠️ No children found in publications data');
        setJournals([]);
      }

    } catch (error) {
      console.error('❌ Failed to fetch journals:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch journals');
      // Fallback to static data
      setJournals([
        { uuid: '1', name: 'Kerala Law Journal', public: true, path: '' },
        { uuid: '2', name: 'Kerala High Court Cases', public: true, path: '' },
        { uuid: '3', name: 'Kerala Law Decisions', public: true, path: '' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleJournalPress = (journal: JournalItem) => {
    console.log('📖 Navigating to journal detail:', journal.name);
    navigation.navigate('JournalDetail', { journal });
  };

  const handleIcoSubmit = () => {
    console.log('ICO Citation submitted:', { icoState, icoYear, icoNumber, icoCode });
    // TODO: Implement ICO citation search
  };

  const handleNeutralSubmit = () => {
    console.log('Neutral Citation submitted:', { neutralYear, neutralState, neutralNumber });
    // TODO: Implement neutral citation search
  };

  const toggleFavorite = (journalName: string) => {
    if (favoriteJournals.includes(journalName)) {
      setFavoriteJournals(favoriteJournals.filter(j => j !== journalName));
    } else {
      setFavoriteJournals([...favoriteJournals, journalName]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header with Logo */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <LogoSVG width={24} height={24} color="#333333" />
          <Text style={styles.headerTitle}>Indian Cases</Text>
        </View>
      </View>

      {/* Citation Title Section */}
      <View style={styles.citationTitleSection}>
        <Ionicons name="library" size={20} color="#666" />
        <Text style={styles.citationTitle}>Citation</Text>
      </View>

      {/* Scrollable Content Area */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEnabled={true}
      >
        {/* Citation Input Card */}
        <View style={styles.citationCard}>
          {/* ICO Citation Section */}
          <View style={styles.citationSection}>
            <Text style={styles.sectionTitle}>ICO CITATION</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.inputField}
                placeholder="State"
                placeholderTextColor="#999"
                value={icoState}
                onChangeText={setIcoState}
              />
              <TextInput
                style={styles.inputField}
                placeholder="Year"
                placeholderTextColor="#999"
                value={icoYear}
                onChangeText={setIcoYear}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.inputField}
                placeholder="Number"
                placeholderTextColor="#999"
                value={icoNumber}
                onChangeText={setIcoNumber}
              />
              <TextInput
                style={styles.inputField}
                placeholder="ICO"
                placeholderTextColor="#999"
                value={icoCode}
                onChangeText={setIcoCode}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleIcoSubmit}>
                <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Neutral Citation Section */}
          <View style={styles.citationSection}>
            <Text style={styles.sectionTitle}>NEUTRAL CITATION</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.inputField}
                placeholder="Year"
                placeholderTextColor="#999"
                value={neutralYear}
                onChangeText={setNeutralYear}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.inputField}
                placeholder="State"
                placeholderTextColor="#999"
                value={neutralState}
                onChangeText={setNeutralState}
              />
              <TextInput
                style={styles.inputField}
                placeholder="Number"
                placeholderTextColor="#999"
                value={neutralNumber}
                onChangeText={setNeutralNumber}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleNeutralSubmit}>
                <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* All Journals Section */}
        <View style={styles.journalsSection}>
          <Text style={styles.journalsTitle}>ALL JOURNALS</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading journals...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load journals: {error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchJournals}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : journals.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No journals available</Text>
            </View>
          ) : (
            journals.map((journal, index) => (
              <View key={journal.uuid}>
                <TouchableOpacity 
                  style={styles.journalItem}
                  onPress={() => handleJournalPress(journal)}
                >
                  <Text style={styles.journalName}>{journal.name}</Text>
                  <TouchableOpacity 
                    onPress={() => toggleFavorite(journal.name)}
                    style={styles.starButton}
                  >
                    <Ionicons 
                      name={favoriteJournals.includes(journal.name) ? "star" : "star-outline"} 
                      size={20} 
                      color={favoriteJournals.includes(journal.name) ? COLORS.primary : "#999"} 
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
                {index < journals.length - 1 && <View style={styles.journalSeparator} />}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab="citation"
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
  headerTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  citationTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  citationTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingBottom: 100, // Space for footer
    paddingHorizontal: 20,
  },
  citationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 20,
    marginTop: 20,
    marginBottom: 30,
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' }
      : {
          elevation: 3,
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        }
    ),
  },
  citationSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputField: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 14,
    color: '#333',
    backgroundColor: 'transparent',
    minHeight: 44,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  journalsSection: {
    marginTop: 20,
  },
  journalsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  journalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  journalName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  starButton: {
    padding: 4,
  },
  journalSeparator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 0,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
  },
});

export default CitationScreen;
