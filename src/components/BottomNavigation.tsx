import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

interface BottomNavigationProps {
  activeTab?: 'home' | 'citation' | 'search' | 'statutes' | 'bookmarks';
  onNavigate?: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  activeTab = 'home',
  onNavigate 
}) => {
  const navigationItems = [
    { key: 'home', icon: 'home', label: 'Home' },
    { key: 'citation', icon: 'book', label: 'Citation' },
    { key: 'search', icon: 'search', label: 'Search' },
    { key: 'statutes', icon: 'bar-chart', label: 'Statutes' },
    { key: 'bookmarks', icon: 'bookmark', label: 'Bookmarks' },
  ];

  const handlePress = (key: string) => {
    if (onNavigate) {
      onNavigate(key);
    }
  };

  return (
    <View style={styles.container}>
      {navigationItems.map((item) => {
        const isActive = activeTab === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            style={[styles.navItem, isActive && styles.navItemActive]}
            onPress={() => handlePress(item.key)}
          >
            <Ionicons 
              name={item.icon as any} 
              size={18} 
              color={isActive ? COLORS.white : '#999'} 
            />
            <Text style={[styles.navText, isActive && styles.navTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    paddingVertical: 12,
    paddingHorizontal: 4,
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 8,
    ...(Platform.OS === 'web' && {
      position: 'fixed' as any,
    }),
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 60,
    flex: 1,
  },
  navItemActive: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.white,
    borderRadius: 0,
  },
  navText: {
    color: '#999',
    fontSize: 10,
    marginTop: 1,
    textAlign: 'center',
  },
  navTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default BottomNavigation;
