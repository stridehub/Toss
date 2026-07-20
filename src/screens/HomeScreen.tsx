import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Alert,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useTheme, ThemeMode } from '../theme/ThemeContext';
import { useSettings } from '../store/SettingsStore';
import { useStats, CoinFace } from '../store/StatsStore';

type Nav = DrawerNavigationProp<Record<string, object | undefined>>;
type Face = CoinFace | null;

const flipSfx = require('../../assets/sfx-flip.wav');
const landSfx = require('../../assets/sfx-land.wav');

const HomeScreen: React.FC = () => {
  const { colors, isDark, setMode } = useTheme();
  const { flipAxis, voiceAssist, haptics, sound } = useSettings();
  const { heads, tails, total, streak, streakFace, recent, recordFlip, resetStats } = useStats();
  const navigation = useNavigation<Nav>();
  const { width, height } = useWindowDimensions();
  const [face, setFace] = useState<Face>(null);
  const [flipping, setFlipping] = useState(false);
  const spin = useRef(new Animated.Value(0)).current;
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flipPlayer = useAudioPlayer(flipSfx);
  const landPlayer = useAudioPlayer(landSfx);

  useEffect(() => {
    // Coin effects behave like keyboard clicks: they respect the phone's
    // silent switch and never take audio focus from the user's music.
    setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' }).catch(
      () => {},
    );
  }, []);

  const minDim = Math.min(width, height);
  const coinSize = Math.min(Math.max(minDim * 0.55, 200), 420);
  const coinLabelSize = Math.round(coinSize * 0.2);
  const hintSize = width >= 600 ? 18 : 14;
  const titleSize = width >= 600 ? 22 : 18;
  const headerBtnSize = width >= 600 ? 44 : 36;
  const headerIcon = width >= 600 ? 30 : 26;
  const themeIcon = width >= 600 ? 24 : 20;

  useEffect(
    () => () => {
      if (swapTimer.current) clearTimeout(swapTimer.current);
      Speech.stop();
    },
    [],
  );

  const toggleTheme = () => {
    const next: ThemeMode = isDark ? 'light' : 'dark';
    setMode(next);
  };

  const flip = () => {
    if (flipping) return;
    const next: CoinFace = Math.random() < 0.5 ? 'heads' : 'tails';
    setFlipping(true);
    spin.setValue(0);
    if (haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (sound) {
      flipPlayer.seekTo(0);
      flipPlayer.play();
    }
    // Swap the face at the spin's midpoint so it changes during an edge-on frame,
    // not as a snap right at the end.
    swapTimer.current = setTimeout(() => setFace(next), 400);
    Animated.timing(spin, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      setFlipping(false);
      if (!finished) return;
      if (haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      if (sound) {
        landPlayer.seekTo(0);
        landPlayer.play();
      }
      recordFlip(next);
      const spoken = next === 'heads' ? 'Heads' : 'Tails';
      if (voiceAssist) {
        Speech.stop();
        Speech.speak(spoken, { rate: 1, pitch: 1 });
      } else {
        // Voice assist off: still surface the result to screen-reader users.
        AccessibilityInfo.announceForAccessibility(spoken);
      }
    });
  };

  const confirmReset = () => {
    Alert.alert('Reset stats?', 'This clears your heads/tails counts and recent flips.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: resetStats },
    ]);
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
        <Pressable
          onPress={flip}
          accessibilityRole="button"
          accessibilityLabel="Flip coin"
          disabled={flipping}
        >
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

        {total > 0 && (
          <View style={styles.stats}>
            <View style={styles.countersRow}>
              <View
                style={[
                  styles.counterPill,
                  { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                ]}
                accessibilityLabel={`Heads ${heads}`}
              >
                <Text style={[styles.counterLabel, { color: colors.textMuted }]}>HEADS</Text>
                <Text style={[styles.counterValue, { color: colors.text }]}>{heads}</Text>
              </View>
              <View
                style={[
                  styles.counterPill,
                  { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                ]}
                accessibilityLabel={`Tails ${tails}`}
              >
                <Text style={[styles.counterLabel, { color: colors.textMuted }]}>TAILS</Text>
                <Text style={[styles.counterValue, { color: colors.text }]}>{tails}</Text>
              </View>
              <Pressable
                onPress={confirmReset}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Reset stats"
                style={[
                  styles.resetBtn,
                  { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                ]}
              >
                <Ionicons name="refresh" size={16} color={colors.textMuted} />
              </Pressable>
            </View>

            <View style={styles.recentRow} accessibilityLabel={`Last ${recent.length} flips`}>
              {recent.map((f, i) => (
                <View
                  key={`${i}-${f}`}
                  style={[
                    styles.chip,
                    f === 'heads'
                      ? { backgroundColor: colors.primarySoft, borderColor: colors.primary }
                      : { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: f === 'heads' ? colors.primary : colors.textMuted },
                    ]}
                  >
                    {f === 'heads' ? 'H' : 'T'}
                  </Text>
                </View>
              ))}
            </View>

            {streak >= 2 && streakFace && (
              <Text style={[styles.streak, { color: colors.textMuted }]}>
                {streak} × {streakFace.toUpperCase()} in a row
              </Text>
            )}
          </View>
        )}
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
  stats: { marginTop: 20, alignItems: 'center', gap: 10 },
  countersRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  counterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  counterLabel: { fontSize: 11, letterSpacing: 1, fontFamily: 'Inter_600SemiBold' },
  counterValue: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  resetBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  recentRow: { flexDirection: 'row', gap: 6 },
  chip: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  chipText: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  streak: { fontSize: 13, fontFamily: 'Inter_500Medium' },
});

export default HomeScreen;
