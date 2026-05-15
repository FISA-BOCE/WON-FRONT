import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';

function RecentCard({
  ticker,
  title,
  quantity,
  amount,
}: {
  ticker: string;
  title: string;
  quantity: string;
  amount: string;
}) {
  return (
    <View style={styles.recentCard}>
      <View style={styles.recentTickerWrap}>
        <Text style={styles.recentTicker}>{ticker}</Text>
      </View>
      <View style={styles.recentInfo}>
        <Text style={styles.recentTitle}>{title}</Text>
        <Text style={styles.recentQuantity}>{quantity}</Text>
      </View>
      <Text style={styles.recentAmount}>{amount}</Text>
    </View>
  );
}

function MoneyCard({
  title,
  amount,
  note,
}: {
  title: string;
  amount: string;
  note: string;
}) {
  return (
    <View style={styles.moneyCard}>
      <Text style={styles.moneyCardTitle}>{title}</Text>
      <Text style={styles.moneyCardAmount}>{amount}</Text>
      <Text style={styles.moneyCardNote}>{note}</Text>
    </View>
  );
}

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <TopBar title="증권" showBack={false} showRightMenu={true} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>총 평가 금액</Text>
          <Text style={styles.balanceAmount}>79,420원</Text>
          <Text style={styles.balanceDelta}>+ 4,820원 (+6.45%)</Text>
        </View>

        <View style={styles.accountCard}>
          <View style={styles.accountLeft}>
            <View style={styles.accountIcon}>
              <Ionicons name="card" size={24} color={AuthColors.white} />
            </View>
            <View>
              <Text style={styles.accountTitle}>우리투자증권 증권계좌</Text>
              <Text style={styles.accountSub}>123-***-***456 | 김*리</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={AuthColors.white} />
        </View>

        <Text style={styles.sectionTitle1}>원화 / 달러</Text>
        <View style={styles.twoCards}>
          <MoneyCard title="원화" amount="0원" note="전액 환전·매수 완료" />
          <MoneyCard title="달러" amount="1.19 USD" note="1,640원" />
        </View>

        <Pressable style={styles.listHeader} onPress={() => router.push('/etf-reward')}>
          <Text style={styles.listHeaderTitle}>ETF 자동 체결 내역 확인</Text>
          <Ionicons name="chevron-forward" size={18} color={AuthColors.textLightGray} />
        </Pressable>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle2}>지급 내역</Text>
          <Pressable style={styles.linkOnly} onPress={() => router.push('/etf-history')}>
            <Text style={styles.linkText}>전체 보기</Text>
          </Pressable>
        </View>
        
        <View style={styles.recentList}>
          <RecentCard ticker="QQQ" title="나스닥 100 ETF" quantity="0.0241주" amount="16,280원" />
          <RecentCard ticker="QQQ" title="나스닥 100 ETF" quantity="0.0241주" amount="16,280원" />
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
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: AuthSpacing.lg,
    paddingBottom: 28,
  },
  sectionHeaderRow: {
    marginTop: 60,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle1: {
    marginTop: 60,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  sectionTitle2: {
    fontSize: 16,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  balanceCard: {
    marginTop: 40,
    backgroundColor: AuthColors.white,
  },
  balanceTitle: {
    fontSize: 14,
    color: AuthColors.textGray,
  },
  balanceAmount: {
    fontSize: 26,
    fontWeight: '700',
    color: AuthColors.textBlack,
    marginTop: 12,
  },
  balanceDelta: {
    fontSize: 12,
    color: AuthColors.textGray,
    marginTop: 18,
  },
  accountCard: {
    marginTop: 40,
    borderRadius: 16,
    backgroundColor: AuthColors.blue300,
    padding: 24,
    paddingLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  accountIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AuthColors.white,
  },
  accountSub: {
    marginTop: 8,
    fontSize: 12,
    color: AuthColors.white,
  },
  twoCards: {
    flexDirection: 'row',
    gap: 10,
  },
  moneyCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    borderRadius: 14,
    padding: 14,
    minHeight: 84,
  },
  moneyCardTitle: {
    fontSize: 12,
    color: AuthColors.textGray,
  },
  moneyCardAmount: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  moneyCardNote: {
    marginTop: 10,
    fontSize: 12,
    color: AuthColors.textGray,
  },
  listHeader: {
    marginTop: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  recentList: {
    marginTop: 12,
    gap: 12,
  },
  recentCard: {
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  recentTickerWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentTicker: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  recentInfo: {
    flex: 1,
    gap: 4,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  recentQuantity: {
    fontSize: 12,
    color: AuthColors.textGray,
  },
  recentAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  linkText: {
    fontSize: 13,
    color: AuthColors.blue300,
    fontWeight: '700',
  },
  linkOnly: {
    paddingVertical: 2,
  },
});
