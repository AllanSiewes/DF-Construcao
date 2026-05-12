import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DFText } from '../common/DFText';
import { DFCard } from '../common/DFCard';
import { Colors, Spacing, Radius } from '../../theme';

interface StatItem {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  sub?: string;
}

interface QuickStatsProps {
  stats: StatItem[];
}

export const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => (
  <View style={styles.row}>
    {stats.map((stat, i) => (
      <DFCard key={i} style={styles.card} padding={Spacing.md}>
        <View style={[styles.iconBg, { backgroundColor: stat.iconBg }]}>
          <Ionicons name={stat.icon} size={18} color={stat.iconColor} />
        </View>
        <DFText variant="footnote" color={Colors.textSecondary} style={styles.label}>
          {stat.label}
        </DFText>
        <DFText variant="title3" weight="bold" color={Colors.textPrimary}>
          {stat.value}
        </DFText>
        {stat.sub && (
          <DFText variant="caption2" color={Colors.textTertiary} style={{ marginTop: 2 }}>
            {stat.sub}
          </DFText>
        )}
      </DFCard>
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  card: {
    flex: 1,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    marginBottom: 2,
  },
});
