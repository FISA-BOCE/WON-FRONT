import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { extractApiErrorMessage } from '@/hooks/apiClient';
import { logout } from '@/hooks/authApi';
import { MyUser, getMyUser } from '@/hooks/userApi';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<MyUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const nextProfile = await getMyUser();

        if (isMounted) {
          setProfile(nextProfile);
        }
      } catch (error) {
        Alert.alert('내 정보 조회 실패', extractApiErrorMessage(error, '내 정보를 불러오지 못했습니다.'));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.replace('/login');
    } catch (error) {
      Alert.alert('로그아웃 실패', extractApiErrorMessage(error, '로그아웃 중 문제가 발생했습니다.'));
    } finally {
      setIsLoggingOut(false);
    }
  };

  const tel = formatPhoneNumber(profile?.tel ?? '');
  const joinedAt = formatDate(profile?.createdAt ?? '');
  const userName = profile?.userName ?? '회원';

  return (
    <View style={styles.container}>
      <TopBar
        title="내 정보"
        onBackPress={() => router.back()}
        onRightPress={() => router.push('/profile-edit')}
      />

      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color={AuthColors.blue300} />
            <Text style={styles.loadingText}>내 정보를 불러오는 중입니다.</Text>
          </View>
        ) : (
          <>
        <View style={styles.profileHeader}>
          <View style={styles.profileHeaderLeft}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={30} color="#a1a1aa" />
            </View>
            <Text style={styles.greeting}>{userName}님, 안녕하세요!</Text>
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
          <InfoRow label="이름" value={userName} />
          <InfoRow label="휴대폰 번호" value={tel} />
          <InfoRow label="가입일" value={joinedAt} />
        </View>

        <View style={styles.bottomArea}>
          <AuthButton
            title="로그아웃"
            onPress={handleLogout}
            variant="blue300"
            disabled={isLoggingOut}
          />
          <Text style={styles.orText}>또는</Text>
          <AuthButton
            title="회원탈퇴"
            onPress={() => router.push('/withdraw')}
            variant="secondary"
            disabled={isLoggingOut}
          />
        </View>
          </>
        )}
      </View>
    </View>
  );
}

function formatPhoneNumber(value: string) {
  if (value.length !== 11) {
    return value || '-';
  }

  return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
}

function formatDate(value: string) {
  if (!value) {
    return '-';
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
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
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: AuthSpacing.md,
  },
  loadingText: {
    fontSize: 14,
    color: AuthColors.textGray,
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
