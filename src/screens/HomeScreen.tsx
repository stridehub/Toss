import React, { useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useTheme, ThemeMode } from '../theme/ThemeContext';
import { useSettings } from '../store/SettingsStore';

type Nav = DrawerNavigationProp<Record<string, object | undefined>>;
type Face = 'heads' | 'tails' | null;

const HomeScreen: React.FC = () => {
  const { colors, isDark, setMode } = useTheme();
  const { flipAxis, voiceAssist } = useSettings();
  const navigation = useNavigation<Nav>();
  const { width, height } = useWindowDimensions();
  const [face, setFace] = useState<Face>(null);
  const [flipping, setFlipping] = useState(false);
  const spin = useRef(new Animated.Value(0)).current;

  const minDim = Math.min(width, height);
  const coinSize = Math.min(Math.max(minDim * 0.55, 200), 420);
  const coinLabelSize = Math.round(coinSize * 0.2);
  const hintSize = width >= 600 ? 18 : 14;
  const titleSize = width >= 600 ? 22 : 18;
  const headerBtnSize = width >= 600 ? 44 : 36;
  const headerIcon = width >= 600 ? 30 : 26;
  const themeIcon = width >= 600 ? 24 : 20;

  const toggleTheme = () => {
    const next: ThemeMode = isDark ? 'light' : 'dark';
    setMode(next);
  };

  const flip = () => {
    if (flipping) return;
    const next: Face = Math.random() < 0.5 ? 'heads' : 'tails';
    setFlipping(true);
    spin.setValue(0);
    // Swap the face at the spin's midpoint so it changes during an edge-on frame,
    // not as a snap right at the end.
    setTimeout(() => {
      setFace(next);
      if (voiceAssist) {
        Speech.stop();
        Speech.speak(next === 'heads' ? 'Heads' : 'Tails', { rate: 1, pitch: 1 });
      }
    }, 400);
    Animated.timing(spin, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setFlipping(false);
    });
  };

  const rotation = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '1080deg'] });
  const transform =
    flipAxis === 'horizontal'
      ? [{ perspective: 1000 }, { rotateY: rotation }]
      : [{ perspective: 1000 }, { rotateX: rotation }];

  // Hide the label entirely during the spin so users never see a stale face for a frame.
  let label: string;
  if (flipping) label = '';
  else if (face === null) label = 'TAP';
  else label = face.toUpperCase();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => navigation.openDrawer()}
          hitSlop={12}
          style={styles.iconBtn}
          accessibilityLabel="Open menu"
        >
          <Ionicons name="menu" size={headerIcon} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text, fontSize: titleSize }]}>Toss</Text>
        <Pressable
          onPress={toggleTheme}
          hitSlop={12}
          style={[
            styles.themeBtn,
            {
              backgroundColor: colors.surfaceAlt,
              borderColor: colors.border,
              width: headerBtnSize,
              height: headerBtnSize,
              borderRadius: headerBtnSize / 2,
            },
          ]}
          accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={themeIcon}
            color={colors.text}
          />
        </Pressable>
      </View>

      <View style={styles.center}>
        <Pressable onPress={flip} accessibilityLabel="Flip coin" disabled={flipping}>
          <Animated.View
            style={[
              styles.coin,
              {
                width: coinSize,
                height: coinSize,
                borderRadius: coinSize / 2,
                backgroundColor: colors.surface,
                borderColor: colors.primary,
                transform,
              },
            ]}
          >
            <Text style={[styles.coinLabel, { color: colors.accent, fontSize: coinLabelSize }]}>
              {label}
            </Text>
          </Animated.View>
        </Pressable>
        <Text style={[styles.hint, { color: colors.textMuted, fontSize: hintSize }]}>Tap to flip</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBtn: { padding: 4 },
  title: { flex: 1, textAlign: 'center', fontFamily: 'Inter_600SemiBold' },
  themeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  coin: {
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinLabel: { letterSpacing: 4, fontFamily: 'Inter_400Regular' },
  hint: { marginTop: 28, fontFamily: 'Inter_400Regular' },
});

export default HomeScreen;
