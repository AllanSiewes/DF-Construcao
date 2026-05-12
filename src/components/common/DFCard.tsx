import React from 'react';
import { View, ViewProps, StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Colors, Radius, Shadows, Spacing } from '../../theme';

interface DFCardProps extends ViewProps {
  children: React.ReactNode;
  padding?: number;
  onPress?: TouchableOpacityProps['onPress'];
  shadow?: 'sm' | 'md' | 'lg' | 'none';
}

export const DFCard: React.FC<DFCardProps> = ({
  children,
  padding = Spacing.md,
  onPress,
  shadow = 'sm',
  style,
  ...props
}) => {
  const shadowStyle = shadow === 'none' ? {} : Shadows[shadow];
  const cardStyle = [styles.card, shadowStyle, { padding }, style];

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={cardStyle} {...(props as any)}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
});
