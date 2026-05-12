import React, { useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { DFText, DFCard, DFButton } from '../../components/common';
import { BalanceCard } from '../../components/dashboard/BalanceCard';
import { QuickStats } from '../../components/dashboard/QuickStats';
import { TransactionItem } from '../../components/transactions/TransactionItem';
import { Colors, Spacing } from '../../theme';
import { useDashboardStore, useAuthStore } from '../../store';
import { formatCurrency } from '../../utils/format';

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { data, isLoading, fetch } = useDashboardStore();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetch();
  }, []);

  const onRefresh = useCallback(() => {
    fetch();
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Gestor';

  const quickStats = data
    ? [
        {
          label: 'Obras Ativas',
          value: String(data.activeProjects),
          icon: 'construct-outline' as const,
          iconBg: Colors.infoLight,
          iconColor: Colors.info,
          sub: 'em andamento',
        },
        {
          label: 'Margem',
          value: `${data.month.margem}%`,
          icon: 'trending-up-outline' as const,
          iconBg: parseFloat(data.month.margem) >= 0 ? Colors.successLight : Colors.dangerLight,
          iconColor: parseFloat(data.month.margem) >= 0 ? Colors.success : Colors.danger,
          sub: 'este mês',
        },
        {
          label: 'Pendências',
          value: String(
            data.recentTransactions.filter((t) => t.status === 'pendente' || t.status === 'atrasado').length
          ),
          icon: 'time-outline' as const,
          iconBg: Colors.warningLight,
          iconColor: Colors.warning,
          sub: 'transações',
        },
      ]
    : [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={Colors.navy} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <DFText variant="subheadline" color={Colors.textSecondary}>
              Olá, {firstName} 👋
            </DFText>
            <DFText variant="title2" weight="bold" color={Colors.navy}>
              Financeiro
            </DFText>
          </View>
          <View style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={Colors.navy} />
          </View>
        </View>

        {isLoading && !data ? (
          <View style={styles.loadingCenter}>
            <ActivityIndicator color={Colors.navy} size="large" />
          </View>
        ) : data ? (
          <>
            <BalanceCard
              lucro={data.month.lucro}
              receita={data.month.receita}
              despesa={data.month.despesa}
              margem={data.month.margem}
              receitaGrowth={data.growth.receita}
            />

            <QuickStats stats={quickStats} />

            {/* Recent transactions */}
            <View style={styles.sectionHeader}>
              <DFText variant="title3" weight="bold" color={Colors.navy}>
                Últimas Transações
              </DFText>
              <DFText
                variant="subheadline"
                color={Colors.orange}
                onPress={() => navigation.navigate('Transações')}
              >
                Ver todas
              </DFText>
            </View>

            <DFCard style={styles.transactionsCard} padding={0} shadow="sm">
              {data.recentTransactions.length === 0 ? (
                <View style={styles.emptyTx}>
                  <DFText variant="subheadline" color={Colors.textTertiary} center>
                    Nenhuma transação registrada.
                  </DFText>
                </View>
              ) : (
                data.recentTransactions.slice(0, 6).map((tx, i) => (
                  <View key={tx.id}>
                    <TransactionItem
                      transaction={tx}
                      onPress={() => navigation.navigate('Transações')}
                    />
                    {i < Math.min(data.recentTransactions.length, 6) - 1 && (
                      <View style={styles.separator} />
                    )}
                  </View>
                ))
              )}
            </DFCard>

            {/* Quick actions */}
            <View style={styles.sectionHeader}>
              <DFText variant="title3" weight="bold" color={Colors.navy}>
                Ações Rápidas
              </DFText>
            </View>
            <View style={styles.actionsRow}>
              <DFButton
                label="Nova Receita"
                onPress={() => navigation.navigate('NovaTransação', { type: 'receita' })}
                variant="secondary"
                icon="add-outline"
                style={styles.actionBtn}
              />
              <DFButton
                label="Nova Despesa"
                onPress={() => navigation.navigate('NovaTransação', { type: 'despesa' })}
                variant="ghost"
                icon="remove-outline"
                style={styles.actionBtn}
              />
            </View>
          </>
        ) : null}

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  loadingCenter: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  transactionsCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.grayBackground,
    marginHorizontal: Spacing.md,
  },
  emptyTx: {
    padding: Spacing.xl,
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  actionBtn: {
    flex: 1,
  },
});
