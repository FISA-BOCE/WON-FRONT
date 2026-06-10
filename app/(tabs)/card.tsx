import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { extractApiErrorMessage } from '@/hooks/apiClient';
import { CardInfo, getCardInfo } from '@/hooks/cardApi';

import CardHomeEmptyScreen from './card-home-empty';

function QuickMenu({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.quickMenuItem} onPress={onPress}>
      <View style={styles.quickMenuIconWrap}>
        <Ionicons name={icon} size={20} color={AuthColors.blue300} />
      </View>
      <Text style={styles.quickMenuText}>{label}</Text>
    </Pressable>
  );
}

export default function CardHomeScreen() {
  const [cards, setCards] = useState<CardInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadCardInfo = async () => {
        try {
          setIsLoading(true);
          setErrorMessage('');
          const nextCards = await getCardInfo();

          if (isMounted) {
            setCards(nextCards);
          }
        } catch (error) {
          if (isMounted) {
            setErrorMessage(extractApiErrorMessage(error, '카드 정보를 불러오지 못했습니다.'));
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      void loadCardInfo();

      return () => {
        isMounted = false;
      };
    }, []),
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <TopBar title="카드" showBack={false} />
        <View style={styles.centerState}>
          <ActivityIndicator size="small" color={AuthColors.blue300} />
          <Text style={styles.stateText}>카드 정보를 불러오는 중입니다.</Text>
        </View>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.container}>
        <TopBar title="카드" showBack={false} />
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      </View>
    );
  }

  if (cards.length === 0) {
    return <CardHomeEmptyScreen />;
  }

  const primaryCard = cards[0];

  return (
    <View style={styles.container}>
      <TopBar title="카드" showBack={false} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardHero}>
          <View style={styles.cardStripe} />
          <Text style={styles.cardHeroLabel}>{primaryCard.cardName}</Text>
          <Text style={styles.cardHeroNumber}>{primaryCard.cardNoDisplay}</Text>
          <Text style={styles.cardHeroSub}>보유 카드 {cards.length}장</Text>
        </View>

        <Text style={styles.sectionTitle}>자주 쓰는 메뉴</Text>
        <View style={styles.quickGrid}>
          <QuickMenu icon="card-outline" label="결제 내역" onPress={() => router.push('/(tabs)/card-monthly-usage')} />
          <QuickMenu icon="sparkles-outline" label="혜택" onPress={() => router.push('/(tabs)/card-create')} />
          <QuickMenu icon="checkbox-outline" label="리워드" onPress={() => router.push('/(tabs)/card-reward')} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>보유 카드 목록</Text>
        </View>

        <View style={styles.cardList}>
          {cards.map((card) => (
            <View key={`${card.cardName}-${card.cardNoDisplay}`} style={styles.cardListItem}>
              <Text style={styles.cardListTitle}>{card.cardName}</Text>
              <Text style={styles.cardListNumber}>{card.cardNoDisplay}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AuthColors.white,
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: AuthSpacing.lg,
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
  },
  content: {
    paddingHorizontal: AuthSpacing.lg,
    paddingBottom: 28,
  },
  cardHero: {
    marginTop: 40,
    height: 200,
    borderRadius: 18,
    backgroundColor: AuthColors.blue300,
    padding: 20,
  },
  cardStripe: {
    width: 36,
    height: 26,
    borderRadius: 4,
    backgroundColor: '#f5d76e',
    marginBottom: 64,
  },
  cardHeroLabel: {
    fontSize: 12,
    color: AuthColors.white,
    marginBottom: 10,
  },
  cardHeroNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: AuthColors.white,
    marginBottom: 10,
  },
  cardHeroSub: {
    fontSize: 11,
    color: AuthColors.white,
  },
  sectionTitle: {
    marginTop: 60,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  quickGrid: {
    marginTop: 4,
    flexDirection: 'row',
    gap: 10,
  },
  quickMenuItem: {
    flex: 1,
    minHeight: 84,
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 10,
  },
  quickMenuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickMenuText: {
    fontSize: 12,
    color: AuthColors.textBlack,
    textAlign: 'center',
  },
  sectionHeader: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardList: {
    gap: 10,
  },
  cardListItem: {
    borderWidth: 1,
    borderColor: AuthColors.borderDarkGray,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardListTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  cardListNumber: {
    marginTop: 6,
    fontSize: 12,
    color: AuthColors.textGray,
  },
});
