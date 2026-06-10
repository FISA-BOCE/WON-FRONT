import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function SignupCompleteScreen() {
  const handleStartPress = () => {
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <TopBar title="회원가입" showBack={false} />

      <View style={styles.content}>
        {/* 성공 아이콘 */}
        <View style={styles.iconContainer}>
          <Ionicons
            name="checkmark-circle"
            size={112}
            color={AuthColors.blue300}
          />
        </View>

        {/* 텍스트 */}
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>
            회원가입이 완료되었습니다!
          </Text>
          <Text style={styles.subText}>
            WON해요의 다양한 서비스를{'\n'}이용해보세요.
          </Text>
        </View>

        {/* 버튼 */}
        <View style={styles.buttonContainer}>
          <AuthButton
            title="시작하기"
            onPress={handleStartPress}
            variant="blue300"
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: AuthSpacing.lg,
  },
  iconContainer: {
    marginBottom: AuthSpacing.xl,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: AuthSpacing.xl * 2,
  },
  mainText: {
    fontSize: 20,
    fontWeight: '700',
    color: AuthColors.textBlack,
    marginBottom: AuthSpacing.md,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    fontWeight: '400',
    color: AuthColors.textGray,
    textAlign: 'center',
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
    marginTop: AuthSpacing.xl,
  },
});
