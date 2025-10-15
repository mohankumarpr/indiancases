import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import Dropdown from './Dropdown';
import CalendarPicker from './CalendarPicker';

const { width } = Dimensions.get('window');

interface EditSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSearch: (searchParams: any) => void;
  initialSearchParams?: any;
}

const EditSearchModal: React.FC<EditSearchModalProps> = ({
  visible,
  onClose,
  onSearch,
  initialSearchParams = {},
}) => {
  const [searchTerms, setSearchTerms] = useState(['Partition']);
  const [textSearch, setTextSearch] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('');
  const [selectedJudge, setSelectedJudge] = useState('');
  const [selectedParty, setSelectedParty] = useState('');
  const [startYear, setStartYear] = useState('2001');
  const [endYear, setEndYear] = useState('2025');

  const courtsOptions = [
    'Supreme Court of India',
    'Delhi High Court',
    'Bombay High Court',
    'Madras High Court',
    'Calcutta High Court',
    'Kerala High Court',
    'Karnataka High Court',
    'Gujarat High Court',
  ];

  const judgesOptions = [
    'Justice Bela M Trivedi',
    'Justice Prasanna B Varale',
    'Justice D.Y. Chandrachud',
    'Justice Sanjay Kishan Kaul',
    'Justice S. Ravindra Bhat',
    'Justice P.S. Narasimha',
  ];

  const partiesOptions = [
    'Union of India',
    'State of Maharashtra',
    'State of Delhi',
    'Tata Motors Limited',
    'Reliance Industries Limited',
    'Infosys Technologies Limited',
  ];

  const handleRemoveSearchTerm = (term: string) => {
    setSearchTerms(searchTerms.filter(t => t !== term));
  };

  const handleAddSearchTerm = () => {
    if (textSearch.trim() && !searchTerms.includes(textSearch.trim())) {
      setSearchTerms([...searchTerms, textSearch.trim()]);
      setTextSearch('');
    }
  };

  const handleSearch = () => {
    const searchParams = {
      searchTerms,
      textSearch,
      court: selectedCourt,
      judge: selectedJudge,
      party: selectedParty,
      startYear,
      endYear,
    };
    onSearch(searchParams);
    onClose();
  };

  const isDesktop = Platform.OS === 'web' && width > 768;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <View style={[
          styles.modalContainer,
          isDesktop ? styles.modalDesktop : styles.modalMobile
        ]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit search</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Search Terms */}
            <View style={styles.section}>
              <View style={styles.searchTermsContainer}>
                {searchTerms.map((term, index) => (
                  <View key={index} style={styles.searchTermTag}>
                    <Text style={styles.searchTermText}>{term}</Text>
                    <TouchableOpacity 
                      onPress={() => handleRemoveSearchTerm(term)}
                      style={styles.removeTagButton}
                    >
                      <Ionicons name="close" size={14} color="#666" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Text Search */}
            <View style={styles.section}>
              <View style={styles.textSearchContainer}>
                <TextInput
                  style={styles.textSearchInput}
                  placeholder="Text Search"
                  placeholderTextColor="#999"
                  value={textSearch}
                  onChangeText={setTextSearch}
                  onSubmitEditing={handleAddSearchTerm}
                />
                <TouchableOpacity style={styles.searchDropdownButton}>
                  <Ionicons name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Dropdown Fields */}
            <View style={styles.section}>
              <View style={styles.dropdownRow}>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.dropdownLabel}>Courts</Text>
                  <Dropdown
                    options={courtsOptions}
                    selectedValue={selectedCourt}
                    onSelect={setSelectedCourt}
                    placeholder="Select Court"
                    isInsideModal={true}
                  />
                </View>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.dropdownLabel}>Judges</Text>
                  <Dropdown
                    options={judgesOptions}
                    selectedValue={selectedJudge}
                    onSelect={setSelectedJudge}
                    placeholder="Select Judge"
                    isInsideModal={true}
                  />
                </View>
              </View>
              <View style={styles.dropdownRow}>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.dropdownLabel}>Parties</Text>
                  <Dropdown
                    options={partiesOptions}
                    selectedValue={selectedParty}
                    onSelect={setSelectedParty}
                    placeholder="Select Party"
                    isInsideModal={true}
                  />
                </View>
                <View style={styles.dropdownContainer}>
                  {/* Empty container for alignment */}
                </View>
              </View>
            </View>

            {/* Search Within Section */}
            <View style={styles.section}>
              <Text style={styles.searchWithinLabel}>SEARCH WITHIN</Text>
              <View style={styles.dateRangeContainer}>
                <View style={styles.dateFieldContainer}>
                  <Text style={styles.dateFieldLabel}>Start Year</Text>
                  <View style={styles.calendarInputContainer}>
                    <CalendarPicker
                      selectedDate={startYear}
                      onSelect={(date) => setStartYear(date.toString())}
                      placeholder="2001"
                    />
                  </View>
                </View>
                <View style={styles.dateFieldContainer}>
                  <Text style={styles.dateFieldLabel}>End Year</Text>
                  <View style={styles.calendarInputContainer}>
                    <CalendarPicker
                      selectedDate={endYear}
                      onSelect={(date) => setEndYear(date.toString())}
                      placeholder="2025"
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Search Summary */}
            <View style={styles.section}>
              <Text style={styles.searchSummary}>
                Searching across <Text style={styles.highlightNumber}>888888</Text> number of cases.
              </Text>
            </View>
          </ScrollView>

          {/* Footer Button */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.viewResultsButton} onPress={handleSearch}>
              <Ionicons name="search" size={20} color={COLORS.white} />
              <Text style={styles.viewResultsText}>View Results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    }),
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    maxHeight: '85%',
    width: '100%',
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0px 15px 50px rgba(0, 0, 0, 0.25)' }
      : {
          elevation: 15,
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: 15 },
          shadowOpacity: 0.25,
          shadowRadius: 25,
        }
    ),
  },
  modalDesktop: {
    width: '60%',
  },
  modalMobile: {
    width: '100%',
    marginHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  searchTermsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  searchTermTag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  searchTermText: {
    fontSize: 14,
    color: '#333',
  },
  removeTagButton: {
    padding: 2,
  },
  textSearchContainer: {
    position: 'relative',
  },
  textSearchInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingRight: 40,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#F8F8F8',
  },
  searchDropdownButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  dropdownRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  dropdownContainer: {
    flex: 1,
  },
  dropdownLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  searchWithinLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  dateFieldContainer: {
    flex: 1,
  },
  dateFieldLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  calendarInputContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    backgroundColor: '#F8F8F8',
  },
  searchSummary: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  highlightNumber: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  viewResultsButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 200,
  },
  viewResultsText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default EditSearchModal;
