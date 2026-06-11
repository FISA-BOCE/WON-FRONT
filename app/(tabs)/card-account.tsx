import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { extractApiErrorMessage } from '@/hooks/apiClient';
import { CardApplicationInvestAccount, getCardApplicationInvestAccounts } from '@/hooks/cardApi';
import {
  resetCardApplicationDraft,
  setCardApplicationSelectedAccount,
  useCardApplicationDraft,
} from '@/hooks/cardApplicationFlow';

export default function CardAccountScreen() {
  const draft = useCardApplicationDraft();
  const [accounts, setAccounts] = useState<CardApplicationInvestAccount[]>([]);
  const [selectedUuid, setSelectedUuid] = useState(draft.selectedAccount?.investAccountUuid ?? '');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const hasHandledEmptyRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadAccounts = async () => {
        try {
          setIsLoading(true);
          setErrorMessage('');
          const nextAccounts = await getCardApplicationInvestAccounts();

          if (!isMounted) {
            return;
          }

          setAccounts(nextAccounts);

          if (nextAccounts.length === 0) {
            if (!hasHandledEmptyRef.current) {
              hasHandledEmptyRef.current = true;
              setSelectedUuid('');
            }
            return;
          }

          const defaultAccount =
            nextAccounts.find((account) => account.investAccountUuid === draft.selectedAccount?.investAccountUuid) ??
            nextAccounts.find((account) => account.isLinked) ??
            nextAccounts[0];

          setSelectedUuid(defaultAccount?.investAccountUuid ?? '');
        } catch (error) {
          if (isMounted) {
            setErrorMessage(extractApiErrorMessage(error, '증권 계좌를 불러오지 못했습니다.'));
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      void loadAccounts();

      return () => {
        isMounted = false;
      };
    }, [draft.selectedAccount?.investAccountUuid]),
  );

  const handleNext = () => {
    const selectedAccount = accounts.find((account) => account.investAccountUuid === selectedUuid);

    if (!selectedAccount) {
      return;
    }

    setCardApplicationSelectedAccount(selectedAccount);
    router.push('/card-etf');
  };

  const handleCreateInvestAccount = () => {
    resetCardApplicationDraft();
    router.push('/invest-account-create-1');
  };

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

        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="small" color={AuthColors.blue300} />
            <Text style={styles.stateText}>보유 증권 계좌를 확인하고 있습니다.</Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.centerState}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <AuthButton title="다시 시도" onPress={() => router.replace('/card-account')} />
          </View>
        ) : (
          <>
            {accounts.map((account) => {
              const isSelected = account.investAccountUuid === selectedUuid;

              return (
                <Pressable
                  key={account.investAccountUuid}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  onPress={() => setSelectedUuid(account.investAccountUuid)}
                >
                  <View style={styles.optionLeft}>
                    <View style={[styles.radio, isSelected && styles.radioSelected]}>
                      {isSelected ? <View style={styles.radioInner} /> : null}
                    </View>
                    <View style={styles.optionTextWrap}>
                      <View style={styles.optionTitleRow}>
                        <Text style={styles.optionTitle}>우리투자증권 증권계좌</Text>
                        {account.isLinked ? (
                          <View style={styles.linkedBadge}>
                            <Text style={styles.linkedBadgeText}>연결됨</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text style={styles.optionSubtitle}>{account.accountNoDisplay}</Text>
                      <Text style={styles.optionHint}>본인 명의 계좌만 연결됩니다</Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}

            {accounts.length === 0 ? (
              <>
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyTitle}>연결 가능한 증권계좌가 없어요</Text>
                  <Text style={styles.emptyText}>
                    카드 신청을 계속하려면 먼저 증권계좌를 개설해주세요.
                  </Text>
                </View>

                <View style={styles.noticeBox}>
                  <Text style={styles.noticeText}>계좌 개설 후 다시 돌아오면 선택해서 계속 진행할 수 있어요.</Text>
                </View>

                <View style={styles.bottomGap} />
                <AuthButton
                  title="증권계좌 생성"
                  onPress={handleCreateInvestAccount}
                />
              </>
            ) : (
              <>
                <View style={styles.noticeBox}>
                  <Text style={styles.noticeText}>선택한 계좌로 ETF 자동매수 리워드가 연결돼요.</Text>
                </View>

                <View style={styles.bottomGap} />
                <AuthButton title="다음" onPress={handleNext} disabled={!selectedUuid} />
              </>
            )}
          </>
        )}
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
    fontSize: 22,
    fontWeight: '700',
    color: AuthColors.gray900,
    marginTop: AuthSpacing.default,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.gray700,
    marginTop: 8,
    marginBottom: AuthSpacing.xl,
  },
  centerState: {
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
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
    marginBottom: 12,
  },
  emptyBox: {
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 20,
    backgroundColor: AuthColors.gray50,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: AuthColors.textGray,
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
  optionCardSelected: {
    borderColor: AuthColors.blue300,
    backgroundColor: '#f5f9ff',
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
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  linkedBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#e7f1ff',
  },
  linkedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: AuthColors.blue500,
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
  noticeBox: {
    marginTop: 24,
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
