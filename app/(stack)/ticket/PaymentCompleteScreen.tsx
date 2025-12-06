import PageHeader from '@/components/common/PageHeader';
import PaymentCompleteCard from '@/components/ticket/payment/PaymentCompleteCard';
import api from '@/utils/axios';
import { useSafeBack } from '@/utils/navigation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

type Ticket = {
  productName: string;
  orderNo: string;
  eventName?: string;
  reservedAt?: string;
  visitDate: string;
  amount: number;
  point: number;
  status: string;
  bookingNo: string;
  optionLabel: string;
  quantity: number;
  paymentMethod: string;
};

export default function PaymentCompleteScreen() {
  const insets = useSafeAreaInsets();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const router = useRouter();
  const handleBack = useSafeBack('/TicketScreen');

  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (!orderId) return;
  
    const fetchTickets = async () => {
      try {
        const response = await api.get(`/api/orders/${orderId}`);
        const order = response.data;
  
        const quantity = Number(order.quantity) || 1;
        const unitPrice = Number(order.price) / quantity; 
  
        const transformed: Ticket[] = Array.from({ length: quantity }).map((_, i) => ({
          productName: order.optionName || '이용권',
          orderNo: order.orderNo,
          eventName: '',
          reservedAt: order.createdAt,
          visitDate: order.visitDate,
          amount: unitPrice,
          point: 0,
          status: order.status || '예매완료',
          bookingNo: `${order.bookingNo}-${i + 1}`,
          optionLabel: order.optionName,
          quantity,
          paymentMethod: order.payMethod,
        }));
  
        setTickets(transformed);
      } catch (e) {
        console.error('주문 데이터 불러오기 실패:', e);
      }
    };
  
    fetchTickets();
  }, [orderId]);

  const totalAmount = tickets.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalPoint = tickets.reduce((sum, t) => sum + (t.point || 0), 0);
  const visitDate = tickets[0]?.visitDate ?? '';
  const counts = {
    adult: tickets.filter(t => t.optionLabel === '어른').length,
    teen: tickets.filter(t => t.optionLabel === '청소년').length,
    child: tickets.filter(t => t.optionLabel === '어린이').length,
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <PageHeader title="결제완료" onBack={handleBack} />
      <ScrollView contentContainerStyle={styles.container}>
        <PaymentCompleteCard
          orderId={orderId}
          orderName={tickets[0]?.productName ?? '이용권'}
          amount={totalAmount}
          visitDate={visitDate}
          ticketNo={tickets[0]?.bookingNo ?? ''}
          quantityLabel={`총 ${tickets.length}매`}
          counts={counts}
          paymentMethod={tickets[0]?.paymentMethod ?? '삼성카드'}
          couponAmount={0}
          pointAmount={totalPoint}
          onPressLeft={() => router.replace('/(stack)/profile/ReservationsScreen')}
          onPressRight={() =>
            router.replace({
              pathname: '/(tabs)/TicketScreen',
              params: { tab: 'myticket' },
            } as never)
          }
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: '#fff'
  },
  container: { 
    padding: scale(16)
  },
});