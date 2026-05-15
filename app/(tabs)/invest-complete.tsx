import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing, AuthTypography } from '@/constants/authColors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const SUMMARY_ROWS = [
  { label: '신청번호', value: 'a1b2-c3d4-e5f6' },
  { label: '상품명', value: 'WON 자동투자 계좌' },
  { label: '개설일시', value: '2026.05.07 14:32' },
  { label: '계좌번호', value: '123-***-***456' },
];

export default function SecuritiesCompleteScreen() {
  return (
    <View style={styles.container}>
      <TopBar title="회원가입" showBack={false} showRightMenu={false} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={54} color={AuthColors.blue300} />
        </View>

        <Text style={styles.title}>계좌 개설이 완료되었습니다!</Text>

        <View style={styles.summaryCard}>
          {SUMMARY_ROWS.map((row) => (
            <View key={row.label} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{row.label}</Text>
              <Text style={styles.summaryValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footerSpacing} />
        <AuthButton title="시작하기" onPress={() => router.replace('/card')} style={styles.ctaButton} />
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
    paddingBottom: 32,
    marginTop: AuthSpacing.default,
    alignItems: 'center',
  },
  successIcon: {
    marginTop: 108,
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 3,
    borderColor: AuthColors.blue300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 54,
    ...AuthTypography.heading1,
    color: AuthColors.textBlack,
    textAlign: 'center',
  },
  summaryCard: {
    width: '100%',
    marginTop: 108,
    borderRadius: 16,
    backgroundColor: AuthColors.gray50,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  summaryRow: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: AuthColors.gray600,
  },
  summaryValue: {
    fontSize: 14,
    color: AuthColors.textBlack,
    fontWeight: '500',
    textAlign: 'right',
  },
  footerSpacing: {
    height: 32,
  },
  ctaButton: {
    width: '100%',
  },
});
