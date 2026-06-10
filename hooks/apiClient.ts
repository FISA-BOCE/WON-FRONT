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

interface CreateTokenReissueRequest {
  refreshToken: string;
}

interface CreateTokenReissueResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export function getApiBaseUrl(port = 8081) {
  const expoConfig = Constants.expoConfig as { hostUri?: string } | null;
  const expoGoConfig = Constants.expoGoConfig as { debuggerHost?: string } | null;
  const hostUri = expoConfig?.hostUri ?? expoGoConfig?.debuggerHost ?? '';
  const host = hostUri.split(':')[0];

  if (host) {
    return `http://${host}:${port}`;
  }

  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${port}`;
  }

  return `http://localhost:${port}`;
}

function createTransactionId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);

  return `txn-${timestamp}-${random}`;
}

async function requestTokenRefresh(refreshToken: string) {
  const response = await refreshClient.post<ApiResponse<CreateTokenReissueResponse>, { data: ApiResponse<CreateTokenReissueResponse> }, CreateTokenReissueRequest>(
    '/api/auth/refresh',
    { refreshToken },
  );

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

  if (!config.headers['X-Transaction-ID']) {
    config.headers['X-Transaction-ID'] = createTransactionId();
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
