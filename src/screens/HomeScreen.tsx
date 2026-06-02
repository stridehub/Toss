import React, { useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useTheme, ThemeMode } from '../theme/ThemeContext';

type Nav = DrawerNavigationProp<Record<string, object | undefined>>;
type Face = 'heads' | 'tails' | null;

const HomeScreen: React.FC = () => {
  const { colors, isDark, setMode } = useTheme();
  const navigation = useNavigation<Nav>();
  const [face, setFace] = useState<Face>(null);
  const [flipping, setFlipping] = useState(false);
  const spin = useRef(new Animated.Value(0)).current;

  const toggleTheme = () => {
    const next: ThemeMode = isDark ? 'light' : 'dark';
    setMode(next);
  };

  const flip = () => {
    if (flipping) return;
    const next: Face = Math.random() < 0.5 ? 'heads' : 'tails';
    setFlipping(true);
    spin.setValue(0);
    Animated.timing(spin, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setFace(next);
      setFlipping(false);
    });
  };

  const rotateY = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '1080deg'] });
  const label = face === null ? 'TAP' : face.toUpperCase();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => navigation.openDrawer()}
          hitSlop={12}
          style={styles.iconBtn}
          accessibilityLabel="Open menu"
        >
          <Ionicons name="menu" size={26} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Toss</Text>
        <Pressable
          onPress={toggleTheme}
          hitSlop={12}
          style={[styles.themeBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
          accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={20}
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
                backgroundColor: colors.surface,
                borderColor: colors.primary,
                transform: [{ perspective: 1000 }, { rotateY }],
              },
            ]}
          >
            <Text style={[styles.coinLabel, { color: colors.accent }]}>{label}</Text>
          </Animated.View>
        </Pressable>
        <Text style={[styles.hint, { color: colors.textMuted }]}>Tap to flip</Text>
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
  title: { flex: 1, textAlign: 'center', fontSize: 18, fontFamily: 'Inter_600SemiBold' },
  themeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  coin: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinLabel: { fontSize: 44, letterSpacing: 4, fontFamily: 'Inter_400Regular' },
  hint: { marginTop: 28, fontSize: 14, fontFamily: 'Inter_400Regular' },
});

export default HomeScreen;
