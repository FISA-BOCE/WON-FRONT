import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing, AuthTypography } from '@/constants/authColors';

export default function CardCreateScreen() {
  return (
    <View style={styles.container}>
      <TopBar title="카드 생성" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>카드명 넣기</Text>
        <Text style={styles.subtitle}>결제할수록 ETF가 쌓이는 새로운 카드</Text>

        <View style={styles.cardPreview}>
          <View style={styles.cardChip} />
          <Text style={styles.previewCardName}>WON 자동투자 카드</Text>
          <Text style={styles.previewCardNumber}>**** **** **** 1234</Text>
          <Text style={styles.previewCardSub}>VISA Platinum</Text>
        </View>

        <View style={styles.rewardBox}>
          <View style={styles.rewardHeader}>
            <Ionicons name="sparkles" size={18} color={AuthColors.blue300} />
            <Text style={styles.rewardTitle}>자동투자 리워드</Text>
          </View>
          <Text style={styles.rewardDescription}>결제 금액의 1%를 해외 ETF로 자동 적립</Text>
        </View>

        <View style={styles.rowItem}>
          <Text style={styles.rowLabel}>상품 유형</Text>
          <Text style={styles.rowValue}>신용카드</Text>
        </View>

        <View style={styles.rowItem}>
          <Text style={styles.rowLabel}>자동투자 리워드</Text>
          <Text style={styles.rowValue}>적용 가능</Text>
        </View>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>월 한도 200,000원 · 해외 ETF 자동 적립</Text>
        </View>

        <View style={styles.bottomGap} />
        <AuthButton title="다음" onPress={() => router.push('./card-application' as never)} />
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: AuthColors.gray900,
    marginTop: AuthSpacing.default
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.gray700,
    marginTop: 8
  },
  cardPreview: {
    marginTop: AuthSpacing.default,
    height: 200,
    borderRadius: 18,
    backgroundColor: AuthColors.blue300,
    padding: 24,
  },
  cardChip: {
    width: 35,
    height: 25,
    borderRadius: 4,
    backgroundColor: '#f5d76e',
    marginBottom: 60,
  },
  previewCardName: {
    fontSize: 12,
    color: AuthColors.white,
    marginBottom: 12,
  },
  previewCardNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: AuthColors.white,
    marginBottom: 8,
  },
  previewCardSub: {
    fontSize: 11,
    color: AuthColors.white,
  },
  rewardBox: {
    marginTop: AuthSpacing.default,
    marginBottom: AuthSpacing.sm,
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#C3E5FF',
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.blue300,
  },
  rewardDescription: {
    marginTop: 8,
    fontSize: 13,
    color: AuthColors.textGray,
  },
  rowItem: {
    marginTop: 12,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AuthColors.borderGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    ...AuthTypography.body,
    color: AuthColors.textDarkGray,
  },
  rowValue: {
    fontSize: 13,
    color: AuthColors.gray800,
    fontWeight: '700',
  },
  noticeBox: {
    marginTop: 40,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  noticeText: {
    fontSize: 12,
    color: '#2563eb',
  },
  bottomGap: {
    height: 20,
  },
});
