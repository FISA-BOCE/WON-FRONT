import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing, AuthTypography } from '@/constants/authColors';

export default function CardAccountScreen() {
  const [selected, setSelected] = useState<'existing' | 'new'>('existing');

  return (
    <View style={styles.container}>
      <TopBar title="계좌 선택" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stepRow}>
          <StepDot active />
          <StepDot active />
          <StepDot active />
          <StepDot />
        </View>

        <Text style={styles.title}>증권계좌가 필요해요</Text>
        <Text style={styles.subtitle}>ETF 자동매수를 위해 본인 명의의 증권계좌가 필요합니다.</Text>

        <Pressable style={styles.optionCard} onPress={() => setSelected('existing')}>
          <View style={styles.optionLeft}>
            <View style={[styles.radio, selected === 'existing' && styles.radioSelected]}>
              {selected === 'existing' ? <View style={styles.radioInner} /> : null}
            </View>
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>우리투자증권 증권계좌</Text>
              <Text style={styles.optionSubtitle}>123-***-***456</Text>
              <Text style={styles.optionHint}>본인 명의 계좌만 연결됩니다</Text>
            </View>
          </View>
        </Pressable>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>선택한 계좌로 ETF 자동매수 리워드가 연결돼요.</Text>
        </View>

        <View style={styles.bottomGap} />
        <AuthButton title="다음" onPress={() => router.push('./card-etf' as never)} />
      </ScrollView>
    </View>
  );
}

function StepDot({ active = false }: { active?: boolean }) {
  return <View style={[styles.stepDot, active && styles.stepDotActive]} />;
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
  stepRow: {
    marginTop: AuthSpacing.default,
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  stepDot: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
  },
  stepDotActive: {
    backgroundColor: AuthColors.blue200,
  },
  title: {
    marginTop: AuthSpacing.lg,
    ...AuthTypography.heading1,
    color: AuthColors.textBlack,
  },
  subtitle: {
    marginTop: AuthSpacing.xs,
    ...AuthTypography.body,
    color: AuthColors.textGray,
    marginBottom: AuthSpacing.default,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionTextWrap: {
    flex: 1,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: AuthColors.blue300,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: AuthColors.blue300,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  optionSubtitle: {
    marginTop: AuthSpacing.xs,
    fontSize: 12,
    color: AuthColors.textGray,
  },
  optionHint: {
    marginTop: AuthSpacing.xs,
    fontSize: 10,
    color: AuthColors.textGray,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 13,
    color: AuthColors.textGray,
  },
  noticeBox: {
    marginTop: 240,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 14,
  },
  noticeText: {
    fontSize: 12,
    color: '#2563eb',
  },
  bottomGap: {
    height: 20,
  },
});
