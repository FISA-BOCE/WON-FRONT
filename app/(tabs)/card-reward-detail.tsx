import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { REWARD_HISTORY } from '@/constants/rewardHistory';


export default function CardRewardDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rewardId = Array.isArray(params.id) ? params.id[0] : params.id;
  const detail = REWARD_HISTORY.find((item) => item.id === rewardId) ?? REWARD_HISTORY[0];
  const isNotMet = detail.status === '미적용';

  return (
    <View style={styles.container}>
      <TopBar title="실적 충족 여부 상세" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.monthTitle}>{detail.summaryTitle}</Text>
          <Text style={styles.sectionLabel}>{detail.summaryLabel}</Text>
          <Text style={styles.largeValue}>{detail.summaryAmount}</Text>
          <View
            style={[
              styles.statusPill,
              detail.status === '적립' && styles.statusPillEarned,
              detail.status === '미적용' && styles.statusPillMissed,
            ]}
          >
            <Text
              style={[
                styles.statusPillText,
                detail.status === '적립' && styles.statusPillTextEarned,
                detail.status === '미적용' && styles.statusPillTextMissed,
              ]}
            >
              {detail.summaryBadge}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>상세 내역</Text>
        <View style={styles.detailsCard}>
          {detail.detailRows.map((row, index) => (
            <View key={`${row.label}-${index}`}> 
              {isNotMet && index === 1 ? <View style={styles.dividerWithMargin} /> : null}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text
                  style={[
                    styles.detailValue,
                    row.highlight && styles.highlightValue,
                  ]}
                >
                  {row.value}
                </Text>
              </View>
            </View>
          ))}
          {isNotMet ? (
            <>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: AuthColors.error },
                    { width: '70%' },
                  ]}
                />
              </View>
            </>
          ) : null}
        </View>

        {isNotMet ? (
          <>
            <Text style={styles.sectionTitle}>이 사유가 무엇인가요?</Text>
            <View style={styles.explanationCard}>
              <Text style={styles.explanationMain}>
                전월 카드 이용 실적이 50만원 이상이어야
                자동투자 리워드가 적립됩니다.
              </Text>
              <View style={styles.explDivider} />
              <Text style={styles.explanationLabel}>실적 인정 기준</Text>
              <Text style={styles.explanationText}>
                청구 취소·환불·제외 업종을 제외한 결제액
              </Text>
            </View>
          </>
        ) : null}

        {detail.status !== '적립' ? (
          <>
            <Text style={styles.sectionTitle}>{detail.reasonTitle}</Text>
            <View
              style={[
                styles.explanationCard,
                isNotMet && styles.explanationCardNoBottom,
              ]}
            >
              {detail.reasonLines.map((line, idx) => (
                <Text
                  key={`reason-${idx}`}
                  style={[
                    styles.explanationMain,
                    isNotMet && styles.explanationTextNotMet,
                  ]}
                >
                  {line}
                </Text>
              ))}
              {detail.extraReasonLines && !isNotMet ? (
                <>
                  <View style={styles.explDivider} />
                  <Text style={styles.explanationLabel}>{detail.extraReasonLines[0]}</Text>
                  <Text style={styles.explanationText}>{detail.extraReasonLines[1]}</Text>
                </>
              ) : null}
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
  statusPillTextEarned: {
    color: AuthColors.success,
  },
  statusPillTextMissed: {
    color: AuthColors.error,
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
  divider: {
    height: 2,
    backgroundColor: AuthColors.gray200,
  },
  dividerWithMargin: {
    height: 2,
    backgroundColor: AuthColors.gray200,
    marginVertical: 8,
  },
  progressTrack: {
    marginTop: 4,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  shortageText: {
    marginTop: 8,
    fontSize: 12,
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
  explanationCardNoBottom: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    padding: 0,
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
  explanationTextNotMet: {
    color: AuthColors.gray600,
  },
  bottomGap: {
    height: 20,
  },
});
