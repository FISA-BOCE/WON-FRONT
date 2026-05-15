import { StyleSheet, TextInput, View, ViewProps, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthColors, AuthSpacing } from '@/constants/authColors';

interface AuthInputProps extends Omit<TextInput['props'], 'style'> {
  label?: string;
  placeholder?: string;
  error?: string;
  containerStyle?: ViewProps['style'];
  rightButton?: {
    label: string;
    onPress: () => void;
  };
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onPasswordToggle?: () => void;
}

export function AuthInput({
  label,
  placeholder,
  error,
  containerStyle,
  rightButton,
  showPasswordToggle = false,
  isPasswordVisible = false,
  onPasswordToggle,
  ...props
}: AuthInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
            rightButton && styles.inputWithButton,
            showPasswordToggle && styles.inputWithIcon,
          ]}
          placeholderTextColor={AuthColors.textLightGray}
          placeholder={placeholder}
          secureTextEntry={showPasswordToggle && !isPasswordVisible}
          {...props}
        />
        {showPasswordToggle && (
          <Pressable 
            style={styles.passwordToggle}
            onPress={onPasswordToggle}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={20}
              color={AuthColors.textGray}
            />
          </Pressable>
        )}
        {rightButton && (
          <Pressable 
            style={styles.rightButton}
            onPress={rightButton.onPress}
          >
            {rightButton.label === '확인됨' && (
              <Ionicons
                name="checkmark"
                size={14}
                color={AuthColors.white}
                style={{ marginRight: 4 }}
              />
            )}
            <Text style={styles.rightButtonText}>{rightButton.label}</Text>
          </Pressable>
        )}
      </View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: AuthSpacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '400',
    color: AuthColors.textGray,
    marginBottom: AuthSpacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AuthColors.borderGray,
    paddingHorizontal: AuthSpacing.md,
    fontSize: 14,
    color: AuthColors.textBlack,
    backgroundColor: AuthColors.white,
  },
  inputError: {
    borderColor: AuthColors.error,
  },
  inputWithButton: {
    paddingRight: 70,
  },
  inputWithIcon: {
    paddingRight: 40,
  },
  passwordToggle: {
    position: 'absolute',
    right: AuthSpacing.md,
    padding: AuthSpacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButton: {
    position: 'absolute',
    right: AuthSpacing.sm,
    paddingHorizontal: AuthSpacing.md,
    paddingVertical: AuthSpacing.xs,
    borderRadius: 6,
    backgroundColor: AuthColors.textLinkBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: AuthColors.white,
  },
  errorText: {
    fontSize: 12,
    color: AuthColors.error,
    marginTop: AuthSpacing.xs,
  },
});

