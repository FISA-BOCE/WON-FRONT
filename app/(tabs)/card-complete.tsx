import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing, AuthTypography } from '@/constants/authColors';

export default function CardCompleteScreen() {
  return (
    <View style={styles.container}>
      <TopBar title="카드 신청 완료" onBackPress={() => router.replace('/(tabs)/index' as never)} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

         <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>카드 수령 후 첫 결제부터 자동투자가 시작됩니다.</Text>
        </View>

        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={34} color={AuthColors.white} />
        </View>

        <Text style={styles.title}>카드 신청이 완료되었습니다!</Text>
        <Text style={styles.subtitle}>심사 후 카드가 발급됩니다</Text>
        <Text style={styles.subtitleSmall}>(영업일 기준 3~5일)</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>신청번호</Text>
            <Text style={styles.summaryValue}>a1b2-c3d4-e5f6</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>상품명</Text>
            <Text style={styles.summaryValue}>WON 자동투자 카드</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>신청일시</Text>
            <Text style={styles.summaryValue}>2026.05.07 14:32</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>자동투자 ETF</Text>
            <Text style={styles.summaryValue}>VOO (S&amp;P 500)</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>연결 증권계좌</Text>
            <Text style={styles.summaryValue}>123-***-***456</Text>
          </View>
        </View>

        <View style={styles.bottomGap} />
        <AuthButton style={styles.homeButton} title="시작하기" onPress={() => router.replace('/card' as never)} />
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
    paddingBottom: 28,
    alignItems: 'center',
  },
    noticeBox: {
    width: '100%',
    marginTop: AuthSpacing.default,
    backgroundColor: 'rgba(195, 229, 255, 0.35)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  noticeText: {
    fontSize: 12,
    color: AuthColors.blue500,
  },
  successIcon: {
    marginTop: 60,
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: AuthColors.blue300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 48,
    fontSize: 22,
    fontWeight: '700',
    color: AuthColors.gray900,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: AuthSpacing.md,
    ...AuthTypography.body,
    color: AuthColors.gray700,
    textAlign: 'center',
  },
  subtitleSmall: {
    marginTop: 8,
    fontSize: 12,
    color: AuthColors.gray700,
    textAlign: 'center',
  },
  summaryCard: {
    width: '100%',
    marginTop: 120,
    borderWidth: 1,
    borderColor: AuthColors.gray50,
    backgroundColor: AuthColors.gray50,
    borderRadius: 16,
    padding: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: AuthColors.textGray,
    flex: 1,
  },
  summaryValue: {
    fontSize: 12,
    color: AuthColors.textBlack,
    textAlign: 'right',
    flex: 1,
  },
  bottomGap: {
    height: 20,
  },
  homeButton: {
    width: '100%',
  },
});
