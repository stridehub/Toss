import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useStats, FlipRecord, HISTORY_LIMIT } from '../store/StatsStore';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// Hand-rolled instead of toLocaleString: Intl availability varies across
// Android Hermes builds, and "Today/Yesterday" needs custom logic anyway.
function formatWhen(at: number): string {
  const d = new Date(at);
  const now = new Date();
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  let day: string;
  if (sameDay(d, now)) day = 'Today';
  else if (sameDay(d, yesterday)) day = 'Yesterday';
  else day = `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  const h12 = d.getHours() % 12 || 12;
  const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
  return `${day}, ${h12}:${d.getMinutes().toString().padStart(2, '0')} ${ampm}`;
}

const HistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const { history, clearHistory } = useStats();
  const navigation = useNavigation();

  const confirmClear = () => {
    Alert.alert('Clear history?', 'This removes every recorded flip. Your stats stay untouched.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearHistory },
    ]);
  };

  const renderItem = ({ item }: { item: FlipRecord }) => {
    const isHeads = item.face === 'heads';
    return (
      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        <View
          style={[
            styles.chip,
            isHeads
              ? { backgroundColor: colors.primarySoft, borderColor: colors.primary }
              : { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.chipText, { color: isHeads ? colors.primary : colors.textMuted }]}>
            {isHeads ? 'H' : 'T'}
          </Text>
        </View>
        <Text style={[styles.face, { color: colors.text }]}>{item.face.toUpperCase()}</Text>
        <Text style={[styles.when, { color: colors.textMuted }]}>{formatWhen(item.at)}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={styles.iconBtn}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>History</Text>
        {history.length > 0 ? (
          <Pressable
            onPress={confirmClear}
            hitSlop={12}
            style={styles.iconBtn}
            accessibilityLabel="Clear history"
          >
            <Ionicons name="trash-outline" size={22} color={colors.textMuted} />
          </Pressable>
        ) : (
          <View style={{ width: 32 }} />
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="time-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No flips yet</Text>
          <Text style={[styles.emptySub, { color: colors.textMuted }]}>
            Toss the coin and every flip will show up here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => `${item.at}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Text style={[styles.count, { color: colors.textMuted }]}>
              {history.length} {history.length === 1 ? 'flip' : 'flips'} · newest first
            </Text>
          }
          ListFooterComponent={
            history.length >= HISTORY_LIMIT ? (
              <Text style={[styles.cap, { color: colors.textMuted }]}>
                Only the most recent {HISTORY_LIMIT} flips are kept.
              </Text>
            ) : null
          }
        />
      )}
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
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  count: { fontSize: 12, letterSpacing: 0.5, marginTop: 14, marginBottom: 6, fontFamily: 'Inter_600SemiBold' },
  cap: { fontSize: 12, marginTop: 14, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  chip: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 12,
  },
  chipText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  face: { flex: 1, fontSize: 14, letterSpacing: 1, fontFamily: 'Inter_600SemiBold' },
  when: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 17, fontFamily: 'Inter_600SemiBold', marginTop: 4 },
  emptySub: { fontSize: 14, textAlign: 'center', fontFamily: 'Inter_400Regular' },
});

export default HistoryScreen;
