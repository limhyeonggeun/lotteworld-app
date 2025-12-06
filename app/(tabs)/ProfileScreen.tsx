import Header from '@/components/profile/Header';
import ProfileAvatarCard from '@/components/profile/ProfileAvatarCard';
import ProfileMenu from '@/components/profile/ProfileMenu';
import { useUser } from '@/context/UserContext';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const displayUser = useMemo(
    () => user ?? { name: '', email: '', phone: '' },
    [user]
  );

  const menuItems = useMemo(
    () => [
      { id: '1', title: '예매내역', icon: 'ticket-outline', route: '/profile/ReservationsScreen' },
      { id: '2', title: '내 쿠폰함', icon: 'pricetag-outline', route: '' },
      { id: '3', title: '공연 찜 목록', icon: 'heart-outline', route: '' },
      { id: '4', title: '알림함', icon: 'notifications-outline', route: '/profile/NotificationsScreen' },
      { id: '5', title: user ? '로그아웃' : '로그인', icon: user ? 'log-out-outline' : 'log-in-outline', route: '/auth/LoginScreen' },
    ],
    [user]
  );

  const goEditProfile = () => {
    if (!user) {
      router.replace({
        pathname: '/auth/LoginScreen',
        params: { redirectTo: '/profile/EditProfileScreen' },
      } as any);
      return;
    }
    router.push('/profile/EditProfileScreen' as any);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header />
      <ProfileAvatarCard
        user={{
          name: displayUser.name,
          email: displayUser.email,
          phone: (displayUser as any).phone,
          avatarUri: (displayUser as any).avatarUri,
        }}
        onEdit={goEditProfile}
      />
      <ProfileMenu items={menuItems} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});