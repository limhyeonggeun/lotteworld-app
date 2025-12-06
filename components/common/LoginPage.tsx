import CustomCheckbox from '@/components/common/CustomCheckbox'
import { useUser } from '@/context/UserContext'
import { useLoginWithKakao } from '@/hooks/useLoginWithKakao'
import api from '@/utils/axios'
import { registerPushToken } from '@/utils/fcm'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Alert, InteractionManager, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'

export default function LoginPage() {
  const handledRef = useRef(false)
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [saveId, setSaveId] = useState(true)
  const [autoLogin, setAutoLogin] = useState(false)
  const [loading, setLoading] = useState(false)
  const passwordRef = useRef<TextInput>(null)
  const router = useRouter()
  const params = useLocalSearchParams<Record<string, string | string[]>>()
  const normalized = Object.fromEntries(Object.entries(params).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])) as Record<string, string | undefined>
  const { from, redirectTo, code } = normalized
  const { setUser } = useUser()
  const { response, promptAsync, redirectUri } = useLoginWithKakao()

  const getSafeRedirectPath = (path?: string) => {
    if (!path || path === '/auth/LoginScreen' || !path.startsWith('/')) return '/ProfileScreen'
    return path
  }

  const finalizeLogin = async (user: any, token: string, needProfile?: boolean, missingFields?: string[]) => {
    const fullUser = {
      id: String(user.id),
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      isAdmin: !!user.isAdmin,
      token,
    }

    await AsyncStorage.setItem('user', JSON.stringify(fullUser))
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(fullUser)

    try {
      await registerPushToken(Number(user.id))
      await api.patch(`/api/users/${user.id}`, { lastLogin: new Date().toISOString() })
    } catch {}

    if (needProfile || !user.phone) {
      return router.replace({
        pathname: '/CompleteProfileScreen',
        params: {
          userId: fullUser.id,
          name: fullUser.name,
          email: fullUser.email,
          phone: fullUser.phone,
          token,
          missing: (missingFields || ['phone']).join(','),
          redirectTo: redirectTo || from || '',
        },
      } as any)
    }

    const safePath = getSafeRedirectPath(redirectTo || from)
    InteractionManager.runAfterInteractions(() => {
      router.replace(safePath as never)
    })
  }

  const handleKakaoLogin = async (authCode: string) => {
    try {
      setLoading(true) 
      const { data } = await api.post('/api/auth/kakao/code', { code: authCode, redirectUri })
      const { token, user, needProfile, missingFields } = data
      if (!user || !token) throw new Error('INVALID_RESPONSE')
      await finalizeLogin(user, token, needProfile, missingFields)
    } catch (e: any) {
      Alert.alert('로그인 실패', e?.response?.data?.message || '카카오 로그인 처리 중 오류가 발생했습니다.')
      handledRef.current = false
      setLoading(false) 
    }
  }

  const handleLogin = async () => {
    try {
      setLoading(true) 
      const { data } = await api.post('/api/auth/login', { email: id, password })
      await finalizeLogin(data.user, data.token)
    } catch (error: any) {
      const message = error?.response?.data?.message || '아이디 또는 비밀번호가 올바르지 않습니다.'
      Alert.alert('로그인 실패', message)
      setLoading(false)
    }
  }

  const handleKakaoLoginStart = () => {
    if (!handledRef.current) promptAsync()
  }

  useEffect(() => {
    const codeToUse = code || (response?.type === 'success' ? response.params?.code : undefined)
    if (codeToUse && !handledRef.current) {
      handledRef.current = true
      handleKakaoLogin(codeToUse)
    }
  }, [response, code, params])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>로그인 중입니다...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>L.POINT 통합회원</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="아이디"
          placeholderTextColor="#999"
          value={id}
          onChangeText={setId}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <TextInput
          ref={passwordRef}
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />
        <View style={styles.checkboxRow}>
          <TouchableOpacity style={styles.checkRow} onPress={() => setSaveId(!saveId)} activeOpacity={0.7}>
            <CustomCheckbox checked={saveId} onChange={() => setSaveId(!saveId)} />
            <Text style={styles.checkboxLabel}>아이디 저장</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkRow} onPress={() => setAutoLogin(!autoLogin)} activeOpacity={0.7}>
            <CustomCheckbox checked={autoLogin} onChange={() => setAutoLogin(!autoLogin)} />
            <Text style={styles.checkboxLabel}>자동 로그인</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.joinButton} onPress={() => router.push('/(stack)/auth/SignUpScreen')}>
          <Text style={styles.joinText}>L.POINT 통합 회원가입</Text>
        </TouchableOpacity>
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>또는</Text>
          <View style={styles.divider} />
        </View>
        <TouchableOpacity style={[styles.snsButton, { backgroundColor: '#FEE500' }]} onPress={handleKakaoLoginStart}>
          <Text style={[styles.snsText, { color: '#000' }]}>카카오 계정으로 로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.snsButton, { backgroundColor: '#1EC800' }]} disabled>
          <Text style={styles.snsText}>네이버 계정으로 로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#0066CC',
    paddingVertical: verticalScale(14),
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: moderateScale(16),
    lineHeight: verticalScale(20),
    fontWeight: '400',
  },
  form: { padding: scale(16) },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: scale(8),
    padding: scale(12),
    fontSize: moderateScale(14),
    marginBottom: verticalScale(16),
    lineHeight: moderateScale(18),
    color: '#111',
  },
  checkboxRow: {
    flexDirection: 'row',
    gap: scale(24),
    marginBottom: verticalScale(24),
  },
  checkRow: { 
    flexDirection: 'row',
     alignItems: 'center' 
  },
  checkboxLabel: { 
    marginLeft: scale(8), 
    fontSize: moderateScale(14),
     color: '#111'
     },
  loginButton: {
    backgroundColor: '#DA291C',
    paddingVertical: verticalScale(12),
    borderRadius: scale(6),
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  loginText: {
    color: '#fff',
    lineHeight: verticalScale(20),
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  joinButton: {
    backgroundColor: '#0066CC',
    paddingVertical: verticalScale(12),
    borderRadius: scale(6),
    alignItems: 'center',
  },
  joinText: {
    color: '#fff',
    lineHeight: verticalScale(20),
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  dividerContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: verticalScale(16)
 },
  divider: { 
    flex: 1, 
    height: 1, 
    backgroundColor: '#ccc'
 },
  orText: { 
    marginHorizontal: scale(10), 
    color: '#999', 
    fontSize: moderateScale(14)
 },
  snsButton: {
    paddingVertical: verticalScale(12),
    borderRadius: scale(6),
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  snsText: {
    fontSize: moderateScale(16),
    lineHeight: verticalScale(20),
    fontWeight: '500',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
})