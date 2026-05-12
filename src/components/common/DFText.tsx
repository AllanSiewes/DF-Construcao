import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../theme';

type Variant =
  | 'largeTitle'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'headline'
  | 'body'
  | 'callout'
  | 'subheadline'
  | 'footnote'
  | 'caption1'
  | 'caption2';

interface DFTextProps extends TextProps {
  variant?: Variant;
  color?: string;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  center?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, object> = {
  largeTitle: { fontSize: Typography.xxxl, fontWeight: Typography.bold, letterSpacing: 0.37 },
  title1: { fontSize: Typography.xxl, fontWeight: Typography.bold, letterSpacing: 0.36 },
  title2: { fontSize: Typography.xl, fontWeight: Typography.bold, letterSpacing: 0.35 },
  title3: { fontSize: Typography.lg, fontWeight: Typography.semibold, letterSpacing: 0.3 },
  headline: { fontSize: Typography.base, fontWeight: Typography.semibold, letterSpacing: -0.4 },
  body: { fontSize: Typography.base, fontWeight: Typography.regular, letterSpacing: -0.4 },
  callout: { fontSize: 16, fontWeight: Typography.regular, letterSpacing: -0.3 },
  subheadline: { fontSize: Typography.sm, fontWeight: Typography.regular, letterSpacing: -0.1 },
  footnote: { fontSize: 12, fontWeight: Typography.regular, letterSpacing: 0 },
  caption1: { fontSize: Typography.xs, fontWeight: Typography.regular, letterSpacing: 0.07 },
  caption2: { fontSize: 10, fontWeight: Typography.regular, letterSpacing: 0.06 },
};

const weightMap = {
  regular: Typography.regular,
  medium: Typography.medium,
  semibold: Typography.semibold,
  bold: Typography.bold,
  extrabold: Typography.extrabold,
};

export const DFText: React.FC<DFTextProps> = ({
  variant = 'body',
  color = Colors.textPrimary,
  weight,
  center,
  style,
  children,
  ...props
}) => {
  return (
    <Text
      style={[
        variantStyles[variant],
        { color },
        weight && { fontWeight: weightMap[weight] },
        center && { textAlign: 'center' },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
