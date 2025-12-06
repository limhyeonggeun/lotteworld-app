import PageHeader from '@/components/common/PageHeader';
import NotificationSettingsForm from '@/components/profile/notifications/NotificationSettingsForm';
import { useSafeBack } from '@/utils/navigation';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets();
  const handleBack = useSafeBack('/ProfileScreen');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PageHeader title="알림 설정" onBack={handleBack} />
      <NotificationSettingsForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});