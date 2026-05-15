import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthButton } from '@/components/auth';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';

export default function CardMonthlyPerformanceScreen() {
  return (
    <View style={styles.container}>
      <TopBar title="전월 실적" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.monthTitle}>2026년 4월 실적</Text>
          <Text style={styles.sectionLabel}>전월 실적 합계</Text>
          <Text style={styles.largeValue}>820,000원</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>기준 충족</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>상세 내역</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>총 청구 금액</Text>
            <Text style={styles.detailValue}>820,000원</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>적립 리워드</Text>
            <Text style={styles.detailValue}>8,200원</Text>
          </View>
        </View>
        
      <View style={styles.bottomGap} />
      <AuthButton title="당월 이용 금액 보기" onPress={() => router.push('/card-monthly-usage')} />
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
  },
  summaryCard: {
    marginTop: 40,
    borderWidth: 1,
    borderColor: AuthColors.white,
  },
  monthTitle: {
    fontSize: 13,
    color: AuthColors.textGray,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    color: AuthColors.textGray,
    marginBottom: 12,
  },
  largeValue: {
    fontSize: 24,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  statusPill: {
    alignSelf: 'flex-start',
    marginTop: 24,
    minWidth: 78,
    height: 24,
    borderRadius: 999,
    backgroundColor: 'rgba(114,176,29,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  statusPillText: {
    fontSize: 12,
    color: AuthColors.success,
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: 60,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  detailsCard: {
    borderWidth: 1,
    borderColor: AuthColors.gray50,
    backgroundColor: AuthColors.gray50,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    marginBottom: 220,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: AuthColors.textGray,
    flex: 1,
  },
  detailValue: {
    fontSize: 12,
    color: AuthColors.textBlack,
    textAlign: 'right',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: AuthColors.borderGray,
  },
  explanationCard: {
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  explanationMain: {
    fontSize: 14,
    color: AuthColors.textBlack,
    lineHeight: 20,
  },
  explDivider: {
    height: 1,
    backgroundColor: AuthColors.borderGray,
    marginVertical: 8,
  },
  explanationLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  explanationText: {
    fontSize: 12,
    color: AuthColors.textGray,
    lineHeight: 18,
  },
  noticeBox: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 14,
  },
  noticeText: {
    fontSize: 12,
    color: AuthColors.gray500,
  },
  bottomGap: {
    height: 20,
  },
});
