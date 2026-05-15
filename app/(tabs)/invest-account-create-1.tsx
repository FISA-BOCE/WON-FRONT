import { TopBar } from '@/components/auth/TopBar';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthColors, AuthSpacing, AuthTypography } from '@/constants/authColors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const PREPARE_ITEMS = [
  '신분증 (운전면허/주민등록증)',
  '본인 명의 휴대폰',
  '출금용 본인 명의 계좌',
];

const STEPS = [
  {
    title: '본인 확인',
    description: '신분증 촬영 및 휴대폰 인증',
    complete: true,
  },
  {
    title: '필수 약관 동의',
    description: '증권 거래 및 개인정보 처리 동의',
    complete: false,
  },
  {
    title: '계좌 비밀번호 설정',
    description: '4자리 숫자 비밀번호',
    complete: false,
  },
];

export default function SecuritiesAccountOpenStep1Screen() {
  return (
    <View style={styles.container}>
      <TopBar title="카드 신청" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>신규 증권계좌를 개설할게요</Text>
        <Text style={styles.subtitle}>본인 확인과 약관 동의 후 진행됩니다</Text>

        <View style={styles.stepCard}>
          {STEPS.map((step, index) => (
            <View key={step.title}>
              <View style={styles.stepRow}>
                <StepBadge index={index + 1} complete={step.complete} />
                <View style={styles.stepTextWrap}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              </View>
              {index !== STEPS.length - 1 ? <View style={styles.stepDivider} /> : null}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>준비해주세요</Text>

        <View style={styles.prepareCard}>
          {PREPARE_ITEMS.map((item, index) => (
            <View key={item}>
              <View style={styles.prepareRow}>
                <View style={styles.prepareIcon}>
                  <Ionicons name={index === 1 ? 'phone-portrait-outline' : 'square-outline'} size={18} color={AuthColors.blue300} />
                </View>
                <Text style={styles.prepareText}>{item}</Text>
              </View>
              {index !== PREPARE_ITEMS.length - 1 ? <View style={styles.prepareDivider} /> : null}
            </View>
          ))}
        </View>

        <View style={styles.footerSpacing} />
        <AuthButton
          title="개설 시작하기"
          onPress={() => router.push('/invest-account-create-2')}
        />
      </ScrollView>
    </View>
  );
}

function StepBadge({ index, complete }: { index: number; complete: boolean }) {
  if (complete) {
    return (
      <View style={styles.stepBadgeComplete}>
        <Ionicons name="checkmark" size={16} color={AuthColors.white} />
      </View>
    );
  }

  return (
    <View style={styles.stepBadgePending}>
      <Text style={styles.stepBadgePendingText}>{index}</Text>
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
    paddingBottom: 32,
    marginTop: AuthSpacing.default,
  },
  title: {
    ...AuthTypography.heading1,
    color: AuthColors.textBlack,
  },
  subtitle: {
    marginTop: 6,
    ...AuthTypography.body,
    color: AuthColors.gray500,
  },
  stepCard: {
    marginTop: 48,
    borderRadius: 16,
    backgroundColor: AuthColors.gray50,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepDivider: {
    marginLeft: 14,
    marginVertical: 14,
    width: 1,
    height: 18,
    backgroundColor: AuthColors.borderGray,
  },
  stepBadgeComplete: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AuthColors.blue300,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepBadgePending: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    backgroundColor: AuthColors.white,
  },
  stepBadgePendingText: {
    fontSize: 12,
    fontWeight: '700',
    color: AuthColors.gray400,
  },
  stepTextWrap: {
    marginLeft: 14,
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  stepDescription: {
    marginTop: 4,
    fontSize: 13,
    color: AuthColors.gray500,
  },
  sectionTitle: {
    marginTop: 40,
    marginBottom: 16,
    fontSize: 18,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  prepareCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AuthColors.borderGray,
    backgroundColor: AuthColors.white,
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  prepareRow: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
  },
  prepareDivider: {
    height: 1,
    backgroundColor: AuthColors.borderGray,
  },
  prepareIcon: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prepareText: {
    marginLeft: 8,
    fontSize: 15,
    color: AuthColors.textBlack,
  },
  footerSpacing: {
    height: 126,
  },
});
