import Header from '@/components/ticket/Header';
import MyTicket from '@/components/ticket/MyTicket';
import MyTicketView from '@/components/ticket/MyTicketsView';
import TicketPurchaseView from '@/components/ticket/TicketPurchaseView';
import TicketTabs from '@/components/ticket/TicketTabs';
import { useUser } from '@/context/UserContext';
import api from '@/utils/axios';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabKey = 'myticket' | 'purchase';

const VALID_STATUSES = new Set(['예매완료']);

export default function TicketScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const params = useLocalSearchParams<{ tab?: string }>();

  const initialTab = useMemo<TabKey>(
    () => (params.tab === 'purchase' ? 'purchase' : 'myticket'),
    [params.tab]
  );

  const [selectedTab, setSelectedTab] = useState<TabKey>(initialTab);
  const [hasTicket, setHasTicket] = useState(false);

  const fetchHasTicket = useCallback(async () => {
    if (!user?.id) {
      setHasTicket(false);
      return;
    }

    try {
      const { data } = await api.get(`/api/orders/user/${user.id}`);
      const hasValid = Array.isArray(data) && data.some((order: any) => VALID_STATUSES.has(order?.status));
      setHasTicket(hasValid);
    } catch (error) {
      console.error('티켓 상태 확인 실패:', error);
      setHasTicket(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchHasTicket();
  }, [fetchHasTicket]);

  useFocusEffect(
    useCallback(() => {
      if (selectedTab === 'myticket') {
        fetchHasTicket();
      }
    }, [selectedTab, fetchHasTicket])
  );

  useEffect(() => {
    if (params.tab === 'purchase' || params.tab === 'myticket') {
      setSelectedTab(params.tab as TabKey);
    }
  }, [params.tab]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header />
      <TicketTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />
      {selectedTab === 'myticket' ? (
        hasTicket ? <MyTicketView /> : <MyTicket />
      ) : (
        <TicketPurchaseView />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});