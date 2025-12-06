import PageHeader from '@/components/common/PageHeader';
import { useSafeBack } from '@/utils/navigation';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RegisterReservation() {
  const insets = useSafeAreaInsets();
  const handleBack = useSafeBack('/TicketScreen');
  const [reservationCode, setReservationCode] = useState('');

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <PageHeader title="예매번호 입력하기" onBack={handleBack} />

        <View style={styles.content}>
          <Text style={styles.label}>예약번호를 입력해주세요.</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={reservationCode}
              onChangeText={setReservationCode}
              placeholder="예약번호 16자리를 입력해주세요."
              keyboardType="default"
              autoCapitalize="none"
            />
            {reservationCode.length > 0 && (
              <TouchableOpacity onPress={() => setReservationCode('')}>
                <Ionicons name="close-circle" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.helperText}>
            예약 완료 후 받은 알림톡 또는 문자에서{'\n'}
            예약번호를 확인해 입력해 주세요.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitText}>등록하기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  label: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '500',
    paddingVertical: 16,
    color: '#1d1d1d',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 16,
    height: 48,
    backgroundColor: '#fafafa',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1d1d1d',
  },
  helperText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  footer: {
    marginTop: 'auto',
    padding: 16,
  },
  submitButton: {
    backgroundColor: '#DA291C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
});