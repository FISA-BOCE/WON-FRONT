import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';

export default function CardMonthlyUsageScreen() {
  return (
    <View style={styles.container}>
      <TopBar title="당월 이용 금액" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.monthTitle}>2026년 5월 (~ 오늘)</Text>
          <Text style={styles.sectionLabel}>현재 누적 이용금액</Text>
          <Text style={styles.largeValue}>1,245,000원</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>전월 대비 +12%</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>예상 리워드 계산</Text>
          <Text style={styles.sectionLabel}>이용 금액</Text>
          <Text style={styles.largeValue}>1,245,000원</Text>

          <Text style={[styles.sectionTitle, { marginTop: 28 }]}>현재 적립률 구간</Text>
          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>0~50만원{"\n"}0.7%</Text>
            </View>
            <View style={[styles.pill, styles.pillActive]}>
              <Text style={[styles.pillText, styles.pillTextActive]}>50~150만원{"\n"}1.0%</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>150만원 초과{"\n"}1.2%</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>구간 3까지 255,000원 남았어요.{"\n"}초과 시 1.2%의 적립률이 적용됩니다.</Text>
          </View>

          <Text style={styles.sectionTitle}>예상 리워드 계산</Text>
          <View style={styles.calcCard}>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>산정 대상 금액</Text>
              <Text style={styles.calcValue}>1,245,000원</Text>
            </View>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>적립률</Text>
              <Text style={styles.calcValueLink}>1.0%</Text>
            </View>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>예상 리워드</Text>
              <Text style={styles.calcValue}>12,450원</Text>
            </View>
            <Text style={styles.calcNote}>예상 리워드는 실제 지급액과 다를 수 있습니다.</Text>
          </View>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>상세 지급 내역은 이용 패턴에 따라 달라질 수 있습니다.</Text>
        </View>

        <View style={styles.bottomGap} />
        <AuthButton title="확인" onPress={() => router.back()} />
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
    borderRadius: 16,
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
    backgroundColor: 'rgba(63,142,252,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  statusPillText: {
    fontSize: 12,
    color: AuthColors.blue300,
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: 60,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  pillRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  pill: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: AuthColors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: AuthColors.blue300,
  },
  pillText: {
    fontSize: 12,
    color: AuthColors.gray700,
    textAlign: 'center',
  },
  pillTextActive: {
    color: AuthColors.white,
    fontWeight: '700',
  },
  infoBox: {
    marginTop: 16,
    backgroundColor: 'rgba(255,224,102,0.2)',
    padding: 14,
    borderRadius: 12,
  },
  infoText: {
    color: AuthColors.gray800,
    fontSize: 13,
  },
  calcCard: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: AuthColors.borderGray,
    borderRadius: 12,
    padding: 14,
    backgroundColor: AuthColors.white,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  calcLabel: {
    fontSize: 13,
    color: AuthColors.textGray,
  },
  calcValue: {
    fontSize: 14,
    color: AuthColors.textBlack,
    fontWeight: '700',
  },
  calcValueLink: {
    fontSize: 14,
    color: AuthColors.blue300,
    fontWeight: '700',
  },
  calcNote: {
    marginTop: 8,
    fontSize: 12,
    color: AuthColors.textGray,
  },
  detailsCard: {
    borderWidth: 1,
    borderColor: AuthColors.gray50,
    backgroundColor: AuthColors.gray50,
    borderRadius: 16,
    padding: 16,
    gap: 10,
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
    color: AuthColors.gray800,
    textAlign: 'right',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: AuthColors.borderGray,
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
