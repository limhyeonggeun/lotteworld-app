import React, { useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

LocaleConfig.locales['ko'] = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일','월','화','수','목','금','토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

type DateObject = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

type CalendarModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (date: string) => void;
  selectedDate: string;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  brandColor?: string;
  minDate?: string;
  maxDate?: string;
};

export default function CalendarModal({
  visible,
  onClose,
  onApply,
  selectedDate,
  title = '날짜 선택',
  confirmLabel = '적용',
  cancelLabel = '취소',
  brandColor = '#DA291C',
  minDate,
  maxDate,
}: CalendarModalProps) {
  const insets = useSafeAreaInsets();
  const [tempSelectedDate, setTempSelectedDate] = useState(selectedDate);

  useEffect(() => {
    setTempSelectedDate(selectedDate);
  }, [selectedDate]);

  const markedDates = useMemo(() => {
    if (!tempSelectedDate) return {};
    return {
      [tempSelectedDate]: {
        selected: true,
        selectedColor: brandColor,
        selectedTextColor: '#fff',
      },
    };
  }, [tempSelectedDate, brandColor]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { paddingBottom: 32 + insets.bottom }]}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.calendarContainer}>
            <Calendar
              current={tempSelectedDate}
              minDate={minDate || undefined}
              maxDate={maxDate || undefined}
              onDayPress={(day: DateObject) => setTempSelectedDate(day.dateString)}
              markedDates={markedDates}
              theme={{
                todayTextColor: brandColor,
                dayTextColor: '#1d1d1d',
                textDisabledColor: '#ccc',
                dotColor: brandColor,
                arrowColor: brandColor,
                monthTextColor: '#1d1d1d',
                textDayFontWeight: '500',
                textMonthFontWeight: '600',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textSectionTitleColor: '#555',
              }}
              disableAllTouchEventsForDisabledDays
              style={{ borderRadius: 12 }}
            />
          </View>

          <View style={styles.legend}>
            <LegendDot color="#1d1d1d" fill label="선택 가능" />
            <LegendDot color="#ccc" fill label="선택 불가" />
            <LegendDot color={brandColor} fill label="선택 완료" />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, { borderColor: brandColor, borderWidth: 1, backgroundColor: '#fff' }]}
              onPress={onClose}
              activeOpacity={0.9}
            >
              <Text style={[styles.actionText, { color: brandColor }]}>{cancelLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: brandColor }]}
              onPress={() => onApply(tempSelectedDate)}
              activeOpacity={0.9}
            >
              <Text style={[styles.actionText, { color: '#fff' }]}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function LegendDot({ color, label, fill = false }: { color: string; label: string; fill?: boolean }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { borderColor: color }, fill && { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    justifyContent: 'flex-end', 
    backgroundColor: 'rgba(0, 0, 0, 0.4)' 
  },
  modalContainer: { 
    backgroundColor: '#fff', 
    paddingTop: 24, 
    paddingBottom: 32, 
    paddingHorizontal: 16, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 10 
  },
  title: { 
    fontSize: 20, 
    fontWeight: '600', 
    textAlign: 'center', 
    marginBottom: 16 
  },
  calendarContainer: { 
    borderRadius: 12, 
    overflow: 'hidden', 
    height: 360 
  },
  legend: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 16, 
    marginBottom: 24, 
    marginTop: 12 
  },
  legendItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  dot: { 
    width: 12, 
    height: 12, 
    borderRadius: 8, 
    borderWidth: 2 
  },
  legendText: { 
    fontSize: 14, 
    color: '#444' 
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 16 
  },
  actionButton: { 
    flex: 1, 
    paddingVertical: 14, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  actionText: { 
    fontWeight: '600', 
    fontSize: 16 
  },
});