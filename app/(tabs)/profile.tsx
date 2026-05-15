import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <TopBar
        title="내 정보"
        onBackPress={() => router.back()}
        onRightPress={() => router.push('/profile-edit')}
      />

      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.profileHeaderLeft}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={30} color="#a1a1aa" />
            </View>
            <Text style={styles.greeting}>김우리님, 안녕하세요!</Text>
          </View>

          <Pressable
            style={styles.editButton}
            onPress={() => router.push('/profile-edit')}
          >
            <Ionicons name="create-outline" size={24} color={AuthColors.textBlack} />
          </Pressable>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoBox}>
          <InfoRow label="이름" value="김우리" />
          <InfoRow label="휴대폰 번호" value="010-****-5678" />
          <InfoRow label="가입일" value="2024.01.01" />
        </View>

        <View style={styles.bottomArea}>
          <AuthButton
            title="로그아웃"
            onPress={() => router.replace('/login')}
            variant="blue300"
          />
          <Text style={styles.orText}>또는</Text>
          <AuthButton
            title="회원탈퇴"
            onPress={() => router.push('/withdraw')}
            variant="secondary"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AuthColors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: AuthSpacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 36,
  },
  profileHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AuthSpacing.md,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 6,
    backgroundColor: '#f3f4f6',
    marginHorizontal: -AuthSpacing.lg,
  },
  infoBox: {
    paddingTop: 28,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#616060',
  },
  infoValue: {
    fontSize: 14,
    color: AuthColors.textBlack,
  },
  bottomArea: {
    marginTop: 'auto',
    paddingTop: 40,
    paddingBottom: 40,
  },
  orText: {
    textAlign: 'center',
    color: '#a9a8a8',
    fontSize: 13,
    marginVertical: 18,
  },
});
