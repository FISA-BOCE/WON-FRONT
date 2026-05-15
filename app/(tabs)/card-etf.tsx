import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';

type ETFItem = {
  name: string;
  ticker: string;
  desc: string;
  category: '전체' | '미국' | '카테고리1' | '카테고리2';
  current?: boolean;
};

const FILTERS: ETFItem['category'][] = ['전체', '미국', '카테고리1', '카테고리2'];

const ETF_LIST: ETFItem[] = [
  { name: 'VOO', ticker: 'VOO · S&P 500', desc: 'S&P 500 ETF', category: '미국', current: true },
  { name: 'QQQ', ticker: 'QQQ · Nasdaq 100', desc: '나스닥100 ETF', category: '미국' },
  { name: 'SCHD', ticker: 'SCHD · Dividend', desc: '고배당 ETF', category: '카테고리1' },
  { name: 'TQQQ', ticker: 'TQQQ · 3x Nasdaq', desc: '레버리지 ETF', category: '카테고리2' },
  { name: 'IVV', ticker: 'IVV · S&P 500', desc: '대형주 추종 ETF', category: '미국' },
];

export default function CardEtfScreen() {
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ETFItem['category']>('전체');
  const [selected, setSelected] = useState('VOO');

  const filteredEtfs = useMemo(() => {
    return ETF_LIST.filter((item) => {
      const matchFilter = selectedFilter === '전체' || item.category === selectedFilter;
      const keyword = search.trim().toLowerCase();
      const matchSearch = !keyword || `${item.name} ${item.ticker} ${item.desc}`.toLowerCase().includes(keyword);
      return matchFilter && matchSearch;
    });
  }, [search, selectedFilter]);

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
        <Text style={styles.subtitle}>사전 등록된 거래 가능 ETF만 표시됩니다.</Text>

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

        <View style={styles.filterRow}>
          {FILTERS.map((filter) => {
            const active = selectedFilter === filter;
            return (
              <Pressable key={filter} style={styles.filterItem} onPress={() => setSelectedFilter(filter)}>
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{filter}</Text>
                {active ? <View style={styles.filterUnderline} /> : <View style={styles.filterSpacer} />}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.listSection}>
          {filteredEtfs.map((item) => {
            const isSelected = selected === item.name;
            return (
              <Pressable
                key={item.name}
                style={[styles.etfCard, isSelected && styles.etfCardSelected]}
                onPress={() => setSelected(item.name)}
              >
                <View style={styles.etfLeft}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.name}</Text>
                  </View>
                  <View style={styles.etfTextWrap}>
                    <Text style={styles.etfTitle}>{item.desc}</Text>
                    <Text style={styles.etfDesc}>{item.ticker}</Text>
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

        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>투자 권유가 아니며 원금 손실 가능성이 있습니다.</Text>
          <Text style={styles.noticeText}>투자 결정은 본인 판단과 책임에 따라 진행하세요.</Text>
        </View>

        <View style={styles.bottomGap} />
        <AuthButton
          style={styles.nextButton}
          title="다음"
          onPress={() => router.push('./card-complete' as never)}
        />
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
    marginTop: AuthSpacing.default
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.gray700,
    marginTop: 8,
    marginBottom: AuthSpacing.xl
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
  },
  filterItem: {
    width: '25%',
    alignItems: 'center',
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
    marginTop: 8
  },
  filterSpacer: {
    width: 52,
    height: 2,
    marginTop: 8
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
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
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
  statusWrap: {
    alignItems: 'flex-end',
    gap: 8,
  },
  currentPill: {
    minWidth: 46,
    height: 24,
    borderRadius: 999,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  currentPillText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
  },
  unchecked: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
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
