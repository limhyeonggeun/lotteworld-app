import api from '@/utils/axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import TicketPurchaseFilter from './TicketPurchaseFilter';
import TicketPurchaseItem from './TicketPurchaseItem';

type Ticket = {
  id: string;
  title: string;
  description: string;
  price: string;
  category: '전체' | '제휴 할인' | '이달의 할인' | '매직패스';
  image: string;
};

const TicketPurchaseView = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<
    '롯데월드 티켓' | '제휴 할인' | '이달의 할인' | '매직패스'
  >('롯데월드 티켓');

  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/api/tickets');
        setTickets(response.data);
      } catch (error) {
        console.error('티켓 불러오기 실패:', error);
      }
    };

    fetchTickets();
  }, []);

  const filteredData =
    selectedFilter === '롯데월드 티켓'
      ? tickets
      : tickets.filter((ticket) => ticket.category === selectedFilter);

  const renderItem = ({ item }: { item: Ticket }) => (
    <TicketPurchaseItem
      title={item.title}
      description={item.description}
      price={item.price}
      image={{ uri: `${api.defaults.baseURL}/uploads/${item.image}` }}
      onPress={() => {
        router.push(`/ticket/${item.id}`);
      }}
    />
  );

  return (
    <View style={styles.container}>
      <TicketPurchaseFilter
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  list: {
    paddingHorizontal: scale(16),
  },
});

export default TicketPurchaseView;