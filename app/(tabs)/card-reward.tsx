import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { extractApiErrorMessage } from '@/hooks/apiClient';
import {
  CardAutoInvestInfo,
  getCardAutoInvest,
  getCardInfo,
  getMonthlyReward,
  MonthlyRewardInfo,
} from '@/hooks/cardApi';

function InfoRow({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string;
  valueStyle?: object;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueStyle]}>{value}</Text>
    </View>
  );
}

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

function formatAutoInvestDate(value?: string) {
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

export default function CardRewardScreen() {
  const [monthlyReward, setMonthlyReward] = useState<MonthlyRewardInfo | null>(null);
  const [autoInvestInfo, setAutoInvestInfo] = useState<CardAutoInvestInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadScreen = async () => {
        try {
          setIsLoading(true);
          setErrorMessage('');

          const nextMonthlyReward = await getMonthlyReward();
          const cards = await getCardInfo().catch(() => []);
          const primaryCard = cards[0];

          const nextAutoInvestInfo = primaryCard
            ? await getCardAutoInvest(primaryCard.cardUuid).catch(() => null)
            : null;

          if (!isMounted) {
            return;
          }

          setMonthlyReward(nextMonthlyReward);
          setAutoInvestInfo(nextAutoInvestInfo);
        } catch (error) {
          if (isMounted) {
            setErrorMessage(extractApiErrorMessage(error, '당월 리워드 정보를 불러오지 못했습니다.'));
          }
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

  const displayEtf = autoInvestInfo?.pendingEtf ?? autoInvestInfo?.currentEtf ?? null;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <TopBar title="리워드 지급" onBackPress={() => router.back()} />
        <View style={styles.centerState}>
          <ActivityIndicator size="small" color={AuthColors.blue300} />
          <Text style={styles.stateText}>리워드 정보를 불러오는 중입니다.</Text>
        </View>
      </View>
    );
  }

  if (errorMessage || !monthlyReward) {
    return (
      <View style={styles.container}>
        <TopBar title="리워드 지급" onBackPress={() => router.back()} />
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{errorMessage || '당월 리워드 정보를 찾을 수 없습니다.'}</Text>
        </View>
      </View>
    );
  }

  const reward = monthlyReward;
  const isPerformanceMet = reward.performanceStatus === 2 || reward.performanceStatus === '2';
  const performanceValueStyle = isPerformanceMet ? styles.valueSuccess : styles.valueError;

  return (
    <View style={styles.container}>
      <TopBar title="리워드 지급" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroMonth}>{formatBaseMonth(reward.baseMonth)} 리워드</Text>
          <Text style={styles.heroAmount}>{formatWon(reward.rewardPointAmount)}</Text>
        </View>

        <Text style={styles.sectionTitle}>산정 내역</Text>
        <View style={styles.cardBox}>
          <InfoRow
            label="전월 실적"
            value={formatWon(reward.previousMonthSpendAmount)}
            valueStyle={performanceValueStyle}
          />
          <InfoRow label="적립률" value={formatRewardRate(reward.rewardRate)} />
          <InfoRow
            label="실적 상태"
            value={mapPerformanceStatusLabel(reward.performanceStatus)}
            valueStyle={performanceValueStyle}
          />
        </View>

        <Text style={styles.sectionTitle}>자동 투자 정보</Text>
        {displayEtf ? (
          <View style={styles.autoCard}>
            <View style={styles.badgeCircle}>
              <Text style={styles.badgeText}>{displayEtf.ticker}</Text>
            </View>

            <View style={styles.autoInfo}>
              <Text style={styles.autoTitle}>{displayEtf.etfName}</Text>
              <Text style={styles.autoSub}>{formatAutoInvestDate(displayEtf.effectiveFrom)}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>현재 연결된 자동 투자 ETF 정보가 없습니다.</Text>
          </View>
        )}

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
  valueSuccess: {
    color: AuthColors.success,
  },
  valueError: {
    color: AuthColors.error,
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
  emptyCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AuthColors.gray200,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 13,
    color: AuthColors.textGray,
    textAlign: 'center',
  },
  footerNote: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 11,
    color: '#9ca3af',
  },
  buttonWrap: {
    marginTop: 24,
    marginBottom: 8,
  },
});
