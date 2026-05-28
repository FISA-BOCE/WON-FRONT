import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'won.accessToken';
const REFRESH_TOKEN_KEY = 'won.refreshToken';
const EXPIRES_IN_KEY = 'won.expiresIn';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

const memoryStorage = new Map<string, string>();

function canUseWebStorage() {
  return Platform.OS === 'web' && typeof globalThis.localStorage !== 'undefined';
}

async function setItem(key: string, value: string) {
  if (canUseWebStorage()) {
    globalThis.localStorage.setItem(key, value);
    return;
  }

  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    memoryStorage.set(key, value);
  }
}

async function getItem(key: string) {
  if (canUseWebStorage()) {
    return globalThis.localStorage.getItem(key);
  }

  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return memoryStorage.get(key) ?? null;
  }
}

async function deleteItem(key: string) {
  if (canUseWebStorage()) {
    globalThis.localStorage.removeItem(key);
    return;
  }

  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    memoryStorage.delete(key);
  }
}

export async function saveAuthTokens(tokens: AuthTokens) {
  await Promise.all([
    setItem(ACCESS_TOKEN_KEY, tokens.accessToken),
    setItem(REFRESH_TOKEN_KEY, tokens.refreshToken),
    setItem(EXPIRES_IN_KEY, String(tokens.expiresIn ?? '')),
  ]);
}

export async function getAuthTokens(): Promise<AuthTokens | null> {
  const [accessToken, refreshToken, expiresIn] = await Promise.all([
    getItem(ACCESS_TOKEN_KEY),
    getItem(REFRESH_TOKEN_KEY),
    getItem(EXPIRES_IN_KEY),
  ]);

  if (!accessToken || !refreshToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    expiresIn: expiresIn ? Number(expiresIn) : undefined,
  };
}

export async function getRefreshToken() {
  return getItem(REFRESH_TOKEN_KEY);
}

export async function clearAuthTokens() {
  await Promise.all([
    deleteItem(ACCESS_TOKEN_KEY),
    deleteItem(REFRESH_TOKEN_KEY),
    deleteItem(EXPIRES_IN_KEY),
  ]);
}
