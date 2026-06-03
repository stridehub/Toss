import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

interface Props {
  onDone: () => void;
  durationMs?: number;
}

const SplashOverlay: React.FC<Props> = ({ onDone, durationMs = 1500 }) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 500,
      delay: 200,
      useNativeDriver: true,
    }).start();

    const t = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }).start(() => onDone());
    }, durationMs);

    return () => clearTimeout(t);
  }, [opacity, textOpacity, durationMs, onDone]);

  return (
    <Animated.View style={[styles.root, { opacity }]} pointerEvents="none">
      <View style={styles.center}>
        <Image
          source={require('../../assets/splash-image.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Animated.View style={[styles.bottom, { opacity: textOpacity }]}>
        <Text style={styles.brand}>POWERED BY STRIDEHUB</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    zIndex: 100,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 320, height: 320 },
  bottom: { paddingBottom: 48, paddingHorizontal: 24, alignItems: 'center' },
  brand: {
    color: '#FFFFFF',
    fontSize: 12,
    letterSpacing: 3,
    fontFamily: 'Inter_500Medium',
  },
});

export default SplashOverlay;
