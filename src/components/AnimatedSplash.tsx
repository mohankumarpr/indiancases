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
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create sequence of animations
    Animated.sequence([
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Step 1: Fast zoom from center to 100%
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Step 2: Zoom from 100% to 300% with 65° rotation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1, // 60 degrees (1 * 60 = 60°)
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // Step 3: Zoom from 300% to 100% while returning to 0° rotation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0, // Back to 0 degrees
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Step 4: Wait/pause at normal size before proceeding
      Animated.delay(1500), // Wait for 1.5 seconds
    ]).start(() => {
      // Animation complete callback
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });
  }, [scaleAnim, fadeAnim, rotateAnim, onAnimationComplete]);

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
                  inputRange: [0, 1, 3],
                  outputRange: [0.8, 1, 1.8],
                }),
              },
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '60deg'],
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
                  inputRange: [0, 1, 3],
                  outputRange: [0.9, 1, 1.5],
                }),
              },
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '60deg'],
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
            transform: [
              { scale: scaleAnim },
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '60deg'],
                }),
              },
            ],
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

