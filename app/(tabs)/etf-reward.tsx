import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { extractApiErrorMessage } from '@/hooks/apiClient';
import { CardAutoInvestInfo, getCardAutoInvest, getCardInfo } from '@/hooks/cardApi';
import {
  getAutoInvestExecutionHistories,
  getInvestMain,
  InvestAutoInvestExecutionHistoryItem,
} from '@/hooks/investApi';

function formatEffectiveDate(value?: string) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const yyyy = date.getFullYear();
  const mm = `${date.getMonth() + 1}`.padStart(2, '0');
  const dd = `${date.getDate()}`.padStart(2, '0');

  const suffix = date.getTime() > Date.now() ? '적용 예정' : '적용 중';

  return `${yyyy}.${mm}.${dd}부터 ${suffix}`;
}

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

function formatHistoryDate(item: InvestAutoInvestExecutionHistoryItem) {
  const target = item.executedAt || item.requestedAt;

  if (!target) {
    return '';
  }

  const date = new Date(target);

  if (Number.isNaN(date.getTime())) {
    return target;
  }

  const yyyy = date.getFullYear();
  const mm = `${date.getMonth() + 1}`.padStart(2, '0');
  const dd = `${date.getDate()}`.padStart(2, '0');
  const hh = `${date.getHours()}`.padStart(2, '0');
  const min = `${date.getMinutes()}`.padStart(2, '0');

  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

function mapExecutionStatusLabel(item: InvestAutoInvestExecutionHistoryItem) {
  switch (item.executionStatus) {
    case 'COMPLETED':
    case 'SUCCESS':
      return '자동 투자 체결 완료';
    case 'REQUESTED':
      return '자동 투자 요청됨';
    case 'FAILED':
      return item.failureMessage || '자동 투자 실패';
    default:
      return item.failureMessage || item.executionStatus;
  }
}

export default function ETFReward() {
  const [autoInvestInfo, setAutoInvestInfo] = useState<CardAutoInvestInfo | null>(null);
  const [executionHistories, setExecutionHistories] = useState<InvestAutoInvestExecutionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadAutoInvestInfo = async () => {
        try {
          setIsLoading(true);
          setErrorMessage('');

          const cards = await getCardInfo();
          const primaryCard = cards[0];

          if (!primaryCard) {
            if (isMounted) {
              setAutoInvestInfo(null);
              setExecutionHistories([]);
            }
            return;
          }

          const [nextAutoInvestInfo, investMain] = await Promise.all([
            getCardAutoInvest(primaryCard.cardUuid),
            getInvestMain(),
          ]);

          const accountUuid = investMain.account?.investAccountUuid;
          const nextExecutionHistories = accountUuid
            ? (await getAutoInvestExecutionHistories(accountUuid)).histories
            : [];

          if (isMounted) {
            setAutoInvestInfo(nextAutoInvestInfo);
            setExecutionHistories(nextExecutionHistories);
          }
        } catch (error) {
          if (isMounted) {
            setErrorMessage(extractApiErrorMessage(error, 'ETF 자동 적립 정보를 불러오지 못했습니다.'));
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      void loadAutoInvestInfo();

      return () => {
        isMounted = false;
      };
    }, []),
  );

  const currentEtf = autoInvestInfo?.currentEtf ?? null;
  const pendingEtf = autoInvestInfo?.pendingEtf ?? null;
  const displayEtf = pendingEtf ?? currentEtf;
  const isPendingUpdate = Boolean(pendingEtf);

  return (
    <View style={styles.container}>
      <TopBar title="ETF 자동 체결 내역" />

      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>ETF 자동 체결 내역</Text>

        <Text style={styles.sectionTitle}>{isPendingUpdate ? '변경 예정 ETF' : '현재 적립 중인 ETF'}</Text>

        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="small" color={AuthColors.blue300} />
            <Text style={styles.stateText}>현재 적립 중인 ETF를 불러오는 중입니다.</Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.centerState}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : displayEtf ? (
          <View style={styles.currentETFCard}>
            <View style={styles.etfBadgeContainer}>
              <View style={styles.etfBadge}>
                <Text style={styles.etfBadgeText}>{displayEtf.ticker}</Text>
              </View>
            </View>

            <View style={styles.currentETFContent}>
              <View style={styles.currentETFTitleRow}>
                <Text style={styles.currentETFName}>{displayEtf.etfName}</Text>
                {isPendingUpdate ? (
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingBadgeText}>변경 예정</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.currentETFDate}>{formatEffectiveDate(displayEtf.effectiveFrom)}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>현재 적립 중인 ETF가 없습니다.</Text>
            <Text style={styles.emptyDescription}>카드 자동 투자 설정 후 이곳에서 확인할 수 있습니다.</Text>
          </View>
        )}

        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>변경 시 다음 적립분부터 적용됩니다.</Text>
          <Text style={styles.warningText}>기존 적립된 ETF에는 영향을 미치지 않습니다.</Text>
        </View>

        <View style={styles.historySectionHeader}>
          <Text style={styles.sectionTitle}>ETF 자동 투자 체결 이력</Text>
          <TouchableOpacity style={styles.viewAllButtonInline} onPress={() => router.push('/etf-change')}>
            <Text style={styles.viewAllText}>변경하기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timelineCard}>
          {executionHistories.length > 0 ? (
            executionHistories.map((history, index) => (
              <TimelineItem
                key={history.sweepExecutionId}
                title={`${history.ticker} (${history.etfName})`}
                dateText={formatHistoryDate(history)}
                status={mapExecutionStatusLabel(history)}
                isLast={index === executionHistories.length - 1}
                active={index === 0}
              />
            ))
          ) : (
            <View style={styles.emptyHistoryContainer}>
              <Text style={styles.emptyDescription}>아직 ETF 자동 투자 체결 이력이 없습니다.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentScroll: {
    flex: 1,
    paddingHorizontal: AuthSpacing.md,
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: AuthColors.gray900,
    marginTop: AuthSpacing.default,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.gray700,
    marginTop: 24,
    marginBottom: 20,
  },
  centerState: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  stateText: {
    fontSize: 13,
    color: AuthColors.gray600,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 13,
    color: AuthColors.error,
    textAlign: 'center',
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '600',
    color: AuthColors.blue500,
    lineHeight: 14,
  },
  historySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllButtonInline: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentETFCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: AuthColors.blue300,
    borderRadius: 12,
    padding: AuthSpacing.md,
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
    minWidth: 0,
  },
  currentETFTitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  currentETFName: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.gray900,
    flexShrink: 1,
    minWidth: 0,
    lineHeight: 20,
    marginRight: 8,
    marginBottom: 8
  },
  currentETFDate: {
    fontSize: 10,
    fontWeight: '400',
    color: AuthColors.gray600,
  },
  pendingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#EFF6FF',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  pendingBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: AuthColors.blue500,
  },
  emptyCard: {
    borderWidth: 1,
    borderColor: AuthColors.gray200,
    borderRadius: 12,
    padding: AuthSpacing.lg,
    marginBottom: AuthSpacing.md,
    backgroundColor: AuthColors.white,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.gray900,
    marginBottom: 6,
  },
  emptyDescription: {
    fontSize: 12,
    color: AuthColors.gray600,
    lineHeight: 18,
    textAlign: 'center',
  },
  warningContainer: {
    backgroundColor: 'rgba(255, 224, 102, 0.3)',
    borderRadius: 8,
    padding: AuthSpacing.md,
    marginBottom: AuthSpacing.lg,
  },
  warningText: {
    fontSize: 10,
    fontWeight: '400',
    color: AuthColors.gray600,
    marginBottom: 4,
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
  emptyHistoryContainer: {
    paddingVertical: 16,
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
  bottomGap: {
    height: 20,
  },
});
