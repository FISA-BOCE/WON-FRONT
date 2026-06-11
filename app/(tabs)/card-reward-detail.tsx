import { useFocusEffect } from '@react-navigation/native';
import { isAxiosError } from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { extractApiErrorMessage } from '@/hooks/apiClient';
import {
  getMonthlyReward,
  getRewardLedgerDetail,
  MonthlyRewardInfo,
  RewardLedgerDetailInfo,
} from '@/hooks/cardApi';

function formatBaseMonth(value: string) {
  const [year, month] = value.split('-');

  if (!year || !month) {
    return value;
  }

  return `${year}년 ${Number(month)}월`;
}

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString('ko-KR')}원`;
}

function formatRewardRate(value: number) {
  return `${value.toFixed(1)}%`;
}

function mapPerformanceStatusLabel(status: number | string) {
  const normalizedStatus = typeof status === 'string' ? Number(status) : status;

  switch (normalizedStatus) {
    case 1:
      return '실적 기준 미달';
    case 2:
      return '실적 기준 충족';
    default:
      return String(status);
  }
}

function mapRewardItemToFilter(item: RewardLedgerDetailInfo) {
  if (item.type === 'EARN') {
    return '적립';
  }

  return '미적용';
}

function mapRewardItemToLabel(item: RewardLedgerDetailInfo) {
  if (item.type === 'EARN') {
    return '적립 완료';
  }

  if (item.type === 'NOT_APPLIED') {
    return '조건 미충족';
  }

  if (item.sweepStatus === 'NONE' || item.sweepStatus === 'REQUESTED') {
    return '처리 중';
  }

  if (item.sweepStatus === 'FAILED') {
    return '실패';
  }

  return item.sweepStatus;
}

export default function CardRewardDetailScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    baseMonth?: string | string[];
    pointAmount?: string | string[];
    type?: string | string[];
    sweepStatus?: string | string[];
  }>();
  const rewardId = Array.isArray(params.id) ? params.id[0] : params.id;
  const baseMonthParam = Array.isArray(params.baseMonth) ? params.baseMonth[0] : params.baseMonth;
  const pointAmountParam = Array.isArray(params.pointAmount) ? params.pointAmount[0] : params.pointAmount;
  const typeParam = Array.isArray(params.type) ? params.type[0] : params.type;
  const sweepStatusParam = Array.isArray(params.sweepStatus) ? params.sweepStatus[0] : params.sweepStatus;
  const numericRewardId = rewardId ? Number(rewardId) : NaN;

  const [ledgerDetail, setLedgerDetail] = useState<RewardLedgerDetailInfo | null>(null);
  const [monthlyReward, setMonthlyReward] = useState<MonthlyRewardInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadDetail = async () => {
        if (!Number.isFinite(numericRewardId)) {
          if (isMounted) {
            setErrorMessage('유효하지 않은 리워드 상세 요청입니다.');
            setIsLoading(false);
          }
          return;
        }

        try {
          setIsLoading(true);
          setErrorMessage('');

          const nextMonthlyReward = await getMonthlyReward().catch(() => null);
          let nextLedgerDetail: RewardLedgerDetailInfo | null = null;

          try {
            nextLedgerDetail = await getRewardLedgerDetail(numericRewardId);
          } catch (error) {
            if (!isAxiosError(error) || error.response?.status !== 404) {
              throw error;
            }
          }

          if (!isMounted) {
            return;
          }

          setLedgerDetail(nextLedgerDetail);
          setMonthlyReward(nextMonthlyReward);
        } catch (error) {
          if (isMounted) {
            setErrorMessage(extractApiErrorMessage(error, '리워드 상세 정보를 불러오지 못했습니다.'));
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      void loadDetail();

      return () => {
        isMounted = false;
      };
    }, [numericRewardId]),
  );

  const reward = useMemo(() => {
    const fallbackBaseMonth = baseMonthParam ?? monthlyReward?.baseMonth;
    const fallbackPointAmount = pointAmountParam ? Number(pointAmountParam) : 0;
    const fallbackType = typeParam ?? '';
    const fallbackSweepStatus = sweepStatusParam ?? '';

    if (!ledgerDetail && !fallbackBaseMonth) {
      return null;
    }

    const baseMonth = ledgerDetail?.baseMonth ?? fallbackBaseMonth ?? '';
    const monthlyForSameMonth =
      monthlyReward && monthlyReward.baseMonth === baseMonth ? monthlyReward : null;

    const detailType = ledgerDetail?.type ?? fallbackType;
    const detailSweepStatus = ledgerDetail?.sweepStatus ?? fallbackSweepStatus;
    const pointAmount = ledgerDetail?.pointAmount ?? fallbackPointAmount;

    const detailLike: RewardLedgerDetailInfo = ledgerDetail ?? {
      pointLedgerId: numericRewardId,
      baseMonth,
      type: detailType,
      pointAmount,
      sweepStatus: detailSweepStatus,
      occurredAt: '',
      detail: null,
    };

    const performanceStatus = monthlyForSameMonth
      ? mapPerformanceStatusLabel(monthlyForSameMonth.performanceStatus)
      : detailType === 'NOT_APPLIED'
        ? '실적 기준 미달'
        : detailLike.detail?.shortfallAmount && detailLike.detail.shortfallAmount > 0
        ? '실적 기준 미달'
        : '실적 기준 충족';

    return {
      monthTitle: `${formatBaseMonth(baseMonth)} 리워드`,
      amount: formatWon(monthlyForSameMonth?.rewardPointAmount ?? pointAmount),
      status: mapRewardItemToFilter(detailLike),
      badgeLabel: mapRewardItemToLabel(detailLike),
      previousMonthSpendAmount: formatWon(
        monthlyForSameMonth?.previousMonthSpendAmount ?? detailLike.detail?.previousMonthSpendAmount ?? 0,
      ),
      targetSpendAmount: formatWon(detailLike.detail?.targetSpendAmount ?? 0),
      shortfallAmount: formatWon(detailLike.detail?.shortfallAmount ?? 0),
      rewardRate: monthlyForSameMonth ? formatRewardRate(monthlyForSameMonth.rewardRate) : '',
      performanceStatus,
      isNotMet: performanceStatus === '실적 기준 미달' || detailType === 'NOT_APPLIED',
      failureMessage: detailLike.sweepFailureMessage ?? '',
    };
  }, [baseMonthParam, ledgerDetail, monthlyReward, numericRewardId, pointAmountParam, sweepStatusParam, typeParam]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <TopBar title="실적 충족 여부 상세" onBackPress={() => router.back()} />
        <View style={styles.centerState}>
          <ActivityIndicator size="small" color={AuthColors.blue300} />
          <Text style={styles.stateText}>리워드 상세 정보를 불러오는 중입니다.</Text>
        </View>
      </View>
    );
  }

  if (errorMessage || !reward) {
    return (
      <View style={styles.container}>
        <TopBar title="실적 충족 여부 상세" onBackPress={() => router.back()} />
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{errorMessage || '리워드 상세 정보를 찾을 수 없습니다.'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar title="실적 충족 여부 상세" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.monthTitle}>{reward.monthTitle}</Text>
          <Text style={styles.sectionLabel}>리워드 금액</Text>
          <Text style={styles.largeValue}>{reward.amount}</Text>
          <View
            style={[
              styles.statusPill,
              reward.status === '적립' && styles.statusPillEarned,
              reward.status === '미적용' && styles.statusPillMissed,
              reward.badgeLabel === '처리 중' && styles.statusPillProcessing,
            ]}
          >
            <Text
              style={[
                styles.statusPillText,
                reward.status === '적립' && styles.statusPillTextEarned,
                reward.status === '미적용' && styles.statusPillTextMissed,
                reward.badgeLabel === '처리 중' && styles.statusPillTextProcessing,
              ]}
            >
              {reward.badgeLabel}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>상세 내역</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>전월 실적</Text>
            <Text style={styles.detailValue}>{reward.previousMonthSpendAmount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>실적 상태</Text>
            <Text style={[styles.detailValue, reward.isNotMet && styles.highlightValue]}>
              {reward.performanceStatus}
            </Text>
          </View>
          {reward.rewardRate ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>적립률</Text>
              <Text style={styles.detailValue}>{reward.rewardRate}</Text>
            </View>
          ) : null}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>실적 기준</Text>
            <Text style={styles.detailValue}>{reward.targetSpendAmount}</Text>
          </View>
          {reward.isNotMet ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>부족 금액</Text>
              <Text style={[styles.detailValue, styles.highlightValue]}>{reward.shortfallAmount}</Text>
            </View>
          ) : null}
        </View>

        {reward.isNotMet ? (
          <>
            <Text style={styles.sectionTitle}>이 사유가 무엇인가요?</Text>
            <View style={styles.explanationCard}>
              <Text style={styles.explanationMain}>
                전월 카드 이용 실적이 1,000원 이상이어야</Text>
              <Text style={styles.explanationMain}>자동투자 리워드가 적립됩니다.
              </Text>
              <View style={styles.explDivider} />
              <Text style={styles.explanationLabel}>실적 인정 기준</Text>
              <Text style={styles.explanationText}>
                청구 취소·환불·제외 업종을 제외한 결제액
              </Text>
            </View>
          </>
        ) : null}

        {reward.failureMessage ? (
          <>
            <Text style={styles.sectionTitle}>추가 안내</Text>
            <View style={styles.explanationCard}>
              <Text style={styles.explanationMain}>{reward.failureMessage}</Text>
            </View>
          </>
        ) : null}

        <View style={styles.bottomGap} />
        <AuthButton title="확인" onPress={() => router.push('/card-reward-history')} />
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
  summaryCard: {
    marginTop: AuthSpacing.default,
  },
  monthTitle: {
    fontSize: 13,
    color: AuthColors.textGray,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 14,
    color: AuthColors.textGray,
  },
  largeValue: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  statusPill: {
    alignSelf: 'flex-start',
    marginTop: 14,
    minWidth: 78,
    height: 24,
    borderRadius: 999,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  statusPillText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '700',
  },
  statusPillEarned: {
    backgroundColor: 'rgba(114,176,29,0.2)',
  },
  statusPillMissed: {
    backgroundColor: 'rgba(255,103,77,0.2)',
  },
  statusPillProcessing: {
    backgroundColor: 'rgba(255, 224, 102, 0.3)',
  },
  statusPillTextEarned: {
    color: AuthColors.success,
  },
  statusPillTextMissed: {
    color: AuthColors.error,
  },
  statusPillTextProcessing: {
    color: '#9a6700',
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
  highlightValue: {
    color: '#d97706',
    fontWeight: '700',
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
  bottomGap: {
    height: 20,
  },
});
