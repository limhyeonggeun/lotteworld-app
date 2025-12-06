import api from '@/utils/axios';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export default function SignUpPage() {
  const [form, setForm] = useState({
    email: '',
    code: '',
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [codeSent, setCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSendCode = async () => {
    try {
      await api.post('/api/email/send-code', { email: form.email });
      setCodeSent(true);
      Alert.alert('인증코드 전송 완료', '입력한 이메일로 인증코드가 전송되었습니다.');
    } catch (err: any) {
      Alert.alert('전송 실패', err?.response?.data?.message || '서버 오류');
    }
  };

  const handleVerifyCode = async () => {
    try {
      await api.post('/api/email/verify-code', { email: form.email, code: form.code });
      setIsVerified(true);
      Alert.alert('인증 완료', '이메일 인증이 완료되었습니다.');
    } catch (err: any) {
      Alert.alert('인증 실패', err?.response?.data?.message || '서버 오류');
    }
  };

  const handleEmailAction = async () => {
    if (!form.email) { 
      Alert.alert('이메일을 입력해주세요.');
      return;
    }

    if (!codeSent) {
      await handleSendCode();
    } else if (!form.code.trim()) {
      Alert.alert('인증코드를 입력해주세요.');
    } else {
      await handleVerifyCode();
    }
  };

  const handleSubmit = () => {
    if (!isVerified) {
      Alert.alert('이메일 인증을 먼저 완료해주세요.');
      return;
    }
    router.replace('/auth/SignUpCompleteScreen');
  };

  const passwordMismatch =
    form.password && form.confirmPassword && form.password !== form.confirmPassword;

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.formContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/lpoint-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.divider} />
        </View>

        <View style={{ marginBottom: scale(24) }}>
          <Text style={styles.label}>이메일(ID)</Text>
          <View style={styles.row}>
            <TextInput
              placeholder="이메일을 입력해주세요."
              value={form.email}
              onChangeText={text => handleChange('email', text)}
              style={[styles.input, { flex: 1 }]}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isVerified}
              placeholderTextColor="#888" 
            />
            <TouchableOpacity
              style={[
                styles.authButton,
                { backgroundColor: isVerified ? '#999' : '#D32F2F' },
              ]}
              onPress={handleEmailAction}
              disabled={isVerified}
            >
              <Text style={styles.authButtonText}>
                {codeSent ? '인증하기' : '전송하기'}
              </Text>
            </TouchableOpacity>
          </View>

          {codeSent && !isVerified && (
            <View style={{ marginTop: scale(8) }}>
              <TextInput
                placeholder="인증코드 6자리 입력해주세요."
                value={form.code}
                onChangeText={text => handleChange('code', text)}
                style={styles.verificationInput}
                keyboardType="numeric"
                placeholderTextColor="#888" 
              />
            </View>
          )}
        </View>

        <View style={{ marginBottom: scale(24) }}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            placeholder="이름을 입력해주세요."
            value={form.name}
            onChangeText={text => handleChange('name', text)}
            style={styles.input}
            placeholderTextColor="#888" 
          />
        </View>

        <View style={{ marginBottom: scale(24) }}>
          <Text style={styles.label}>전화번호</Text>
          <TextInput
            placeholder="전화번호를 입력해주세요."
            value={form.phone}
            onChangeText={text => handleChange('phone', text)}
            style={styles.input}
            keyboardType="phone-pad"
            placeholderTextColor="#888" 
          />
        </View>

        <View style={{ marginBottom: scale(24) }}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            placeholder="비밀번호를 입력해주세요."
            value={form.password}
            onChangeText={text => handleChange('password', text)}
            style={styles.input}
            secureTextEntry
            placeholderTextColor="#888" 
          />
        </View>

        <View style={{ marginBottom: scale(24) }}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            placeholder="비밀번호를 재입력해주세요."
            value={form.confirmPassword}
            onChangeText={text => handleChange('confirmPassword', text)}
            style={styles.input}
            secureTextEntry
            placeholderTextColor="#888" 
          />
          {passwordMismatch && (
            <Text style={styles.errorText}>
              * 비밀번호가 일치하지 않습니다. 다시 한 번 입력해주세요.
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: isVerified ? '#DA291C' : '#ccc' },
          ]}
          onPress={handleSubmit}
          disabled={!isVerified}
        >
          <Text style={styles.submitButtonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  formContent: {
    padding: scale(16),
  },
  footer: {
    padding: scale(16),
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#eee',
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
  label: {
    marginBottom: scale(6),
    color: '#111',
    fontSize: scale(14),
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: scale(4),
    paddingHorizontal: scale(8),
    lineHeight: scale(20), 
    paddingVertical: scale(10),
    fontSize: scale(14),
    backgroundColor: '#f9f9f9',
  },
  verificationInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: scale(8),
    fontSize: scale(14),
    backgroundColor: '#f9f9f9',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  authButton: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    borderRadius: scale(4),
  },
  authButtonText: {
    color: '#fff',
    fontSize: scale(14),
    lineHeight: scale(20),
    fontWeight: '600',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: scale(12),
    marginTop: scale(4),
    marginLeft: scale(8),
  },
  submitButton: {
    paddingVertical: verticalScale(16),
    borderRadius: scale(12),
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: '600',
    lineHeight: moderateScale(24),
  },
});