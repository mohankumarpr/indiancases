import React, { useState } from 'react';
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

type CitationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Citation'>;

const CitationScreen = () => {
  const navigation = useNavigation<CitationScreenNavigationProp>();
  
  const [icoState, setIcoState] = useState('');
  const [icoYear, setIcoYear] = useState('');
  const [icoNumber, setIcoNumber] = useState('');
  const [icoCode, setIcoCode] = useState('');
  
  const [neutralYear, setNeutralYear] = useState('');
  const [neutralState, setNeutralState] = useState('');
  const [neutralNumber, setNeutralNumber] = useState('');

  const [favoriteJournals, setFavoriteJournals] = useState(['Kerala Law Journal']);

  const journals = [
    'Kerala Law Journal',
    'Kerala High Court Cases',
    'Kerala Law Decisions',
  ];

  const handleIcoSubmit = () => {
    console.log('ICO Citation submitted:', { icoState, icoYear, icoNumber, icoCode });
    // TODO: Implement ICO citation search
  };

  const handleNeutralSubmit = () => {
    console.log('Neutral Citation submitted:', { neutralYear, neutralState, neutralNumber });
    // TODO: Implement neutral citation search
  };

  const toggleFavorite = (journal: string) => {
    if (favoriteJournals.includes(journal)) {
      setFavoriteJournals(favoriteJournals.filter(j => j !== journal));
    } else {
      setFavoriteJournals([...favoriteJournals, journal]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header with Logo */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <Ionicons name="library" size={24} color="#333" />
          <Text style={styles.headerTitle}>Citation</Text>
        </View>
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
          {journals.map((journal, index) => (
            <View key={journal}>
              <TouchableOpacity 
                style={styles.journalItem}
                onPress={() => toggleFavorite(journal)}
              >
                <Text style={styles.journalName}>{journal}</Text>
                <TouchableOpacity 
                  onPress={() => toggleFavorite(journal)}
                  style={styles.starButton}
                >
                  <Ionicons 
                    name={favoriteJournals.includes(journal) ? "star" : "star-outline"} 
                    size={20} 
                    color={favoriteJournals.includes(journal) ? COLORS.primary : "#999"} 
                  />
                </TouchableOpacity>
              </TouchableOpacity>
              {index < journals.length - 1 && <View style={styles.journalSeparator} />}
            </View>
          ))}
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
  },
  headerTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    letterSpacing: 0.5,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputField: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#F8F8F8',
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  journalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
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
});

export default CitationScreen;
