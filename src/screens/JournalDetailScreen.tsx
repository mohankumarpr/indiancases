import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS } from '../constants';
import { RootStackParamList } from '../types';
import BottomNavigation from '../components/BottomNavigation';
import LogoSVG from '../components/LogoSVG';

type JournalDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'JournalDetail'>;
type JournalDetailScreenRouteProp = RouteProp<RootStackParamList, 'JournalDetail'>;

interface JournalItem {
  uuid: string;
  name: string;
  public: boolean;
  path: string;
}

interface JudgmentItem {
  uuid: string;
  citation: string;
}

interface JournalDetailResponse {
  uuid: string;
  name: string;
  public: boolean;
  path: string;
  children: JournalItem[];
  judgments: JudgmentItem[];
}

const JournalDetailScreen = () => {
  const navigation = useNavigation<JournalDetailScreenNavigationProp>();
  const route = useRoute<JournalDetailScreenRouteProp>();
  const { journal } = route.params;

  const [journalData, setJournalData] = useState<JournalDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [subItems, setSubItems] = useState<Map<string, JournalDetailResponse>>(new Map());

  useEffect(() => {
    fetchJournalData();
  }, []);

  const fetchJournalData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📡 Fetching journal data from:', journal.path);
      const response = await fetch(journal.path);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch journal data: ${response.status}`);
      }

      const data: JournalDetailResponse = await response.json();
      console.log('✅ Journal data received:', data);
      setJournalData(data);

    } catch (error) {
      console.error('❌ Failed to fetch journal data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch journal data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubItemData = async (item: JournalItem) => {
    try {
      console.log('📡 Fetching sub-item data from:', item.path);
      const response = await fetch(item.path);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sub-item data: ${response.status}`);
      }

      const data: JournalDetailResponse = await response.json();
      console.log('✅ Sub-item data received:', data);
      
      setSubItems(prev => new Map(prev.set(item.uuid, data)));
    } catch (error) {
      console.error('❌ Failed to fetch sub-item data:', error);
    }
  };

  const toggleExpanded = (item: JournalItem) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(item.uuid)) {
      newExpanded.delete(item.uuid);
    } else {
      newExpanded.add(item.uuid);
      // Fetch sub-item data when expanding
      if (item.path && !subItems.has(item.uuid)) {
        fetchSubItemData(item);
      }
    }
    setExpandedItems(newExpanded);
  };

  const handleItemPress = (item: JournalItem) => {
    if (item.path) {
      toggleExpanded(item);
    }
  };

  const handleJudgmentPress = (judgment: JudgmentItem) => {
    console.log('📋 Judgment selected:', judgment);
    // TODO: Navigate to judgment details or search
  };

  const extractYearFromName = (name: string): string => {
    const parts = name.split(' | ');
    return parts.length > 1 ? parts[1] : '';
  };

  const extractVolumeFromName = (name: string): string => {
    const parts = name.split(' | ');
    return parts.length > 2 ? parts[2] : '';
  };

  const renderItem = (item: JournalItem, level: number = 0) => {
    const isExpanded = expandedItems.has(item.uuid);
    const subData = subItems.get(item.uuid);
    const year = extractYearFromName(item.name);
    const volume = extractVolumeFromName(item.name);
    const displayName = volume || year || item.name;

    return (
      <View key={item.uuid}>
        <TouchableOpacity
          style={[styles.itemContainer, { paddingLeft: 20 + (level * 20) }]}
          onPress={() => handleItemPress(item)}
        >
          <Text style={[
            styles.itemText,
            isExpanded && styles.expandedItemText,
            level > 0 && styles.subItemText
          ]}>
            {displayName}
          </Text>
          {item.path && (
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={16}
              color={isExpanded ? COLORS.primary : "#999"}
            />
          )}
        </TouchableOpacity>

        {isExpanded && subData && (
          <View>
            {subData.children.map(child => renderItem(child, level + 1))}
            {subData.judgments.map(judgment => (
              <TouchableOpacity
                key={judgment.uuid}
                style={[styles.judgmentContainer, { paddingLeft: 20 + ((level + 1) * 20) }]}
                onPress={() => handleJudgmentPress(judgment)}
              >
                <Text style={styles.judgmentText}>{judgment.citation}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{journal.name}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading journal details...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{journal.name}</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load journal: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchJournalData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{journal.name}</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>SELECT VOLUME</Text>
          
          {journalData?.children.map(item => renderItem(item))}
          
          {journalData?.judgments.map(judgment => (
            <TouchableOpacity
              key={judgment.uuid}
              style={styles.judgmentContainer}
              onPress={() => handleJudgmentPress(judgment)}
            >
              <Text style={styles.judgmentText}>{judgment.citation}</Text>
            </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  expandedItemText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  subItemText: {
    fontSize: 14,
    color: '#666',
  },
  judgmentContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  judgmentText: {
    fontSize: 14,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JournalDetailScreen;
