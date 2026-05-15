import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';

type HoldingCardProps = {
  ticker: string;
  title: string;
  subtitle: string;
  amount: string;
  rate: string;
  averagePrice: string;
};

function HoldingCard({ ticker, title, subtitle, amount, rate, averagePrice }: HoldingCardProps) {
  const isPositive = rate.trim().startsWith('+');

  return (
    <View style={styles.holdingCard}>
      <View style={styles.holdingLeft}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>{ticker}</Text>
        </View>
        <View style={styles.holdingInfo}>
          <Text style={styles.holdingTitle}>{title}</Text>
          <Text style={styles.holdingSubtitle}>{subtitle}</Text>
        </View>
      </View>

      <View style={styles.holdingRight}>
        <Text style={styles.holdingAmount}>{amount}</Text>
        <Text style={[styles.holdingRate, isPositive ? styles.holdingRatePositive : styles.holdingRateNegative]}>
          {rate}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>평균 매입단가</Text>
        <Text style={styles.metricValue}>{averagePrice}</Text>
      </View>
    </View>
  );
}

function HistoryItem() {
  return (
    <View style={styles.historyCard}>
      <View style={styles.historyTopRow}>
        <Text style={styles.historyDate}>2026.05.16</Text>
        <Text style={styles.historyAmount}>+ 0.0235주</Text>
      </View>
      <Text style={styles.historyDetail}>VOO · 0.0235주 · 시장가 체결</Text>
    </View>
  );
}

export default function EtfHistoryScreen() {
  return (
    <View style={styles.container}>
      <TopBar title="ETF 지급 내역" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryBlock}>
          <Text style={styles.summaryLabel}>총 평가 금액</Text>
          <Text style={styles.summaryAmount}>79,420원</Text>
          <Text style={styles.summaryChange}>+ 4,820원 (+6.45%)</Text>
        </View>

        <View style={styles.segmentWrap}>
          <View style={[styles.segment, styles.segmentActive]}>
            <Text style={[styles.segmentText, styles.segmentTextActive]}>보유 종목</Text>
          </View>
          <View style={styles.segment}>
            <Text style={styles.segmentText}>매수 이력</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>자동 투자 ETF</Text>
        <HoldingCard
          ticker="VOO"
          title="S&P 500 ETF"
          subtitle="VOO · S&P 500"
          amount="79,420원"
          rate="+6.45%"
          averagePrice="375.40 USD"
        />

        <Text style={[styles.sectionTitle, styles.historySectionTitle]}>최근 매수 이력</Text>
        <View style={styles.historyList}>
          <HistoryItem />
          <HistoryItem />
          <HistoryItem />
        </View>

        <Text style={styles.note}>평가금액은 실시간 시세 기준 · 환율 변동 반영</Text>
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
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: AuthSpacing.lg,
    paddingTop: 20,
    paddingBottom: 28,
  },
  summaryBlock: {
    marginTop: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: AuthColors.textLightGray,
  },
  summaryAmount: {
    marginTop: 12,
    fontSize: 30,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  summaryChange: {
    marginTop: 10,
    fontSize: 11,
    color: AuthColors.error,
    fontWeight: '600',
  },
  segmentWrap: {
    marginTop: 24,
    flexDirection: 'row',
    backgroundColor: '#f5f5f7',
    borderRadius: 999,
    padding: 4,
  },
  segment: {
    flex: 1,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: AuthColors.white,
  },
  segmentText: {
    fontSize: 13,
    color: AuthColors.textLightGray,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: AuthColors.textBlack,
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 12,
    fontSize: 13,
    fontWeight: '700',
    color: AuthColors.textGray,
  },
  holdingCard: {
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    borderRadius: 14,
    padding: 14,
  },
  holdingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 11,
    fontWeight: '700',
    color: AuthColors.blue300,
  },
  holdingInfo: {
    flex: 1,
  },
  holdingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  holdingSubtitle: {
    marginTop: 4,
    fontSize: 10,
    color: AuthColors.textGray,
  },
  holdingRight: {
    position: 'absolute',
    right: 14,
    top: 14,
    alignItems: 'flex-end',
  },
  holdingAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  holdingRate: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
  },
  holdingRatePositive: {
    color: AuthColors.error,
  },
  holdingRateNegative: {
    color: AuthColors.blue300,
  },
  divider: {
    marginTop: 14,
    height: 1,
    backgroundColor: AuthColors.borderGray,
  },
  metricRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: AuthColors.textLightGray,
  },
  metricValue: {
    fontSize: 10,
    color: AuthColors.textBlack,
    fontWeight: '700',
  },
  historySectionTitle: {
    marginTop: 30,
  },
  historyList: {
    gap: 10,
  },
  historyCard: {
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  historyTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyDate: {
    fontSize: 12,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  historyAmount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ff674d',
  },
  historyDetail: {
    marginTop: 8,
    fontSize: 10,
    color: AuthColors.textGray,
  },
  note: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 10,
    color: AuthColors.textLightGray,
  },
});