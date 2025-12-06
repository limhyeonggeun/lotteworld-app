import { router } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export default function SignUpCompletePage() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/lpoint-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.divider} />
      </View>

      <View style={styles.content}>
        <Image
          source={require('@/assets/images/splash-icon.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.message}>
          회원가입이 완료되었습니다.{'\n'}이제 다양한 서비스를 이용해보세요!
        </Text>

        <View style={styles.row}>
          <TouchableOpacity style={styles.outlineButton} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.outlineButtonText}>홈 화면</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filledButton} onPress={() => router.replace('/auth/LoginScreen')}>
            <Text style={styles.filledButtonText}>로그인 화면</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: scale(16),
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: scale(24),
  },
  logo: {
    width: scale(83),
    height: scale(16),
    marginLeft: scale(8),
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#ddd',
    marginTop: scale(16),
  },
  content: {
    marginTop: verticalScale(60),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(16),
  },
  image: {
    width: scale(160),
    height: scale(160),
    marginBottom: verticalScale(20),
  },
  message: {
    fontSize: scale(14),
    color: '#111',
    marginBottom: verticalScale(24),
    textAlign: 'center',
    lineHeight: scale(20),
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: scale(16),
    justifyContent: 'center',
    marginBottom: verticalScale(16),
    width: '100%',
  },
  outlineButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DA291C',
    height: verticalScale(40),
    borderRadius: scale(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    color: '#DA291C',
    fontSize: moderateScale(14),
    fontWeight: '600',
    textAlign: 'center',
  },
  filledButton: {
    flex: 1,
    backgroundColor: '#D32F2F',
    height: verticalScale(40),
    borderRadius: scale(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledButtonText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '600',
    textAlign: 'center',
    minWidth: scale(64),
  },
});