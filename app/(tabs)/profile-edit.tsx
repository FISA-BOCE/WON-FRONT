import { AuthButton } from '@/components/auth/AuthButton';
import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

export default function ProfileEditScreen() {
  return (
    <View style={styles.container}>
      <TopBar
        title="회원 정보 수정"
        onBackPress={() => router.replace('/profile')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <FieldBlock label="이름">
          <View style={[styles.inputBox, styles.disabledBox]}>
            <Text style={styles.disabledValue}>김우리</Text>
          </View>
        </FieldBlock>

        <FieldBlock label="이메일">
          <Pressable style={styles.inputBox}>
            <Text style={styles.value}>woori@email.com</Text>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </Pressable>
        </FieldBlock>

        <FieldBlock label="비밀번호 변경">
          <View style={styles.inputBox} />
        </FieldBlock>

        <View style={styles.buttonWrap}>
          <AuthButton
            title="수정하기"
            onPress={() => router.replace('/profile')}
            variant="blue300"
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
  },
  content: {
    paddingHorizontal: AuthSpacing.lg,
    paddingTop: 32,
    paddingBottom: 40,
  },
  fieldBlock: {
    marginBottom: 28,
  },
  fieldLabel: {
    fontSize: 13,
    color: AuthColors.textGray,
    marginBottom: 8,
  },
  inputBox: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eeeded',
    backgroundColor: AuthColors.white,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabledBox: {
    backgroundColor: '#eeeded',
  },
  disabledValue: {
    color: '#9ca3af',
    fontSize: 14,
  },
  value: {
    color: AuthColors.textBlack,
    fontSize: 14,
  },
  buttonWrap: {
    marginTop: 220,
  },
});
