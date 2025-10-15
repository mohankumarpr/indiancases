import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { COLORS } from '../constants';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: any;
  maxWidth?: number;
}

const { width: screenWidth } = Dimensions.get('window');

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  style,
  maxWidth = 1200,
}) => {
  const isTablet = screenWidth >= 768;
  const isDesktop = screenWidth >= 1024;

  const responsiveStyle = [
    styles.container,
    style,
    isTablet && styles.tabletContainer,
    isDesktop && { maxWidth: maxWidth, alignSelf: 'center' },
  ];

  return <View style={responsiveStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabletContainer: {
    // Add tablet-specific styling here if needed
  },
});

export default ResponsiveContainer;

