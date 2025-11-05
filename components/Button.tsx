import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'purple';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  iconSize?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  iconPosition = 'left',
  iconSize,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyles = [
    styles.button,
    styles[`${variant}Button`],
    styles[`${size}Button`],
    disabled && styles.disabledButton,
    style,
  ];

  const textStyles = [
    styles.buttonText,
    styles[`${variant}ButtonText`],
    styles[`${size}ButtonText`],
    disabled && styles.disabledButtonText,
    textStyle,
  ];

  const getIconColor = () => {
    if (disabled) return '#9CA3AF';
    switch (variant) {
      case 'primary':
      case 'destructive':
      case 'purple':
        return '#ffffff';
      case 'secondary':
        return '#374151';
      default:
        return '#ffffff';
    }
  };

  const getIconSize = () => {
    if (iconSize) return iconSize;
    switch (size) {
      case 'small':
        return 18;
      case 'medium':
        return 22;
      case 'large':
        return 24;
      default:
        return 22;
    }
  };

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {Icon && iconPosition === 'left' && (
        <Icon color={getIconColor()} size={getIconSize()} style={styles.iconLeft} />
      )}
      <Text style={textStyles}>{title}</Text>
      {Icon && iconPosition === 'right' && (
        <Icon color={getIconColor()} size={getIconSize()} style={styles.iconRight} />
      )}
    </TouchableOpacity>
  );
}

/* eslint-disable react-native/no-unused-styles */
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  // Variant styles
  primaryButton: {
    backgroundColor: '#EF4444',
    borderColor: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: '#E5E7EB',
    borderColor: '#ffffff',
  },
  destructiveButton: {
    backgroundColor: '#EF4444',
    borderColor: '#ffffff',
  },
  purpleButton: {
    backgroundColor: '#9333EA',
    borderColor: '#ffffff',
  },
  // Size styles
  smallButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  mediumButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  largeButton: {
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  // Disabled styles
  disabledButton: {
    backgroundColor: '#D1D5DB',
    borderColor: '#9CA3AF',
    opacity: 0.6,
  },
  // Text styles
  buttonText: {
    fontWeight: '900',
    textAlign: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 18,
  },
  destructiveButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  purpleButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  // Size-specific text styles
  smallButtonText: {
    fontSize: 16,
  },
  mediumButtonText: {
    fontSize: 18,
  },
  largeButtonText: {
    fontSize: 20,
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
  // Icon styles
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
/* eslint-enable react-native/no-unused-styles */
