import { useSyncExternalStore } from 'react';

import { CreateInvestAccountResult, LinkInvestAccountResult } from '@/hooks/investApi';

interface InvestAccountFlowState {
  createResult: CreateInvestAccountResult | null;
  linkResult: LinkInvestAccountResult | null;
}

const initialState: InvestAccountFlowState = {
  createResult: null,
  linkResult: null,
};

let state: InvestAccountFlowState = initialState;

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
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

export function resetInvestAccountFlow() {
  state = initialState;
  emitChange();
}

export function setInvestAccountFlowResult(
  createResult: CreateInvestAccountResult,
  linkResult: LinkInvestAccountResult,
) {
  state = {
    createResult,
    linkResult,
  };
  emitChange();
}

export function useInvestAccountFlow() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
