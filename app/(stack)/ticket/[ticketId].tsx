import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PageHeader from '@/components/common/PageHeader';
import CalendarModal from '@/components/ticket/modals/CalendarModal';
import FacilityStatusModal from '@/components/ticket/modals/FacilityStatusModal';
import DateSelector from '@/components/ticket/purchase/DateSelector';
import PersonCounter, { CountType } from '@/components/ticket/purchase/PersonCounter';
import TicketBenefitInfo from '@/components/ticket/purchase/TicketBenefitInfo';

import api from '@/utils/axios';
import { generateNext7Days } from '@/utils/date';
import { useSafeBack } from '@/utils/navigation';

export default function TicketDetailScreen() {
  const { ticketId: ticketIdParam } = useLocalSearchParams<{ ticketId?: string }>();
  const ticketId = ticketIdParam ?? '1';
  const insets = useSafeAreaInsets();
  const handleBack = useSafeBack('/TicketScreen');

  const [cardMap, setCardMap] = useState<Record<string, any>>({});
  const [counts, setCounts] = useState({ adult: 0, teen: 0, child: 0 });
  const [selectedMaxCounts, setSelectedMaxCounts] = useState<Partial<Record<CountType, number>> | undefined>();
  const [totalPrice, setTotalPrice] = useState(0);

  const [selectedDateObj, setSelectedDateObj] = useState(new Date());
  const [dates, setDates] = useState(generateNext7Days(selectedDateObj));
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  const AGE_LABEL_MAP: Record<CountType, string> = {
    adult: '어른',
    teen: '청소년',
    child: '어린이',
  };

  const handleCountChange = (type: CountType, delta: number) => {
    setCounts((prev) => {
      const newValue = Math.max(0, prev[type] + delta);
      const max = selectedMaxCounts?.[type];

      if (max !== undefined) {
        if (max === 0 && newValue > 0) return prev;
        if (newValue > max) return prev;
      }

      const total = prev.adult + prev.teen + prev.child;
      if (total + delta > 10) return prev;

      return { ...prev, [type]: newValue };
    });
  };

  useEffect(() => {
    const fetchCardMap = async () => {
      try {
        const res = await api.get(`/api/benefits/${ticketId}`);
        setCardMap(res.data.cardMap);
      } catch (err) {}
    };
    fetchCardMap();
  }, [ticketId]);

  const getSafeDateString = (index: number) => {
    if (dates[index]?.dateObj instanceof Date) {
      return dates[index].dateObj.toISOString().split('T')[0];
    }
    return '';
  };

  const selectedVisitDate = getSafeDateString(selectedDateIndex);
  const selectedCalendarDate = getSafeDateString(selectedDateIndex);

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <PageHeader title="티켓 예매" onBack={handleBack} />

      <ScrollView style={styles.container}>
        <DateSelector
          dates={dates}
          selectedDate={selectedDateIndex.toString()}
          onSelectDate={(id) => setSelectedDateIndex(parseInt(id))}
          onPressCalendar={() => setIsCalendarOpen(true)}
        />

        <PersonCounter
          counts={counts}
          onChange={handleCountChange}
          onPressNotice={() => setIsNoticeOpen(true)}
          maxCounts={selectedMaxCounts}
        />

        <TicketBenefitInfo
          ticketId={ticketId}
          cardMap={cardMap}
          onChangeMaxCounts={setSelectedMaxCounts}
          counts={counts}
          onPriceChange={setTotalPrice}
          visitDate={selectedVisitDate}
        />
      </ScrollView>

      <CalendarModal
        visible={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={selectedCalendarDate}
        onApply={(dateStr: string) => {
          const date = new Date(dateStr);
          const newDates = generateNext7Days(date);
          setDates(newDates);
          setSelectedDateObj(date);
          setSelectedDateIndex(0);
          setIsCalendarOpen(false);
        }}
      />

      <FacilityStatusModal
        visible={isNoticeOpen}
        onClose={() => setIsNoticeOpen(false)}
        selectedDate={dates[selectedDateIndex]?.dateObj ?? new Date()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});