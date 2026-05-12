import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, View } from 'react-native';
import { DFText } from './DFText';
import { Colors, Radius, Spacing } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface DFButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
  style?: object;
}

const variants = {
  primary: {
    bg: Colors.navy,
    textColor: Colors.white,
    border: Colors.navy,
  },
  secondary: {
    bg: Colors.orange,
    textColor: Colors.white,
    border: Colors.orange,
  },
  ghost: {
    bg: 'transparent',
    textColor: Colors.navy,
    border: Colors.grayBorder,
  },
  danger: {
    bg: Colors.danger,
    textColor: Colors.white,
    border: Colors.danger,
  },
};

const sizes = {
  sm: { height: 36, px: Spacing.md, fontSize: 13 },
  md: { height: 48, px: Spacing.lg, fontSize: 15 },
  lg: { height: 56, px: Spacing.xl, fontSize: 17 },
};

export const DFButton: React.FC<DFButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
}) => {
  const v = variants[variant];
  const s = sizes[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          height: s.height,
          paddingHorizontal: s.px,
          opacity: isDisabled ? 0.5 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.textColor} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Ionicons name={icon} size={s.fontSize + 2} color={v.textColor} style={styles.icon} />
          )}
          <DFText
            variant="headline"
            color={v.textColor}
            style={{ fontSize: s.fontSize }}
          >
            {label}
          </DFText>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    marginRight: 2,
  },
});
