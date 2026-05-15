import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { REWARD_FILTERS, REWARD_HISTORY, type RewardFilter } from '@/constants/rewardHistory';

export default function CardRewardHistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState<RewardFilter>('전체');

  const filteredRewards = useMemo(
    () => REWARD_HISTORY.filter((item) => selectedFilter === '전체' || item.status === selectedFilter),
    [selectedFilter]
  );

  return (
    <View style={styles.container}>
      <TopBar title="리워드 이력" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCaption}>2026년 누적 적립</Text>
          <Text style={styles.summaryAmount}>1,245,000원</Text>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>적립률 구간</Text>
            <Text style={styles.summaryValue}>50~150만원 · 1.0% 적용</Text>
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

        <View style={styles.listWrap}>
          {filteredRewards.map((item, index) => (
            <Pressable
              key={`${item.id}-${index}`}
              style={styles.listCard}
              onPress={() =>
                router.push({
                  pathname: '/card-reward-detail',
                  params: { id: item.id },
                })
              }
            >
              <View style={styles.listHeader}>
                <Text style={styles.listDate}>{item.date}</Text>
                <Text style={styles.listAmount}>{item.amount}</Text>
              </View>
              <View style={styles.listBottomRow}>
                <Text style={styles.listTicker}>{item.ticker}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    item.status === '적립' && styles.statusEarned,
                    item.status === '미적용' && styles.statusMissed,
                    item.status === '보류' && styles.statusPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.status === '적립' && styles.statusTextEarned,
                      item.status === '미적용' && styles.statusTextMissed,
                      item.status === '보류' && styles.statusTextPending,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listTicker: {
    fontSize: 12,
    color: AuthColors.textGray,
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
  statusPending: {
    backgroundColor: 'rgba(255,224,102,0.2)',
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
  statusTextPending: {
    color: '#B69100',
  },
});
