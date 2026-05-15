import { AuthButton } from '@/components/auth/AuthButton';
import { AuthInput } from '@/components/auth/AuthInput';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { EMAIL_REGEX } from '@/constants/validation';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface SignupForm {
  phoneNumber: string;
  name: string;
  password: string;
  passwordConfirm: string;
  email: string;
  agreeToTerms: boolean;
}

interface SignupErrors {
  phoneNumber?: string;
  name?: string;
  password?: string;
  passwordConfirm?: string;
  email?: string;
  agreeToTerms?: string;
}

export default function SignupScreen() {
  const [form, setForm] = useState<SignupForm>({
    phoneNumber: '',
    name: '',
    password: '',
    passwordConfirm: '',
    email: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<SignupErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: SignupErrors = {};

    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = '휴대폰 번호를 입력해주세요';
    } else if (form.phoneNumber.length !== 11) {
      newErrors.phoneNumber = '올바른 휴대폰 번호를 입력해주세요';
    }

    if (!form.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (!form.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (form.password.length < 8 || form.password.length > 16) {
      newErrors.password = '비밀번호는 8~16자여야 합니다';
    }

    if (!form.passwordConfirm.trim()) {
      newErrors.passwordConfirm = '비밀번호를 다시 입력해주세요';
    } else if (form.password !== form.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다';
    }

    if (!form.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      newErrors.email = '올바른 이메일을 입력해주세요';
    }

    if (!form.agreeToTerms) {
      newErrors.agreeToTerms = '약관에 동의해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof SignupForm, value: string | boolean) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handlePhoneVerify = () => {
    // TODO: API 연결 - 휴대폰 번호 중복 확인
    if (!form.phoneNumber.trim()) {
      setErrors({ ...errors, phoneNumber: '휴대폰 번호를 입력해주세요' });
      return;
    }
    if (form.phoneNumber.length !== 11) {
      setErrors({ ...errors, phoneNumber: '올바른 휴대폰 번호를 입력해주세요' });
      return;
    }
    
    console.log('휴대폰 번호 중복확인:', form.phoneNumber);
    setPhoneVerified(true);
  };

  const handleSignup = () => {
    if (!validateForm()) return;

    // TODO: API 연결
    console.log('회원가입 시도:', form);

    // 성공 화면으로 이동
    router.push('/signup-complete');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TopBar
        title="회원가입"
        onBackPress={() => router.back()}
        showBack={true}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 입력 폼 */}
        <View style={styles.formContainer}>
          <AuthInput
            label="휴대폰 번호 *"
            placeholder="- 없이 숫자만 입력해주세요"
            value={form.phoneNumber}
            onChangeText={(text) => {
              handleInputChange('phoneNumber', text);
              setPhoneVerified(false);
            }}
            error={errors.phoneNumber}
            keyboardType="number-pad"
            maxLength={11}
            rightButton={{
              label: phoneVerified ? '확인됨' : '중복확인',
              onPress: handlePhoneVerify,
            }}
          />

          <AuthInput
            label="이름 *"
            placeholder="이름을 입력해주세요"
            value={form.name}
            onChangeText={(text) => handleInputChange('name', text)}
            error={errors.name}
          />

          <AuthInput
            label="비밀번호 *"
            placeholder="영문+숫자+특수문자 포함 8~16자"
            value={form.password}
            onChangeText={(text) => handleInputChange('password', text)}
            error={errors.password}
            showPasswordToggle={true}
            isPasswordVisible={showPassword}
            onPasswordToggle={() => setShowPassword(!showPassword)}
          />

          <AuthInput
            label="비밀번호 확인 *"
            placeholder="비밀번호를 다시 입력해주세요"
            value={form.passwordConfirm}
            onChangeText={(text) => handleInputChange('passwordConfirm', text)}
            error={errors.passwordConfirm}
            showPasswordToggle={true}
            isPasswordVisible={showPasswordConfirm}
            onPasswordToggle={() => setShowPasswordConfirm(!showPasswordConfirm)}
          />

          <AuthInput
            label="이메일 *"
            placeholder="이메일을 입력해주세요"
            value={form.email}
            onChangeText={(text) => handleInputChange('email', text)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* 약관 동의 */}
        <Pressable
          style={styles.termsContainer}
          onPress={() => handleInputChange('agreeToTerms', !form.agreeToTerms)}
        >
          <View
            style={[
              styles.checkbox,
              form.agreeToTerms && styles.checkboxChecked,
            ]}
          >
            {form.agreeToTerms && (
              <Ionicons
                name="checkmark"
                size={16}
                color={AuthColors.white}
              />
            )}
          </View>
          <Text style={styles.termsText}>약관 동의</Text>
        </Pressable>
        {errors.agreeToTerms && (
          <Text style={styles.errorText}>{errors.agreeToTerms}</Text>
        )}

        {/* 버튼 */}
        <View style={styles.buttonContainer}>
          <AuthButton
            title="가입하기"
            onPress={handleSignup}
            variant="blue300"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AuthColors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: AuthSpacing.md,
    paddingVertical: AuthSpacing.lg,
  },
  formContainer: {
    marginBottom: AuthSpacing.lg,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: AuthSpacing.md,
    marginBottom: AuthSpacing.md,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: AuthColors.borderGray,
    marginRight: AuthSpacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: AuthColors.blue300,
    borderColor: AuthColors.blue300,
  },
  termsText: {
    fontSize: 14,
    fontWeight: '500',
    color: AuthColors.textBlack,
  },
  errorText: {
    fontSize: 12,
    color: AuthColors.error,
    marginBottom: AuthSpacing.md,
  },
  buttonContainer: {
    marginTop: AuthSpacing.xl,
    marginBottom: AuthSpacing.xl,
  },
});
