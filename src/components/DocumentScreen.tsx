import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';

export interface DocSection {
  heading: string;
  body?: string;
  bullets?: string[];
}

interface Props {
  title: string;
  intro: string;
  lastUpdated: string;
  sections: DocSection[];
  icon: keyof typeof import('@expo/vector-icons/build/Ionicons').default.glyphMap;
}

const DocumentScreen: React.FC<Props> = ({ title, intro, lastUpdated, sections, icon }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: colors.primarySoft }]}>
          <Ionicons name={icon} size={32} color={colors.primary} />
          <Text style={[styles.heroTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.heroMeta, { color: colors.textMuted }]}>
            Last updated · {lastUpdated}
          </Text>
        </View>

        <Text style={[styles.intro, { color: colors.text }]}>{intro}</Text>

        {sections.map((s, i) => (
          <View key={s.heading} style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={[styles.sectionNum, { color: colors.primary }]}>
                {String(i + 1).padStart(2, '0')}
              </Text>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{s.heading}</Text>
            </View>
            {s.body ? (
              <Text style={[styles.sectionBody, { color: colors.textMuted }]}>{s.body}</Text>
            ) : null}
            {s.bullets?.map((b) => (
              <View key={b} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.bulletText, { color: colors.textMuted }]}>{b}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={[styles.footerCard, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}>
          <Ionicons name="mail-outline" size={20} color={colors.text} />
          <Text style={[styles.footerText, { color: colors.text }]}>
            Questions? Reach out at support@stridehub.app
          </Text>
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
  headerTitle: { flex: 1, fontSize: 17, fontFamily: 'Inter_600SemiBold' },
  content: { padding: 20, paddingBottom: 40 },
  hero: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  heroTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', marginTop: 12 },
  heroMeta: { fontSize: 12, marginTop: 4, fontFamily: 'Inter_500Medium', letterSpacing: 0.5 },
  intro: { fontSize: 15, lineHeight: 23, fontFamily: 'Inter_400Regular', marginBottom: 8 },
  section: { marginTop: 24 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionNum: { fontSize: 13, fontFamily: 'Inter_700Bold', marginRight: 10, letterSpacing: 1 },
  sectionTitle: { flex: 1, fontSize: 17, fontFamily: 'Inter_600SemiBold' },
  sectionBody: { fontSize: 14, lineHeight: 22, fontFamily: 'Inter_400Regular' },
  bulletRow: { flexDirection: 'row', marginTop: 8, paddingLeft: 4 },
  bulletDot: { width: 5, height: 5, borderRadius: 2.5, marginTop: 9, marginRight: 12 },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 22, fontFamily: 'Inter_400Regular' },
  footerCard: {
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  footerText: { flex: 1, marginLeft: 10, fontSize: 13, fontFamily: 'Inter_500Medium' },
});

export default DocumentScreen;
