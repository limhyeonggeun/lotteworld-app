import { UserProvider } from '@/context/UserContext'
import * as Font from 'expo-font'
import * as Notifications from 'expo-notifications'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Platform, StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,  
  }),
});

function AppInitializer() {
  const [initialized, setInitialized] = useState(false)
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    if (initialized) return
    let notifSub: Notifications.Subscription | null = null
    const init = async () => {
      await Font.loadAsync({
        'Pretendard-Regular': require('@/assets/fonts/Pretendard-Regular.ttf'),
        'Pretendard-Medium': require('@/assets/fonts/Pretendard-Medium.ttf'),
        'Pretendard-SemiBold': require('@/assets/fonts/Pretendard-SemiBold.ttf'),
        'Pretendard-Bold': require('@/assets/fonts/Pretendard-Bold.ttf'),
      })
      ;(Text as any).defaultProps = (Text as any).defaultProps || {}
      ;(Text as any).defaultProps.style = {
        ...(Text as any).defaultProps.style,
        fontFamily: 'Pretendard-Regular',
      }
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        })
      }
      notifSub = Notifications.addNotificationReceivedListener(() => {})
      setFontsLoaded(true)
      setInitialized(true)
    }
    init()
    return () => notifSub?.remove()
  }, [initialized])

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Image source={require('@/assets/images/splash-icon.png')} style={styles.splashImage} resizeMode="contain" />
        <ActivityIndicator size="large" color="#888" style={{ marginTop: 20 }} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return <Slot />
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <StatusBar style="dark" translucent={false} backgroundColor="#ffffff" />
        <AppInitializer />
      </UserProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashImage: {
    width: 160,
    height: 160,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#888',
  },
})