import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthButton } from '@/components/auth/AuthButton';
import { AuthInput } from '@/components/auth/AuthInput';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import {
  CardApplicationApplicantInfoDraft,
  setCardApplicationApplicantInfo,
  useCardApplicationDraft,
} from '@/hooks/cardApplicationFlow';

export default function CardApplicationScreen() {
  const draft = useCardApplicationDraft();
  const [form, setForm] = useState<CardApplicationApplicantInfoDraft>(draft.applicantInfo);

  const errors = useMemo(() => {
    const nextErrors: Partial<Record<keyof CardApplicationApplicantInfoDraft, string>> = {};

    if (!form.koreanName.trim()) nextErrors.koreanName = '국문 이름을 입력해주세요.';
    if (!form.englishName.trim()) nextErrors.englishName = '영문 이름을 입력해주세요.';
    if (!/^\d{8}$/.test(form.birthDate.trim())) nextErrors.birthDate = '생년월일 8자리를 입력해주세요.';
    if (!form.gender.trim()) nextErrors.gender = '성별을 입력해주세요.';
    if (!form.nationality.trim()) nextErrors.nationality = '국적을 입력해주세요.';
    if (!/^01\d{8,9}$/.test(form.phoneNumber.trim())) nextErrors.phoneNumber = '휴대폰 번호를 확인해주세요.';
    if (!form.email.trim()) nextErrors.email = '이메일을 입력해주세요.';
    if (!form.address.trim()) nextErrors.address = '주소를 입력해주세요.';
    if (!form.job.trim()) nextErrors.job = '직업을 입력해주세요.';

    return nextErrors;
  }, [form]);

  const hasError = Object.keys(errors).length > 0;

  const updateField = (field: keyof CardApplicationApplicantInfoDraft, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setCardApplicationApplicantInfo({
      ...form,
      birthDate: form.birthDate.trim(),
      phoneNumber: form.phoneNumber.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      job: form.job.trim(),
      gender: form.gender.trim(),
      nationality: form.nationality.trim(),
      koreanName: form.koreanName.trim(),
      englishName: form.englishName.trim(),
    });
    router.push('/(tabs)/card-terms');
  };

  return (
    <View style={styles.container}>
      <TopBar title="카드 신청" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stepRow}>
          <StepDot active />
          <StepDot />
          <StepDot />
          <StepDot />
        </View>

        <Text style={styles.title}>신청 정보를 입력해주세요</Text>

        <AuthInput
          label="국문 이름 *"
          placeholder="이름을 입력해주세요"
          value={form.koreanName}
          onChangeText={(text) => updateField('koreanName', text)}
          error={errors.koreanName}
        />
        <AuthInput
          label="영문 이름 *"
          placeholder="여권상의 이름을 입력해주세요"
          value={form.englishName}
          onChangeText={(text) => updateField('englishName', text)}
          error={errors.englishName}
        />
        <AuthInput
          label="생년월일 *"
          placeholder="예: 19990101"
          keyboardType="number-pad"
          value={form.birthDate}
          onChangeText={(text) => updateField('birthDate', text.replace(/\D/g, '').slice(0, 8))}
          error={errors.birthDate}
        />
        <View style={styles.genderBlock}>
          <Text style={styles.genderLabel}>성별 *</Text>
          <View style={styles.genderRow}>
            <GenderOption
              label="여성"
              selected={form.gender === 'F'}
              onPress={() => updateField('gender', 'F')}
            />
            <GenderOption
              label="남성"
              selected={form.gender === 'M'}
              onPress={() => updateField('gender', 'M')}
            />
          </View>
          {errors.gender ? <Text style={styles.genderError}>{errors.gender}</Text> : null}
        </View>
        <AuthInput
          label="국적 *"
          placeholder="예: KOREAN"
          value={form.nationality}
          onChangeText={(text) => updateField('nationality', text)}
          error={errors.nationality}
        />
        <AuthInput
          label="전화번호 *"
          placeholder="01012345678"
          keyboardType="phone-pad"
          value={form.phoneNumber}
          onChangeText={(text) => updateField('phoneNumber', text.replace(/\D/g, '').slice(0, 11))}
          error={errors.phoneNumber}
        />
        <AuthInput
          label="이메일 *"
          placeholder="example@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(text) => updateField('email', text)}
          error={errors.email}
        />
        <AuthInput
          label="주소 *"
          placeholder="서울시 마포구 상암동"
          value={form.address}
          onChangeText={(text) => updateField('address', text)}
          error={errors.address}
        />
        <AuthInput
          label="직업 *"
          placeholder="직업을 입력해주세요"
          value={form.job}
          onChangeText={(text) => updateField('job', text)}
          error={errors.job}
        />

        {hasError ? (
          <View style={styles.helperBox}>
            <Text style={styles.helperText}>필수 항목을 카드 신청 스펙에 맞게 모두 입력해주세요.</Text>
          </View>
        ) : null}

        <View style={styles.bottomGap} />
        <AuthButton title="다음" disabled={hasError} onPress={handleNext} />
      </ScrollView>
    </View>
  );
}

function StepDot({ active = false }: { active?: boolean }) {
  return <View style={[styles.stepDot, active && styles.stepDotActive]} />;
}

function GenderOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.genderOption, selected && styles.genderOptionSelected]}
      onPress={onPress}
    >
      <Text style={[styles.genderOptionText, selected && styles.genderOptionTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AuthColors.white,
  },
  content: {
    paddingHorizontal: AuthSpacing.lg,
    paddingBottom: 28,
  },
  stepRow: {
    marginTop: 40,
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  stepDot: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
  },
  stepDotActive: {
    backgroundColor: AuthColors.blue200,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: AuthColors.gray900,
    marginVertical: AuthSpacing.default,
  },
  genderBlock: {
    marginBottom: AuthSpacing.md,
  },
  genderLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: AuthColors.textGray,
    marginBottom: AuthSpacing.sm,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderOption: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AuthColors.borderGray,
    backgroundColor: AuthColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderOptionSelected: {
    borderColor: AuthColors.blue300,
    backgroundColor: '#eff6ff',
  },
  genderOptionText: {
    fontSize: 14,
    color: AuthColors.textBlack,
    fontWeight: '500',
  },
  genderOptionTextSelected: {
    color: AuthColors.blue500,
    fontWeight: '700',
  },
  genderError: {
    fontSize: 12,
    color: AuthColors.error,
    marginTop: AuthSpacing.xs,
  },
  helperBox: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 103, 7, 0.2)',
    borderRadius: 12,
    padding: 14,
  },
  helperText: {
    fontSize: 12,
    color: AuthColors.error,
  },
  bottomGap: {
    height: 20,
  },
});
