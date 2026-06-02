import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme, ThemeMode } from '../theme/ThemeContext';
import { useSettings } from '../store/SettingsStore';

const ModeOption: React.FC<{ value: ThemeMode; label: string; current: ThemeMode; onPick: (m: ThemeMode) => void }> = ({
  value,
  label,
  current,
  onPick,
}) => {
  const { colors } = useTheme();
  const active = current === value;
  return (
    <Pressable
      onPress={() => onPick(value)}
      style={[
        styles.modeChip,
        {
          backgroundColor: active ? colors.primarySoft : colors.surfaceAlt,
          borderColor: active ? colors.primary : colors.border,
        },
      ]}
    >
      <Text style={[styles.modeText, { color: active ? colors.primary : colors.text }]}>{label}</Text>
    </Pressable>
  );
};

const SettingsScreen: React.FC = () => {
  const { colors, mode, setMode } = useTheme();
  const { voiceAssist, setVoiceAssist } = useSettings();
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
          <View style={styles.modeRow}>
            <ModeOption value="light" label="Light" current={mode} onPick={setMode} />
            <ModeOption value="dark" label="Dark" current={mode} onPick={setMode} />
            <ModeOption value="system" label="System" current={mode} onPick={setMode} />
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
  modeRow: { flexDirection: 'row', marginTop: 12 },
  modeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
  modeText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
});

export default SettingsScreen;
