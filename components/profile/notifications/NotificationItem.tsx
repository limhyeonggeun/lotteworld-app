import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export interface NotificationItemProps {
  id: string;
  type: string;
  title: string;
  content: string;
  date: string;
  icon: string;
  color: string;
  onCancel?: () => void;
}

export default function NotificationItem({
  title,
  content,
  date,
  icon,
  color,
  onCancel,
}: NotificationItemProps) {
  return (
    <View style={styles.card}>
      <Ionicons name={icon as any} size={scale(24)} color={color} style={styles.icon} />
      <View style={styles.textBox}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.date}>{dayjs(date).format('YYYY-MM-DD HH:mm')}</Text>
      </View>
      <TouchableOpacity style={styles.cancelBox} onPress={onCancel}>
        <Text style={styles.cancelText}>삭제</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  icon: {
    marginTop: verticalScale(2),
    marginRight: scale(12),
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: '#111',
  },
  content: {
    fontSize: moderateScale(14),
    color: '#555',
    marginTop: verticalScale(6),
  },
  date: {
    fontSize: moderateScale(13),
    color: '#aaa',
    marginTop: verticalScale(6),
  },
  cancelBox: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: 4,
    alignSelf: 'center',
    marginLeft: scale(8),
  },
  cancelText: {
    fontSize: moderateScale(14),
    color: '#ff4444',
    fontWeight: '500',
  },
});