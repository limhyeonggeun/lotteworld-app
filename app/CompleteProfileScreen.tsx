import PageHeader from '@/components/common/PageHeader';
import { useUser } from '@/context/UserContext';
import api from '@/utils/axios';
import { registerPushToken } from '@/utils/fcm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export default function CompleteProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setUser } = useUser();

  const params = useLocalSearchParams<{
    userId: string;
    name?: string;
    email?: string;
    phone?: string;
    missing?: string;
    redirectTo?: string;
    token?: string;
  }>();

  const missingSet = useMemo(
    () => new Set((params.missing || '').split(',').filter(Boolean)),
    [params.missing]
  );

  const needName = missingSet.size === 0 || missingSet.has('name');
  const needEmail = missingSet.size === 0 || missingSet.has('email');
  const needPhone = missingSet.size === 0 || missingSet.has('phone');

  const [name, setName] = useState(params.name || '');
  const [email, setEmail] = useState(params.email || '');
  const [phone, setPhone] = useState(params.phone || '');

  const goBackTwo = () => {
    const target = params.redirectTo;
    if (target && typeof target === 'string' && target.startsWith('/')) {
      router.replace(target as any);
      return;
    }

    let popped = 0;
    const tryGoBack = () => {
      if (router.canGoBack()) {
        router.back();
        popped++;
      }
    };

    tryGoBack();
    setTimeout(() => {
      if (popped === 1) tryGoBack();
      if (popped === 0 && !router.canGoBack()) {
        router.replace('/');
      }
    }, 50);
  };

  const finalizeAuth = async (finalUser: any, token: string) => {
    const fullUser = {
      id: String(finalUser.id),
      name: finalUser.name || '',
      email: finalUser.email || '',
      phone: finalUser.phone || '',
      isAdmin: !!finalUser.isAdmin,
      token,
    };
    await AsyncStorage.setItem('user', JSON.stringify(fullUser));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(fullUser);
  
    try {
      await registerPushToken(finalUser.id); 
    } catch (err) {
      console.warn('FCM 등록 실패:', err);
    }
  };

  const onSubmit = async () => {
    try {
      const token = params.token;
      if (!token) throw new Error('TOKEN_MISSING');

      const payload: Record<string, string> = {};
      if (needName) payload.name = name;
      if (needEmail) payload.email = email;
      if (needPhone) payload.phone = phone;

      await api.patch(`/api/users/${params.userId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const meRes = await api.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      await finalizeAuth(meRes.data, token);
      goBackTwo();
    } catch (e: any) {
      const message = e?.response?.data?.message || e?.message || '업데이트 중 오류가 발생했습니다.';
      Alert.alert('오류', message);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        <PageHeader title="추가 정보 입력" onBack={goBackTwo} />
        <View style={styles.form}>
          {needName && (
            <>
              <Text style={styles.label}>이름</Text>
              <TextInput
                style={styles.input}
                placeholder="이름을 입력하세요"
                value={name}
                onChangeText={setName}
              />
            </>
          )}
          {needEmail && (
            <>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={styles.input}
                placeholder="example@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </>
          )}
          {needPhone && (
            <>
              <Text style={styles.label}>전화번호</Text>
              <TextInput
                style={styles.input}
                placeholder="010-1234-5678"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </>
          )}
          <TouchableOpacity style={styles.submit} onPress={onSubmit}>
            <Text style={styles.submitText}>저장</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  form: { padding: scale(16) },
  label: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    marginBottom: verticalScale(4),
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: scale(8),
    padding: scale(12),
    fontSize: moderateScale(14),
    marginBottom: verticalScale(16),
    color: '#111',
  },
  submit: {
    backgroundColor: '#0066CC',
    paddingVertical: verticalScale(12),
    borderRadius: scale(6),
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});