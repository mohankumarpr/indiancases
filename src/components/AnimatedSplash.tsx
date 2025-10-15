import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import LogoSVG from './LogoSVG';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashProps {
  onAnimationComplete?: () => void;
}

const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onAnimationComplete }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create sequence of animations
    Animated.sequence([
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Zoom in effect
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      // Zoom out to normal size
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      // Breathing effect - zoom in slightly
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 2 } // Loop twice
      ),
    ]).start(() => {
      // Animation complete callback
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });
  }, [scaleAnim, fadeAnim, onAnimationComplete]);

  return (
    <View style={styles.container}>
      {/* Optional: Add animated background circles */}
      <Animated.View
        style={[
          styles.circleOuter,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.08],
            }),
            transform: [
              {
                scale: scaleAnim.interpolate({
                  inputRange: [0, 1, 1.2],
                  outputRange: [0.8, 1, 1.3],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circleInner,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.12],
            }),
            transform: [
              {
                scale: scaleAnim.interpolate({
                  inputRange: [0, 1, 1.2],
                  outputRange: [0.9, 1, 1.2],
                }),
              },
            ],
          },
        ]}
      />
      
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LogoSVG width={150} height={150} color="#FFFFFF" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: width * 0.5,
    height: width * 0.5,
    maxWidth: 300,
    maxHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  circleOuter: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    maxWidth: 500,
    maxHeight: 500,
    borderRadius: width * 0.4,
    backgroundColor: '#ffffff',
    zIndex: 0,
  },
  circleInner: {
    position: 'absolute',
    width: width * 0.65,
    height: width * 0.65,
    maxWidth: 400,
    maxHeight: 400,
    borderRadius: width * 0.325,
    backgroundColor: '#ffffff',
    zIndex: 1,
  },
});

export default AnimatedSplash;

