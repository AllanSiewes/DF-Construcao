import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DFText } from './DFText';
import { Colors, Radius } from '../../theme';

interface DFBadgeProps {
  label: string;
  color?: string;
  bgColor?: string;
  size?: 'sm' | 'md';
}

export const DFBadge: React.FC<DFBadgeProps> = ({
  label,
  color = Colors.navy,
  bgColor,
  size = 'md',
}) => {
  const bg = bgColor || `${color}18`;
  return (
    <View style={[styles.badge, { backgroundColor: bg }, size === 'sm' && styles.sm]}>
      <DFText
        variant="caption1"
        color={color}
        weight="semibold"
        style={{ fontSize: size === 'sm' ? 10 : 11 }}
      >
        {label}
      </DFText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
