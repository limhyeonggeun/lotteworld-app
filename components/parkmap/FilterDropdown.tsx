import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export type FilterKey = '전체' | 'B1' | '1F' | '2F' | '3F' | '4F' | '실내' | '실외';

type Props = {
  visible: boolean;
  onClose: () => void;
  items: Array<{ label: string; key: FilterKey }>;
  selectedKey: FilterKey;
  onSelect: (key: FilterKey) => void;
};

export default function FilterDropdown({
  visible,
  onClose,
  items,
  selectedKey,
  onSelect,
}: Props) {
  if (!visible) return null;

  return (
    <>
      <TouchableOpacity style={Style.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={Style.box}>
        {items.map(({ label, key }) => {
          const active = selectedKey === key;
          return (
            <TouchableOpacity
              key={label}
              style={Style.item}
              onPress={() => onSelect(key)}
              activeOpacity={0.7}
            >
              <Text style={[Style.text, active && Style.textActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

const Style = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 9,
  },
  box: {
    position: 'absolute',
    top: verticalScale(60),
    right: scale(16),
    backgroundColor: '#fff',
    borderRadius: scale(8),
    paddingVertical: verticalScale(4),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 10,
  },
  item: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
  },
  text: {
    fontSize: moderateScale(14),
    color: '#111',
  },
  textActive: {
    fontWeight: '900',
    color: '#DA291C',
  },
});