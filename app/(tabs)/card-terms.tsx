import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { setCardApplicationTerms, useCardApplicationDraft } from '@/hooks/cardApplicationFlow';

const requiredTerms = [
  '카드 신청 약관 동의',
  '개인정보 수집·이용 동의',
  '신용정보 조회 동의',
  '자동투자 리워드 서비스 약관',
];

const optionalTerms = ['마케팅 정보 수신 (이메일)', '마케팅 정보 수신 (SMS)'];

export default function CardTermsScreen() {
  const draft = useCardApplicationDraft();
  const [selected, setSelected] = useState<string[]>(() => {
    const nextSelected = [...requiredTerms.filter(() => draft.terms.requiredTerms)];

    if (draft.terms.isMarketingEmailAgree) {
      nextSelected.push(optionalTerms[0]);
    }

    if (draft.terms.isMarketingSmsAgree) {
      nextSelected.push(optionalTerms[1]);
    }

    return nextSelected;
  });

  const allRequiredSelected = useMemo(
    () => requiredTerms.every((term) => selected.includes(term)),
    [selected],
  );

  const toggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label],
    );
  };

  const toggleAllRequired = () => {
    setSelected((prev) =>
      allRequiredSelected
        ? prev.filter((item) => !requiredTerms.includes(item))
        : [...new Set([...prev, ...requiredTerms])],
    );
  };

  const handleNext = () => {
    setCardApplicationTerms({
      requiredTerms: allRequiredSelected,
      isMarketingEmailAgree: selected.includes(optionalTerms[0]),
      isMarketingSmsAgree: selected.includes(optionalTerms[1]),
    });

    router.push('/card-account');
  };

  return (
    <View style={styles.container}>
      <TopBar title="약관 동의" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stepRow}>
          <StepDot active />
          <StepDot active />
          <StepDot />
          <StepDot />
        </View>

        <Text style={styles.title}>약관에 동의해주세요</Text>
        <Text style={styles.subtitle}>서비스 이용을 위해 약관 확인이 필요합니다</Text>

        <Pressable style={styles.allRow} onPress={toggleAllRequired}>
          <View style={[styles.checkbox, allRequiredSelected && styles.checkboxChecked]}>
            {allRequiredSelected ? <Ionicons name="checkmark" size={16} color={AuthColors.white} /> : null}
          </View>
          <Text style={styles.allText}>필수 약관 모두 동의</Text>
        </Pressable>

        <View style={styles.section}>
          {requiredTerms.map((term) => {
            const checked = selected.includes(term);
            return (
              <Pressable key={term} style={styles.termRow} onPress={() => toggle(term)}>
                <View style={styles.termLeft}>
                  <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                    {checked ? <Ionicons name="checkmark" size={16} color={AuthColors.white} /> : null}
                  </View>
                  <View style={styles.termTextWrap}>
                    <Text style={styles.requiredPrefix}>[필수]</Text>
                    <Text style={styles.termText}>{term}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={AuthColors.textLightGray} />
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.optionalLabel}>선택 동의</Text>
        <View style={styles.section}>
          {optionalTerms.map((term) => {
            const checked = selected.includes(term);
            return (
              <Pressable key={term} style={styles.termRow} onPress={() => toggle(term)}>
                <View style={styles.termLeft}>
                  <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                    {checked ? <Ionicons name="checkmark" size={16} color={AuthColors.white} /> : null}
                  </View>
                  <View style={styles.termTextWrap}>
                    <Text style={styles.termPrefix}>[선택]</Text>
                    <Text style={styles.termText}>{term}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={AuthColors.textLightGray} />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>필수 약관 미동의 시 신청이 어렵습니다.</Text>
        </View>

        <View style={styles.bottomGap} />
        <AuthButton title="다음" disabled={!allRequiredSelected} onPress={handleNext} />
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
  allRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    backgroundColor: AuthColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: AuthColors.blue400,
    backgroundColor: AuthColors.blue400,
  },
  allText: {
    fontSize: 15,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  section: {
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    borderRadius: 14,
    overflow: 'hidden',
  },
  termRow: {
    minHeight: 54,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: AuthColors.borderGray,
  },
  termLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  termTextWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  termPrefix: {
    fontSize: 12,
    color: AuthColors.textGray,
    fontWeight: '700',
  },
  requiredPrefix: {
    fontSize: 12,
    color: AuthColors.error,
    fontWeight: '700',
  },
  termText: {
    fontSize: 13,
    color: AuthColors.textBlack,
    flex: 1,
  },
  optionalLabel: {
    marginTop: 18,
    marginBottom: 12,
    fontSize: 13,
    fontWeight: '700',
    color: AuthColors.textGray,
  },
  warningBox: {
    marginTop: AuthSpacing.xl,
    backgroundColor: 'rgba(255, 224, 102, 0.2)',
    borderRadius: 12,
    padding: 14,
  },
  warningText: {
    fontSize: 12,
    color: '#78350F',
  },
  bottomGap: {
    height: 20,
  },
});
