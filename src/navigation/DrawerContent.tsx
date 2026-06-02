import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useTheme } from '../theme/ThemeContext';

interface RowProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

const Row: React.FC<RowProps> = ({ iconName, label, onPress }) => {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: colors.surfaceAlt }}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
    >
      <Ionicons name={iconName} size={26} color={colors.text} style={styles.icon} />
      <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
};

function DrawerContent({ navigation }: Readonly<DrawerContentComponentProps>): React.ReactElement {
  const { colors } = useTheme();

  const go = (route: string) => {
    navigation.closeDrawer();
    navigation.navigate(route as never);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
      <View style={[styles.brand, { borderBottomColor: colors.border }]}>
        <Text style={[styles.brandName, { color: colors.text }]}>Toss</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Row iconName="settings-outline" label="Settings" onPress={() => go('Settings')} />
        <Row iconName="document-text-outline" label="Terms & Conditions" onPress={() => go('Terms')} />
        <Row iconName="shield-checkmark-outline" label="Privacy Policy" onPress={() => go('Privacy')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  brand: {
    minHeight: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  brandName: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  scroll: { paddingVertical: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  icon: { marginRight: 18 },
  rowLabel: { flex: 1, fontSize: 16, fontFamily: 'Inter_500Medium' },
});

export default DrawerContent;
