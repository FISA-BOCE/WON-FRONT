import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'default',
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: '로그인',
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: '회원가입',
        }}
      />
      <Stack.Screen
        name="signup-complete"
        options={{
          title: '가입 완료',
        }}
      />
      <Stack.Screen
        name="withdraw"
        options={{
          title: '회원 탈퇴',
        }}
      />
    </Stack>
  );
}
