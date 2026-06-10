import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { extractApiErrorMessage } from '@/hooks/apiClient';
import { getCardAutoInvest, getCardInfo, getRewardLedgers, RewardLedgerItem } from '@/hooks/cardApi';
import { getInvestMain, InvestMainResult } from '@/hooks/investApi';

import SecuritiesNoAccountScreen from './invest-no-account';

function RecentCard({
  ticker,
  title,
  quantity,
  amount,
  occurredAt,
}: {
  ticker: string;
  title: string;
  quantity: string;
  amount: string;
  occurredAt: string;
}) {
  return (
    <View style={styles.recentCard}>
      <View style={styles.recentTickerWrap}>
        <Text style={styles.recentTicker}>{ticker}</Text>
      </View>
      <View style={styles.recentInfo}>
        <Text style={styles.recentTitle}>{title}</Text>
        <Text style={styles.recentQuantity}>{quantity}</Text>
        <Text style={styles.recentDate}>{occurredAt}</Text>
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
  const [investMain, setInvestMain] = useState<InvestMainResult | null>(null);
  const [rewardLedgers, setRewardLedgers] = useState<RewardLedgerItem[]>([]);
  const [autoInvestSummary, setAutoInvestSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadScreen = async () => {
        try {
          setIsLoading(true);
          setErrorMessage('');

          const [nextInvestMain, nextRewardLedgers] = await Promise.all([
            getInvestMain(),
            getRewardLedgers(),
          ]);

          const cardInfoResult = await getCardInfo().catch(() => []);
          const primaryCard = cardInfoResult[0];
          const autoInvestInfo = primaryCard
            ? await getCardAutoInvest(primaryCard.cardUuid).catch(() => null)
            : null;
          const displayEtf = autoInvestInfo?.pendingEtf ?? autoInvestInfo?.currentEtf ?? null;
          const nextAutoInvestSummary = displayEtf
            ? `${displayEtf.ticker} ${autoInvestInfo?.pendingEtf ? '변경 예정' : '적립 중'}`
            : '';

          if (!isMounted) {
            return;
          }

          setInvestMain(nextInvestMain);
          setRewardLedgers(nextRewardLedgers.slice(0, 3));
          setAutoInvestSummary(nextAutoInvestSummary);
        } catch (error) {
          if (!isMounted) {
            return;
          }

          const responseStatus =
            typeof error === 'object' && error !== null && 'response' in error
              ? (error as { response?: { status?: number } }).response?.status
              : undefined;

          if (responseStatus === 404) {
            setInvestMain(null);
            setRewardLedgers([]);
            setAutoInvestSummary('');
            setErrorMessage('');
            return;
          }

          setErrorMessage(extractApiErrorMessage(error, '증권 메인 정보를 불러오지 못했습니다.'));
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      void loadScreen();

      return () => {
        isMounted = false;
      };
    }, []),
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <TopBar title="증권" showBack={false} showRightMenu={true} />
        <View style={styles.centerState}>
          <ActivityIndicator size="small" color={AuthColors.blue300} />
          <Text style={styles.stateText}>증권 메인 정보를 불러오는 중입니다.</Text>
        </View>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.container}>
        <TopBar title="증권" showBack={false} showRightMenu={true} />
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      </View>
    );
  }

  if (!investMain?.account) {
    return <SecuritiesNoAccountScreen />;
  }

  const { account, cashBalance } = investMain;
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
          <Text style={styles.balanceAmount}>{formatWon(investMain.totalEvaluationAmount)}</Text>
          <Text style={styles.balanceDelta}>현재 원장 정보가 없어 0원 기준으로 표시될 수 있습니다.</Text>
        </View>

        <View style={styles.accountCard}>
          <View style={styles.accountLeft}>
            <View style={styles.accountIcon}>
              <Ionicons name="card" size={24} color={AuthColors.white} />
            </View>
            <View>
              <Text style={styles.accountTitle}>우리투자증권 증권계좌</Text>
              <Text style={styles.accountSub}>{account.accountNoDisplay} | 상태 {account.accountStatus}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle1}>원화 / 달러</Text>
        <View style={styles.twoCards}>
          <MoneyCard
            title="원화"
            amount={formatWon(cashBalance.krwAmount)}
            note={cashBalance.krwStatus || '원화 잔액 정보'}
          />
          <MoneyCard
            title="달러"
            amount={`${formatDecimal(cashBalance.usdAmount)} USD`}
            note={formatWon(cashBalance.usdKrwAmount)}
          />
        </View>

        <Pressable style={styles.listHeader} onPress={() => router.push('/(tabs)/etf-reward')}>
          <View style={styles.listHeaderTextWrap}>
            <Text style={styles.listHeaderTitle}>ETF 자동 체결 내역 확인</Text>
            {autoInvestSummary ? (
              <Text style={styles.listHeaderSubtitle}>{autoInvestSummary}</Text>
            ) : null}
          </View>
          <Ionicons name="chevron-forward" size={18} color={AuthColors.textLightGray} />
        </Pressable>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle2}>지급 내역</Text>
          <Pressable style={styles.linkOnly} onPress={() => router.push('/(tabs)/card-reward-history')}>
            <Text style={styles.linkText}>전체 보기</Text>
          </Pressable>
        </View>

        {rewardLedgers.length > 0 ? (
          <View style={styles.recentList}>
            {rewardLedgers.map((ledger) => (
              <RecentCard
                key={ledger.pointLedgerId}
                ticker={ledger.type}
                title={`${ledger.baseMonth} 리워드`}
                quantity={ledger.sweepStatus}
                amount={formatWon(ledger.pointAmount)}
                occurredAt={formatDate(ledger.occurredAt)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyListCard}>
            <Text style={styles.emptyListText}>아직 지급 내역이 없습니다.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString('ko-KR')}원`;
}

function formatDecimal(value: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function formatDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AuthColors.white,
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: AuthSpacing.lg,
  },
  stateText: {
    fontSize: 14,
    color: AuthColors.textGray,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: AuthColors.error,
    textAlign: 'center',
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
  listHeaderTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  listHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  listHeaderSubtitle: {
    marginTop: 6,
    fontSize: 12,
    color: AuthColors.textGray,
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
    minWidth: 44,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  recentTicker: {
    fontSize: 11,
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
  recentDate: {
    fontSize: 11,
    color: AuthColors.gray500,
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
  emptyListCard: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 13,
    color: AuthColors.textGray,
  },
});
