import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { EMAIL_REGEX } from '@/constants/validation';
import { extractApiErrorMessage } from '@/hooks/apiClient';
import { MyUser, getMyUser, updateMyUser } from '@/hooks/userApi';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

export default function ProfileEditScreen() {
  const [profile, setProfile] = useState<MyUser | null>(null);
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; currentPassword?: string; newPassword?: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const nextProfile = await getMyUser();

        if (isMounted) {
          setProfile(nextProfile);
        }
      } catch (error) {
        Alert.alert('내 정보 조회 실패', extractApiErrorMessage(error, '회원 정보를 불러오지 못했습니다.'));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const validateForm = () => {
    const nextErrors: typeof errors = {};
    const trimmedEmail = email.trim();
    const hasPasswordChange = currentPassword.trim() || newPassword.trim();

    if (trimmedEmail && !EMAIL_REGEX.test(trimmedEmail)) {
      nextErrors.email = '올바른 이메일을 입력해주세요';
    }

    if (hasPasswordChange) {
      if (!currentPassword.trim()) {
        nextErrors.currentPassword = '현재 비밀번호를 입력해주세요';
      } else if (currentPassword.trim().length < 8 || currentPassword.trim().length > 16) {
        nextErrors.currentPassword = '현재 비밀번호는 8~16자여야 합니다';
      }

      if (!newPassword.trim()) {
        nextErrors.newPassword = '새 비밀번호를 입력해주세요';
      } else if (newPassword.trim().length < 8 || newPassword.trim().length > 16) {
        nextErrors.newPassword = '새 비밀번호는 8~16자여야 합니다';
      }
    }

    if (!trimmedEmail && !hasPasswordChange) {
      nextErrors.email = '수정할 이메일 또는 비밀번호를 입력해주세요';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const payload = {
      ...(email.trim() ? { email: email.trim() } : {}),
      ...(currentPassword.trim() ? { currentPw: currentPassword.trim() } : {}),
      ...(newPassword.trim() ? { newPw: newPassword.trim() } : {}),
    };

    try {
      setIsSubmitting(true);
      await updateMyUser(payload);
      Alert.alert('회원 정보 수정 완료', '회원 정보가 수정되었습니다.', [
        {
          text: '확인',
          onPress: () => router.replace('/(tabs)/profile'),
        },
      ]);
    } catch (error) {
      Alert.alert('회원 정보 수정 실패', extractApiErrorMessage(error, '회원 정보 수정 중 문제가 발생했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar
        title="회원 정보 수정"
        onBackPress={() => router.replace('/(tabs)/profile')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <FieldBlock label="이름">
          <View style={[styles.inputBox, styles.disabledBox]}>
            <Text style={styles.disabledValue}>
              {isLoading ? '불러오는 중...' : (profile?.userName ?? '-')}
            </Text>
          </View>
        </FieldBlock>

        <FieldBlock label="이메일">
          <AuthInput
            placeholder="변경할 이메일을 입력해주세요"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.inlineInput}
          />
        </FieldBlock>

        <FieldBlock label="현재 비밀번호">
          <AuthInput
            placeholder="현재 비밀번호를 입력해주세요"
            value={currentPassword}
            onChangeText={(text) => {
              setCurrentPassword(text);
              if (errors.currentPassword) {
                setErrors((prev) => ({ ...prev, currentPassword: undefined }));
              }
            }}
            error={errors.currentPassword}
            secureTextEntry
            containerStyle={styles.inlineInput}
          />
        </FieldBlock>

        <FieldBlock label="새 비밀번호">
          <AuthInput
            placeholder="새 비밀번호를 입력해주세요"
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              if (errors.newPassword) {
                setErrors((prev) => ({ ...prev, newPassword: undefined }));
              }
            }}
            error={errors.newPassword}
            secureTextEntry
            containerStyle={styles.inlineInput}
          />
        </FieldBlock>

        <View style={styles.buttonWrap}>
          <AuthButton
            title="수정하기"
            onPress={handleSubmit}
            variant="blue300"
            disabled={isSubmitting || isLoading}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AuthColors.white,
  },
  content: {
    paddingHorizontal: AuthSpacing.lg,
    paddingTop: 32,
    paddingBottom: 40,
  },
  fieldBlock: {
    marginBottom: 28,
  },
  inlineInput: {
    marginBottom: 0,
  },
  fieldLabel: {
    fontSize: 13,
    color: AuthColors.textGray,
    marginBottom: 8,
  },
  inputBox: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eeeded',
    backgroundColor: AuthColors.white,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabledBox: {
    backgroundColor: '#eeeded',
  },
  disabledValue: {
    color: '#9ca3af',
    fontSize: 14,
  },
  buttonWrap: {
    marginTop: 120,
  },
});
