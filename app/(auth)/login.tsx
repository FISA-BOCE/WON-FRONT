import { AuthButton } from '@/components/auth/AuthButton';
import { AuthInput } from '@/components/auth/AuthInput';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { extractApiErrorMessage } from '@/hooks/apiClient';
import { login } from '@/hooks/authApi';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function LoginScreen({ route }: any) {
  // Check if coming from login-error (error state mode)
  const startInErrorState = route?.params?.showError || false;
  
  const [phoneNumber, setPhoneNumber] = useState(startInErrorState ? '01012345678' : '');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>(
    startInErrorState ? { password: '비밀번호가 올바르지 않습니다.' } : {}
  );

  const validateForm = () => {
    const newErrors: typeof errors = {};

    const normalizedPhone = phoneNumber.trim();
    const isPhoneValid = /^\d+$/.test(normalizedPhone);

    if (!normalizedPhone) {
      newErrors.phone = '휴대폰 번호를 입력해주세요';
    } else if (!isPhoneValid) {
      newErrors.phone = '휴대폰 번호는 숫자만 입력해주세요';
    }

    if (!password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await login(phoneNumber.trim(), password.trim());
      router.replace('/card');
    } catch (error) {
      Alert.alert('로그인 실패', extractApiErrorMessage(error, '로그인 중 문제가 발생했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupPress = () => {
    router.push('/signup');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TopBar title="로그인" showBack={false} showRightMenu={false} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            <Text style={styles.headerHighlight}>WON해요</Text>
            <Text style={styles.headerNormal}>에 오신 것을</Text>
          </Text>
          <Text style={styles.headerSubtitle}>환영합니다!</Text>
        </View>

        {/* 입력 폼 */}
        <View style={styles.formContainer}>
          <AuthInput
            label="휴대폰 번호"
            placeholder="- 없이 숫자만 입력해주세요"
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text);
              if (errors.phone) {
                setErrors({ ...errors, phone: undefined });
              }
            }}
            error={errors.phone}
            keyboardType="number-pad"
            maxLength={11}
            autoComplete="off"
            textContentType="none"
            autoCorrect={false}
            spellCheck={false}
          />
          
          <AuthInput
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) {
                setErrors({ ...errors, password: undefined });
              }
            }}
            error={errors.password}
            secureTextEntry
            autoComplete="off"
            textContentType="none"
            autoCorrect={false}
            spellCheck={false}
          />
        </View>

        {/* 버튼 */}
        <View style={styles.buttonContainer}>
          <AuthButton
            title="로그인"
            onPress={handleLogin}
            variant="blue300"
            disabled={isSubmitting}
          />
          
          <Text style={styles.dividerText}>또는</Text>
          
          <AuthButton
            title="회원가입"
            onPress={handleSignupPress}
            variant="secondary"
            disabled={isSubmitting}
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
    paddingHorizontal: AuthSpacing.lg,
    paddingVertical: AuthSpacing.lg,
  },
  header: {
    marginBottom: AuthSpacing.xl,
    marginTop: AuthSpacing.lg,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
    marginBottom: AuthSpacing.sm,
  },
  headerHighlight: {
    color: AuthColors.textLinkBlue,
  },
  headerNormal: {
    color: AuthColors.textDarkGray,
  },
  headerSubtitle: {
    fontSize: 22,
    fontWeight: '700',
    color: AuthColors.textDarkGray,
  },
  formContainer: {
    marginBottom: AuthSpacing.xl,
  },
  buttonContainer: {
    gap: AuthSpacing.md,
    marginTop: AuthSpacing.xl,
  },
  dividerText: {
    fontSize: 13,
    color: AuthColors.textLightGray,
    textAlign: 'center',
    marginVertical: AuthSpacing.sm,
  },
});
