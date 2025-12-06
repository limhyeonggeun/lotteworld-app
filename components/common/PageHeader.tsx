import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

type Props = {
  title: string;
  onBack: () => void;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  showBorder?: boolean; 
  right?: React.ReactNode;
};

const PageHeader: React.FC<Props> = ({
  title,
  onBack,
  backgroundColor = '#fff',
  textColor = '#111',
  iconColor = '#111',
  showBorder = true,
  right, 
}) => {
  return (
    <View
      style={[
        styles.header,
        { backgroundColor },
        !showBorder && { borderBottomWidth: 0 }, 
      ]}
    >
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="chevron-back" size={24} color={iconColor} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: textColor }]}>{title}</Text>

      <View style={{ width: scale(24), alignItems: 'flex-end' }}>
        {right ?? null}
      </View>
    </View>
  );
};

export default PageHeader;

const styles = StyleSheet.create({
  header: {
    height: verticalScale(56),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
});