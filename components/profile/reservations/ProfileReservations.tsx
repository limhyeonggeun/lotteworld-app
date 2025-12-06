import TicketCard from '@/components/profile/reservations/TicketCard';
import CalendarModal from '@/components/ticket/modals/CalendarModal';
import { useUser } from '@/context/UserContext';
import api from '@/utils/axios';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export type Ticket = {
  id: number;
  orderNo: string;
  bookingNo: string;
  eventName?: string;
  optionName: string;
  visitDate?: string;
  reservedAt?: string;
  createdAt: string; 
  quantity: number;
  price?: number;
  point?: number;
  status: '예매완료' | '취소완료';
  payMethod?: string;
  buyerName?: string;
};

function toISO(d: Date) {
  return d.toISOString().split('T')[0];
}
function monthsAgoISO(n: number) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() - n, now.getDate());
  return toISO(d);
}
function parseDateSafe(src?: string) {
  if (!src) return new Date(0);
  if (/\d{4}-\d{2}-\d{2}T/.test(src)) {
    const d = new Date(src);
    return isNaN(d.getTime()) ? new Date(0) : d;
  }
  const cleaned = src.replace(/\(.*?\)/g, '').replace(/\s+/g, '').replace(/\./g, '-');
  const d = new Date(`${cleaned}T00:00:00`);
  return isNaN(d.getTime()) ? new Date(0) : d;
}
function toStartOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function formatDisplayDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${y}. ${m.padStart(2, '0')}. ${d.padStart(2, '0')}`;
}

export default function ProfileReservations() {
  const { user } = useUser();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [rangePreset, setRangePreset] = useState<'3m' | '6m' | 'custom'>('3m');
  const todayISO = useMemo(() => toISO(new Date()), []);
  const [startDate, setStartDate] = useState<string>(monthsAgoISO(3));
  const [endDate, setEndDate] = useState<string>(todayISO);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectingStart, setSelectingStart] = useState(true);
  const disabledDates = useMemo(() => rangePreset !== 'custom', [rangePreset]);

  const load = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`/api/orders/user/${user.id}`);
      setTickets(res.data);
    } catch (_) {
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const filtered = useMemo(() => {
    const from = toStartOfDay(parseDateSafe(startDate));
    const to = toStartOfDay(parseDateSafe(endDate));
    return tickets.filter(t => {
      const d = toStartOfDay(parseDateSafe(t.createdAt));
      return d >= from && d <= to;
    });
  }, [tickets, rangePreset, startDate, endDate]);

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.noticeBox}>
          <Ionicons name="alert-circle-outline" size={scale(18)} color="#bbb" style={styles.noticeIcon} />
          <Text style={styles.noticeText}>예매내역은 로그인 후 확인할 수 있습니다.</Text>
        </View>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>로그인해주세요.</Text>
        </View>
      </View>
    );
  }

  const handleCancel = async (ticket: Ticket) => {
    try {
      await api.delete(`/api/orders/${ticket.id}`);
      load(); 
    } catch (_) {
    }
  };

  const renderHeader = () => (
    <View>
      <View style={styles.noticeBox}>
        <Ionicons name="alert-circle-outline" size={scale(18)} color="#bbb" style={styles.noticeIcon} />
        <Text style={styles.noticeText}>
          예매하신 티켓은 방문일자에 사용하실 수 있으며 <Text style={styles.noticeHighlight}>사용후에는 예매취소가 불가</Text> 하니 유의하시기 바랍니다.
        </Text>
      </View>
      <View style={styles.segmentRow}>
        <SegmentButton label="3개월" active={rangePreset === '3m'} onPress={() => handlePreset('3m')} />
        <SegmentButton label="6개월" active={rangePreset === '6m'} onPress={() => handlePreset('6m')} />
        <SegmentButton label="기간설정" active={rangePreset === 'custom'} onPress={() => handlePreset('custom')} />
      </View>
      <View style={styles.rangeRow}>
        <TouchableOpacity
          onPress={() => { if (!disabledDates) { setSelectingStart(true); setCalendarOpen(true); } }}
          style={styles.dateBox}
          activeOpacity={disabledDates ? 1 : 0.8}
        >
          <Text style={styles.dateInput}>{formatDisplayDate(startDate)}</Text>
          <Ionicons name="calendar-clear-outline" size={scale(16)} color={disabledDates ? '#cfcfcf' : '#666'} />
        </TouchableOpacity>
        <Text style={styles.rangeDash}>—</Text>
        <TouchableOpacity
          onPress={() => { if (!disabledDates) { setSelectingStart(false); setCalendarOpen(true); } }}
          style={styles.dateBox}
          activeOpacity={disabledDates ? 1 : 0.8}
        >
          <Text style={styles.dateInput}>{formatDisplayDate(endDate)}</Text>
          <Ionicons name="calendar-clear-outline" size={scale(16)} color={disabledDates ? '#cfcfcf' : '#666'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchBtn} onPress={() => setRangePreset('custom')} activeOpacity={0.9}>
          <Ionicons name="search" size={scale(16)} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handlePreset = (preset: '3m' | '6m' | 'custom') => {
    setRangePreset(preset);
    if (preset === '3m') {
      setStartDate(monthsAgoISO(3));
      setEndDate(todayISO);
    } else if (preset === '6m') {
      setStartDate(monthsAgoISO(6));
      setEndDate(todayISO);
    } else {
      openCustomRange();
    }
  };

  const openCustomRange = () => {
    setRangePreset('custom');
    setSelectingStart(true);
    setCalendarOpen(true);
  };

  const handleApplyDate = (date: string) => {
    if (selectingStart) {
      setStartDate(date);
      setSelectingStart(false);
      setCalendarOpen(true);
    } else {
      setEndDate(date);
      setSelectingStart(true);
      setCalendarOpen(false);
    }
  };

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>예약하신 내역이 없습니다.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TicketCard ticket={item} onPress={() => {}} onCancel={handleCancel} />
        )}
        contentContainerStyle={{ paddingBottom: verticalScale(16) }}
        showsVerticalScrollIndicator={false}
      />

      <CalendarModal
        visible={calendarOpen}
        onClose={() => { setCalendarOpen(false); setSelectingStart(true); }}
        onApply={handleApplyDate}
        selectedDate={selectingStart ? startDate : endDate}
      />
    </View>
  );
}

function SegmentButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.segmentBtn, active ? styles.segmentActive : styles.segmentInactive]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Text style={[styles.segmentText, !active && styles.segmentTextInactive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: scale(16) },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fafafa',
    borderRadius: scale(8),
    paddingVertical: verticalScale(16),
  },
  noticeIcon: {
    marginRight: scale(6),
    marginTop: scale(2),
  },
  noticeText: {
    flex: 1,
    fontSize: moderateScale(14),
    lineHeight: verticalScale(20),
    color: '#555',
  },
  noticeHighlight: {
    color: '#DA291C',
    fontWeight: '600',
  },
  segmentRow: {
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: verticalScale(16),
  },
  segmentBtn: {
    flex: 1,
    height: verticalScale(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: scale(6),
  },
  segmentActive: {
    backgroundColor: '#fff',
    borderColor: '#111',
  },
  segmentInactive: {
    backgroundColor: '#f7f7f7',
    borderColor: '#e5e5e5',
  },
  segmentText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#111',
  },
  segmentTextInactive: {
    color: '#9a9a9a',
    fontWeight: '400',
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: verticalScale(16),
  },
  dateBox: {
    flex: 1,
    height: verticalScale(40),
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: scale(8),
    paddingHorizontal: scale(10),
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInput: {
    fontSize: moderateScale(14),
    color: '#111',
  },
  rangeDash: {
    color: '#bdbdbd',
  },
  searchBtn: {
    width: verticalScale(28),
    height: verticalScale(28),
    borderRadius: verticalScale(14),
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: verticalScale(40),
  },
  emptyText: {
    fontSize: moderateScale(15),
    color: '#9a9a9a',
  },
});
