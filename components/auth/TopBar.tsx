import { AuthColors, AuthSpacing } from '@/constants/authColors';
import { extractApiErrorMessage } from '@/hooks/apiClient';
import { logout } from '@/hooks/authApi';
import { getMyUser } from '@/hooks/userApi';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface TopBarProps {
  title: string;
  onBackPress?: () => void;
  showBack?: boolean;
  onRightPress?: () => void;
  showRightMenu?: boolean;
}

export function TopBar({
  title,
  onBackPress,
  showBack = true,
  onRightPress,
  showRightMenu = true,
}: TopBarProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'card' | 'securities' | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userName, setUserName] = useState('회원');
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!modalVisible) {
      return;
    }

    let isMounted = true;

    async function loadUserName() {
      try {
        const user = await getMyUser();

        if (isMounted && user.userName?.trim()) {
          setUserName(user.userName.trim());
        }
      } catch {
        if (isMounted) {
          setUserName((prev) => prev || '회원');
        }
      }
    }

    void loadUserName();

    return () => {
      isMounted = false;
    };
  }, [modalVisible]);

  const openMenu = () => {
    setModalVisible(true);
    Animated.timing(anim, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleRight = () => {
    if (onRightPress) return onRightPress();
    if (modalVisible) closeMenu();
    else openMenu();
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      closeMenu();
      router.replace('/login');
    } catch (error) {
      Alert.alert('로그아웃 실패', extractApiErrorMessage(error, '로그아웃 중 문제가 발생했습니다.'));
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      {showBack ? (
        <Pressable onPress={onBackPress} style={styles.backButton}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={AuthColors.gray800}
          />
        </Pressable>
      ) : (
        <View style={styles.backButton} />
      )}
      <Text style={styles.title}>{title}</Text>
      {showRightMenu ? (
        <Pressable onPress={handleRight} style={styles.backButton}>
          <Ionicons name="menu" size={24} color={AuthColors.gray800} />
        </Pressable>
      ) : (
        <View style={styles.backButton} />
      )}

      <Modal visible={modalVisible} transparent animationType="none" onRequestClose={closeMenu}>
        <Pressable style={styles.menuBackdrop} onPress={closeMenu} />

        <Animated.View
          style={[
            styles.menuPanel,
            {
              transform: [
                {
                  translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [320, 0] }),
                },
              ],
              opacity: anim,
            },
          ]}
        >
          <View style={styles.menuInner}>
            <Pressable style={styles.closeIconWrap} onPress={closeMenu}>
                <Ionicons name="close" size={24} color={AuthColors.gray600} />
            </Pressable>
            <View style={styles.headerDark}>
              <View style={styles.headerRow}>
                <View style={styles.userWrap}>
                  <Text style={styles.userName}>{userName}님, 안녕하세요!</Text>
                </View>
                <Pressable 
                  style={styles.settingsWrap} 
                  onPress={() => { closeMenu(); router.push('/profile'); }}
                >
                  <Ionicons name="settings" size={18} color={AuthColors.gray500} />
                </Pressable>
              </View>
            </View>

            <Animated.ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.menuList}>
              <Pressable 
                style={styles.sectionHeader}
                onPress={() => setExpandedSection(expandedSection === 'card' ? null : 'card')}
              >
                <Text style={[
                  styles.sectionTitle,
                  expandedSection === 'card' && styles.sectionTitleActive
                ]}>카드</Text>
                <Ionicons 
                  name={expandedSection === 'card' ? 'chevron-up' : 'chevron-down'} 
                  size={18} 
                  color={expandedSection === 'card' ? AuthColors.blue300 : AuthColors.textGray}
                />
              </Pressable>

              {expandedSection === 'card' && (
                <>
                  <Pressable 
                    style={styles.menuRow} 
                    onPress={() => { closeMenu(); router.push('/card'); }}
                  >
                    <Text style={styles.menuRowText}>결제 내역</Text>
                  </Pressable>
                  <Pressable 
                    style={styles.menuRow} 
                    onPress={() => { closeMenu(); router.push('/card-create'); }}
                  >
                    <Text style={styles.menuRowText}>혜택</Text>
                  </Pressable>
                  <Pressable 
                    style={styles.menuRow} 
                    onPress={() => { closeMenu(); router.push('/card-reward'); }}
                  >
                    <Text style={styles.menuRowText}>리워드</Text>
                  </Pressable>
                </>
              )}

              <View style={styles.rowDivider} />

              <Pressable 
                style={styles.sectionHeader}
                onPress={() => setExpandedSection(expandedSection === 'securities' ? null : 'securities')}
              >
                <Text style={[
                  styles.sectionTitle,
                  expandedSection === 'securities' && styles.sectionTitleActive
                ]}>증권</Text>
                <Ionicons 
                  name={expandedSection === 'securities' ? 'chevron-up' : 'chevron-down'} 
                  size={18} 
                  color={expandedSection === 'securities' ? AuthColors.blue300 : AuthColors.textGray}
                />
              </Pressable>

              {expandedSection === 'securities' && (
                <>
                  <Pressable 
                    style={styles.menuRow} 
                    onPress={() => { closeMenu(); router.push('/invest'); }}
                  >
                    <Text style={styles.menuRowText}>계좌</Text>
                  </Pressable>
                  <Pressable 
                    style={styles.menuRow} 
                    onPress={() => { closeMenu(); router.push('/invest'); }}
                  >
                    <Text style={styles.menuRowText}>ETF 자동 체결 내역</Text>
                  </Pressable>
                </>
              )}
            </Animated.ScrollView>

            <View style={styles.menuFooter}>
              <Pressable
                style={({ pressed }) => [
                  styles.logoutButton,
                  pressed && styles.logoutButtonPressed,
                  isLoggingOut && styles.logoutButtonDisabled,
                ]}
                onPress={handleLogout}
                disabled={isLoggingOut}
              >
                <Text style={styles.logoutButtonText}>
                  {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: AuthSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AuthColors.borderDarkGray,
    backgroundColor: AuthColors.white,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.textBlack,
    flex: 1,
    textAlign: 'center',
  },
  menuBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 9999,
    elevation: 30,
  },
  menuPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 320,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 10000,
    elevation: 30,
  },
  menuInner: {
    flex: 1,
    backgroundColor: AuthColors.white,
    shadowOpacity: 0.08,
    shadowOffset: { width: -4, height: 0 },
    shadowRadius: 8,
    overflow: 'hidden',
  },
  headerDark: {
    marginTop: 108,
    backgroundColor: AuthColors.white,
    paddingTop: AuthSpacing.lg,
    paddingHorizontal: AuthSpacing.md,
    paddingBottom: AuthSpacing.sm,
    borderColor: AuthColors.gray200,
    borderWidth: 1,
  },
  closeIconWrap: {
    position: 'fixed',
    left: 269,
    top: 90,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsWrap: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userWrap: {
    padding: 16,
    justifyContent: 'center',
  },
  userName: {
    color: AuthColors.gray700,
    fontSize: 20,
    fontWeight: '700',
  },
  menuFooter: {
    paddingHorizontal: AuthSpacing.md,
    marginBottom: AuthSpacing.xl,
  },
  logoutButton: {
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AuthColors.error,
  },
  logoutButtonPressed: {
    opacity: 0.85,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.white,
  },
  menuList: {
    paddingVertical: AuthSpacing.sm,
    backgroundColor: AuthColors.white,
    paddingHorizontal: AuthSpacing.md,
  },
  sectionHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AuthColors.textBlack,
  },
  sectionTitleActive: {
    color: AuthColors.blue300,
  },
  menuRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
  },
  menuRowText: {
    fontSize: 16,
    color: AuthColors.textBlack,
  },
  rowDivider: {
    height: 1,
    backgroundColor: AuthColors.borderGray,
  },
  serviceList: {
    marginTop: 8,
  },
  serviceItem: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: AuthColors.notice,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AuthSpacing.md,
  },
  serviceText: {
    color: AuthColors.gray700,
    fontSize: 15,
  },
});
