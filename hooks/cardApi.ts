import axios from 'axios';

import { ApiResponse, apiClient } from '@/hooks/apiClient';

export interface CardApplicationInvestAccount {
  investAccountUuid: string;
  accountNoDisplay: string;
  isLinked: boolean;
}

export interface CardInfo {
  cardUuid: string;
  cardName: string;
  cardNoDisplay: string;
}

export interface CardAutoInvestEtf {
  etfId: number;
  etfName: string;
  ticker: string;
  effectiveFrom: string;
}

export interface CardAutoInvestInfo {
  cardUuid: string;
  currentEtf: CardAutoInvestEtf | null;
  pendingEtf: CardAutoInvestEtf | null;
  isAutoInvestEnabled: boolean;
}

export interface CardAutoInvestChangeResult {
  cardUuid: string;
  previousEtf: {
    etfName: string;
    ticker: string;
    effectiveTo: string;
  } | null;
  newEtf: {
    etfId: number;
    etfName: string;
    ticker: string;
    effectiveFrom: string;
  } | null;
}

export interface CardApplicationApplicantInfo {
  nameKo: string;
  nameEn: string;
  birthDate: string;
  gender: string;
  nationality: string;
  phoneNumber: string;
  email: string;
  address: string;
  job: string;
}

export interface CardApplicationCreatePayload {
  applicantInfo: CardApplicationApplicantInfo;
  investAccountUuid: string;
  etfId: number;
  ticker: string;
  requiredTerms: boolean;
  optionalTerms?: {
    isMarketingEmailAgree?: boolean;
    isMarketingSmsAgree?: boolean;
  };
}

export interface CardApplicationCreateResult {
  cardUuid: string;
  cardNoDisplay: string;
  issuedAt: string;
  cardStatus: string;
  autoInvestEtfName: string;
}

export interface RewardLedgerItem {
  pointLedgerId: number;
  baseMonth: string;
  pointAmount: number;
  type: string;
  sweepStatus: string;
  sweepFailureCode?: string;
  sweepFailureMessage?: string;
  occurredAt: string;
}

interface CardApplicationInvestAccountsResponse {
  accounts: CardApplicationInvestAccount[];
}

interface CardInfoResponse {
  cards: CardInfo[];
}

export interface RewardLedgerResponse {
  baseYear: number;
  totalAccumulatedAmount: number;
  ledgers: RewardLedgerItem[];
}

export async function getCardApplicationInvestAccounts() {
  try {
    const response = await apiClient.get<ApiResponse<CardApplicationInvestAccountsResponse>>(
      '/api/cards/applications/invest-accounts',
    );

    return response.data.data.accounts;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const code = (error.response?.data as { code?: string } | undefined)?.code;

      // The backend returns 404 when the user has no linked invest accounts.
      if (status === 404 && code === 'COM_404_001') {
        return [];
      }
    }

    throw error;
  }
}

export async function getCardInfo() {
  const response = await apiClient.get<ApiResponse<CardInfoResponse>>('/api/cards/info');

  return response.data.data.cards;
}

export async function getCardAutoInvest(cardUuid: string) {
  const response = await apiClient.get<ApiResponse<CardAutoInvestInfo>>(
    `/api/cards/${cardUuid}/auto-invest`,
  );

  return response.data.data;
}

export async function changeCardAutoInvest(cardUuid: string, etfId: number) {
  const response = await apiClient.patch<
    ApiResponse<CardAutoInvestChangeResult>,
    { data: ApiResponse<CardAutoInvestChangeResult> },
    { etfId: number }
  >(`/api/cards/${cardUuid}/auto-invest`, { etfId });

  return response.data.data;
}

export async function getRewardLedgers(type?: string) {
  const response = await apiClient.get<ApiResponse<RewardLedgerResponse>>(
    '/api/cards/rewards/ledger',
    {
      params: type ? { type } : undefined,
    },
  );

  return response.data.data.ledgers;
}

export async function getRewardLedgerOverview(type?: string) {
  const response = await apiClient.get<ApiResponse<RewardLedgerResponse>>(
    '/api/cards/rewards/ledger',
    {
      params: type ? { type } : undefined,
    },
  );

  return response.data.data;
}

export async function applyCard(payload: CardApplicationCreatePayload) {
  const response = await apiClient.post<
    ApiResponse<CardApplicationCreateResult>,
    { data: ApiResponse<CardApplicationCreateResult> },
    CardApplicationCreatePayload
  >('/api/cards/applications', payload);

  return response.data.data;
}
