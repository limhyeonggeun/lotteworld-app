import PageHeader from '@/components/common/PageHeader';
import { useSafeBack } from '@/utils/navigation';
import { Stack } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function QRCodeRegister() {
  const insets = useSafeAreaInsets();
  const handleBack = useSafeBack('/TicketScreen');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ statusBarStyle: 'light', statusBarHidden: false }} />

      <PageHeader
        title="QR코드 스캔하기"
        onBack={handleBack}
        backgroundColor="#000"
        textColor="#fff"
        iconColor="#fff"
        showBorder={false}
      />

      <View style={styles.qrContainer}>
        <View style={styles.qrBox}>
          <Text style={styles.disabledText}>(QR 스캐너 기능은 앱 빌드 후 활성화 예정)</Text>
        </View>
      </View>

      <Text style={styles.instructionTitle}>QR코드를 스캔해주세요.</Text>
      <Text style={styles.instructionDesc}>
        너무 가깝거나 멀면 인식이 잘 안될 수 있으니, 적정한 거리를 유지해 QR코드를 스캔해주세요!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  qrContainer: { 
    marginTop: 80, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  qrBox: {
    width: width * 0.6,
    height: width * 0.6,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledText: { 
    color: '#aaa', 
    fontSize: 12, 
    textAlign: 'center', 
    paddingHorizontal: 10 
  },
  instructionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 16,
  },
  instructionDesc: { 
    color: '#fff', 
    fontSize: 14,
    textAlign: 'center'
  },
});