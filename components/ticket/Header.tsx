import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>티켓</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    height: verticalScale(56),
    paddingHorizontal: scale(16),
    backgroundColor: 'white', 
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: scale(20),
    fontWeight: 'bold',
    color: '#111', 
  },
});