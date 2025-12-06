import api from '@/utils/axios'
import * as Device from 'expo-device'

let messagingModule: typeof import('@react-native-firebase/messaging') | null = null
try {
  messagingModule = require('@react-native-firebase/messaging')
} catch {}

let lastToken: string | null = null

export async function getFCMToken() {
  if (!Device.isDevice || !messagingModule) return null
  const messaging = messagingModule.default
  const authStatus = await messaging().requestPermission()
  const enabled =
    authStatus === messagingModule.AuthorizationStatus.AUTHORIZED ||
    authStatus === messagingModule.AuthorizationStatus.PROVISIONAL
  if (!enabled) return null
  const token = await messaging().getToken()
  return token || null
}

export async function registerPushToken(userId: number) {
  if (!userId || !Device.isDevice) return
  const token = await getFCMToken()
  if (!token || token === lastToken) return
  await api.post('/api/users/fcm-token', { userId, token })
  lastToken = token
}