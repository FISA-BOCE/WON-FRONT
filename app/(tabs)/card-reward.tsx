import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';

function InfoRow({ label, value, valueStyle }: { label: string; value: string; valueStyle?: object }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueStyle]}>{value}</Text>
    </View>
  );
}

export default function CardRewardScreen() {
  return (
    <View style={styles.container}>
      <TopBar title="리워드 지급" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroMonth}>2026년 5월 리워드</Text>
          <Text style={styles.heroAmount}>12,450원</Text>
          <Text style={styles.heroSub}>VOO 자동매수가 진행됩니다</Text>
        </View>

        <Text style={styles.sectionTitle}>산정 내역</Text>
        <View style={styles.cardBox}>
          <InfoRow label="전월 실적" value="820,000원" valueStyle={styles.valueGreen} />
          <InfoRow label="적립률" value="1.0% (50~150만 구간)" />
          <InfoRow label="한도 적용" value="한도 미도달" />
        </View>

        <Text style={styles.sectionTitle}>자동 투자 정보</Text>
        <View style={styles.autoCard}>
          <View style={styles.badgeCircle}>
            <Text style={styles.badgeText}>VOO</Text>
          </View>

          <View style={styles.autoInfo}>
            <Text style={styles.autoTitle}>S&amp;P 500 ETF</Text>
            <Text style={styles.autoSub}>123-***-***456 계좌로 매수</Text>
          </View>

          <View style={styles.waitBadge}>
            <Text style={styles.waitText}>매수 대기</Text>
          </View>
        </View>

        <Text style={styles.footerNote}>매수 체결 결과는 별도로 안내됩니다.</Text>

        <View style={styles.buttonWrap}>
          <AuthButton title="리워드 이력 확인" onPress={() => router.push('/card-reward-history')} />
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
    paddingBottom: 32,
  },
  hero: {
    marginTop: 40,
    alignItems: 'center',
  },
  heroMonth: {
    fontSize: 14,
    color: AuthColors.textGray,
    marginBottom: 8,
  },
  heroAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  heroSub: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.blue300,
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    marginTop: 60,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#253144',
  },
  cardBox: {
    borderRadius: 16,
    backgroundColor: '#f7f7f8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 2,
  },
  infoRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  valueGreen: {
    color: '#73a61f',
  },
  autoCard: {
    borderWidth: 1,
    borderColor: AuthColors.blue300,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badgeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e8eef8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.blue300,
  },
  autoInfo: {
    flex: 1,
  },
  autoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  autoSub: {
    marginTop: 8,
    fontSize: 10,
    color: '#6b7280',
  },
  waitBadge: {
    minWidth: 88,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#dce6f6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  waitText: {
    fontSize: 24 / 2,
    fontWeight: '700',
    color: AuthColors.blue300,
  },
  footerNote: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 22 / 2,
    color: '#9ca3af',
  },
  buttonWrap: {
    marginTop: 24,
    marginBottom: 8,
  },
});
