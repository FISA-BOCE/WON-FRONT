import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { resetInvestAccountFlow, useInvestAccountFlow } from '@/hooks/investAccountFlow';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SecuritiesCompleteScreen() {
  const { createResult, linkResult } = useInvestAccountFlow();

  const handleDone = () => {
    resetInvestAccountFlow();
    router.replace('/invest');
  };

  if (!createResult || !linkResult) {
    return (
      <View style={styles.container}>
        <TopBar title="증권계좌 개설 완료" showBack={false} showRightMenu={false} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>표시할 개설 결과가 없습니다.</Text>
          <AuthButton title="증권 화면으로 이동" onPress={handleDone} style={styles.ctaButton} />
        </View>
      </View>
    );
  }

  const summaryRows = [
    { label: '계좌 번호', value: linkResult.accountNoDisplay || createResult.accountNoDisplay },
    { label: '계좌 상태', value: linkResult.accountStatus || createResult.accountStatus },
    { label: '연결 상태', value: linkResult.investConnectedStatus ? '연결 완료' : '미연결' },
    { label: '개설일시', value: formatDateTime(createResult.openedAt) },
    { label: '연결일시', value: formatDateTime(linkResult.linkedAt) },
  ];

  return (
    <View style={styles.container}>
      <TopBar title="증권계좌 개설 완료" showBack={false} showRightMenu={false} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={34} color={AuthColors.white} />
        </View>

        <Text style={styles.title}>계좌 개설 및 연결이 완료되었습니다!</Text>
        <Text style={styles.subtitle}>이제 카드 신청이나 ETF 자동투자를 진행할 수 있어요.</Text>

        <View style={styles.summaryCard}>
          {summaryRows.map((row) => (
            <View key={row.label} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{row.label}</Text>
              <Text style={styles.summaryValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footerSpacing} />
        <AuthButton title="증권 화면으로 이동" onPress={handleDone} style={styles.ctaButton} />
      </ScrollView>
    </View>
  );
}

function formatDateTime(value: string) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AuthColors.white,
  },
  content: {
    paddingHorizontal: AuthSpacing.lg,
    paddingBottom: 32,
    marginTop: AuthSpacing.default,
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    paddingHorizontal: AuthSpacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyTitle: {
    fontSize: 16,
    color: AuthColors.textGray,
    textAlign: 'center',
  },
  successIcon: {
    marginTop: 60,
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: AuthColors.blue300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 54,
    fontWeight: '700',
    fontSize: 22,
    color: AuthColors.gray800,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    fontSize: 14,
    color: AuthColors.textGray,
    textAlign: 'center',
    lineHeight: 22,
  },
  summaryCard: {
    width: '100%',
    marginTop: 108,
    borderRadius: 16,
    backgroundColor: AuthColors.gray50,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  summaryRow: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: AuthColors.gray600,
  },
  summaryValue: {
    flex: 1,
    fontSize: 14,
    color: AuthColors.textBlack,
    fontWeight: '500',
    textAlign: 'right',
  },
  footerSpacing: {
    height: 32,
  },
  ctaButton: {
    width: '100%',
  },
});
