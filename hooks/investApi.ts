import axios from 'axios';

import { ApiResponse, getApiBaseUrl } from '@/hooks/apiClient';
import { getAuthTokens } from '@/hooks/authStorage';

export interface InvestEtfSummary {
  etfId: number;
  ticker: string;
  etfName: string;
  description: string;
  market: string;
  currency: 'USD' | 'KRW' | 'CAD' | 'EUR';
  riskGrade: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' | 'UNKNOWN';
  isTradeAvailable: boolean;
  isFractionalAvailable: boolean;
  isAutoInvestAvailable: boolean;
  displayOrder: number;
  lastSyncedAt: string;
}

interface InvestEtfProductListResponse {
  etfs: InvestEtfSummary[];
}

export interface InvestMainAccount {
  investAccountUuid: string;
  accountNoDisplay: string;
  accountStatus: string;
}

export interface InvestMainCashBalance {
  krwAmount: number;
  krwStatus: string;
  usdAmount: number;
  usdKrwAmount: number;
}

export interface InvestMainRecentPayment {
  etfName: string;
  ticker: string;
  holdingQuantity: number;
  evaluationAmount: number;
}

export interface InvestAutoInvestExecutionHistoryItem {
  sweepExecutionId: number;
  orderId: number;
  etfId: number;
  etfName: string;
  ticker: string;
  executionStatus: string;
  requestedKrwAmount: number;
  orderedQuantity: number;
  executedQuantity: number;
  averageExecutionPrice: number;
  executedAmount: number;
  requestedAt: string;
  executedAt: string;
  failureCode?: string;
  failureMessage?: string;
}

export interface InvestAutoInvestExecutionHistoryResult {
  baseDateTime: string;
  histories: InvestAutoInvestExecutionHistoryItem[];
  nextCursor?: string;
  hasNext: boolean;
}

export interface InvestMainResult {
  totalEvaluationAmount: number;
  profitLossAmount: number;
  profitLossRate: number;
  account: InvestMainAccount;
  cashBalance: InvestMainCashBalance;
  recentPayments: InvestMainRecentPayment[];
}

export interface CreateInvestAccountPayload {
  phoneNumber: string;
  customerName: string;
  accountPassword: string;
  accountPasswordConfirm: string;
  email: string;
  agreedTerms: string[];
}

export interface CreateInvestAccountResult {
  investAccountUuid: string;
  accountNoDisplay: string;
  accountStatus: string;
  investConnectedStatus: string;
  openedAt: string;
}

export interface LinkInvestAccountPayload {
  investAccountUuid: string;
}

export interface LinkInvestAccountResult {
  investAccountUuid: string;
  accountNoDisplay: string;
  accountStatus: string;
  investConnectedStatus: boolean;
  linkedAt: string;
}

const investApiClient = axios.create({
  baseURL: getApiBaseUrl(8083),
  headers: {
    'Content-Type': 'application/json',
  },
});

investApiClient.interceptors.request.use(async (config) => {
  const tokens = await getAuthTokens();

  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  if (!config.headers['X-Transaction-ID']) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).slice(2, 10);
    config.headers['X-Transaction-ID'] = `txn-${timestamp}-${random}`;
  }

  return config;
});

export async function getInvestEtfs() {
  const response = await investApiClient.get<ApiResponse<InvestEtfProductListResponse>>(
    '/api/invest/etfs',
  );

  return response.data.data.etfs;
}

export async function getInvestMain() {
  const response = await investApiClient.get<ApiResponse<InvestMainResult>>('/api/invest/main');

  return response.data.data;
}

export async function getAutoInvestExecutionHistories(accountUuid: string) {
  const response = await investApiClient.get<ApiResponse<InvestAutoInvestExecutionHistoryResult>>(
    `/api/invest/accounts/${accountUuid}/auto-invest/executions`,
  );

  return response.data.data;
}

export async function createInvestAccount(payload: CreateInvestAccountPayload) {
  const response = await investApiClient.post<
    ApiResponse<CreateInvestAccountResult>,
    { data: ApiResponse<CreateInvestAccountResult> },
    CreateInvestAccountPayload
  >('/api/invest/accounts/new', payload);

  return response.data.data;
}

export async function linkInvestAccount(payload: LinkInvestAccountPayload) {
  const response = await investApiClient.post<
    ApiResponse<LinkInvestAccountResult>,
    { data: ApiResponse<LinkInvestAccountResult> },
    LinkInvestAccountPayload
  >('/api/invest/accounts/link', payload);

  return response.data.data;
}
