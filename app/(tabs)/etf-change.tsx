import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing, AuthTypography } from '@/constants/authColors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const filterTabs = ['전체', '미국', '카테고리1', '카테고리2'];

const etfOptions = [
  {
    id: 'current',
    ticker: 'VOO',
    title: 'S&P 500 ETF',
    subtitle: 'VOO · S&P 500',
    selected: false,
    current: true,
  },
  {
    id: 'selected',
    ticker: 'QQQ',
    title: 'Nasdaq 100 ETF',
    subtitle: 'QQQ · Nasdaq 100',
    selected: true,
    current: false,
  },
  {
    id: 'candidate',
    ticker: 'SCHD',
    title: 'Dividend ETF',
    subtitle: 'SCHD · Dividend',
    selected: false,
    current: false,
  },
];

  export default function ETFChange() {
    const [search, setSearch] = React.useState('');
    const [selectedId, setSelectedId] = React.useState<string | null>(
      etfOptions.find((e) => e.selected)?.id ?? null
    );
    const [selectedTab, setSelectedTab] = React.useState<string>('전체');

    const currentItem = etfOptions.find((e) => e.current) ?? null;

    const selectableOptions = React.useMemo(() => etfOptions.filter((item) => !item.current), []);

    const filteredOptions = React.useMemo(() => {
      const keyword = search.trim().toLowerCase();

      if (!keyword) {
        return selectableOptions;
      }

      return selectableOptions.filter((item) => {
        const haystack = `${item.ticker} ${item.title} ${item.subtitle}`.toLowerCase();
        return haystack.includes(keyword);
      });
    }, [search, selectableOptions]);


    return (
      <View style={styles.container}>
        <TopBar title="ETF 변경" />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {currentItem ? (
            <Pressable style={styles.topCurrentCard} disabled>
              <View style={styles.etfLeft}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{currentItem.ticker}</Text>
                </View>
                <View style={styles.etfTextWrap}>
                  <Text style={styles.etfTitle}>{currentItem.title}</Text>
                  <Text style={styles.etfDesc}>2025.05.07부터 적용 중</Text>
                </View>
              </View>
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>현재</Text>
              </View>
            </Pressable>
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
                <Pressable
                  key={tab}
                  style={styles.tabItemWrap}
                  onPress={() => setSelectedTab(tab)}
                >
                  <Text style={[styles.tabItem, active && styles.tabItemActive]}>{tab}</Text>
                  {active ? <View style={styles.tabUnderline} /> : <View style={styles.tabSpacer} />}
                </Pressable>
              );
            })}
          </View>

          <View style={styles.listSection}>
            {filteredOptions.map((item) => {
              const isSelected = selectedId === item.id;

              return (
                <Pressable
                  key={item.id}
                  style={[styles.listItem, isSelected && styles.selectedItem]}
                  onPress={() => setSelectedId(item.id)}
                >
                  <View style={styles.etfLeft}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.ticker}</Text>
                    </View>
                    <View style={styles.etfTextWrap}>
                      <Text style={styles.etfTitle}>{item.title}</Text>
                      <Text style={styles.etfDesc}>{item.subtitle}</Text>
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

          <View style={styles.noteBox}>
            <Text style={styles.noteTitle}>VOO → QQQ로 변경</Text>
            <Text style={styles.noteText}>2026년 6월 결제분부터 QQQ로 자동 적립됩니다.</Text>
          </View>

          <View style={styles.bottomGap} />
          <AuthButton
            title="ETF 변경하기"
            onPress={() => router.back()}
          />
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
  },
  tabItemWrap: {
    width: '25%',
    alignItems: 'center',
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
    width: 52,
    height: 2,
    marginTop: 8,
  },
  sectionHeader: {
    marginBottom: AuthSpacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.gray700,
    fontFamily: 'Pretendard-Bold',
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
    borderWidth: 1,
    borderColor: AuthColors.blue300,
    borderRadius: 16,
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
  badgeText: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 13,
    fontFamily: 'Pretendard-Bold',
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
  bottomBar: {
    paddingHorizontal: AuthSpacing.md,
    paddingBottom: AuthSpacing.lg,
    paddingTop: AuthSpacing.md,
    borderTopWidth: 1,
    borderTopColor: AuthColors.gray200,
    backgroundColor: AuthColors.white,
  },
  bottomButton: {
    height: 44,
    borderRadius: 10,
    backgroundColor: AuthColors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtonActive: {
    backgroundColor: AuthColors.blue300,
  },
  bottomButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.gray800,
    fontFamily: 'Pretendard-Bold',
  },
  bottomButtonTextActive: {
    color: AuthColors.white,
  },
});
