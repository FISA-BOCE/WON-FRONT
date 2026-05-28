import Constants from 'expo-constants';
import { Platform } from 'react-native';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { AuthTokens, clearAuthTokens, getAuthTokens, saveAuthTokens } from '@/hooks/authStorage';

interface ApiResponse<T> {
  status: number;
  code: string;
  message: string;
  data: T;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

function getApiBaseUrl() {
  const expoConfig = Constants.expoConfig as { hostUri?: string } | null;
  const expoGoConfig = Constants.expoGoConfig as { debuggerHost?: string } | null;
  const hostUri = expoConfig?.hostUri ?? expoGoConfig?.debuggerHost ?? '';
  const host = hostUri.split(':')[0];

  if (host) {
    return `http://${host}:8081`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8081';
  }

  return 'http://localhost:8081';
}

async function requestTokenRefresh(refreshToken: string) {
  const response = await refreshClient.post<ApiResponse<RefreshResponse>>('/api/auth/refresh', {
    refreshToken,
  });

  const tokens: AuthTokens = response.data.data;
  await saveAuthTokens(tokens);

  return tokens;
}

let refreshPromise: Promise<AuthTokens> | null = null;

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const tokens = await getAuthTokens();

  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const isRefreshRequest = originalRequest?.url?.includes('/api/auth/refresh');

    if (!originalRequest || status !== 401 || originalRequest._retry || isRefreshRequest) {
      return Promise.reject(error);
    }

    const tokens = await getAuthTokens();

    if (!tokens?.refreshToken) {
      await clearAuthTokens();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= requestTokenRefresh(tokens.refreshToken);
      const nextTokens = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${nextTokens.accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      await clearAuthTokens();
      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  },
);

export function extractApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError(error)) {
    const responseMessage = (error.response?.data as { message?: string } | undefined)?.message;

    if (responseMessage) {
      return responseMessage;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

export type { ApiResponse };
