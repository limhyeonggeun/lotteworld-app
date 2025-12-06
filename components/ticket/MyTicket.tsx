import { useUser } from '@/context/UserContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import InfoCircle from '../../assets/Icon/info-circle.svg';

export default function MyTicket() {
  const router = useRouter();
  const { user } = useUser();

  const ensureLoggedIn = (redirectTo: string, params?: Record<string, string>) => {
    if (user?.token) {
      router.push({ pathname: redirectTo, params } as never); 
      return;
    }
  
    Alert.alert(
      '로그인이 필요합니다',
      '서비스 이용을 위해 로그인해 주세요.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그인',
          onPress: () =>
            router.replace({
              pathname: '/auth/LoginScreen',
              params: {
                redirectTo,
                ...(params ?? {}),
              },
            } as never),
        },
      ],
    );
  };

  const goPurchase = () => ensureLoggedIn('/TicketScreen', { tab: 'purchase' });
  const goQrScan = () => ensureLoggedIn('/ticket/QRCodeRegister');
  const goRegisterNumber = () => ensureLoggedIn('/ticket/RegisterReservation');

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <InfoCircle width={scale(48)} height={scale(48)} />
      </View>

      <Text style={styles.title}>이용안내</Text>
      <Text style={styles.description}>
        예매된 티켓이 없습니다.{'\n'}티켓을 구매하거나 등록해 주세요.
      </Text>

      <View style={styles.cardGroup}>
        <TouchableOpacity style={styles.card} onPress={goPurchase}>
          <Text style={styles.cardTitle}>티켓 구매하기</Text>
          <Text style={styles.cardDesc}>공식 온라인몰에서 구매할 수 있어요.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={goQrScan}>
          <Text style={styles.cardTitle}>QR코드 스캔하기</Text>
          <Text style={styles.cardDesc}>종이 티켓이 있다면 QR코드를 찍어보세요.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={goRegisterNumber}>
          <Text style={styles.cardTitle}>예약번호 입력하기</Text>
          <Text style={styles.cardDesc}>
            다른 경로에서 구매했다면 예약번호를 입력해 주세요.
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  iconWrapper: {
    marginTop: verticalScale(40),
    marginBottom: verticalScale(16),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#111',
    marginBottom: verticalScale(8),
  },
  description: {
    textAlign: 'center',
    fontSize: moderateScale(16),
    color: '#717171',
    marginBottom: verticalScale(40),
  },
  cardGroup: {
    width: '100%',
    gap: verticalScale(16),
    paddingHorizontal: scale(16),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: scale(8),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(16),
  },
  cardTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#111',
    marginBottom: verticalScale(4),
  },
  cardDesc: {
    fontSize: moderateScale(13),
    color: '#717171',
  },
});