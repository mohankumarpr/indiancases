import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../constants';

const Footer = () => {
  const handleLinkPress = (url: string) => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  const handleEmailPress = () => {
    const email = 'support@indiancases.com';
    if (Platform.OS === 'web') {
      window.location.href = `mailto:${email}`;
    } else {
      Linking.openURL(`mailto:${email}`);
    }
  };

  // Show footer on web only
  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, TYPOGRAPHY.h4]}>IndianCases Research</Text>
          <Text style={[styles.description, TYPOGRAPHY.body]}>
            Your trusted platform for comprehensive legal case research and analysis.
            Access thousands of judgments and legal documents efficiently.
          </Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-twitter" size={20} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-linkedin" size={20} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, TYPOGRAPHY.h4]}>Quick Links</Text>
          <TouchableOpacity style={styles.linkItem}>
            <Text style={[styles.linkText, TYPOGRAPHY.body]}>Advanced Search</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem}>
            <Text style={[styles.linkText, TYPOGRAPHY.body]}>Case Categories</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem}>
            <Text style={[styles.linkText, TYPOGRAPHY.body]}>Recent Judgments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem}>
            <Text style={[styles.linkText, TYPOGRAPHY.body]}>Legal News</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, TYPOGRAPHY.h4]}>Support</Text>
          <TouchableOpacity style={styles.linkItem} onPress={handleEmailPress}>
            <Text style={[styles.linkText, TYPOGRAPHY.body]}>Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem}>
            <Text style={[styles.linkText, TYPOGRAPHY.body]}>Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem}>
            <Text style={[styles.linkText, TYPOGRAPHY.body]}>FAQ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem}>
            <Text style={[styles.linkText, TYPOGRAPHY.body]}>API Documentation</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, TYPOGRAPHY.h4]}>Legal</Text>
          <TouchableOpacity style={styles.linkItem}>
            <Text style={[styles.linkText, TYPOGRAPHY.body]}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem}>
            <Text style={[styles.linkText, TYPOGRAPHY.body]}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem}>
            <Text style={[styles.linkText, TYPOGRAPHY.body]}>Cookie Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem}>
            <Text style={[styles.linkText, TYPOGRAPHY.body]}>Disclaimer</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.bottomContent}>
          <Text style={[styles.copyright, TYPOGRAPHY.caption]}>
            © 2024 IndianCases Research. All rights reserved.
          </Text>
          <View style={styles.bottomLinks}>
            <TouchableOpacity style={styles.bottomLink}>
              <Text style={[styles.bottomLinkText, TYPOGRAPHY.caption]}>Privacy</Text>
            </TouchableOpacity>
            <Text style={[styles.separator, TYPOGRAPHY.caption]}>|</Text>
            <TouchableOpacity style={styles.bottomLink}>
              <Text style={[styles.bottomLinkText, TYPOGRAPHY.caption]}>Terms</Text>
            </TouchableOpacity>
            <Text style={[styles.separator, TYPOGRAPHY.caption]}>|</Text>
            <TouchableOpacity style={styles.bottomLink}>
              <Text style={[styles.bottomLinkText, TYPOGRAPHY.caption]}>Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    marginTop: 50,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 40,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  section: {
    flex: 1,
    marginRight: 30,
  },
  sectionTitle: {
    color: COLORS.white,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  description: {
    color: '#cccccc',
    lineHeight: 24,
    marginBottom: 20,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 10,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkItem: {
    marginBottom: 12,
  },
  linkText: {
    color: '#cccccc',
    textDecorationLine: 'underline',
  },
  bottomBar: {
    backgroundColor: '#0d0d0d',
    paddingVertical: 20,
  },
  bottomContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  copyright: {
    color: '#999999',
  },
  bottomLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  bottomLink: {
    // TouchableOpacity styling
  },
  bottomLinkText: {
    color: '#cccccc',
    textDecorationLine: 'underline',
  },
  separator: {
    color: '#666666',
  },
});

export default Footer;

