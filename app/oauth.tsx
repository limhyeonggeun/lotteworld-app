import { useLoginWithKakao } from '@/hooks/useLoginWithKakao';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function OAuth() {
  const params = useLocalSearchParams();
  const { response, promptAsync } = useLoginWithKakao();
  const router = useRouter();

  useEffect(() => {
    const code = params.code;
    if (typeof code === 'string') {
      console.log('✅ 카카오 인증 코드 수신 성공:', code);
  
      const timer = setTimeout(() => {
        router.push({
          pathname: '/auth/LoginScreen',
          params: {
            code,
            from: 'oauth',
          },
        });
      }, 10);
  
      return () => clearTimeout(timer);
    } else {
      console.warn('⚠️ code 파라미터 없음:', params);
    }
  }, [params]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator size="large" color="#0066CC" />
      <Text style={{ marginTop: 16, color: '#333', fontSize: 16 }}>
        로그인 중입니다...
      </Text>
    </View>
  );
}