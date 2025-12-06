import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

import HomeIcon from '../../assets/Icon/home.svg';
import MapIcon from '../../assets/Icon/mappin.svg';
import ProfileIcon from '../../assets/Icon/mypage.svg';
import TicketIcon from '../../assets/Icon/ticket.svg';

export default function FooterNavigation() {
  const router = useRouter();

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
        <HomeIcon width={32} height={32} fill="#ffffff" />
        <Text style={styles.label}>홈</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/TicketScreen')}>
        <TicketIcon width={32} height={32} fill="#ffffff" />
        <Text style={styles.label}>티켓</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/MapScreen')}>
        <MapIcon width={32} height={32} fill="#ffffff" />
        <Text style={styles.label}>파크맵</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/ProfileScreen')}>
        <ProfileIcon width={32} height={32} fill="#ffffff" />
        <Text style={styles.label}>마이페이지</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: verticalScale(60),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    paddingHorizontal: scale(8),
  },
  button: {
    width: scale(56),
    height: verticalScale(56),
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: moderateScale(12),
    marginTop: verticalScale(2),
    color: '#111', 
  },
});