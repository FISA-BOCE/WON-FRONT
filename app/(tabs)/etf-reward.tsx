import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ETFReward() {

// TODO : 더미 데이터 변경 필요
  const currentETF = {
    symbol: 'VOO',
    name: 'S&P 500 ETF',
    startDate: '2025.05.07부터 적용 중',
  };

  const etfTimeline = [
    {
      id: 'current',
      symbol: 'VOO',
      name: 'VOO (S&P 500 ETF)',
      date: '2026.05.07 14:32',
      status: '현재 적립 중',
      active: true,
    },
    {
      id: 'history1',
      symbol: 'QQQ',
      name: 'QQQ (Nasdaq 100 ETF)',
      date: '2026.03.15 ~ 2026.05.07',
      status: '변경 사유: 변동성 부담',
      active: false,
    },
    {
      id: 'history2',
      symbol: 'SCHD',
      name: 'SCHD (고배당 ETF)',
      date: '2026.01.01 ~ 2026.03.15',
      status: '변경 사유: 성장형으로 변경',
      active: false,
    },
  ];

  const renderTimelineItem = (item: (typeof etfTimeline)[number], isLast: boolean) => (
    <View key={item.id} style={styles.timelineRow}>
      <View style={styles.timelineLeftColumn}>
        <View style={[styles.timelineDot, item.active ? styles.timelineDotActive : styles.timelineDotInactive]} />
        {!isLast && <View style={styles.timelineLine} />}
      </View>

      <View style={styles.timelineContent}>
        <View style={styles.timelineHeaderRow}>
          <Text style={styles.timelineTitle}>{item.name}</Text>
        </View>
        <Text style={styles.timelineDate}>{item.date}</Text>
        <Text style={styles.timelineStatus}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TopBar title="ETF 자동 체결 내역" />

      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <Text style={styles.mainTitle}>ETF 자동 체결 내역</Text>

        {/* Current ETF Section */}
        <Text style={styles.sectionTitle}>현재 적립 중인 ETF</Text>

        <View style={styles.currentETFCard}>
          <View style={styles.etfBadgeContainer}>
            <View style={styles.etfBadge}>
              <Text style={styles.etfBadgeText}>{currentETF.symbol}</Text>
            </View>
          </View>

          <View style={styles.currentETFContent}>
            <Text style={styles.currentETFName}>{currentETF.name}</Text>
            <Text style={styles.currentETFDate}>{currentETF.startDate}</Text>
          </View>
        </View>

        {/* Warning Message */}
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>변경 시 다음 적립분부터 적용됩니다.</Text>
          <Text style={styles.warningText}>기존 적립된 ETF에는 영향을 미치지 않습니다.</Text>
        </View>

        <View style={styles.historySectionHeader}>
          <Text style={styles.sectionTitle}>적립 ETF 변경 내역</Text>
          <TouchableOpacity style={styles.viewAllButtonInline} onPress={() => router.push('/card-reward-history')}>
            <Text style={styles.viewAllText}>전체보기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timelineCard}>
          {etfTimeline.map((item, index) => renderTimelineItem(item, index === etfTimeline.length - 1))}
        </View>

        <View style={styles.bottomGap} />
        <AuthButton title="ETF 변경하기" onPress={() => router.push('/etf-change')} />
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
    marginBottom: 40
  },

  // Header Section
  mainTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: AuthColors.gray900,
    marginTop: AuthSpacing.default
  },

  // Section Title
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.gray700,
    marginTop: 24,
    marginBottom: 20,
  },

  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.gray700,
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
    alignItems: 'center'
  },

  viewAllButtonInline: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Current ETF Card
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
  },

  currentETFName: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.gray900,
    marginBottom: 4,
  },

  currentETFDate: {
    fontSize: 10,
    fontWeight: '400',
    color: AuthColors.gray600,
  },

  // Warning Section
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

  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 58,
    paddingTop: 12

  },

  timelineLeftColumn: {
    width: 22,
    alignItems: 'center',
    marginRight: 8
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

  // Bottom Button
  buttonContainer: {
    paddingHorizontal: AuthSpacing.md,
    paddingBottom: AuthSpacing.lg,
    paddingTop: AuthSpacing.md,
    borderTopWidth: 1,
    borderTopColor: AuthColors.gray200,
    backgroundColor: '#ffffff',
  },

  primaryButton: {
    backgroundColor: AuthColors.blue500,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },

   bottomGap: {
    height: 20,
  },
});
