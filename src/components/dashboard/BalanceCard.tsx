import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { DFText } from '../common/DFText';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { formatCurrency, formatPercent } from '../../utils/format';

interface BalanceCardProps {
  lucro: number;
  receita: number;
  despesa: number;
  margem: string;
  receitaGrowth?: string | null;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  lucro,
  receita,
  despesa,
  margem,
  receitaGrowth,
}) => {
  const isPositive = lucro >= 0;

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={[Colors.navy, Colors.navyLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Decorative circles */}
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <View style={styles.header}>
          <DFText variant="subheadline" color="rgba(255,255,255,0.7)">
            Resultado do Mês
          </DFText>
          {receitaGrowth && (
            <View style={styles.growthBadge}>
              <Ionicons
                name={parseFloat(receitaGrowth) >= 0 ? 'trending-up' : 'trending-down'}
                size={12}
                color={parseFloat(receitaGrowth) >= 0 ? '#4ade80' : '#f87171'}
              />
              <DFText
                variant="caption1"
                color={parseFloat(receitaGrowth) >= 0 ? '#4ade80' : '#f87171'}
                style={{ marginLeft: 4 }}
              >
                {formatPercent(receitaGrowth)}
              </DFText>
            </View>
          )}
        </View>

        <DFText
          variant="largeTitle"
          color={Colors.white}
          weight="bold"
          style={styles.mainValue}
        >
          {formatCurrency(lucro)}
        </DFText>

        <View style={styles.margemRow}>
          <View style={[styles.margemBadge, { backgroundColor: isPositive ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)' }]}>
            <DFText variant="caption1" color={isPositive ? '#4ade80' : '#f87171'} weight="semibold">
              Margem {margem}%
            </DFText>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={styles.statIconRow}>
              <View style={[styles.statDot, { backgroundColor: '#4ade80' }]} />
              <DFText variant="caption1" color="rgba(255,255,255,0.6)">Receitas</DFText>
            </View>
            <DFText variant="headline" color={Colors.white} weight="semibold">
              {formatCurrency(receita, true)}
            </DFText>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={styles.statIconRow}>
              <View style={[styles.statDot, { backgroundColor: '#f87171' }]} />
              <DFText variant="caption1" color="rgba(255,255,255,0.6)">Despesas</DFText>
            </View>
            <DFText variant="headline" color={Colors.white} weight="semibold">
              {formatCurrency(despesa, true)}
            </DFText>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  card: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: -60,
    right: -40,
  },
  circle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(249,115,22,0.12)',
    bottom: -30,
    left: -20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  mainValue: {
    marginBottom: Spacing.sm,
    fontSize: 34,
  },
  margemRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  margemBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: Spacing.md,
  },
});
