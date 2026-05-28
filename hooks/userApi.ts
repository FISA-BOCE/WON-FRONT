import { ApiResponse, apiClient } from '@/hooks/apiClient';
import { clearAuthTokens, getRefreshToken } from '@/hooks/authStorage';

export interface MyUser {
  userName: string;
  tel: string;
  createdAt: string;
}

export interface UpdateUserPayload {
  email?: string;
  currentPw?: string;
  newPw?: string;
}

export async function getMyUser() {
  const response = await apiClient.get<ApiResponse<MyUser>>('/api/users/me');
  return response.data.data;
}

export async function updateMyUser(payload: UpdateUserPayload) {
  await apiClient.patch<ApiResponse<null>>('/api/users/me', payload);
}

export async function withdrawUser() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    throw new Error('로그인 정보가 없습니다.');
  }

  await apiClient.post<ApiResponse<null>>('/api/users/me/withdraw', {
    refreshToken,
  });

  await clearAuthTokens();
}
