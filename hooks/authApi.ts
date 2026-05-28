import { ApiResponse, apiClient } from '@/hooks/apiClient';
import { clearAuthTokens, getRefreshToken, saveAuthTokens } from '@/hooks/authStorage';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface SignupPayload {
  phoneNumber: string;
  userName: string;
  password: string;
  passwordConfirm: string;
  email: string;
  termsAgreed: boolean;
}

export async function signup(payload: SignupPayload) {
  await apiClient.post<ApiResponse<null>>('/api/auth/signup', {
    ...payload,
    passwordConfirmed: payload.password === payload.passwordConfirm,
    termsAgreedAccepted: payload.termsAgreed,
  });
}

export async function login(userId: string, userPw: string) {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', {
    userId,
    userPw,
  });

  await saveAuthTokens(response.data.data);
}

export async function logout() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    await clearAuthTokens();
    return;
  }

  await apiClient.post<ApiResponse<null>>('/api/auth/logout', {
    refreshToken,
  });

  await clearAuthTokens();
}
