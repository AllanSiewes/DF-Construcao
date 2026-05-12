import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DFText } from '../common/DFText';
import { Colors, Spacing, Radius } from '../../theme';
import { Transaction } from '../../types';
import { formatCurrency, formatDate, transactionStatusColor } from '../../utils/format';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
  showProject?: boolean;
}

const categoryIconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  'hard-hat': 'construct-outline',
  wallet: 'wallet-outline',
  'clipboard-list': 'clipboard-outline',
  'plus-circle': 'add-circle-outline',
  package: 'cube-outline',
  users: 'people-outline',
  tool: 'build-outline',
  truck: 'car-outline',
  droplet: 'water-outline',
  coffee: 'cafe-outline',
  'file-text': 'document-text-outline',
  'minus-circle': 'remove-circle-outline',
};

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
  showProject = true,
}) => {
  const isReceita = transaction.type === 'receita';
  const amountColor = isReceita ? Colors.success : Colors.danger;
  const statusColor = transactionStatusColor[transaction.status] || Colors.gray;

  const iconName = transaction.category?.icon
    ? (categoryIconMap[transaction.category.icon] || 'ellipse-outline')
    : isReceita
    ? 'arrow-down-circle-outline'
    : 'arrow-up-circle-outline';

  const iconBg = isReceita ? Colors.successLight : Colors.dangerLight;
  const iconColor = isReceita ? Colors.success : Colors.danger;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.container}
    >
      <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={20} color={iconColor} />
      </View>

      <View style={styles.info}>
        <DFText variant="subheadline" weight="medium" color={Colors.textPrimary} numberOfLines={1}>
          {transaction.description}
        </DFText>
        <View style={styles.metaRow}>
          <DFText variant="caption1" color={Colors.textTertiary}>
            {formatDate(transaction.date)}
          </DFText>
          {transaction.category && (
            <>
              <View style={styles.dot} />
              <DFText variant="caption1" color={Colors.textTertiary} numberOfLines={1}>
                {transaction.category.name}
              </DFText>
            </>
          )}
          {showProject && transaction.project && (
            <>
              <View style={styles.dot} />
              <DFText variant="caption1" color={Colors.orange} numberOfLines={1}>
                {transaction.project.name}
              </DFText>
            </>
          )}
        </View>
      </View>

      <View style={styles.right}>
        <DFText
          variant="subheadline"
          weight="semibold"
          color={amountColor}
        >
          {isReceita ? '+' : '-'} {formatCurrency(Number(transaction.amount))}
        </DFText>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textDisabled,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    alignSelf: 'center',
  },
});
