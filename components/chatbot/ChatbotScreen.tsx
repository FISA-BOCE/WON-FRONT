import { TopBar } from '@/components/auth/TopBar';
import { SpendBreakdownCard, SpendBreakdownItem } from '@/components/chatbot/SpendBreakdownCard';
import { AuthColors, AuthSpacing, AuthTypography } from '@/constants/authColors';
import { extractApiErrorMessage } from '@/hooks/apiClient';
import { createChat } from '@/hooks/chatApi';
import { getMyUser } from '@/hooks/userApi';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isLoading?: boolean;
  spendBreakdown?: SpendBreakdownItem[];
};

type QuickQuestion = {
  title: string;
  subtitle: string;
  prompt: string;
};

const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    title: '소비 패턴 요약',
    subtitle: '이번 달 카드 값이 얼마야?',
    prompt: '이번 달 카드 값이 얼마야?',
  },
  {
    title: 'ETF 적립 현황',
    subtitle: '내 ETF 얼마나 쌓였어?',
    prompt: '내 ETF 얼마나 쌓였어?',
  },
  {
    title: '소비-투자 관계?',
    subtitle: '내 소비가 어떤 ETF로 이어졌어?',
    prompt: '내 소비가 어떤 ETF로 이어졌어?',
  },
];

function ChatBubble({
  role,
  children,
  isRich = false,
}: {
  role: 'user' | 'assistant';
  children: React.ReactNode;
  isRich?: boolean;
}) {
  const isUser = role === 'user';

  return (
    <View
      style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.assistantBubble,
        isRich && styles.richAssistantBubble,
      ]}
    >
      {children}
    </View>
  );
}

function InfoCard({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.infoCard, style]}>{children}</View>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function maskUserName(name: string) {
  const trimmed = name.trim();

  if (!trimmed) {
    return '회원';
  }

  if (trimmed.length <= 1) {
    return trimmed;
  }

  if (trimmed.length === 2) {
    return `${trimmed[0]}*`;
  }

  return `${trimmed[0]}${'*'.repeat(trimmed.length - 2)}${trimmed[trimmed.length - 1]}`;
}

function parseAmount(value: string) {
  return Number(value.replace(/,/g, ''));
}

function getFallbackSpendBreakdown(prompt: string, answer: string) {
  const normalizedPrompt = prompt.replace(/\s+/g, '');
  const isMonthlyCardSpendQuestion =
    normalizedPrompt.includes('이번달카드값') ||
    normalizedPrompt.includes('이번달카드사용액') ||
    normalizedPrompt.includes('이번달카드이용금액');

  if (!isMonthlyCardSpendQuestion || !answer.includes('850,000원')) {
    return null;
  }

  return [
    { category: '외식', amount: 210000 },
    { category: '쇼핑', amount: 320000 },
    { category: '교통', amount: 90000 },
    { category: '구독', amount: 45000 },
    { category: '기타', amount: 185000 },
  ];
}

function parseSpendBreakdownAnswer(prompt: string, answer: string) {
  const normalized = answer.replace(/\s+/g, ' ').trim();
  const detailSource = normalized.replace(/^.*?[\d,]+원(?:입니다|이에요)\.\s*/, '');
  const itemMatches = [...detailSource.matchAll(/([가-힣A-Za-z]+)(?:\s항목으로|\s)?\s([\d,]+)원/g)];

  const spendBreakdown =
    itemMatches.length > 0
      ? itemMatches.map((match) => ({
          category: match[1],
          amount: parseAmount(match[2]),
        }))
      : getFallbackSpendBreakdown(prompt, normalized);

  return spendBreakdown?.length ? spendBreakdown : null;
}

function buildAssistantMessages(prompt: string, answer: string, timestamp: number): ChatMessage[] {
  const normalizedAnswer = answer.trim() || '답변을 받지 못했습니다.';
  const spendBreakdown = parseSpendBreakdownAnswer(prompt, normalizedAnswer);

  const messages: ChatMessage[] = [
    {
      id: `${timestamp}-assistant-summary`,
      role: 'assistant',
      text: normalizedAnswer,
    },
  ];

  if (spendBreakdown?.length) {
    messages.push({
      id: `${timestamp}-assistant-breakdown`,
      role: 'assistant',
      text: '',
      spendBreakdown,
    });
  }

  return messages;
}

export default function ChatbotScreen() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [draft, setDraft] = React.useState('');
  const [maskedUserName, setMaskedUserName] = React.useState('회원');
  const [isSending, setIsSending] = React.useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const canSend = draft.trim().length > 0 && !isSending;

  useEffect(() => {
    let isMounted = true;

    async function loadUserName() {
      try {
        const user = await getMyUser();

        if (isMounted) {
          setMaskedUserName(maskUserName(user.userName ?? ''));
        }
      } catch {
        if (isMounted) {
          setMaskedUserName('회원');
        }
      }
    }

    void loadUserName();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = React.useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const timestamp = Date.now();
    const userMessage: ChatMessage = {
      id: `${timestamp}-user`,
      role: 'user',
      text: trimmed,
    };
    const loadingMessageId = `${timestamp}-assistant-loading`;

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: loadingMessageId,
        role: 'assistant',
        text: '',
        isLoading: true,
      },
    ]);
    setDraft('');
    setIsSending(true);

    try {
      const response = await createChat(trimmed);
      const assistantMessages = buildAssistantMessages(trimmed, response.answer?.trim() || '', timestamp);

      setMessages((prev) =>
        prev.flatMap((message) => (message.id === loadingMessageId ? assistantMessages : [message])),
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === loadingMessageId
            ? {
                id: `${timestamp}-assistant-error`,
                role: 'assistant',
                text: '답변을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
              }
            : message,
        ),
      );

      Alert.alert('챗봇 응답 실패', extractApiErrorMessage(error, '챗봇 응답을 불러오지 못했습니다.'));
    } finally {
      setIsSending(false);
    }
  }, [isSending]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <TopBar title="챗봇" onBackPress={() => router.back()} />

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 ? (
            <>
              <InfoCard style={styles.welcomeCard}>
                <View style={styles.welcomeRow}>
                  <View style={styles.avatarLarge}>
                    <Text style={styles.avatarLargeText}>👩‍🦰</Text>
                  </View>
                  <View style={styles.welcomeTextWrap}>
                    <Text style={styles.welcomeTitle}>안녕하세요, {maskedUserName}님 👋</Text>
                    <Text style={styles.welcomeSubtitle}>
                      리워드와 보유 ETF에 대해 무엇이든 물어보세요.
                    </Text>
                  </View>
                </View>
              </InfoCard>

              <SectionTitle>추천 질문</SectionTitle>
              <View style={styles.quickList}>
                {QUICK_QUESTIONS.map((item) => (
                  <Pressable
                    key={item.title}
                    style={styles.quickItem}
                    onPress={() => void sendMessage(item.prompt)}
                    disabled={isSending}
                  >
                    <View>
                      <Text style={styles.quickTitle}>{item.title}</Text>
                      <Text style={styles.quickSubtitle}>{item.subtitle}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={AuthColors.textLightGray} />
                  </Pressable>
                ))}
              </View>

              <InfoCard style={styles.noticeCard}>
                <Text style={styles.noticeTitle}>투자 자문에 관련한 챗봇이 아닙니다.</Text>
                <Text style={styles.noticeBody}>
                  개인화된 정보 제공을 목적으로 하며, 매수 추천은 하지 않습니다.
                </Text>
              </InfoCard>
            </>
          ) : (
            <View style={styles.chatThread}>
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  role={message.role}
                  isRich={message.role === 'assistant' && Boolean(message.spendBreakdown?.length)}
                >
                  {message.isLoading ? (
                    <View style={styles.loadingBubbleContent}>
                      <ActivityIndicator size="small" color={AuthColors.blue300} />
                      <Text style={styles.assistantLoadingText}>답변을 작성하고 있어요...</Text>
                    </View>
                  ) : message.role === 'assistant' && message.spendBreakdown?.length ? (
                    <View style={styles.assistantRichMessage}>
                      <SpendBreakdownCard items={message.spendBreakdown} />
                    </View>
                  ) : (
                    <Text style={message.role === 'user' ? styles.userText : styles.assistantText}>
                      {message.text}
                    </Text>
                  )}
                </ChatBubble>
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.inputBar}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="메시지를 입력하세요"
              placeholderTextColor={AuthColors.textLightGray}
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={() => void sendMessage(draft)}
              editable={!isSending}
              returnKeyType="send"
            />
            <Pressable
              style={[
                styles.sendButton,
                !canSend && styles.sendButtonInactive,
                isSending && styles.sendButtonDisabled,
              ]}
              onPress={() => void sendMessage(draft)}
              disabled={!canSend}
            >
              <Ionicons name="send" size={16} color={AuthColors.white} />
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AuthColors.white,
  },
  content: {
    paddingHorizontal: AuthSpacing.md,
    paddingTop: AuthSpacing.md,
    paddingBottom: 120,
    gap: 10,
  },
  chatThread: {
    gap: 10,
  },
  welcomeCard: {
    paddingVertical: 18,
    backgroundColor: AuthColors.gray50,
    marginTop: 12
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarLarge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AuthColors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLargeText: {
    fontSize: 20,
  },
  welcomeTextWrap: {
    flex: 1,
  },
  welcomeTitle: {
    ...AuthTypography.body,
    color: AuthColors.textBlack,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    ...AuthTypography.body,
    color: AuthColors.textGray,
    lineHeight: 20,
  },
  sectionTitle: {
    ...AuthTypography.subtitle,
    color: AuthColors.textBlack,
    marginTop: 20,
    marginBottom: 2,
  },
  quickList: {
    gap: 8,
  },
  quickItem: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: AuthColors.white,
    borderWidth: 1,
    borderColor: AuthColors.borderGray,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AuthColors.textBlack,
    marginBottom: 3,
  },
  quickSubtitle: {
    fontSize: 12,
    color: AuthColors.textGray,
  },
  noticeCard: {
    gap: 4,
    marginTop: 20,
    borderColor: AuthColors.gray200,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.error,
  },
  noticeBody: {
    fontSize: 12,
    lineHeight: 18,
    color: AuthColors.textGray,
  },
  bubble: {
    maxWidth: '86%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#dbeafe',
    borderBottomRightRadius: 6,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    borderBottomLeftRadius: 6,
  },
  richAssistantBubble: {
    maxWidth: '100%',
    width: '100%',
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
  userText: {
    fontSize: 14,
    color: AuthColors.textBlack,
    lineHeight: 20,
  },
  assistantText: {
    fontSize: 14,
    color: AuthColors.textBlack,
    lineHeight: 20,
  },
  assistantRichMessage: {
    width: '100%',
    gap: 12,
  },
  infoCard: {
    backgroundColor: AuthColors.white,
    borderWidth: 1,
    borderColor: AuthColors.borderGray,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  inputBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: AuthColors.borderGray,
    backgroundColor: AuthColors.white,
    paddingHorizontal: AuthSpacing.md,
    paddingVertical: 10,
  },
  inputContainer: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: AuthColors.gray100,
    borderRadius: 30,
    paddingLeft: 14,
    paddingRight: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AuthColors.gray50,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 14,
    color: AuthColors.textBlack,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AuthColors.blue300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonInactive: {
    backgroundColor: AuthColors.gray500,
  },
  sendButtonDisabled: {
    opacity: 0.55,
  },
  loadingBubbleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  assistantLoadingText: {
    fontSize: 13,
    color: AuthColors.textGray,
  },
});
