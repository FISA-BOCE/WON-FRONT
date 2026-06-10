import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { EMAIL_REGEX } from '@/constants/validation';
import { extractApiErrorMessage } from '@/hooks/apiClient';
import { resetInvestAccountFlow, setInvestAccountFlowResult } from '@/hooks/investAccountFlow';
import {
  createInvestAccount,
  CreateInvestAccountResult,
  LinkInvestAccountResult,
  linkInvestAccount,
} from '@/hooks/investApi';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const initialForm = {
  phone: '',
  name: '',
  password: '',
  passwordConfirm: '',
  email: '',
};

const ACCOUNT_PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,16}$/;

export default function SecuritiesAccountOpenStep2Screen() {
  const [form, setForm] = useState(initialForm);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setPasswordConfirmVisible] = useState(false);
  const [isTermsChecked, setTermsChecked] = useState(false);
  const [isPhoneChecked, setPhoneChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdAccount, setCreatedAccount] = useState<CreateInvestAccountResult | null>(null);

  useEffect(() => {
    resetInvestAccountFlow();
  }, []);

  const isPasswordValid = ACCOUNT_PASSWORD_REGEX.test(form.password.trim());
  const isFormValid = useMemo(() => {
    return (
      form.phone.trim().length === 11 &&
      form.name.trim().length > 0 &&
      isPasswordValid &&
      form.password === form.passwordConfirm &&
      EMAIL_REGEX.test(form.email.trim()) &&
      isTermsChecked &&
      isPhoneChecked
    );
  }, [form, isPasswordValid, isTermsChecked, isPhoneChecked]);

  const submitLabel = createdAccount ? '계좌 연결하기' : '가입하기';

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) {
      return;
    }

    let accountForLink = createdAccount;

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      accountForLink =
        createdAccount ??
        (await createInvestAccount({
          phoneNumber: formatPhoneNumber(form.phone),
          customerName: form.name.trim(),
          accountPassword: form.password.trim(),
          accountPasswordConfirm: form.passwordConfirm.trim(),
          email: form.email.trim(),
          agreedTerms: ['INVEST_BASIC'],
        }));

      setCreatedAccount(accountForLink);

      const linkedAccount: LinkInvestAccountResult =
        accountForLink.investConnectedStatus === 'CONNECTED'
          ? {
              investAccountUuid: accountForLink.investAccountUuid,
              accountNoDisplay: accountForLink.accountNoDisplay,
              accountStatus: accountForLink.accountStatus,
              investConnectedStatus: true,
              linkedAt: accountForLink.openedAt,
            }
          : await linkInvestAccount({
              investAccountUuid: accountForLink.investAccountUuid,
            });

      setInvestAccountFlowResult(accountForLink, linkedAccount);
      router.replace('/(tabs)/invest-complete');
    } catch (error) {
      if (accountForLink) {
        setErrorMessage(
          `계좌는 개설되었지만 연결에 실패했습니다. ${extractApiErrorMessage(
            error,
            '다시 시도해주세요.',
          )}`,
        );
      } else {
        setErrorMessage(extractApiErrorMessage(error, '증권 계좌 개설 중 문제가 발생했습니다.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar title="증권 계좌 개설" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>WON해요</Text>
        <Text style={styles.title}>증권 계좌를 개설해요</Text>

        <View style={styles.formSection}>
          <Text style={styles.label}>휴대폰 번호 *</Text>
          <View style={styles.phoneRow}>
            <TextInput
              style={styles.phoneInput}
              placeholder="- 없이 숫자만 입력해주세요"
              placeholderTextColor={AuthColors.textLightGray}
              keyboardType="number-pad"
              value={form.phone}
              onChangeText={(text) => {
                setPhoneChecked(false);
                setForm((prev) => ({ ...prev, phone: text.replace(/\D/g, '').slice(0, 11) }));
              }}
            />
            <Pressable
              style={[styles.checkButton, isPhoneChecked && styles.checkButtonDone]}
              onPress={() => setPhoneChecked(form.phone.trim().length === 11)}
            >
              <Text style={[styles.checkButtonText, isPhoneChecked && styles.checkButtonDoneText]}>
                {isPhoneChecked ? '확인됨' : '중복 확인'}
              </Text>
            </Pressable>
          </View>

          <FormField
            label="이름 *"
            placeholder="이름을 입력해주세요"
            value={form.name}
            onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
          />

          <PasswordField
            label="비밀번호 *"
            placeholder="숫자+특수문자 포함 8~16자"
            value={form.password}
            visible={isPasswordVisible}
            onToggleVisible={() => setPasswordVisible((prev) => !prev)}
            onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
          />

          <PasswordField
            label="비밀번호 확인 *"
            placeholder="비밀번호를 다시 입력해주세요"
            value={form.passwordConfirm}
            visible={isPasswordConfirmVisible}
            onToggleVisible={() => setPasswordConfirmVisible((prev) => !prev)}
            onChangeText={(text) => setForm((prev) => ({ ...prev, passwordConfirm: text }))}
          />

          <FormField
            label="이메일 *"
            placeholder="이메일을 입력해주세요"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
          />
        </View>

        <Pressable style={styles.termsCard} onPress={() => setTermsChecked((prev) => !prev)}>
          <View style={[styles.termsRadio, isTermsChecked && styles.termsRadioActive]}>
            {isTermsChecked ? <View style={styles.termsRadioInner} /> : null}
          </View>
          <Text style={styles.termsText}>약관 동의</Text>
        </Pressable>
        
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <View style={styles.footerSpacing} />
        <AuthButton
          title={isSubmitting ? '처리 중...' : submitLabel}
          disabled={!isFormValid || isSubmitting}
          onPress={handleSubmit}
          variant="blue300"
          style={isFormValid ? styles.submitButtonActive : styles.submitButtonInactive}
          textStyle={isFormValid ? styles.submitButtonTextActive : styles.submitButtonTextInactive}
        />
      </ScrollView>
    </View>
  );
}

function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  ...props
}: React.ComponentProps<typeof TextInput> & { label: string }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        placeholder={placeholder}
        placeholderTextColor={AuthColors.textLightGray}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    </View>
  );
}

function PasswordField({
  label,
  placeholder,
  value,
  onChangeText,
  visible,
  onToggleVisible,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordWrap}>
        <TextInput
          style={styles.passwordInput}
          placeholder={placeholder}
          placeholderTextColor={AuthColors.textLightGray}
          secureTextEntry={!visible}
          value={value}
          onChangeText={onChangeText}
        />
        <Pressable style={styles.eyeButton} onPress={onToggleVisible}>
          <Ionicons name={visible ? 'eye-outline' : 'eye-off-outline'} size={20} color={AuthColors.textLightGray} />
        </Pressable>
      </View>
    </View>
  );
}

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, '');

  if (digits.length !== 11) {
    return value;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AuthColors.white,
  },
  content: {
    paddingHorizontal: AuthSpacing.lg,
    paddingBottom: 32,
    marginTop: AuthSpacing.default,
  },
  kicker: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    color: AuthColors.blue300,
  },
  title: {
    marginTop: 2,
    fontSize: 22,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  formSection: {
    marginTop: 28,
  },
  fieldBlock: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: AuthColors.textDarkGray,
    marginBottom: 10,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 8,
  },
  phoneInput: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AuthColors.borderGray,
    backgroundColor: AuthColors.white,
    paddingHorizontal: 16,
    fontSize: 14,
    color: AuthColors.textBlack,
  },
  checkButton: {
    width: 98,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AuthColors.borderGray,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AuthColors.white,
  },
  checkButtonDone: {
    borderColor: AuthColors.blue300,
    backgroundColor: AuthColors.blue100,
  },
  checkButtonText: {
    fontSize: 14,
    color: AuthColors.textGray,
  },
  checkButtonDoneText: {
    color: AuthColors.blue500,
    fontWeight: '600',
  },
  fieldInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AuthColors.borderGray,
    backgroundColor: AuthColors.white,
    paddingHorizontal: 16,
    fontSize: 14,
    color: AuthColors.textBlack,
  },
  passwordWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AuthColors.borderGray,
    backgroundColor: AuthColors.white,
    paddingLeft: 16,
    paddingRight: 44,
    fontSize: 14,
    color: AuthColors.textBlack,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    padding: 4,
  },
  termsCard: {
    marginTop: 48,
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AuthColors.borderGray,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AuthColors.white,
  },
  termsRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: AuthColors.gray400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsRadioActive: {
    borderColor: AuthColors.blue300,
  },
  termsRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AuthColors.blue300,
  },
  termsText: {
    marginLeft: 10,
    fontSize: 16,
    color: AuthColors.textBlack,
  },
  termsHint: {
    marginTop: 10,
    fontSize: 12,
    color: AuthColors.textGray,
  },
  errorText: {
    marginTop: 16,
    fontSize: 13,
    lineHeight: 20,
    color: AuthColors.error,
  },
  footerSpacing: {
    height: 30,
  },
  submitButtonActive: {
    backgroundColor: AuthColors.blue300,
  },
  submitButtonInactive: {
    backgroundColor: AuthColors.lightBg,
  },
  submitButtonTextActive: {
    color: AuthColors.white,
  },
  submitButtonTextInactive: {
    color: AuthColors.textDarkGray,
  },
});
