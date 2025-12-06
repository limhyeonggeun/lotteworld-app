import { CHIP_LABELS } from '@/data/parkMap.data';
import React, { memo, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface Props {
  activeIndex?: number;
  onSelect?: (index: number) => void;
  withPadding?: boolean;
}

export default memo(function BottomChips({
  activeIndex,
  onSelect,
  withPadding = true,
}: Props) {
  const isControlled = typeof activeIndex === 'number';
  const [internalIndex, setInternalIndex] = useState<number>(activeIndex ?? 0);

  useEffect(() => {
    if (isControlled) setInternalIndex(activeIndex!);
  }, [isControlled, activeIndex]);

  const handlePress = (i: number) => {
    if (!isControlled) setInternalIndex(i);
    onSelect?.(i);
  };

  const cur = isControlled ? (activeIndex as number) : internalIndex;

  return (
    <View style={Style.bar}>
      <View style={Style.chipsGutter}>
        <FlatList
          horizontal
          data={CHIP_LABELS}
          keyExtractor={(label) => label}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={Style.row}
          ListHeaderComponent={withPadding ? () => <View style={{ width: scale(16) }} /> : null}
          ListFooterComponent={withPadding ? () => <View style={{ width: scale(16) }} /> : null}
          ItemSeparatorComponent={() => <View style={{ width: scale(8) }} />}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => handlePress(index)}
              style={[
                Style.chip,
                index === cur ? Style.chipActive : Style.chipInactive,
              ]}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: index === cur }}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Text style={[Style.chipText, index === cur && Style.chipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
});

const Style = StyleSheet.create({
  bar: {
    height: verticalScale(48),
    justifyContent: 'center',
    width: '100%',
  },
  chipsGutter: {
    width: '100%',
  },
  scroll: {
    width: '100%',
  },
  row: {
    alignItems: 'center',
  },
  edgeSpacer: {
    width: scale(16),
  },
  chip: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: scale(18),
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: '#DA291C', 
    borderColor: '#DA291C',
  },
  chipInactive: {
    backgroundColor: '#fff',
    borderColor: '#e6e6e6',
  },
  chipText: {
    fontSize: moderateScale(14),
    color: '#666',
  },
  chipTextActive: {
    color: '#fff', 
    fontWeight: '600',
  },
});