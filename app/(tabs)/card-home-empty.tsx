import { AuthColors, AuthSpacing, AuthTypography } from '@/constants/authColors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TopBar } from '@/components/auth/TopBar';

const BENEFITS = [
  '국내외 결제 1% ETF 자동 적립',
  'VOO·QQQ 등 해외 ETF 선택 가능',
  '소수점 매수로 소액부터 가능',
];

export default function CardHomeEmptyScreen() {
  return (
    <View style={styles.container}>
      <TopBar title="카드" showBack={false} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.emptyHero}>
          <View style={styles.emptyIcon}>
            <Ionicons name="card-outline" size={48} color={AuthColors.gray500} />
          </View>
          <Text style={styles.emptyTitle}>아직 카드가 없어요</Text>
          <Text style={styles.emptyDescription}>
            자동투자 리워드 카드를 신청하면{'\n'}결제 금액의 1%가 ETF로 쌓여요
          </Text>
        </View>

        <View style={styles.productCard}>
          <View style={styles.productRow}>
            <View style={styles.productTextWrap}>
              <Text style={styles.productTitle}>클엔의 정석</Text>
              <View style={styles.productMetaRow}>
                <View style={styles.rateBadge}>
                  <Text style={styles.rateBadgeText}>0.7~1.2%</Text>
                </View>
                <Text style={styles.limitText}>월 한도 200,000원</Text>
              </View>
            </View>

            <Pressable style={styles.applyButton} onPress={() => router.push('/(tabs)/card-create')}>
              <Text style={styles.applyButtonText}>신청하기</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.sectionTitle}>카드 혜택 미리보기</Text>

        <View style={styles.benefitCard}>
          {BENEFITS.map((benefit) => (
            <View key={benefit} style={styles.benefitRow}>
              <View style={styles.checkIconWrap}>
                <Ionicons name="checkmark-circle" size={16} color={AuthColors.blue300} />
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
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
    marginTop: AuthSpacing.default,
  },
  emptyHero: {
    borderRadius: 16,
    backgroundColor: AuthColors.gray50,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 34,
  },
  emptyIcon: {
    marginBottom: 18,
  },
  emptyTitle: {
    ...AuthTypography.heading2,
    color: AuthColors.textBlack,
    textAlign: 'center',
  },
  emptyDescription: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 22,
    color: AuthColors.gray500,
    textAlign: 'center',
  },
  productCard: {
    marginTop: 60,
    borderRadius: 16,
    backgroundColor: AuthColors.blue300,
    paddingHorizontal: 22,
    paddingVertical: 18,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  productTextWrap: {
    flex: 1,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: AuthColors.white,
    lineHeight: 38,
  },
  productMetaRow: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  rateBadge: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  rateBadgeText: {
    fontSize: 12,
    color: AuthColors.white,
  },
  limitText: {
    fontSize: 12,
    color: AuthColors.white,
  },
  applyButton: {
    minWidth: 108,
    height: 34,
    borderRadius: 10,
    backgroundColor: AuthColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AuthColors.blue500,
  },
  productDescription: {
    marginTop: 34,
    fontSize: 12,
    lineHeight: 16,
    color: AuthColors.white,
  },
  sectionTitle: {
    marginTop: 40,
    marginBottom: 14,
    fontSize: 16,
    fontWeight: '700',
    color: AuthColors.gray800,
  },
  benefitCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AuthColors.gray300,
    backgroundColor: AuthColors.white,
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 16,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIconWrap: {
    width: 22,
    alignItems: 'flex-start',
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: AuthColors.gray900,
  },
});
