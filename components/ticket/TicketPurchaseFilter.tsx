import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  moderateScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';

const FILTERS = ['롯데월드 티켓', '제휴 할인', '이달의 할인', '매직패스'] as const;
type FilterType = typeof FILTERS[number];

type Props = {
  selectedFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
};

const TicketPurchaseFilter = ({ selectedFilter, onSelectFilter }: Props) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => onSelectFilter(filter)}
            style={[
              styles.button,
              selectedFilter === filter && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.text,
                selectedFilter === filter && styles.activeText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
    paddingVertical: verticalScale(8),
    marginBottom: verticalScale(16),
  },
  container: {
    paddingHorizontal: scale(24),
    gap: scale(8),
  },
  button: {
    height: verticalScale(40),
    paddingHorizontal: scale(16),
    borderRadius: scale(100),
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#DA291C',
  },
  text: {
    color: '#333',
    fontSize: moderateScale(14),
  },
  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default TicketPurchaseFilter;