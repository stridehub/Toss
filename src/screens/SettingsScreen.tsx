import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme, ThemeMode } from '../theme/ThemeContext';
import { useSettings, FlipAxis } from '../store/SettingsStore';

interface PillProps<V extends string> {
  value: V;
  label: string;
  active: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  onPick: (v: V) => void;
}

function Pill<V extends string>({ value, label, active, iconName, onPick }: Readonly<PillProps<V>>): React.ReactElement {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => onPick(value)}
      style={[
        styles.pill,
        {
          backgroundColor: active ? colors.primarySoft : colors.surfaceAlt,
          borderColor: active ? colors.primary : colors.border,
        },
      ]}
    >
      {iconName ? (
        <Ionicons
          name={iconName}
          size={16}
          color={active ? colors.primary : colors.textMuted}
          style={{ marginRight: 6 }}
        />
      ) : null}
      <Text style={[styles.pillText, { color: active ? colors.primary : colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const SettingsScreen: React.FC = () => {
  const { colors, mode, setMode } = useTheme();
  const { voiceAssist, setVoiceAssist, flipAxis, setFlipAxis, haptics, setHaptics, sound, setSound } =
    useSettings();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Appearance</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardLabel, { color: colors.text }]}>Theme</Text>
          <View style={styles.pillRow}>
            <Pill<ThemeMode> value="light" label="Light" active={mode === 'light'} onPick={setMode} />
            <Pill<ThemeMode> value="dark" label="Dark" active={mode === 'dark'} onPick={setMode} />
            <Pill<ThemeMode> value="system" label="System" active={mode === 'system'} onPick={setMode} />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Flip</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardLabel, { color: colors.text }]}>Flip direction</Text>
          <Text style={[styles.cardSub, { color: colors.textMuted }]}>
            How the coin spins when you tap it.
          </Text>
          <View style={styles.pillRow}>
            <Pill<FlipAxis>
              value="vertical"
              label="Vertical"
              iconName="swap-vertical"
              active={flipAxis === 'vertical'}
              onPick={setFlipAxis}
            />
            <Pill<FlipAxis>
              value="horizontal"
              label="Horizontal"
              iconName="swap-horizontal"
              active={flipAxis === 'horizontal'}
              onPick={setFlipAxis}
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardLabel, { color: colors.text }]}>Haptic feedback</Text>
              <Text style={[styles.cardSub, { color: colors.textMuted }]}>
                Vibrate as the coin spins and lands.
              </Text>
            </View>
            <Switch
              value={haptics}
              onValueChange={setHaptics}
              thumbColor={haptics ? colors.primary : '#FFFFFF'}
              trackColor={{ false: colors.border, true: colors.primarySoft }}
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardLabel, { color: colors.text }]}>Sound effects</Text>
              <Text style={[styles.cardSub, { color: colors.textMuted }]}>
                Play a coin sound as it spins and lands.
              </Text>
            </View>
            <Switch
              value={sound}
              onValueChange={setSound}
              thumbColor={sound ? colors.primary : '#FFFFFF'}
              trackColor={{ false: colors.border, true: colors.primarySoft }}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Assistance</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardLabel, { color: colors.text }]}>Voice assist</Text>
              <Text style={[styles.cardSub, { color: colors.textMuted }]}>
                Announce toss results out loud.
              </Text>
            </View>
            <Switch
              value={voiceAssist}
              onValueChange={setVoiceAssist}
              thumbColor={voiceAssist ? colors.primary : '#FFFFFF'}
              trackColor={{ false: colors.border, true: colors.primarySoft }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBtn: { padding: 4, width: 32 },
  title: { flex: 1, fontSize: 17, fontFamily: 'Inter_600SemiBold' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 12, letterSpacing: 1, marginTop: 12, marginBottom: 8, marginLeft: 4, fontFamily: 'Inter_700Bold' },
  card: {
    borderRadius: 14,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  cardSub: { fontSize: 13, marginTop: 2, fontFamily: 'Inter_400Regular' },
  pillRow: { flexDirection: 'row', marginTop: 12, flexWrap: 'wrap', gap: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
});

export default SettingsScreen;
