import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing, AuthTypography } from '@/constants/authColors';
import { extractApiErrorMessage } from '@/hooks/apiClient';
import {
  CardAutoInvestInfo,
  changeCardAutoInvest,
  getCardAutoInvest,
  getCardInfo,
} from '@/hooks/cardApi';
import { getInvestEtfs, InvestEtfSummary } from '@/hooks/investApi';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type FilterTab = '전체' | string;

function formatAppliedDate(value?: string) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const yyyy = date.getFullYear();
  const mm = `${date.getMonth() + 1}`.padStart(2, '0');
  const dd = `${date.getDate()}`.padStart(2, '0');

  const suffix = date.getTime() > Date.now() ? '적용 예정' : '적용 중';

  return `${yyyy}.${mm}.${dd}부터 ${suffix}`;
}

function formatScheduledDate(value?: string) {
  if (!value) {
    return '다음 적립분부터 적용됩니다.';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '다음 적립분부터 적용됩니다.';
  }

  const yyyy = date.getFullYear();
  const mm = `${date.getMonth() + 1}`.padStart(2, '0');
  const dd = `${date.getDate()}`.padStart(2, '0');

  return `${yyyy}.${mm}.${dd}부터 적용됩니다.`;
}

function getMarketLabel(market: string) {
  switch (market) {
    case 'US':
      return '미국';
    case 'KR':
      return '국내';
    default:
      return market || '기타';
  }
}

export default function ETFChange() {
  const [search, setSearch] = useState('');
  const [selectedEtfId, setSelectedEtfId] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<FilterTab>('전체');
  const [cardUuid, setCardUuid] = useState('');
  const [autoInvestInfo, setAutoInvestInfo] = useState<CardAutoInvestInfo | null>(null);
  const [etfOptions, setEtfOptions] = useState<InvestEtfSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadScreen = async () => {
        try {
          setIsLoading(true);
          setErrorMessage('');

          const cards = await getCardInfo();
          const primaryCard = cards[0];

          if (!primaryCard) {
            if (isMounted) {
              setCardUuid('');
              setAutoInvestInfo(null);
              setEtfOptions([]);
              setSelectedEtfId(null);
            }
            return;
          }

          const [nextAutoInvestInfo, nextEtfOptions] = await Promise.all([
            getCardAutoInvest(primaryCard.cardUuid),
            getInvestEtfs(),
          ]);

          if (!isMounted) {
            return;
          }

          setCardUuid(primaryCard.cardUuid);
          setAutoInvestInfo(nextAutoInvestInfo);
          setEtfOptions(nextEtfOptions.filter((item) => item.isAutoInvestAvailable));
          setSelectedEtfId(nextAutoInvestInfo.pendingEtf?.etfId ?? null);
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

      void loadScreen();

      return () => {
        isMounted = false;
      };
    }, []),
  );

  const currentEtf = autoInvestInfo?.currentEtf ?? null;
  const pendingEtf = autoInvestInfo?.pendingEtf ?? null;
  const displayEtf = pendingEtf ?? currentEtf;
  const isPendingUpdate = Boolean(pendingEtf);

  const filterTabs = useMemo<FilterTab[]>(() => {
    const markets = Array.from(new Set(etfOptions.map((item) => getMarketLabel(item.market))));
    return ['전체', ...markets];
  }, [etfOptions]);

  const filteredOptions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const nextOptions = etfOptions.filter((item) => {
      const matchesTab =
        selectedTab === '전체' ? true : getMarketLabel(item.market) === selectedTab;
      const matchesKeyword = keyword
        ? `${item.ticker} ${item.etfName} ${item.description}`.toLowerCase().includes(keyword)
        : true;

      return matchesTab && matchesKeyword;
    });

    if (!currentEtf) {
      return nextOptions;
    }

    return [...nextOptions].sort((left, right) => {
      if (left.etfId === currentEtf.etfId) {
        return -1;
      }

      if (right.etfId === currentEtf.etfId) {
        return 1;
      }

      return 0;
    });
  }, [currentEtf, etfOptions, search, selectedTab]);

  const selectedEtf = etfOptions.find((item) => item.etfId === selectedEtfId) ?? null;
  const isCurrentEtfSelected = selectedEtfId !== null && selectedEtfId === currentEtf?.etfId;
  const isChangeDisabled = !selectedEtf || !cardUuid || isCurrentEtfSelected || isSubmitting;

  const handleChangeEtf = async () => {
    if (!selectedEtf || !cardUuid || isCurrentEtfSelected) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      await changeCardAutoInvest(cardUuid, selectedEtf.etfId);
      router.back();
    } catch (error) {
      setErrorMessage(extractApiErrorMessage(error, 'ETF 변경에 실패했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar title="ETF 변경" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="small" color={AuthColors.blue300} />
            <Text style={styles.stateText}>ETF 정보를 불러오는 중입니다.</Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.centerState}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : (
          <>
            {displayEtf ? (
              <Pressable style={styles.topCurrentCard} disabled>
                <View style={styles.etfLeft}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{displayEtf.ticker}</Text>
                  </View>
                  <View style={styles.etfTextWrap}>
                    <Text style={styles.etfTitle}>{displayEtf.etfName}</Text>
                    <Text style={styles.etfDesc}>{formatAppliedDate(displayEtf.effectiveFrom)}</Text>
                  </View>
                </View>
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>{isPendingUpdate ? '변경 예정' : '현재'}</Text>
                </View>
              </Pressable>
            ) : (
              <View style={styles.emptyCurrentCard}>
                <Text style={styles.emptyCurrentTitle}>현재 선택된 ETF가 없습니다.</Text>
                <Text style={styles.emptyCurrentDesc}>변경할 ETF를 선택하면 다음 적립분부터 적용됩니다.</Text>
              </View>
            )}

            {pendingEtf ? (
              <View style={styles.pendingInfoBox}>
                <Text style={styles.pendingInfoTitle}>이미 ETF 변경이 예약되어 있어요.</Text>
                <Text style={styles.pendingInfoText}>
                  {`${pendingEtf.ticker}가 ${formatScheduledDate(pendingEtf.effectiveFrom)}`}
                </Text>
                <Text style={styles.pendingInfoText}>
                  다른 ETF를 다시 선택하면 예약된 변경 내용이 새 ETF 기준으로 덮어써집니다.
                </Text>
              </View>
            ) : null}

            <View style={styles.searchBox}>
              <Ionicons name="search" size={16} color={AuthColors.gray400} />
              <TextInput
                style={styles.searchInput}
                placeholder="ETF명 또는 티커로 검색"
                placeholderTextColor={AuthColors.gray400}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <View style={styles.tabRow}>
              {filterTabs.map((tab) => {
                const active = selectedTab === tab;
                return (
                  <Pressable key={tab} style={styles.tabItemWrap} onPress={() => setSelectedTab(tab)}>
                    <Text style={[styles.tabItem, active && styles.tabItemActive]}>{tab}</Text>
                    {active ? <View style={styles.tabUnderline} /> : <View style={styles.tabSpacer} />}
                  </Pressable>
                );
              })}
            </View>

            {filteredOptions.length > 0 ? (
              <View style={styles.listSection}>
                {filteredOptions.map((item) => {
                  const isSelected = selectedEtfId === item.etfId;
                  const isCurrent = item.etfId === currentEtf?.etfId;

                  return (
                    <Pressable
                      key={item.etfId}
                      style={[
                        styles.listItem,
                        isSelected && !isCurrent && styles.selectedItem,
                        isCurrent && styles.disabledItem,
                      ]}
                      onPress={() => {
                        if (!isCurrent) {
                          setSelectedEtfId(item.etfId);
                        }
                      }}
                      disabled={isCurrent}
                    >
                      <View style={styles.etfLeft}>
                        <View style={[styles.badge, isCurrent && styles.disabledBadge]}>
                          <Text style={[styles.badgeText, isCurrent && styles.disabledBadgeText]}>
                            {item.ticker}
                          </Text>
                        </View>
                        <View style={styles.etfTextWrap}>
                          <Text style={[styles.etfTitle, isCurrent && styles.disabledText]}>
                            {item.etfName}
                          </Text>
                          <Text style={[styles.etfDesc, isCurrent && styles.disabledText]}>
                            {`${item.ticker} · ${getMarketLabel(item.market)}`}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.statusWrap}>
                        {isCurrent ? (
                          <View style={styles.inlineCurrentBadge}>
                            <Text style={styles.inlineCurrentBadgeText}>현재 선택</Text>
                          </View>
                        ) : isSelected ? (
                          <Ionicons name="checkmark-circle" size={22} color={AuthColors.blue300} />
                        ) : (
                          <View style={styles.unchecked} />
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyListCard}>
                <Text style={styles.emptyListText}>검색 조건에 맞는 ETF가 없습니다.</Text>
              </View>
            )}

            {selectedEtf ? (
              <View style={styles.noteBox}>
                <Text style={styles.noteTitle}>
                  {`${displayEtf?.ticker ?? '현재 ETF 없음'} → ${selectedEtf.ticker}로 변경`}
                </Text>
                <Text style={styles.noteText}>
                  {pendingEtf?.etfId === selectedEtf.etfId
                    ? formatScheduledDate(pendingEtf.effectiveFrom)
                    : '변경 시 다음 적립분부터 적용됩니다.'}
                </Text>
              </View>
            ) : null}

            <View style={styles.bottomGap} />
            <AuthButton
              title={isSubmitting ? '변경 중...' : 'ETF 변경하기'}
              onPress={handleChangeEtf}
              disabled={isChangeDisabled}
            />
          </>
        )}
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
    paddingBottom: 24,
    marginTop: 40,
    alignItems: 'stretch',
  },
  centerState: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  stateText: {
    fontSize: 14,
    color: AuthColors.gray600,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: AuthColors.error,
    textAlign: 'center',
  },
  topCurrentCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: AuthColors.blue300,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: AuthColors.white,
  },
  emptyCurrentCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: AuthColors.gray200,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    backgroundColor: AuthColors.white,
  },
  emptyCurrentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.gray900,
    marginBottom: 6,
    fontFamily: 'Pretendard-Bold',
  },
  emptyCurrentDesc: {
    fontSize: 12,
    color: AuthColors.textGray,
    lineHeight: 18,
    fontFamily: 'Pretendard-Regular',
  },
  pendingInfoBox: {
    width: '100%',
    backgroundColor: 'rgba(255, 224, 102, 0.3)',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    marginBottom: 8,
  },
  pendingInfoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: AuthColors.gray700,
    marginBottom: 6,
    fontFamily: 'Pretendard-Bold',
  },
  pendingInfoText: {
    fontSize: 11,
    color: AuthColors.gray600,
    lineHeight: 17,
    fontFamily: 'Pretendard-Regular',
  },
  currentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#EFF6FF',
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: AuthColors.blue500,
    fontFamily: 'Pretendard-Bold',
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
    marginTop: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: AuthColors.gray600,
    fontFamily: 'Pretendard-Regular',
  },
  tabRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 36,
    marginBottom: 24,
    flexWrap: 'wrap',
    rowGap: 10,
  },
  tabItemWrap: {
    minWidth: '25%',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabItem: {
    fontSize: 14,
    color: AuthColors.gray800,
    fontFamily: 'Pretendard-Regular',
  },
  tabItemActive: {
    color: AuthColors.blue400,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
  },
  tabUnderline: {
    width: 70,
    height: 2,
    backgroundColor: AuthColors.blue300,
    marginTop: 8,
  },
  tabSpacer: {
    width: 70,
    height: 2,
    marginTop: 8,
  },
  listSection: {
    width: '100%',
    gap: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: AuthSpacing.md,
    paddingHorizontal: AuthSpacing.md,
    borderWidth: 1,
    borderColor: AuthColors.gray200,
    borderRadius: 16,
    backgroundColor: AuthColors.white,
  },
  selectedItem: {
    backgroundColor: AuthColors.blue100,
    borderColor: AuthColors.blue300,
  },
  disabledItem: {
    backgroundColor: AuthColors.gray50,
    borderColor: AuthColors.gray200,
  },
  etfLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBadge: {
    backgroundColor: AuthColors.gray100,
  },
  badgeText: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 13,
    fontFamily: 'Pretendard-Bold',
  },
  disabledBadgeText: {
    color: AuthColors.gray500,
  },
  etfTextWrap: {
    flex: 1,
  },
  etfTitle: {
    fontSize: AuthTypography.subtitle.fontSize,
    fontWeight: '700',
    color: AuthColors.gray900,
    fontFamily: 'Pretendard-Bold',
  },
  etfDesc: {
    marginTop: 4,
    fontSize: 12,
    color: AuthColors.textGray,
    fontFamily: 'Pretendard-Regular',
  },
  disabledText: {
    color: AuthColors.gray500,
  },
  statusWrap: {
    alignItems: 'flex-end',
    gap: 8,
    marginLeft: 12,
  },
  unchecked: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
  },
  inlineCurrentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: AuthColors.gray100,
  },
  inlineCurrentBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: AuthColors.gray600,
    fontFamily: 'Pretendard-Bold',
  },
  emptyListCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: AuthColors.gray200,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 12,
    backgroundColor: AuthColors.white,
  },
  emptyListText: {
    fontSize: 13,
    color: AuthColors.textGray,
    textAlign: 'center',
    fontFamily: 'Pretendard-Regular',
  },
  noteBox: {
    width: '100%',
    marginTop: 40,
    marginBottom: 60,
    backgroundColor: 'rgba(255, 224, 102, 0.3)',
    borderRadius: 12,
    padding: 14,
  },
  noteTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: AuthColors.gray600,
    marginBottom: 4,
    fontFamily: 'Pretendard-SemiBold',
  },
  noteText: {
    fontSize: 10,
    fontWeight: '400',
    color: AuthColors.gray600,
    fontFamily: 'Pretendard-Regular',
  },
  bottomGap: {
    height: 20,
  },
});
