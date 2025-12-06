import PageHeader from '@/components/common/PageHeader';
import AgreementSection from '@/components/ticket/payment/AgreementSection';
import BuyerInfoDisplay from '@/components/ticket/payment/BuyerInfo';
import PaymentMethod from '@/components/ticket/payment/PaymentMethod';
import PaymentSummary from '@/components/ticket/payment/PaymentSummary';
import VisitorInfo from '@/components/ticket/payment/VisitorInfo';
import { useUser } from '@/context/UserContext';
import api from '@/utils/axios';
import { useSafeBack } from '@/utils/navigation';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TicketPaymentScreen() {
  const {
    ticketId,
    selectedDate,
    totalPrice,
    cardName,
    optionName,
    counts,
    quantity: routeQty,
    cardMap: cardMapString,
  } = useLocalSearchParams<{
    ticketId: string;
    selectedDate: string;
    totalPrice: string;
    optionName?: string;
    counts?: string;
    cardName?: string;
    quantity?: string;
    cardMap?: string;
  }>();

  const insets = useSafeAreaInsets();
  const safeBack = useSafeBack('/TicketScreen');
  const { user } = useUser();

  const parsedCounts = useMemo(() => {
    try {
      return counts ? JSON.parse(counts) : {};
    } catch {
      return {};
    }
  }, [counts]);

  const cardMap = useMemo(() => {
    try {
      return cardMapString ? JSON.parse(cardMapString) : {};
    } catch {
      return {};
    }
  }, [cardMapString]);

  const resolvedQuantity =
    (parsedCounts.adult ?? 0) + (parsedCounts.teen ?? 0) + (parsedCounts.child ?? 0) ||
    Number(routeQty || 0);

  const visitDateISO = String(selectedDate || '');

  const [selectedCard, setSelectedCard] = useState<string | null>(cardName || null);
  const [saved, setSaved] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);

  const [buyer, setBuyer] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [visitor, setVisitor] = useState({
    sameAsBuyer: true,
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
      })
    : '';

  const discountedTotal = useMemo(() => {
    const parsed = Number(totalPrice);
    return isNaN(parsed) ? 0 : parsed;
  }, [totalPrice]);

  const baseTotal = discountedTotal * 2;

  const handleOrderSubmit = async () => {
    try {
      const res = await api.post('/api/orders', {
        userId: user?.id,
        ticketId,
        visitDate: visitDateISO,
        counts: parsedCounts,
        quantity: resolvedQuantity,
        amount: finalPrice,
        paymentMethod: selectedCard,
        orderName: optionName,
        buyer,
        visitor,
      });

      const result = res.data;

      router.push({
        pathname: '/ticket/TestCheckoutScreen',
        params: { orderId: result.id.toString() },
      } as never);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || '서버 오류 또는 네트워크 오류';
      Alert.alert('예매 실패', message);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <PageHeader title="이용권 결제" onBack={safeBack} />
      <ScrollView style={styles.container}>
        <BuyerInfoDisplay />
        <VisitorInfo visitor={visitor} buyer={buyer} setVisitor={setVisitor} />
        <PaymentMethod
          ticketId={ticketId as string}
          selectedCard={selectedCard}
          onSelectCard={setSelectedCard}
          saved={saved}
          onToggleSave={() => setSaved((prev) => !prev)}
          cardMap={cardMap}
        />
        <PaymentSummary
          benefitTitle={optionName || '혜택 선택 없음'}
          visitDate={formattedDate}
          baseTotal={baseTotal}
          discountedTotal={discountedTotal}
          couponDiscount={0}
          onFinalPriceChange={setFinalPrice}
        />
        <AgreementSection
          finalPrice={finalPrice}
          buyer={buyer}
          visitor={visitor}
          orderName={optionName || '이용권'}
          payMethod={selectedCard || '카드결제'}
          visitDate={formattedDate}
          visitDateISO={visitDateISO}
          counts={parsedCounts}
          quantity={resolvedQuantity}
          ticketId={ticketId as string}
          userId={user?.id || 0}
          onSubmit={handleOrderSubmit}
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
    flex: 1, 
    paddingHorizontal: 16 
  },
});