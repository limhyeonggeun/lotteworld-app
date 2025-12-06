import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';
import NotificationItem from './NotificationItem';
import { ICON_MAP, NotificationType } from './iconMap';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  date: string;
}

interface NotificationListProps {
  data: NotificationData[];
  onCancel?: (id: string) => void;
}

export default function NotificationList({ data, onCancel }: NotificationListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <NotificationItem
          {...item}
          icon={ICON_MAP[item.type]?.icon ?? 'notifications-outline'}
          color={ICON_MAP[item.type]?.color ?? '#aaa'}
          onCancel={() => onCancel?.(item.id)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: verticalScale(12),
  },
});