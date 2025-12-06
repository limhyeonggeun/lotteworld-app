import FooterNavigation from '@/components/common/FooterNavigation';
import { Slot, usePathname } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const hideFooter = pathname.includes('/ticket');

  return (
    <View style={styles.container}>
      <View style={styles.page}>
        <Slot />
      </View>

      {!hideFooter && (
        <View style={[styles.footerWrap, { paddingBottom: insets.bottom }]}>
          <FooterNavigation />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff'
  },
  page: { 
    flex: 1 
  },
  footerWrap: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e5e5',
  },
});