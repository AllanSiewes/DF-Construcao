import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleSheet, TouchableOpacity } from 'react-native';
import { DFText } from './DFText';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface DFInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  isPassword?: boolean;
}

export const DFInput: React.FC<DFInputProps> = ({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword = false,
  style,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const borderColor = error
    ? Colors.danger
    : focused
    ? Colors.navy
    : Colors.grayBorder;

  return (
    <View style={styles.container}>
      {label && (
        <DFText variant="subheadline" weight="medium" color={Colors.textSecondary} style={styles.label}>
          {label}
        </DFText>
      )}
      <View style={[styles.inputWrapper, { borderColor }]}>
        {leftIcon && (
          <Ionicons name={leftIcon} size={18} color={focused ? Colors.navy : Colors.grayLight} style={styles.leftIcon} />
        )}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.textDisabled}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {(rightIcon || isPassword) && (
          <TouchableOpacity
            onPress={isPassword ? () => setShowPassword(!showPassword) : onRightIconPress}
            style={styles.rightIcon}
          >
            <Ionicons
              name={isPassword ? (showPassword ? 'eye-off-outline' : 'eye-outline') : rightIcon!}
              size={18}
              color={Colors.grayLight}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <DFText variant="caption1" color={Colors.danger} style={styles.message}>
          {error}
        </DFText>
      )}
      {helper && !error && (
        <DFText variant="caption1" color={Colors.textTertiary} style={styles.message}>
          {helper}
        </DFText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    paddingVertical: Spacing.sm + 2,
    fontWeight: '400',
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIcon: {
    padding: 4,
    marginLeft: Spacing.sm,
  },
  message: {
    marginTop: 4,
    marginLeft: 2,
  },
});
