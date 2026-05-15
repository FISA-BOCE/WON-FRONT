import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { GestureResponderEvent, Pressable, StyleSheet, Text } from 'react-native';

interface AuthButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  variant?: 'blue300' | 'secondary' | 'danger';
  style?: any;
  textStyle?: any;
}

export function AuthButton({
  title,
  onPress,
  disabled = false,
  variant = 'blue300',
  style,
  textStyle,
}: AuthButtonProps) {
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isSecondary ? styles.secondaryButton : styles.primaryButton,
        isDanger && styles.dangerButton,
        disabled && styles.disabledButton,
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.buttonText,
          isSecondary && styles.secondaryButtonText,
          isDanger && styles.dangerButtonText,
          disabled && styles.disabledButtonText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: AuthSpacing.lg,
  },
  primaryButton: {
    backgroundColor: AuthColors.blue300,
  },
  dangerButton: {
    backgroundColor: '#ff674d',
  },
  secondaryButton: {
    backgroundColor: AuthColors.lightBg,
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
  },
  disabledButton: {
    backgroundColor: AuthColors.lightBg,
    borderWidth: 0,
  },
  pressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.white,
  },
  disabledButtonText: {
    color: AuthColors.textDarkGray,
  },
  secondaryButtonText: {
    color: AuthColors.textDarkGray,
  },
  dangerButtonText: {
    color: AuthColors.white,
  },
});
