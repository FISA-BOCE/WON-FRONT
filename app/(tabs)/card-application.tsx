import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthButton } from '@/components/auth/AuthButton';
import { AuthInput } from '@/components/auth/AuthInput';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';

const initial = {
  koreanName: '',
  englishName: '',
  birthDate: '',
  gender: '',
  nationality: '',
  phoneNumber: '',
  email: '',
  address: '',
  job: '',
};

export default function CardApplicationScreen() {
  const [form, setForm] = useState(initial);

  const hasError = useMemo(
    () =>
      !form.koreanName ||
      !form.englishName ||
      !form.birthDate ||
      !form.gender ||
      !form.nationality ||
      !form.phoneNumber ||
      !form.email ||
      !form.address ||
      !form.job,
    [form]
  );

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
          onChangeText={(text) => setForm((prev) => ({ ...prev, koreanName: text }))}
        />
        <AuthInput
          label="영문 이름 *"
          placeholder="여권상의 이름을 입력해주세요"
          value={form.englishName}
          onChangeText={(text) => setForm((prev) => ({ ...prev, englishName: text }))}
        />
        <AuthInput
          label="생년월일 *"
          placeholder="예: 1999-01-01"
          value={form.birthDate}
          onChangeText={(text) => setForm((prev) => ({ ...prev, birthDate: text }))}
        />
        <AuthInput
          label="성별 *"
          placeholder="성별을 입력해주세요"
          value={form.gender}
          onChangeText={(text) => setForm((prev) => ({ ...prev, gender: text }))}
        />
        <AuthInput
          label="국적 *"
          placeholder="국적을 입력해주세요"
          value={form.nationality}
          onChangeText={(text) => setForm((prev) => ({ ...prev, nationality: text }))}
        />
        <AuthInput
          label="전화번호 *"
          placeholder="01012345678"
          keyboardType="phone-pad"
          value={form.phoneNumber}
          onChangeText={(text) => setForm((prev) => ({ ...prev, phoneNumber: text }))}
        />
        <AuthInput
          label="이메일 *"
          placeholder="example@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        />
        <AuthInput
          label="주소 *"
          placeholder="서울시 마포구 상암동"
          value={form.address}
          onChangeText={(text) => setForm((prev) => ({ ...prev, address: text }))}
        />
        <AuthInput
          label="직업 *"
          placeholder="선택해주세요"
          value={form.job}
          onChangeText={(text) => setForm((prev) => ({ ...prev, job: text }))}
        />

        <View style={styles.bottomGap} />
        {hasError ? (
          <View style={styles.helperBox}>
            <Text style={styles.helperText}>필수 항목을 모두 입력해주세요.</Text>
          </View>
        ) : null}

        <View style={styles.bottomGap} />
        <AuthButton
          title="다음"
          disabled={hasError}
          onPress={() => router.push('./card-terms' as never)}
        />
      </ScrollView>
    </View>
  );
}

function StepDot({ active = false }: { active?: boolean }) {
  return <View style={[styles.stepDot, active && styles.stepDotActive]} />;
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
    marginVertical: AuthSpacing.default
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
