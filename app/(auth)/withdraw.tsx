import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { extractApiErrorMessage } from '@/hooks/apiClient';
import { withdrawUser } from '@/hooks/userApi';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function WithdrawScreen() {
  const [expanded, setExpanded] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = useMemo(
    () => [
      '서비스 이용이 불편해서',
      '다른 서비스를 사용하게 돼서',
      '더 이상 필요하지 않아서',
    ],
    [],
  );

  const handleWithdraw = async () => {
    if (!selectedReason || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      await withdrawUser();
      Alert.alert('회원 탈퇴 완료', '회원 탈퇴가 완료되었습니다.', [
        {
          text: '확인',
          onPress: () => router.replace('/(auth)/login'),
        },
      ]);
    } catch (error) {
      Alert.alert('회원 탈퇴 실패', extractApiErrorMessage(error, '회원 탈퇴 중 문제가 발생했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar title="회원 탈퇴" onBackPress={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!expanded}
      >
        <Text style={styles.title}>
          계속 진행하시려면{`\n`}탈퇴 사유를 선택해주세요.
        </Text>

        <View style={styles.block}>
          <Text style={styles.label}>탈퇴 사유 선택</Text>
          <Pressable
            style={styles.selectBox}
            onPress={() => setExpanded((prev) => !prev)}
          >
            <Text style={[styles.placeholder, selectedReason && styles.selectedValue]}>
              {selectedReason || '선택해주세요'}
            </Text>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#9ca3af"
            />
          </Pressable>

          {expanded && (
            <View style={styles.reasonList}>
              {reasons.map((reason) => (
                <Pressable
                  key={reason}
                  style={styles.reasonItem}
                  onPress={() => {
                    setSelectedReason(reason);
                    setExpanded(false);
                  }}
                >
                  <Text style={styles.reasonText}>{reason}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>안내 사항</Text>
          <View style={styles.bulletRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.noticeText}>탈퇴 시 모든 개인 정보가 삭제됩니다.</Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.noticeText}>보유하신 계좌 상품은 해지 처리됩니다.</Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.noticeText}>탈퇴 후 30일간 재가입이 제한됩니다.</Text>
          </View>
        </View>

        <View style={styles.buttonWrap}>
          <AuthButton
            title="탈퇴하기"
            onPress={handleWithdraw}
            variant="danger"
            disabled={!selectedReason || isSubmitting}
            style={{
              opacity: selectedReason ? 1 : 0.5,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AuthColors.white,
    position: 'relative',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  content: {
    paddingHorizontal: AuthSpacing.lg,
    paddingTop: 34,
    paddingBottom: 40,
    zIndex: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: AuthColors.textBlack,
    lineHeight: 24,
    marginBottom: 32,
  },
  block: {
    marginBottom: 48,
    position: 'relative',
    zIndex: 20,
  },
  label: {
    fontSize: 13,
    color: AuthColors.textGray,
    marginBottom: 8,
  },
  selectBox: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: AuthColors.white,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeholder: {
    fontSize: 14,
    color: '#9ca3af',
  },
  selectedValue: {
    color: AuthColors.textBlack,
  },
  reasonList: {
    position: 'absolute',
    top: 76,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: AuthColors.white,
    zIndex: 30,
    elevation: 10,
    pointerEvents: 'auto',
  },
  reasonItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  reasonText: {
    fontSize: 14,
    color: AuthColors.textBlack,
  },
  noticeCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#fafafa',
    padding: 16,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: AuthColors.textBlack,
    marginBottom: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    color: '#6b7280',
    fontSize: 12,
    lineHeight: 18,
    marginRight: 8,
  },
  noticeText: {
    flex: 1,
    color: '#6b7280',
    fontSize: 12,
    lineHeight: 18,
  },
  buttonWrap: {
    marginTop: 178,
  },
});
