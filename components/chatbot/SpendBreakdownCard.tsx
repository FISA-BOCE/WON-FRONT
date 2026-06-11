import { AuthColors } from '@/constants/authColors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type SpendBreakdownItem = {
  category: string;
  amount: number;
};

interface SpendBreakdownCardProps {
  items: SpendBreakdownItem[];
}

const BAR_COLORS = [
  AuthColors.blue500,
  '#2F67F6',
  '#4385E8',
  '#78B4F5',
  '#AFD5F5',
];

function formatAmount(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

export function SpendBreakdownCard({ items }: SpendBreakdownCardProps) {
  const sortedItems = [...items].sort((left, right) => {
    const leftIsEtc = left.category === '기타';
    const rightIsEtc = right.category === '기타';

    if (leftIsEtc && !rightIsEtc) {
      return 1;
    }

    if (!leftIsEtc && rightIsEtc) {
      return -1;
    }

    return right.amount - left.amount;
  });
  const maxAmount = Math.max(...sortedItems.map((item) => item.amount), 1);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>업종별 소비 비중</Text>
      <View style={styles.list}>
        {sortedItems.map((item, index) => {
          const widthRatio = Math.max(item.amount / maxAmount, 0.12);

          return (
            <View key={`${item.category}-${index}`} style={styles.item}>
              <View style={styles.row}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.amount}>{formatAmount(item.amount)}</Text>
              </View>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { width: `${Math.min(widthRatio * 100, 100)}%` },
                    { backgroundColor: BAR_COLORS[index % BAR_COLORS.length] },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#F4F5F8',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 20,
  },
  list: {
    gap: 18,
  },
  item: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  category: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  amount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  track: {
    width: '100%',
    height: 14,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
