import { useSyncExternalStore } from 'react';

export interface CardApplicationApplicantInfoDraft {
  koreanName: string;
  englishName: string;
  birthDate: string;
  gender: string;
  nationality: string;
  phoneNumber: string;
  email: string;
  address: string;
  job: string;
}

export interface CardApplicationTermsDraft {
  requiredTerms: boolean;
  isMarketingEmailAgree: boolean;
  isMarketingSmsAgree: boolean;
}

export interface CardApplicationAccountDraft {
  investAccountUuid: string;
  accountNoDisplay: string;
  isLinked?: boolean;
}

export interface CardApplicationEtfDraft {
  etfId: number;
  ticker: string;
  etfName: string;
  description?: string;
  market?: string;
  riskGrade?: string;
}

export interface CardApplicationResultDraft {
  cardUuid: string;
  cardNoDisplay: string;
  issuedAt: string;
  cardStatus: string;
  autoInvestEtfName: string;
}

interface CardApplicationDraftState {
  applicantInfo: CardApplicationApplicantInfoDraft;
  terms: CardApplicationTermsDraft;
  selectedAccount: CardApplicationAccountDraft | null;
  selectedEtf: CardApplicationEtfDraft | null;
  result: CardApplicationResultDraft | null;
}

const initialApplicantInfo: CardApplicationApplicantInfoDraft = {
  koreanName: '',
  englishName: '',
  birthDate: '',
  gender: '',
  nationality: '',
  phoneNumber: '',
  email: '',
  address: '',
  job: '',
};

const initialTerms: CardApplicationTermsDraft = {
  requiredTerms: false,
  isMarketingEmailAgree: false,
  isMarketingSmsAgree: false,
};

const initialState: CardApplicationDraftState = {
  applicantInfo: initialApplicantInfo,
  terms: initialTerms,
  selectedAccount: null,
  selectedEtf: null,
  result: null,
};

let state: CardApplicationDraftState = initialState;

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setState(nextState: CardApplicationDraftState) {
  state = nextState;
  emitChange();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

function isInitialApplicantInfo(applicantInfo: CardApplicationApplicantInfoDraft) {
  return Object.values(applicantInfo).every((value) => value === '');
}

function isInitialTerms(terms: CardApplicationTermsDraft) {
  return !terms.requiredTerms && !terms.isMarketingEmailAgree && !terms.isMarketingSmsAgree;
}

export function resetCardApplicationDraft() {
  setState({
    applicantInfo: { ...initialApplicantInfo },
    terms: { ...initialTerms },
    selectedAccount: null,
    selectedEtf: null,
    result: null,
  });
}

export function hasPendingCardApplicationDraft() {
  return (
    !state.result &&
    (!isInitialApplicantInfo(state.applicantInfo) ||
      !isInitialTerms(state.terms) ||
      state.selectedAccount !== null ||
      state.selectedEtf !== null)
  );
}

export function setCardApplicationApplicantInfo(
  applicantInfo: CardApplicationApplicantInfoDraft,
) {
  setState({
    ...state,
    applicantInfo,
  });
}

export function setCardApplicationTerms(terms: CardApplicationTermsDraft) {
  setState({
    ...state,
    terms,
  });
}

export function setCardApplicationSelectedAccount(
  selectedAccount: CardApplicationAccountDraft | null,
) {
  setState({
    ...state,
    selectedAccount,
  });
}

export function setCardApplicationSelectedEtf(selectedEtf: CardApplicationEtfDraft | null) {
  setState({
    ...state,
    selectedEtf,
  });
}

export function setCardApplicationResult(result: CardApplicationResultDraft | null) {
  setState({
    ...state,
    result,
  });
}

export function useCardApplicationDraft() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
