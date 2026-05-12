import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DFText } from './DFText';
import { DFButton } from './DFButton';
import { Colors, Spacing } from '../../theme';

interface DFEmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const DFEmptyState: React.FC<DFEmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <View style={styles.container}>
    <View style={styles.iconWrapper}>
      <Ionicons name={icon} size={40} color={Colors.grayLight} />
    </View>
    <DFText variant="title3" weight="semibold" center color={Colors.textSecondary} style={styles.title}>
      {title}
    </DFText>
    {description && (
      <DFText variant="subheadline" center color={Colors.textTertiary} style={styles.desc}>
        {description}
      </DFText>
    )}
    {actionLabel && onAction && (
      <DFButton label={actionLabel} onPress={onAction} style={styles.action} />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.grayBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  desc: {
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  action: {
    marginTop: Spacing.sm,
  },
});
