import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

type Props = {
  selectedTab: 'myticket' | 'purchase';
  onTabChange: (tab: 'myticket' | 'purchase') => void;
};

export default function TicketTabs({ selectedTab, onTabChange }: Props) {
  return (
    <View style={styles.headerBar}>
      <TouchableOpacity
        style={[
          styles.headerSection,
          selectedTab === 'myticket' && styles.activeTabBorder,
        ]}
        onPress={() => onTabChange('myticket')}
      >
        <Text
          style={[
            styles.tabText,
            selectedTab !== 'myticket' && styles.inactiveText,
          ]}
        >
          MY 티켓
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.headerSection,
          selectedTab === 'purchase' && styles.activeTabBorder,
        ]}
        onPress={() => onTabChange('purchase')}
      >
        <Text
          style={[
            styles.tabText,
            selectedTab !== 'purchase' && styles.inactiveText,
          ]}
        >
          티켓 구매
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    height: verticalScale(48),
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  activeTabBorder: {
    borderBottomWidth: 2,
    borderBottomColor: '#DA291C',
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#111',
  },
  inactiveText: {
    color: '#717171',
  },
});