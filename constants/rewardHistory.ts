export type RewardFilter = '전체' | '적립' | '미적용';

export type RewardHistoryItem = {
  id: string;
  date: string;
  amount: string;
  ticker: string;
  status: Exclude<RewardFilter, '전체'>;
  summaryTitle: string;
  summaryLabel: string;
  summaryAmount: string;
  summaryBadge: string;
  detailRows: Array<{ label: string; value: string; highlight?: boolean }>;
  reasonTitle: string;
  reasonLines: string[];
  extraReasonLines?: string[];
};

export const REWARD_FILTERS: RewardFilter[] = ['전체', '적립', '미적용'];

export const REWARD_HISTORY: RewardHistoryItem[] = [
  {
    id: '2026-05-earned',
    date: '2026년 05월',
    amount: '12,450원',
    ticker: 'QQQ',
    status: '적립',
    summaryTitle: '2026년 4월 실적',
    summaryLabel: '전월 실적 합계',
    summaryAmount: '820,000원',
    summaryBadge: '기준 충족',
    detailRows: [
      { label: '총 청구 금액', value: '820,000원' },
      { label: '적립 리워드', value: '8,200원' },
    ],
    reasonTitle: '이 사유가 무엇인가요?',
    reasonLines: ['전월 카드 이용 실적이 50만원 이상이어야', '자동투자 리워드가 적립됩니다.'],
    extraReasonLines: ['실적 인정 기준', '청구 취소·환불·제외 업종을 제외한 결제액'],
  },
  {
    id: '2026-04-not-met',
    date: '2026년 04월',
    amount: '0원',
    ticker: 'QQQ',
    status: '미적용',
    summaryTitle: '2026년 4월 실적',
    summaryLabel: '리워드 금액',
    summaryAmount: '20,000원',
    summaryBadge: '미적용',
    detailRows: [
      { label: '미적용 사유', value: '전월 실적 미충족' },
      { label: '전월 실적', value: '380,000원' },
      { label: '기준', value: '500,000원' },
      { label: '부족 금액', value: '120,000원', highlight: true },
    ],
    reasonTitle: '다른 미적용 사유',
    reasonLines: ['출금 실패 — 결제대금 출금이 정상 처리되지 않은 경우', '환전 실패 — 환전 가능 시간 외 또는 환전 한도 초과'],
  },
];
