import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';

function QuickMenu({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.quickMenuItem} onPress={onPress}>
      <View style={styles.quickMenuIconWrap}>
        <Ionicons name={icon} size={20} color={AuthColors.blue300} />
      </View>
      <Text style={styles.quickMenuText}>{label}</Text>
    </Pressable>
  );
}

export default function CardHomeScreen() {
  return (
    <View style={styles.container}>
      <TopBar title="카드" showBack={false} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardHero}>
          <View style={styles.cardStripe} />
          <Text style={styles.cardHeroLabel}>WON 자동투자 카드</Text>
          <Text style={styles.cardHeroNumber}>**** **** **** 1234</Text>
          <Text style={styles.cardHeroSub}>VISA Platinum · 김우리</Text>
        </View>

        <Text style={styles.sectionTitle}>5월 이용금액</Text>
        <View style={styles.monthCard}>
          <Text style={styles.monthCardLabel}>총 이용금액</Text>
          <Text style={styles.monthCardValue}>1,245,000원</Text>
          <View style={styles.monthDivider} />
          <View style={styles.monthCardRow}>
            <Text style={styles.monthCardLabel}>적립률 구간</Text>
            <Text style={styles.monthCardSubValue}>50~150만원 · 1.0% 적용</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>자주 쓰는 메뉴</Text>
        <View style={styles.quickGrid}>
          <QuickMenu icon="card-outline" label="결제 내역" onPress={() => router.push('/card-monthly-usage')} />
          <QuickMenu icon="sparkles-outline" label="혜택" onPress={() => router.push('/card-create')} />
          <QuickMenu icon="checkbox-outline" label="리워드" onPress={() => router.push('/card-reward')} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>최근 결제</Text>
          <Pressable onPress={() => router.push('/card-reward')}>
            <Text style={styles.linkText}>전체보기 ›</Text>
          </Pressable>
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
  cardHero: {
    marginTop: 40,
    height: 200,
    borderRadius: 18,
    backgroundColor: AuthColors.blue300,
    padding: 20,
  },
  cardStripe: {
    width: 36,
    height: 26,
    borderRadius: 4,
    backgroundColor: '#f5d76e',
    marginBottom: 64,
  },
  cardHeroLabel: {
    fontSize: 12,
    color: AuthColors.white,
    marginBottom: 10,
  },
  cardHeroNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: AuthColors.white,
    marginBottom: 10,
  },
  cardHeroSub: {
    fontSize: 11,
    color: AuthColors.white,
  },
  sectionTitle: {
    marginTop: 60,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  monthCard: {
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    borderRadius: 16,
    padding: 18,
  },
  monthCardLabel: {
    fontSize: 12,
    color: AuthColors.textGray,
  },
  monthCardValue: {
    marginTop: 12,
    marginBottom: 18,
    fontSize: 20,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  monthDivider: {
    height: 1,
    backgroundColor: AuthColors.borderGray,
    marginVertical: 12,
  },
  monthCardSubValue: {
    fontSize: 12,
    color: AuthColors.blue300,
    textAlign: 'right',
  },
  monthCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickGrid: {
    marginTop: 4,
    flexDirection: 'row',
    gap: 10,
  },
  quickMenuItem: {
    flex: 1,
    minHeight: 84,
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 10,
  },
  quickMenuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickMenuText: {
    fontSize: 12,
    color: AuthColors.textBlack,
    textAlign: 'center',
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 13,
    color: AuthColors.blue300,
    fontWeight: '700',
  },
});
