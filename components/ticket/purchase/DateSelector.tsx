import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface DateItem {
  id: string;
  label: string;
  fullLabel: string;
}

interface DateSelectorProps {
  dates: DateItem[];
  selectedDate: string;
  onSelectDate: (id: string) => void;
  onPressCalendar: () => void;
}

export default function DateSelector({
  dates,
  selectedDate,
  onSelectDate,
  onPressCalendar,
}: DateSelectorProps) {
  return (
    <View>
      <View style={styles.dateHeader}>
        <Text style={styles.sectionTitle}>방문일자</Text>
        <View style={styles.rightSection}>
          <Text style={styles.selectedDateText}>
            {dates.find((date) => date.id === selectedDate)?.fullLabel || ''}
          </Text>
          <TouchableOpacity onPress={onPressCalendar}>
            <Ionicons name="calendar-outline" size={scale(24)} color="#444" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={dates}
        horizontal={false}
        scrollEnabled={false}
        numColumns={7}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.dateList}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelectDate(item.id)}
            style={[
              styles.dateItem,
              selectedDate === item.id && styles.dateItemSelected,
              { width: scale(44) }, 
            ]}
          >
            <Text
              style={[
                styles.dateDayText,
                selectedDate === item.id && styles.dateTextSelected,
              ]}
            >
              {item.label.split(' ')[1]}
            </Text>
            <Text
              style={[
                styles.dateWeekdayText,
                selectedDate === item.id && styles.dateTextSelected,
              ]}
            >
              {item.label.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: '500',
    paddingVertical: verticalScale(16),
    color: '#1d1d1d',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
  },
  selectedDateText: {
    fontSize: moderateScale(20),
    color: '#007aff',
    fontWeight: '600',
  },
  dateList: {
    marginVertical: verticalScale(8),
    flexDirection: 'row',
  },
  dateItem: {
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateItemSelected: {
    backgroundColor: '#007aff',
  },
  dateDayText: {
    fontSize: moderateScale(14),
    textAlign: 'center',
    color: '#444',
    fontWeight: '500',
    marginBottom: verticalScale(8),
  },
  dateWeekdayText: {
    fontSize: moderateScale(18),
    textAlign: 'center',
    fontWeight: '600',
    color: '#444',
  },
  dateTextSelected: {
    color: '#fff',
  },
});