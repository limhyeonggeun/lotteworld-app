import AdBanner from '@/components/homescreen/AdBanner';
import Header from '@/components/homescreen/Header';
import Parade from '@/components/homescreen/Parade';
import ParkInfo from '@/components/homescreen/ParkInfo';
import PopularContent from '@/components/homescreen/PopularContent';
import TicketInfo from '@/components/homescreen/TicketInfo';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AdBanner />
        <ParkInfo />
        <TicketInfo />
        <PopularContent />
        <Parade />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 16,
  },
});