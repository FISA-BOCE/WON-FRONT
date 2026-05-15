import { TopBar } from '@/components/auth/TopBar';
import { AuthColors, AuthSpacing, AuthTypography } from '@/constants/authColors';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useRef } from 'react';
import {
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
};

type QuickQuestion = {
  title: string;
  subtitle: string;
  prompt: string;
  reply: string;
};

const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    title: '이번 달 소비 어디에 많이 썼어?',
    subtitle: '소비 패턴 요약',
    prompt: '이번 달 소비 어디에 많이 썼어?',
    reply:
      '5월 카드 결제 기준으로 업종별 소비 비중을 보여드릴게요.\n\nAPI가 연결되면 실제 소비 데이터로 바뀝니다.',
  },
  {
    title: '이번 달 리워드 받을 수 있을까?',
    subtitle: '실적 등급 안내',
    prompt: '이번 달 리워드 받을 수 있을까?',
    reply: '이번 달 리워드는 12,450원이에요.\n\n추후 API 연동 후 실제 산정 금액을 보여드릴게요.',
  },
  {
    title: '내 ETF 얼마나 쌓였어?',
    subtitle: 'ETF 적립 현황',
    prompt: '내 ETF 얼마나 쌓였어?',
    reply:
      '올해 누적 0.1721주의 VOO를 쌓으셨어요.\n\n체결·예정 내역도 API 연동 후 불러올 수 있습니다.',
  },
  {
    title: '내 소비가 어떤 ETF로 이어졌어?',
    subtitle: '소비-투자 관계',
    prompt: '내 소비가 어떤 ETF로 이어졌어?',
    reply: '5월 카페 결제를 VOO 기준으로 환산하면 약 0.1535주예요.\n\n실제 데이터는 추후 API로 연결할 예정입니다.',
  },
];

function ChatBubble({
  role,
  children,
}: {
  role: 'user' | 'assistant';
  children: React.ReactNode;
}) {
  const isUser = role === 'user';

  return (
    <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
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

export default function ChatbotScreen() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [draft, setDraft] = React.useState('');
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    React.useCallback(() => {
      setMessages([]);
      setDraft('');
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const sendMessage = React.useCallback((text: string, reply?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const nextMessages: ChatMessage[] = [
      {
        id: `${Date.now()}-user`,
        role: 'user',
        text: trimmed,
      },
    ];

    if (reply) {
      nextMessages.push({
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        text: reply,
      });
    }

    setMessages((prev) => [...prev, ...nextMessages]);
    setDraft('');
  }, []);

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
                    <Text style={styles.welcomeTitle}>안녕하세요, 김우리님 👋</Text>
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
                    onPress={() => sendMessage(item.prompt, item.reply)}
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
                <ChatBubble key={message.id} role={message.role}>
                  <Text style={message.role === 'user' ? styles.userText : styles.assistantText}>
                    {message.text}
                  </Text>
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
              onSubmitEditing={() => sendMessage(draft)}
            />
            <Pressable style={styles.sendButton} onPress={() => sendMessage(draft)}>
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
    marginTop: 8,
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
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.textBlack,
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
});
