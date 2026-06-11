import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { extractApiErrorMessage } from '@/hooks/apiClient';
import { CardAutoInvestInfo, getCardAutoInvest, getCardInfo } from '@/hooks/cardApi';
import {
  getAutoInvestExecutionHistories,
  getInvestMain,
  InvestAutoInvestExecutionHistoryItem,
  InvestMainResult,
} from '@/hooks/investApi';

import SecuritiesNoAccountScreen from './invest-no-account';

function TimelineItem({
  title,
  status,
  dateText,
  isLast,
  active = false,
}: {
  title: string;
  status: string;
  dateText: string;
  isLast: boolean;
  active?: boolean;
}) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineLeftColumn}>
        <View style={[styles.timelineDot, active ? styles.timelineDotActive : styles.timelineDotInactive]} />
        {!isLast && <View style={styles.timelineLine} />}
      </View>

      <View style={styles.timelineContent}>
        <View style={styles.timelineHeaderRow}>
          <Text style={styles.timelineTitle}>{title}</Text>
        </View>
        <Text style={styles.timelineDate}>{dateText}</Text>
        <Text style={styles.timelineStatus}>{status}</Text>
      </View>
    </View>
  );
}

function CurrentEtfCard({
  ticker,
  name,
  subtitle,
}: {
  ticker: string;
  name: string;
  subtitle: string;
}) {
  return (
    <View style={styles.currentETFCard}>
      <View style={styles.etfBadgeContainer}>
        <View style={styles.etfBadge}>
          <Text style={styles.etfBadgeText}>{ticker}</Text>
        </View>
      </View>
      <View style={styles.currentETFContent}>
        <Text style={styles.currentETFName}>{name}</Text>
        <Text style={styles.currentETFDate}>{subtitle}</Text>
      </View>
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
  const [autoInvestInfo, setAutoInvestInfo] = useState<CardAutoInvestInfo | null>(null);
  const [executionHistories, setExecutionHistories] = useState<InvestAutoInvestExecutionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadScreen = async () => {
        try {
          setIsLoading(true);
          setErrorMessage('');

          const nextInvestMain = await getInvestMain();

          const cardInfoResult = await getCardInfo().catch(() => []);
          const primaryCard = cardInfoResult[0];
          const nextAutoInvestInfo = primaryCard
            ? await getCardAutoInvest(primaryCard.cardUuid).catch(() => null)
            : null;
          const accountUuid = nextInvestMain.account?.investAccountUuid;
          const nextExecutionHistories = accountUuid
            ? (await getAutoInvestExecutionHistories(accountUuid).catch(() => null))?.histories ?? []
            : [];

          if (!isMounted) {
            return;
          }

          setInvestMain(nextInvestMain);
          setAutoInvestInfo(nextAutoInvestInfo);
          setExecutionHistories(nextExecutionHistories.slice(0, 3));
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
            setAutoInvestInfo(null);
            setExecutionHistories([]);
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
  const displayEtf = autoInvestInfo?.pendingEtf ?? autoInvestInfo?.currentEtf ?? null;
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
              <Text style={styles.accountSub}>{account.accountNoDisplay}{account.accountStatus}</Text>
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

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle2}>현재 적립 중인 ETF</Text>
          <Pressable style={styles.linkOnly} onPress={() => router.push('/etf-reward')}>
            <Text style={styles.linkText}>전체 보기</Text>
          </Pressable>
        </View>

        {displayEtf ? (
          <CurrentEtfCard
            ticker={displayEtf.ticker}
            name={displayEtf.etfName}
            subtitle={`${autoInvestInfo?.pendingEtf ? '변경 예정' : '적립 중'} · ${formatAutoInvestDate(displayEtf.effectiveFrom)}`}
          />
        ) : (
          <View style={styles.emptyListCard}>
            <Text style={styles.emptyListText}>현재 적립 중인 ETF가 없습니다.</Text>
          </View>
        )}

        <View style={styles.sectionHeaderRowCompact}>
          <Text style={styles.sectionTitle2}>ETF 자동 투자 체결 이력</Text>
        </View>

        {executionHistories.length > 0 ? (
          <View style={styles.timelineCard}>
            {executionHistories.map((history, index) => (
              <TimelineItem
                key={history.sweepExecutionId}
                title={`${history.ticker} (${history.etfName})`}
                dateText={formatExecutionHistoryDate(history)}
                status={formatExecutionHistorySubtitle(history)}
                isLast={index === executionHistories.length - 1}
                active={index === 0}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyListCard}>
            <Text style={styles.emptyListText}>아직 ETF 자동 투자 체결 이력이 없습니다.</Text>
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

function formatAutoInvestDate(value?: string) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const suffix = date.getTime() > Date.now() ? '적용 예정' : '적용 중';

  return `${yyyy}.${mm}.${dd}부터 ${suffix}`;
}

function formatExecutionHistorySubtitle(item: InvestAutoInvestExecutionHistoryItem) {
  const quantity = item.executedQuantity || item.orderedQuantity;

  if (quantity && (item.executionStatus === 'COMPLETED' || item.executionStatus === 'SUCCESS')) {
    return `${quantity.toFixed(4)}주`;
  }

  switch (item.executionStatus) {
    case 'REQUESTED':
      return '자동 투자 요청됨';
    case 'FAILED':
      return item.failureMessage || '자동 투자 실패';
    default:
      return '자동 투자 체결';
  }
}

function formatExecutionHistoryDate(item: InvestAutoInvestExecutionHistoryItem) {
  const target = item.executedAt || item.requestedAt;

  if (!target) {
    return '';
  }

  const date = new Date(target);

  if (Number.isNaN(date.getTime())) {
    return target;
  }

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
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
  sectionHeaderRowCompact: {
    marginTop: 24,
    marginBottom: 12,
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
  currentETFCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: AuthColors.blue300,
    borderRadius: 12,
    padding: AuthSpacing.md,
    marginTop: 12,
    marginBottom: AuthSpacing.md,
  },
  etfBadgeContainer: {
    marginRight: AuthSpacing.md,
  },
  etfBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  etfBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: AuthColors.blue300,
  },
  currentETFContent: {
    flex: 1,
  },
  currentETFName: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.gray900,
  },
  currentETFDate: {
    marginTop: 4,
    fontSize: 10,
    color: AuthColors.gray600,
  },
  timelineCard: {
    borderWidth: 1,
    borderColor: AuthColors.gray200,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: AuthSpacing.md,
    paddingVertical: AuthSpacing.md,
    marginBottom: AuthSpacing.md,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 58,
    paddingTop: 12,
  },
  timelineLeftColumn: {
    width: 22,
    alignItems: 'center',
    marginRight: 8,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineDotActive: {
    backgroundColor: AuthColors.blue300,
  },
  timelineDotInactive: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: AuthColors.gray300,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: AuthColors.gray200,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: AuthSpacing.md,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  timelineTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: AuthColors.gray900,
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 10,
    fontWeight: '400',
    color: AuthColors.gray600,
    marginBottom: 8,
  },
  timelineStatus: {
    fontSize: 10,
    fontWeight: '400',
    color: AuthColors.gray500,
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
