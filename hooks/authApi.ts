import { ApiResponse, apiClient } from '@/hooks/apiClient';
import { clearAuthTokens, getRefreshToken, saveAuthTokens } from '@/hooks/authStorage';

interface CreateLoginRequest {
  userId: string;
  userPw: string;
}

interface CreateLoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SignupPayload {
  phoneNumber: string;
  userName: string;
  password: string;
  passwordConfirm: string;
  email: string;
  termsAgreed: boolean;
}

export async function signup(payload: SignupPayload) {
  const requestBody = {
    ...payload,
    passwordConfirmed: payload.password === payload.passwordConfirm,
    termsAgreedAccepted: payload.termsAgreed,
  };

  await apiClient.post<ApiResponse<null>, { data: ApiResponse<null> }, typeof requestBody>(
    '/api/auth/signup',
    requestBody,
  );
}

export async function login(userId: string, userPw: string) {
  const requestBody: CreateLoginRequest = { userId, userPw };
  const response = await apiClient.post<ApiResponse<CreateLoginResponse>, { data: ApiResponse<CreateLoginResponse> }, CreateLoginRequest>(
    '/api/auth/login',
    requestBody,
  );

  await saveAuthTokens(response.data.data);
}

export async function logout() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    await clearAuthTokens();
    return;
  }

  await apiClient.post<ApiResponse<null>, { data: ApiResponse<null> }, { refreshToken: string }>(
    '/api/auth/logout',
    { refreshToken },
  );

  await clearAuthTokens();
}
