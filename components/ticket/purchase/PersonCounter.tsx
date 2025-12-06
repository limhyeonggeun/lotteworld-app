import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export type CountType = 'adult' | 'teen' | 'child';

interface PersonCounterProps {
  counts: Record<CountType, number>;
  onChange: (type: CountType, delta: number) => void;
  onPressNotice: () => void;
  maxCounts?: Partial<Record<CountType, number>>;
}

export default function PersonCounter({
  counts,
  onChange,
  onPressNotice,
  maxCounts,
}: PersonCounterProps) {
  return (
    <View>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>인원을 선택해주세요</Text>
        <TouchableOpacity onPress={onPressNotice}>
          <Text style={styles.infoButton}>운휴안내</Text>
        </TouchableOpacity>
      </View>

      {[
        { label: '어른', key: 'adult' },
        { label: '청소년', key: 'teen' },
        { label: '어린이', key: 'child' },
      ].map(({ label, key }) => (
        <View key={key} style={styles.counterBox}>
          <Text style={styles.counterLabel}>{label}</Text>
          <View style={styles.counterControls}>
            <TouchableOpacity onPress={() => onChange(key as CountType, -1)}>
              <Ionicons name="remove-circle-outline" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.countText}>{counts[key as CountType]}</Text>
            <TouchableOpacity onPress={() => onChange(key as CountType, 1)}>
              <Ionicons name="add-circle-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: '500',
    paddingVertical: verticalScale(16),
    color: '#1d1d1d',
  },
  infoButton: {
    color: '#007aff',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  counterBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderColor: '#dcdcdc',
  },
  counterLabel: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: '#1d1d1d',
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  countText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    minWidth: scale(24),
    textAlign: 'center',
  },
});