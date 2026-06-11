import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing, AuthTypography } from '@/constants/authColors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SecuritiesNoAccountScreen() {
  return (
    <View style={styles.container}>
      <TopBar title="증권" showBack={false} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="bar-chart-outline" size={54} color={AuthColors.gray500} />
          </View>
          <Text style={styles.heroTitle}>아직 보유 ETF가 없어요</Text>
          <Text style={styles.heroDescription}>
            증권계좌를 연결하고 자동투자를 시작하면{'\n'}매일 ETF가 쌓이는 모습을 볼 수 있어요
          </Text>
        </View>

        <Text style={styles.sectionTitle}>증권계좌 시작하기</Text>

        <Pressable style={styles.primaryOption} onPress={() => router.push('/card-account')}>
          <View style={styles.optionLeft}>
            <View style={[styles.optionIconWrap, styles.optionIconBlue]}>
              <Ionicons name="document-text-outline" size={18} color={AuthColors.blue300} />
            </View>
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>기존 증권계좌 연결</Text>
              <Text style={styles.optionSubTitle}>123-***-***456</Text>
              <Text style={styles.optionHint}>본인 명의 계좌만 연결됩니다</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={AuthColors.textLightGray} />
        </Pressable>

        <Text style={styles.orText}>또는</Text>

        <Pressable style={styles.secondaryOption} onPress={() => router.push('/invest-account-create-1')}>
          <View style={styles.optionLeft}>
            <View style={[styles.optionIconWrap, styles.optionIconGray]}>
              <Ionicons name="add" size={20} color={AuthColors.gray500} />
            </View>
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>신규 증권계좌 개설</Text>
              <Text style={styles.optionHint}>2~3분이면 완료돼요</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={AuthColors.textLightGray} />
        </Pressable>
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
  heroCard: {
    borderRadius: 16,
    backgroundColor: AuthColors.gray50,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 34,
  },
  heroIcon: {
    marginBottom: 18,
  },
  heroTitle: {
    ...AuthTypography.heading1,
    color: AuthColors.textBlack,
    textAlign: 'center',
  },
  heroDescription: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 22,
    color: AuthColors.gray600,
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: 52,
    marginBottom: 16,
    fontSize: 20,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  primaryOption: {
    minHeight: 84,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: AuthColors.blue300,
    backgroundColor: AuthColors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secondaryOption: {
    minHeight: 84,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AuthColors.borderGray,
    borderStyle: 'dashed',
    backgroundColor: AuthColors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  optionIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  optionIconBlue: {
    backgroundColor: AuthColors.blue100,
  },
  optionIconGray: {
    backgroundColor: AuthColors.gray50,
  },
  optionTextWrap: {
    marginLeft: 14,
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  optionSubTitle: {
    marginTop: 4,
    fontSize: 12,
    color: AuthColors.gray600,
  },
  optionHint: {
    marginTop: 10,
    fontSize: 11,
    color: AuthColors.gray500,
  },
  orText: {
    marginVertical: 18,
    textAlign: 'center',
    fontSize: 16,
    color: AuthColors.gray400,
  },
});
