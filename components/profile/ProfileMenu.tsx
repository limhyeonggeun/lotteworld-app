import { useUser } from '@/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

type MenuItem = {
  id: string;
  title: string;
  icon: string;
  route: string;
};

type Props = {
  items: MenuItem[];
};

export default function ProfileMenu({ items }: Props) {
  const { user, clearUser } = useUser();

  const goLogin = (redirectTo?: string) => {
    router.replace({
      pathname: '/auth/LoginScreen',
      params: redirectTo ? { redirectTo } : {},
    } as any);
  };

  const doLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(['userToken', 'USER_DATA']);
          } finally {
            clearUser();
          }
        },
      },
    ]);
  };

  const handlePress = (item: MenuItem) => {
    if (!user) {
      goLogin(item.route); 
      return;
    }

    if (item.title.includes('로그아웃') || item.route === '/mypage/LoginLogout') {
      doLogout();
      return;
    }

    router.push(item.route as any);
  };

  return (
    <View style={styles.card}>
      {items.map((item, idx) => (
        <View key={item.id}>
          <TouchableOpacity style={styles.menuItem} onPress={() => handlePress(item)}>
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon as any} size={scale(22)} color="#111" />
              <Text style={styles.menuText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={scale(18)} color="#999" />
          </TouchableOpacity>
          {idx < items.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: scale(16),
    borderRadius: scale(12),
    borderWidth: 2,
    borderColor: '#eee',
    overflow: 'hidden',
  },
  menuItem: {
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
  },
  menuText: {
    fontSize: moderateScale(16),
    color: '#111',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: scale(16),
  },
});