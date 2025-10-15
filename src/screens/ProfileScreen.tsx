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
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import { RootStackParamList } from '../types';
import BottomNavigation from '../components/BottomNavigation';
import { useAuthContext } from '../context/AuthContext';
import useSEO from '../hooks/useSEO';
import { SEOConfigs } from '../utils/seo';

const { width } = Dimensions.get('window');

// Responsive breakpoints
const isMobile = width < 768;
const isTablet = width >= 768 && width < 1024;
const isDesktop = width >= 1024;

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user } = useAuthContext();
  
  const [phoneNumber, setPhoneNumber] = useState('8888888888');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [accountInfoExpanded, setAccountInfoExpanded] = useState(true);

  useSEO(SEOConfigs.home);

  const handleSupport = () => {
    Alert.alert('Support', 'Contact support feature coming soon!');
  };

  const handleUploadPhoto = () => {
    Alert.alert('Upload Photo', 'Photo upload feature coming soon!');
  };

  const handleEditPhone = () => {
    setIsEditingPhone(true);
  };

  const handleSavePhone = () => {
    setIsEditingPhone(false);
    Alert.alert('Success', 'Phone number updated!');
  };

  return (
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
            onPress={handleSupport}
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
        <View style={styles.contentContainer}>
          {/* Profile Picture Section */}
          <View style={styles.profilePictureSection}>
            <View style={styles.profilePictureContainer}>
              <View style={styles.profilePicture}>
                <Ionicons name="person" size={48} color="#99CCFF" />
              </View>
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={handleUploadPhoto}
              >
                <Ionicons name="pencil" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* User Info */}
          <View style={styles.userInfoSection}>
            <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'primary.account@email.com'}</Text>
          </View>

          {/* Account Information Section */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setAccountInfoExpanded(!accountInfoExpanded)}
            >
              <Text style={styles.sectionTitle}>Account Information</Text>
              <Ionicons 
                name={accountInfoExpanded ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#999" 
              />
            </TouchableOpacity>
            {accountInfoExpanded && (
              <View style={styles.sectionContent}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Member Since:</Text>
                  <Text style={styles.infoValue}>20/05/2025</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Expires On:</Text>
                  <Text style={styles.infoValue}>19/05/2026</Text>
                </View>
          </View>
        )}
      </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Phone Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>PHONE</Text>
          </View>
            <View style={styles.phoneInputContainer}>
              <TextInput
                style={[styles.phoneInput, !isEditingPhone && styles.phoneInputDisabled]}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                editable={isEditingPhone}
                keyboardType="phone-pad"
                maxLength={10}
              />
              {isEditingPhone ? (
                <TouchableOpacity onPress={handleSavePhone}>
                  <Ionicons name="checkmark" size={20} color="#007AFF" />
        </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleEditPhone}>
                  <Ionicons name="pencil-outline" size={18} color="#999" />
        </TouchableOpacity>
              )}
          </View>
      </View>

          {/* App Version */}
          <Text style={styles.appVersion}>App version 1.0, 2025</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab="home"
        onNavigate={(tab) => {
          if (tab === 'home') {
            navigation.navigate('Home');
          } else if (tab === 'search') {
            navigation.navigate('Search', {});
          } else if (tab === 'citation') {
            navigation.navigate('Citation');
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
    paddingBottom: Platform.OS === 'web' ? 40 : 120,
  },
  contentContainer: {
    maxWidth: isDesktop ? 600 : '100%',
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: isMobile ? 16 : isTablet ? 24 : 40,
    paddingTop: 32,
  },
  profilePictureSection: {
    marginBottom: 20,
  },
  profilePictureContainer: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E6F2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userInfoSection: {
    marginBottom: 24,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 24,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  phoneInputDisabled: {
    color: '#666',
  },
  appVersion: {
    fontSize: 12,
    color: '#999',
    marginTop: 32,
  },
});

export default ProfileScreen;
