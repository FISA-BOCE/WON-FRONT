import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing, AuthTypography } from '@/constants/authColors';
import { extractApiErrorMessage } from '@/hooks/apiClient';
import { applyCard } from '@/hooks/cardApi';
import {
  resetCardApplicationDraft,
  setCardApplicationResult,
  useCardApplicationDraft,
} from '@/hooks/cardApplicationFlow';

export default function CardCompleteScreen() {
  const draft = useCardApplicationDraft();
  const selectedAccount = draft.selectedAccount;
  const selectedEtf = draft.selectedEtf;
  const result = draft.result;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (result || !selectedAccount || !selectedEtf || !draft.terms.requiredTerms) {
      return;
    }

    let isMounted = true;

    const submit = async () => {
      try {
        setIsSubmitting(true);
        setErrorMessage('');

        const result = await applyCard({
          applicantInfo: {
            nameKo: draft.applicantInfo.koreanName,
            nameEn: draft.applicantInfo.englishName,
            birthDate: draft.applicantInfo.birthDate.replace(/\D/g, ''),
            gender: draft.applicantInfo.gender,
            nationality: draft.applicantInfo.nationality,
            phoneNumber: draft.applicantInfo.phoneNumber.replace(/\D/g, ''),
            email: draft.applicantInfo.email,
            address: draft.applicantInfo.address,
            job: draft.applicantInfo.job,
          },
          investAccountUuid: selectedAccount.investAccountUuid,
          etfId: selectedEtf.etfId,
          ticker: selectedEtf.ticker,
          requiredTerms: draft.terms.requiredTerms,
          optionalTerms: {
            isMarketingEmailAgree: draft.terms.isMarketingEmailAgree,
            isMarketingSmsAgree: draft.terms.isMarketingSmsAgree,
          },
        });

        if (isMounted) {
          setCardApplicationResult(result);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(extractApiErrorMessage(error, '카드 신청 중 문제가 발생했습니다.'));
        }
      } finally {
        if (isMounted) {
          setIsSubmitting(false);
        }
      }
    };

    void submit();

    return () => {
      isMounted = false;
    };
  }, [draft, result, selectedAccount, selectedEtf]);

  const handleReset = () => {
    resetCardApplicationDraft();
    router.replace('/card');
  };

  const canShowSummary = Boolean(result && selectedAccount);

  return (
    <View style={styles.container}>
      <TopBar title="카드 신청 완료" onBackPress={handleReset} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isSubmitting && !result ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color={AuthColors.blue300} />
            <Text style={styles.loadingText}>카드 신청 정보를 전송하고 있습니다.</Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.loadingWrap}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <AuthButton title="이전 단계로 돌아가기" onPress={() => router.replace('/card-etf')} />
          </View>
        ) : canShowSummary && result && selectedAccount ? (
          <>
            <View style={styles.noticeBox}>
              <Text style={styles.noticeText}>카드 수령 후 첫 결제부터 자동투자가 시작됩니다.</Text>
            </View>

            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={34} color={AuthColors.white} />
            </View>

            <Text style={styles.title}>카드 신청이 완료되었습니다!</Text>
            <Text style={styles.subtitle}>심사 후 카드가 발급됩니다</Text>
            <Text style={styles.subtitleSmall}>(영업일 기준 3~5일)</Text>

            <View style={styles.summaryCard}>
              <SummaryRow label="신청번호" value={result.cardUuid} />
              <SummaryRow label="카드 번호" value={result.cardNoDisplay} />
              <SummaryRow label="발급 상태" value={result.cardStatus} />
              <SummaryRow label="신청일시" value={formatDateTime(result.issuedAt)} />
              <SummaryRow label="자동투자 ETF" value={result.autoInvestEtfName || selectedEtf?.etfName || '-'} />
              <SummaryRow label="연결 증권계좌" value={selectedAccount.accountNoDisplay} />
            </View>

            <View style={styles.bottomGap} />
            <AuthButton style={styles.homeButton} title="시작하기" onPress={handleReset} />
          </>
        ) : (
          <View style={styles.loadingWrap}>
            <Text style={styles.errorText}>카드 신청에 필요한 정보가 부족합니다.</Text>
            <AuthButton title="처음으로 돌아가기" onPress={handleReset} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
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
    paddingBottom: 28,
    alignItems: 'center',
  },
  loadingWrap: {
    flex: 1,
    minHeight: 420,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  loadingText: {
    fontSize: 14,
    color: AuthColors.textGray,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: AuthColors.error,
    textAlign: 'center',
  },
  noticeBox: {
    width: '100%',
    marginTop: AuthSpacing.default,
    backgroundColor: 'rgba(195, 229, 255, 0.35)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  noticeText: {
    fontSize: 12,
    color: AuthColors.blue500,
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
    marginTop: 48,
    fontSize: 22,
    fontWeight: '700',
    color: AuthColors.gray900,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: AuthSpacing.md,
    ...AuthTypography.body,
    color: AuthColors.gray700,
    textAlign: 'center',
  },
  subtitleSmall: {
    marginTop: 8,
    fontSize: 12,
    color: AuthColors.gray700,
    textAlign: 'center',
  },
  summaryCard: {
    width: '100%',
    marginTop: 120,
    borderWidth: 1,
    borderColor: AuthColors.gray50,
    backgroundColor: AuthColors.gray50,
    borderRadius: 16,
    padding: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: AuthColors.textGray,
    flex: 1,
  },
  summaryValue: {
    fontSize: 12,
    color: AuthColors.textBlack,
    textAlign: 'right',
    flex: 1,
  },
  bottomGap: {
    height: 20,
  },
  homeButton: {
    width: '100%',
  },
});
