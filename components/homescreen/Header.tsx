import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import MenuIcon from '../../assets/Icon/menu.svg';
import NotificationIcon from '../../assets/Icon/notification.svg';
import { useRouter } from 'expo-router';

export default function Header() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity>
        <MenuIcon width={scale(24)} height={scale(24)} fill="#222" />
      </TouchableOpacity>

      <View>
        <Text style={styles.title}>LotteWorld</Text>
      </View>

      <TouchableOpacity onPress={() => router.push('/profile/NotificationsScreen')}>
        <NotificationIcon width={scale(24)} height={scale(24)} color="#222" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: verticalScale(56), 
    backgroundColor: '#fff',
    paddingHorizontal: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  iconButton: {
    width: scale(32),
    height: verticalScale(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: scale(20),
    fontWeight: 'bold',
    color: '#111',
  },
});