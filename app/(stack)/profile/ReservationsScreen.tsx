import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PageHeader from '@/components/common/PageHeader';
import ProfileReservations from '@/components/profile/reservations/ProfileReservations';
import { useSafeBack } from '@/utils/navigation';

export default function ReservationsScreen() {
  const insets = useSafeAreaInsets();
  const handleBack = useSafeBack('/ProfileScreen');

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <PageHeader title="예약내역" onBack={handleBack} />
      <ProfileReservations />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
});