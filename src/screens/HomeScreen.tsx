import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import { RootStackParamList } from '../types';
import BottomNavigation from '../components/BottomNavigation';
import Footer from '../components/Footer';
import LogoSVG from '../components/LogoSVG';
import { useAuthContext } from '../context/AuthContext';
import useSEO from '../hooks/useSEO';
import { SEOConfigs } from '../utils/seo';
import { useToastMessage } from '../hooks/useToastMessage';

const { width } = Dimensions.get('window');

// Responsive breakpoints
const isMobile = width < 768;
const isTablet = width >= 768 && width < 1024;
const isDesktop = width >= 1024;

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// Sample latest cases data
const LATEST_CASES = [
  {
    id: '1',
    date: 'Today, 21 June 2025',
    caseId: '2025 (KER) ICO 88888',
    headnote: 'Arbitration and Conciliation Act, 1996 - Sect. 11(6) - Appointment of Arbitrator - Application for appointment of arbitrator - Petitioner and respondent entered into agreement - Disputes arose between parties - Petitioner invoked arbitration clause...',
  },
  {
    id: '2',
    date: 'Today, 21 June 2025',
    caseId: '2025 (KER) ICO 88888',
    headnote: 'Arbitration and Conciliation Act, 1996 - Sect. 11(6) - Appointment of Arbitrator - Application for appointment of arbitrator - Petitioner and respondent entered into agreement - Disputes arose between parties - Petitioner invoked arbitration clause...',
  },
];

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuthContext();
  const { showSuccess, showError, showWarning, showInfo } = useToastMessage();
  const [showAlert, setShowAlert] = useState(true);

  // SEO optimization
  useSEO(SEOConfigs.home);

  const handleCasePress = (caseItem: any) => {
    navigation.navigate('CaseDetail', { caseId: caseItem.id });
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <LogoSVG 
            width={24} 
            height={24} 
            color="#333333" 
          />
          <Text style={styles.headerTitle}>Indian Cases</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => showInfo('Support', 'Contact support feature coming soon!')}
          >
            <Ionicons name="headset-outline" size={24} color="#999" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileContainer}>
            <View style={styles.userInfoRow}>
              <View style={styles.userTextContainer}>
                <Text style={styles.greetingText}>
                  Hi, {user?.name || 'User Name'}
                </Text>
                <View style={styles.contactInfo}>
                  <View style={styles.contactRow}>
                    <Ionicons name="mail-outline" size={16} color="#666" />
                    <Text style={styles.contactText}>
                      {user?.email || 'primary.account@email.com'}
                    </Text>
          </View>
                  <View style={styles.contactRow}>
                    <Ionicons name="call-outline" size={16} color="#666" />
                    <Text style={styles.contactText}>+91-9888888888</Text>
            </View>
          </View>
              </View>
              <TouchableOpacity 
                style={styles.profileIconContainer}
                onPress={handleProfilePress}
                activeOpacity={0.7}
              >
                <Ionicons name="person" size={32} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Alerts Box */}
            {showAlert && (
              <View style={styles.alertBox}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertTitle}>ALERTS</Text>
                  <TouchableOpacity onPress={() => setShowAlert(false)}>
                    <Ionicons name="close" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.alertMessage}>
                  Your subscription is available till 19/6/2026
                </Text>
              </View>
            )}
            </View>
          </View>

        {/* Latest Cases Section */}
        <View style={styles.latestCasesSection}>
          <View style={styles.latestCasesContainer}>
            <Text style={styles.sectionTitle}>LATEST CASES</Text>
            
            {LATEST_CASES.map((caseItem) => (
              <TouchableOpacity
                key={caseItem.id}
                style={styles.caseCard}
                onPress={() => handleCasePress(caseItem)}
                activeOpacity={0.7}
              >
                <View style={styles.caseContent}>
                  <Text style={styles.caseDate}>{caseItem.date}</Text>
                  <Text style={styles.caseId}>{caseItem.caseId}</Text>
                  <Text style={styles.headnoteLabel}>HEADNOTE:</Text>
                  <Text style={styles.headnoteText} numberOfLines={3}>
                    {caseItem.headnote}
                  </Text>
                  <TouchableOpacity 
                    style={styles.viewJudgmentButton}
                    onPress={() => handleCasePress(caseItem)}
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
        </View>

        {/* Footer - Web only */}
        {Platform.OS === 'web' && <Footer />}
      </ScrollView>

      {/* Bottom Navigation - Mobile only */}
      <BottomNavigation 
        activeTab="home"
        onNavigate={(tab) => {
          if (tab === 'citation') {
            navigation.navigate('Citation');
          } else if (tab === 'search') {
            navigation.navigate('Search', {});
          } else if (tab === 'profile') {
            navigation.navigate('Profile');
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'web' ? 20 : Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16,
    paddingHorizontal: isMobile ? 16 : isTablet ? 24 : 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    fontSize: isMobile ? 18 : 20,
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
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'web' ? 0 : 100,
  },
  profileSection: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: isMobile ? 16 : isTablet ? 24 : 40,
    paddingVertical: isMobile ? 20 : isTablet ? 28 : 32,
  },
  profileContainer: {
    maxWidth: isDesktop ? 1200 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  userTextContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: isMobile ? 24 : isTablet ? 28 : 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  contactInfo: {
    gap: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
  },
  profileIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  alertMessage: {
    color: '#fff',
    fontSize: 14,
  },
  latestCasesSection: {
    paddingHorizontal: isMobile ? 16 : isTablet ? 24 : 40,
    paddingVertical: isMobile ? 24 : isTablet ? 32 : 40,
  },
  latestCasesContainer: {
    maxWidth: isDesktop ? 1200 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#999',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  caseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  caseContent: {
    flex: 1,
  },
  caseDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  caseId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  headnoteLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#999',
    letterSpacing: 1,
    marginBottom: 8,
  },
  headnoteText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
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

export default HomeScreen;
