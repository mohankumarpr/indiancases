import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SAMPLE_CASES } from '../constants';
import { RootStackParamList } from '../types';
import BottomNavigation from '../components/BottomNavigation';
import CaseDetailModal from '../components/CaseDetailModal';
import BookmarkModal from '../components/BookmarkModal';
import Dropdown from '../components/Dropdown';
import CalendarPicker from '../components/CalendarPicker';
import useSEO from '../hooks/useSEO';
import { SEOConfigs } from '../utils/seo';

const { width } = Dimensions.get('window');

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Search'>;

const SearchScreen = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  
  // Toggle between form view and results view
  const [showResults, setShowResults] = useState(false);
  
  // Form fields
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActs, setSelectedActs] = useState<string>('');
  const [selectedCourt, setSelectedCourt] = useState<string>('');
  const [selectedJudge, setSelectedJudge] = useState<string>('');
  const [selectedParty, setSelectedParty] = useState<string>('');
  const [startYear, setStartYear] = useState<string>('');
  const [endYear, setEndYear] = useState<string>('');
  
  // Modals
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState(false);

  // Example data
  const actsOptions = [
    'Indian Penal Code (IPC)',
    'Criminal Procedure Code (CrPC)',
    'Constitution of India',
    'Companies Act, 2013',
    'Income Tax Act, 1961',
    'Consumer Protection Act, 2019',
    'Motor Vehicles Act, 1988',
    'Family Courts Act, 1984',
    'Negotiable Instruments Act, 1881',
    'Arbitration and Conciliation Act, 1996'
  ];

  const courtsOptions = [
    'Supreme Court of India',
    'Delhi High Court',
    'Bombay High Court',
    'Madras High Court',
    'Calcutta High Court',
    'Karnataka High Court',
    'Punjab & Haryana High Court',
    'Gujarat High Court',
    'Rajasthan High Court',
    'Uttar Pradesh High Court'
  ];

  const judgesOptions = [
    'Justice D.Y. Chandrachud',
    'Justice S.A. Bobde',
    'Justice N.V. Ramana',
    'Justice U.U. Lalit',
    'Justice A.M. Khanwilkar',
    'Justice L. Nageswara Rao',
    'Justice H.L. Dattu',
    'Justice T.S. Thakur',
    'Justice J.S. Khehar',
    'Justice Dipak Misra'
  ];

  const partiesOptions = [
    'State of Maharashtra',
    'Union of India',
    'Reliance Industries Ltd.',
    'Tata Consultancy Services',
    'Infosys Technologies Ltd.',
    'Bharat Petroleum Corporation',
    'Indian Oil Corporation',
    'State Bank of India',
    'HDFC Bank Ltd.',
    'ICICI Bank Ltd.'
  ];

  // Mock search results
  const searchResults = [
    {
      id: '1',
      caseId: '2025 (KER) ICO 88888',
      headnote: 'Arbitration and Conciliation Act, 1996 - Sect. 11(6) - Appointment of arbitrator - Application under Sect. 11(6) for appointment of arbitrator when there is a failure on the part of the appointing authority to appoint an arbitrator within the stipulated period...'
    },
    {
      id: '2',
      caseId: '2024 (DEL) ICO 77777',
      headnote: 'Indian Penal Code, 1860 - Sect. 302 - Murder - Conviction under Sect. 302 IPC - Circumstantial evidence - Chain of circumstances must be complete and conclusive - Benefit of doubt...'
    },
    {
      id: '3',
      caseId: '2023 (BOM) ICO 66666',
      headnote: 'Constitution of India - Art. 14 - Equality before law - Classification test - Reasonable classification based on intelligible differentia - Constitutional validity of statute...'
    }
  ];

  useSEO(SEOConfigs.search);

  const handleSearch = () => {
    setShowResults(true);
  };

  const handleEditSearch = () => {
    setShowResults(false);
  };

  const handleCasePress = (caseItem: any) => {
    setSelectedCase(caseItem);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedCase(null);
  };

  const handleBookmarkPress = () => {
    setModalVisible(false);
    setTimeout(() => {
      setBookmarkModalVisible(true);
    }, 300);
  };

  const handleCloseBookmarkModal = () => {
    setBookmarkModalVisible(false);
  };

  // Render Database Search Form
  const renderSearchForm = () => (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../../assets/logo.svg')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Indian Cases</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => Alert.alert('Support', 'Contact support feature coming soon!')}
          >
            <Ionicons name="headset-outline" size={24} color="#999" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content Area */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Search Form */}
        <View style={styles.searchFormContainer}>
          <View style={styles.searchForm}>
            {/* Search Type Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity style={styles.toggleActive}>
                <Text style={styles.toggleActiveText}>Database Search</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toggleInactive}>
                <Text style={styles.toggleInactiveText}>myPara Legal AI</Text>
              </TouchableOpacity>
            </View>

            {/* Input Fields */}
            <View style={styles.inputField}>
              <TextInput
                style={styles.textInput}
                placeholder="Text"
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <View style={styles.inputField}>
              <Dropdown
                placeholder="Acts with sections"
                options={actsOptions}
                selectedValue={selectedActs}
                onSelect={setSelectedActs}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputField, styles.inputFieldHalf]}>
                <Dropdown
                  placeholder="Courts"
                  options={courtsOptions}
                  selectedValue={selectedCourt}
                  onSelect={setSelectedCourt}
                />
              </View>
              <View style={[styles.inputField, styles.inputFieldHalf]}>
                <Dropdown
                  placeholder="Judges"
                  options={judgesOptions}
                  selectedValue={selectedJudge}
                  onSelect={setSelectedJudge}
                />
              </View>
            </View>

            <View style={styles.inputField}>
              <Dropdown
                placeholder="Parties"
                options={partiesOptions}
                selectedValue={selectedParty}
                onSelect={setSelectedParty}
              />
            </View>

            {/* Search Within Section */}
            <View style={styles.searchWithinSection}>
              <Text style={styles.searchWithinLabel}>SEARCH WITHIN</Text>
              <View style={styles.inputRow}>
                <View style={[styles.inputField, styles.inputFieldHalf]}>
                  <CalendarPicker
                    placeholder="Start Year"
                    selectedDate={startYear}
                    onSelect={setStartYear}
                  />
                </View>
                <View style={[styles.inputField, styles.inputFieldHalf]}>
                  <CalendarPicker
                    placeholder="End Year"
                    selectedDate={endYear}
                    onSelect={setEndYear}
                  />
                </View>
              </View>
      </View>

            {/* Case Count */}
            <Text style={styles.caseCountText}>Searching across 888888 number of cases.</Text>

            {/* View Results Button */}
            <TouchableOpacity style={styles.viewResultsButton} onPress={handleSearch}>
              <Ionicons name="search" size={20} color={COLORS.white} />
              <Text style={styles.viewResultsText}>View Results</Text>
    </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab="search"
        onNavigate={(tab) => {
          if (tab === 'home') {
            navigation.navigate('Home');
          } else if (tab === 'citation') {
            navigation.navigate('Citation');
          } else if (tab === 'profile') {
            navigation.navigate('Profile');
          }
        }}
      />
    </View>
  );

  // Render Search Results
  const renderSearchResults = () => (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../../assets/logo.svg')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Indian Cases</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => Alert.alert('Support', 'Contact support feature coming soon!')}
          >
            <Ionicons name="headset-outline" size={24} color="#999" />
          </TouchableOpacity>
        </View>
        </View>
        
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={handleEditSearch} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Search Results</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditSearch}>
              <Text style={styles.editText}>Edit Search</Text>
              <Ionicons name="open-outline" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={styles.contentContainer}>
        {/* Results Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            444 results from over, <Text style={styles.highlightText}>198545</Text> headnotes across, <Text style={styles.highlightText}>149739</Text> cases
                      </Text>
              </View>

        {/* Case Results */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentResults}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.resultsContainer}>
            {searchResults.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.caseCard}
                onPress={() => handleCasePress(item)}
                activeOpacity={0.7}
              >
                <View style={styles.caseContent}>
                  <Text style={styles.caseId}>{item.caseId}</Text>
                  <Text style={styles.headnoteLabel}>HEADNOTE:</Text>
                  <Text style={styles.headnoteText} numberOfLines={3}>
                    {item.headnote}
                  </Text>
                  <TouchableOpacity 
                    style={styles.viewJudgmentButton}
                    onPress={() => handleCasePress(item)}
                  >
                    <Text style={styles.viewJudgmentText}>VIEW JUDGEMENT</Text>
                  </TouchableOpacity>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color="#999" 
                  style={styles.chevronIcon}
                />
              </TouchableOpacity>
            ))}
            </View>
          </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab="search"
        onNavigate={(tab) => {
          if (tab === 'home') {
            navigation.navigate('Home');
          } else if (tab === 'citation') {
            navigation.navigate('Citation');
          } else if (tab === 'profile') {
            navigation.navigate('Profile');
          }
        }}
      />

          {/* Case Detail Modal */}
          <CaseDetailModal
            visible={modalVisible}
            onClose={handleCloseModal}
            onBookmarkPress={handleBookmarkPress}
            caseData={selectedCase}
          />

          {/* Bookmark Modal */}
          <BookmarkModal
            visible={bookmarkModalVisible}
            onClose={handleCloseBookmarkModal}
            caseData={selectedCase}
      />
    </View>
  );

  return showResults ? renderSearchResults() : renderSearchForm();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    backgroundColor: '#1A1A1A',
    paddingTop: Platform.OS === 'web' ? 20 : Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 32,
    height: 32,
    marginRight: 12,
    tintColor: COLORS.white,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  searchFormContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    minHeight: '100%',
  },
  searchForm: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)' }
      : {
          elevation: 4,
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        }
    ),
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    padding: 2,
    marginBottom: 20,
  },
  toggleActive: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 4,
    paddingVertical: 8,
    alignItems: 'center',
  },
  toggleInactive: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 4,
    paddingVertical: 8,
    alignItems: 'center',
  },
  toggleActiveText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 12,
  },
  toggleInactiveText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 12,
  },
  inputField: {
    marginBottom: 12,
  },
  inputFieldHalf: {
    flex: 1,
    marginRight: 8,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 6,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#333',
  },
  searchWithinSection: {
    marginTop: 12,
    marginBottom: 4,
  },
  searchWithinLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 12,
    letterSpacing: 1,
  },
  caseCountText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 10,
  },
  viewResultsButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewResultsText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  // Results view styles
  topHeader: {
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'web' ? 20 : Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  navBar: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    fontSize: 14,
    color: '#333',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
  },
  highlightText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContentResults: {
    paddingBottom: 100,
  },
  resultsContainer: {
    padding: 16,
  },
  caseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' }
      : {
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }
    ),
  },
  caseContent: {
    flex: 1,
  },
  caseId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headnoteLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#999',
    letterSpacing: 1,
    marginBottom: 4,
  },
  headnoteText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  viewJudgmentButton: {
    alignSelf: 'flex-start',
  },
  viewJudgmentText: {
    fontSize: 13,
    color: '#666',
    textDecorationLine: 'underline',
  },
  chevronIcon: {
    marginLeft: 12,
  },
});

export default SearchScreen;
