import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface LogoProps {
  size?: number;
  color?: 'white' | 'blue' | 'default';
  style?: any;
}

const Logo: React.FC<LogoProps> = ({ size = 100, color = 'white', style }) => {
  // Use the logo.png which should work across all platforms
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Image
        source={require('../../assets/logo.png')}
        style={[
          styles.logo,
          color === 'white' && styles.white,
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  white: {
    tintColor: '#ffffff',
  },
});

export default Logo;

