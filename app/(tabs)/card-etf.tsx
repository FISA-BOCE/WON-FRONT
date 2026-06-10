import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { extractApiErrorMessage } from '@/hooks/apiClient';
import { setCardApplicationSelectedEtf, useCardApplicationDraft } from '@/hooks/cardApplicationFlow';
import { getInvestEtfs, InvestEtfSummary } from '@/hooks/investApi';

export default function CardEtfScreen() {
  const draft = useCardApplicationDraft();
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [selectedEtfId, setSelectedEtfId] = useState<number | null>(draft.selectedEtf?.etfId ?? null);
  const [etfs, setEtfs] = useState<InvestEtfSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadEtfs = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const nextEtfs = await getInvestEtfs();

        if (!isMounted) {
          return;
        }

        const availableEtfs = nextEtfs
          .filter((item) => item.isAutoInvestAvailable)
          .sort((a, b) => a.displayOrder - b.displayOrder);

        setEtfs(availableEtfs);

        if (availableEtfs.length > 0) {
          setSelectedEtfId((prev) => prev ?? availableEtfs[0].etfId);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(extractApiErrorMessage(error, 'ETF 목록을 불러오지 못했습니다.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadEtfs();

    return () => {
      isMounted = false;
    };
  }, []);

  const filterOptions = useMemo(() => {
    const marketSet = new Set(etfs.map((item) => item.market));
    return ['전체', ...marketSet];
  }, [etfs]);

  const filteredEtfs = useMemo(() => {
    return etfs.filter((item) => {
      const matchFilter = selectedFilter === '전체' || item.market === selectedFilter;
      const keyword = search.trim().toLowerCase();
      const matchSearch =
        !keyword ||
        `${item.etfName} ${item.ticker} ${item.description} ${item.market}`
          .toLowerCase()
          .includes(keyword);

      return matchFilter && matchSearch;
    });
  }, [etfs, search, selectedFilter]);

  const handleNext = () => {
    const selectedEtf = etfs.find((item) => item.etfId === selectedEtfId);

    if (!selectedEtf) {
      return;
    }

    setCardApplicationSelectedEtf({
      etfId: selectedEtf.etfId,
      ticker: selectedEtf.ticker,
      etfName: selectedEtf.etfName,
      description: selectedEtf.description,
      market: selectedEtf.market,
      riskGrade: selectedEtf.riskGrade,
    });

    router.push('/(tabs)/card-complete');
  };

  return (
    <View style={styles.container}>
      <TopBar title="ETF 선택" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stepRow}>
          <StepDot active />
          <StepDot active />
          <StepDot active />
          <StepDot active />
        </View>

        <Text style={styles.title}>ETF를 선택해 주세요</Text>
        <Text style={styles.subtitle}>제공 ETF 목록 조회 API 결과를 기준으로 표시됩니다.</Text>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={AuthColors.textLightGray} />
          <TextInput
            style={styles.searchInput}
            placeholder="ETF명 또는 티커로 검색"
            placeholderTextColor={AuthColors.textLightGray}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {!isLoading && !errorMessage ? (
          <View style={styles.filterRow}>
            {filterOptions.map((filter) => {
              const active = selectedFilter === filter;
              return (
                <Pressable
                  key={filter}
                  style={styles.filterItem}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>{filter}</Text>
                  {active ? <View style={styles.filterUnderline} /> : <View style={styles.filterSpacer} />}
                </Pressable>
              );
            })}
          </View>
        ) : null}

        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="small" color={AuthColors.blue300} />
            <Text style={styles.stateText}>ETF 목록을 불러오고 있습니다.</Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.centerState}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <AuthButton title="다시 시도" onPress={() => router.replace('/(tabs)/card-etf')} />
          </View>
        ) : (
          <>
            <View style={styles.listSection}>
              {filteredEtfs.map((item) => {
                const isSelected = selectedEtfId === item.etfId;
                return (
                  <Pressable
                    key={item.etfId}
                    style={[styles.etfCard, isSelected && styles.etfCardSelected]}
                    onPress={() => setSelectedEtfId(item.etfId)}
                  >
                    <View style={styles.etfLeft}>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.ticker}</Text>
                      </View>
                      <View style={styles.etfTextWrap}>
                        <Text style={styles.etfTitle}>{item.etfName}</Text>
                        <Text style={styles.etfDesc}>{item.description || item.market}</Text>
                        <Text style={styles.etfMeta}>
                          {item.market} · {item.currency} · 위험도 {formatRiskGrade(item.riskGrade)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.statusWrap}>
                      {isSelected ? (
                        <Ionicons name="checkmark-circle" size={22} color={AuthColors.blue300} />
                      ) : (
                        <View style={styles.unchecked} />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {filteredEtfs.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.stateText}>검색 조건에 맞는 ETF가 없습니다.</Text>
              </View>
            ) : null}

            <View style={styles.noticeBox}>
              <Text style={styles.noticeText}>투자 권유가 아니며 원금 손실 가능성이 있습니다.</Text>
              <Text style={styles.noticeText}>투자 결정은 본인 판단과 책임에 따라 진행하세요.</Text>
            </View>

            <View style={styles.bottomGap} />
            <AuthButton
              style={styles.nextButton}
              title="다음"
              onPress={handleNext}
              disabled={!selectedEtfId}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

function formatRiskGrade(value: InvestEtfSummary['riskGrade']) {
  switch (value) {
    case 'VERY_LOW':
      return '매우 낮음';
    case 'LOW':
      return '낮음';
    case 'MEDIUM':
      return '보통';
    case 'HIGH':
      return '높음';
    case 'VERY_HIGH':
      return '매우 높음';
    default:
      return '미정';
  }
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
    paddingBottom: 24,
    marginTop: 40,
    alignItems: 'stretch',
  },
  stepRow: {
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
  searchBox: {
    width: '100%',
    minHeight: 44,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AuthColors.gray50,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: AuthColors.gray50,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: AuthColors.gray600,
  },
  filterRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 36,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  filterItem: {
    minWidth: '25%',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterText: {
    fontSize: 14,
    color: AuthColors.textGray,
  },
  filterTextActive: {
    color: AuthColors.textBlack,
    fontWeight: '700',
  },
  filterUnderline: {
    width: 52,
    height: 2,
    backgroundColor: AuthColors.blue300,
    marginTop: 8,
  },
  filterSpacer: {
    width: 52,
    height: 2,
    marginTop: 8,
  },
  centerState: {
    minHeight: 260,
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
  listSection: {
    width: '100%',
    gap: 12,
  },
  etfCard: {
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  etfCardSelected: {
    borderColor: AuthColors.blue300,
  },
  etfLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  badge: {
    minWidth: 52,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 13,
  },
  etfTextWrap: {
    flex: 1,
  },
  etfTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  etfDesc: {
    marginTop: 4,
    fontSize: 12,
    color: AuthColors.textGray,
  },
  etfMeta: {
    marginTop: 4,
    fontSize: 11,
    color: AuthColors.gray500,
  },
  statusWrap: {
    alignItems: 'flex-end',
    gap: 8,
  },
  unchecked: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
  },
  emptyBox: {
    marginTop: 24,
    marginBottom: 8,
  },
  noticeBox: {
    width: '100%',
    marginTop: 40,
    backgroundColor: 'rgba(255, 224, 102, 0.3)',
    borderRadius: 12,
    padding: 14,
  },
  noticeText: {
    fontSize: 12,
    color: AuthColors.gray400,
  },
  bottomGap: {
    height: 20,
  },
  nextButton: {
    width: '100%',
  },
});
