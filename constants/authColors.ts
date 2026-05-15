export const AuthColors = {
  // 주요 색상
  blue500: '#283ECC',
  blue400: '#2667FF',
  blue300: '#3F8EFC', // 메인 컬러
  blue200: '#87BFFF',
  blue100: '#C3E5FF',

  gray50: '#F8F7F7',
  gray100: '#EEEDED',
  gray200: '#E1E0E0',
  gray300: '#CECDCD',
  gray400: '#A9A8A8',
  gray500: '#888787',
  gray600: '#616060',
  gray700: '#4E4D4D',
  gray800: '#302F2F',
  gray900: '#100F0F',
  
  // 텍스트 색상
  textBlack: '#111827',
  textDarkGray: '#302f2f',
  textGray: '#374151',
  textLightGray: '#9ca3af',
  textLinkBlue: '#3f8efc',
  
  // 배경 색상
  white: '#ffffff',
  lightBg: '#f8f7f7',
  
  // 테두리 색색
  borderGray: '#eeeded',
  borderDarkGray: '#d1d5db',
  
  // 상태
  error: '#FF674D',
  success: '#72B01D',
  notice: '#FFE066'
};

export const AuthSpacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  default: 40
} as const;

export const AuthTypography = {
  heading1: {
    fontSize: 22,
    fontWeight: '500',
    lineHeight: 26,
    fontFamily: 'Pretendard-Bold',
  },
  heading2: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    fontFamily: 'Pretendard-SemiBold',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    fontFamily: 'Pretendard-SemiBold',
  },
  body: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
    fontFamily: 'Pretendard-Medium',
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 16,
    fontFamily: 'Pretendard-Regular',
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 14,
    fontFamily: 'Pretendard-Regular',
  },
} as const;
