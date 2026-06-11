import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { extractApiErrorMessage } from '@/hooks/apiClient';
import {
  getRewardLedgerOverview,
  RewardLedgerItem,
  RewardLedgerResponse,
} from '@/hooks/cardApi';

type RewardFilter = '전체' | '적립' | '미적용';

const REWARD_FILTERS: RewardFilter[] = ['전체', '적립', '미적용'];

export default function CardRewardHistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState<RewardFilter>('전체');
  const [overview, setOverview] = useState<RewardLedgerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadRewardHistory = async () => {
        try {
          setIsLoading(true);
          setErrorMessage('');
          const nextOverview = await getRewardLedgerOverview();

          if (isMounted) {
            setOverview(nextOverview);
          }
        } catch (error) {
          if (isMounted) {
            setErrorMessage(extractApiErrorMessage(error, '리워드 이력을 불러오지 못했습니다.'));
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      void loadRewardHistory();

      return () => {
        isMounted = false;
      };
    }, []),
  );

  const filteredRewards = useMemo(() => {
    const ledgers = overview?.ledgers ?? [];

    return ledgers.filter((item) => {
      if (selectedFilter === '전체') {
        return true;
      }

      return mapRewardItemToFilter(item) === selectedFilter;
    });
  }, [overview?.ledgers, selectedFilter]);

  const earnedAmount = useMemo(() => {
    const ledgers = overview?.ledgers ?? [];

    return ledgers
      .filter((item) => mapRewardItemToFilter(item) === '적립')
      .reduce((sum, item) => sum + item.pointAmount, 0);
  }, [overview?.ledgers]);

  return (
    <View style={styles.container}>
      <TopBar title="리워드 이력" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCaption}>{overview ? `${overview.baseYear}년 누적 적립` : '리워드 누적 적립'}</Text>
          <Text style={styles.summaryAmount}>{formatWon(earnedAmount)}</Text>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>전체 건수</Text>
            <Text style={styles.summaryValue}>{`${overview?.ledgers.length ?? 0}건`}</Text>
          </View>
        </View>

        <View style={styles.filterRow}>
          {REWARD_FILTERS.map((filter) => {
            const active = filter === selectedFilter;

            return (
              <Pressable key={filter} style={styles.filterItem} onPress={() => setSelectedFilter(filter)}>
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{filter}</Text>
                <View style={[styles.filterIndicator, active && styles.filterIndicatorActive]} />
              </Pressable>
            );
          })}
        </View>

        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="small" color={AuthColors.blue300} />
            <Text style={styles.stateText}>리워드 이력을 불러오는 중입니다.</Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.centerState}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : (
          <View style={styles.listWrap}>
            {filteredRewards.length > 0 ? (
              filteredRewards.map((item) => {
                const filterStatus = mapRewardItemToFilter(item);
                const statusLabel = mapRewardItemToLabel(item);
                const isProcessingStatus = statusLabel === '처리 중';

                return (
                  <Pressable
                    key={item.pointLedgerId}
                    style={styles.listCard}
                    onPress={() =>
                      router.push({
                        pathname: '/card-reward-detail',
                        params: {
                          id: String(item.pointLedgerId),
                          baseMonth: item.baseMonth,
                          pointAmount: String(item.pointAmount),
                          type: item.type,
                          sweepStatus: item.sweepStatus,
                        },
                      })
                    }
                  >
                    <View style={styles.listHeader}>
                      <Text style={styles.listDate}>{formatBaseMonth(item.baseMonth)}</Text>
                      <Text style={styles.listAmount}>{formatWon(item.pointAmount)}</Text>
                    </View>
                    <View style={styles.listBottomRow}>
                      <View
                        style={[
                          styles.statusBadge,
                          filterStatus === '적립' && styles.statusEarned,
                          filterStatus === '미적용' && styles.statusMissed,
                          isProcessingStatus && styles.statusProcessing,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            filterStatus === '적립' && styles.statusTextEarned,
                            filterStatus === '미적용' && styles.statusTextMissed,
                            isProcessingStatus && styles.statusTextProcessing,
                          ]}
                        >
                          {statusLabel}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>선택한 카테고리의 지급 내역이 없습니다.</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function mapSweepStatusToFilter(sweepStatus: string): Exclude<RewardFilter, '전체'> {
  switch (sweepStatus) {
    case 'EARN':
    case 'COMPLETED':
    case 'SUCCESS':
      return '적립';
    default:
      return '미적용';
  }
}

function mapSweepStatusLabel(sweepStatus: string) {
  switch (sweepStatus) {
    case 'EARN':
      return '적립 완료';
    case 'NOT_APPLIED':
      return '조건 미충족';
    case 'NONE':
    case 'REQUESTED':
      return '처리 중';
    case 'COMPLETED':
      return '적립 완료';
    case 'SUCCESS':
      return '적립 성공';
    case 'FAILED':
      return '실패';
    default:
      return sweepStatus;
  }
}

function mapRewardItemToFilter(item: RewardLedgerItem): Exclude<RewardFilter, '전체'> {
  if (item.type === 'EARN') {
    return '적립';
  }

  if (item.type === 'NOT_APPLIED') {
    return '미적용';
  }

  return mapSweepStatusToFilter(item.sweepStatus);
}

function mapRewardItemToLabel(item: RewardLedgerItem) {
  if (item.type === 'EARN') {
    return '적립 완료';
  }

  if (item.type === 'NOT_APPLIED') {
    return '조건 미충족';
  }

  return mapSweepStatusLabel(item.sweepStatus);
}

function formatBaseMonth(value: string) {
  const [year, month] = value.split('-');

  if (!year || !month) {
    return value;
  }

  return `${year}년 ${month}월`;
}

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString('ko-KR')}원`;
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
    borderColor: AuthColors.blue300,
    backgroundColor: AuthColors.blue300,
    borderRadius: 16,
    padding: 20,
  },
  summaryCaption: {
    fontSize: 13,
    color: AuthColors.white,
  },
  summaryAmount: {
    marginTop: 8,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700',
    color: AuthColors.white,
  },
  summaryDivider: {
    marginTop: 18,
    marginBottom: 10,
    height: 1,
    backgroundColor: AuthColors.white,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 13,
    color: AuthColors.white,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '500',
    color: AuthColors.white,
  },
  filterRow: {
    marginTop: 60,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: AuthColors.borderGray,
  },
  filterItem: {
    flex: 1,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 16,
    color: AuthColors.textGray,
  },
  filterTextActive: {
    color: AuthColors.blue300,
    fontWeight: '700',
  },
  filterIndicator: {
    marginTop: 10,
    height: 2,
    width: 64,
    backgroundColor: 'transparent',
  },
  filterIndicatorActive: {
    backgroundColor: AuthColors.blue300,
  },
  centerState: {
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
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
  listWrap: {
    marginTop: 14,
    gap: 10,
  },
  listCard: {
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listDate: {
    fontSize: 14,
    color: AuthColors.textBlack,
  },
  listAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  listBottomRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusEarned: {
    backgroundColor: 'rgba(114,176,29,0.2)',
  },
  statusMissed: {
    backgroundColor: 'rgba(255,103,77,0.2)',
  },
  statusProcessing: {
    backgroundColor: 'rgba(255, 224, 102, 0.3)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  statusTextEarned: {
    color: AuthColors.success,
  },
  statusTextMissed: {
    color: AuthColors.error,
  },
  statusTextProcessing: {
    color: '#9a6700',
  },
  emptyCard: {
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: AuthColors.textGray,
  },
});
