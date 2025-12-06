import PageHeader from '@/components/common/PageHeader';
import NotificationList, { NotificationData } from '@/components/profile/notifications/NotificationList';
import { useUser } from '@/context/UserContext';
import api from '@/utils/axios';
import { useSafeBack } from '@/utils/navigation';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const handleBack = useSafeBack('/');

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/api/notifications/user/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
  
        const mapped: NotificationData[] = res.data.map((item: any) => ({
          id: String(item.id),
          type: item.type,
          title: item.title,
          content: item.content,
          date: item.createdAt,
          status: item.status,
        }));
  
        setNotifications(mapped);
      } catch (e) {
        console.error('알림 가져오기 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  const handleCancel = async (id: string) => {
    try {
      await api.put(`/api/notifications/${id}`, { read: true });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      console.warn('알림 숨김 처리 실패:', e);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#999" />
        </View>
      );
    }
    if (notifications.length === 0) {
      return (
        <View style={styles.emptyWrap}>
          <Ionicons name="notifications-off-outline" size={48} color="#aaa" />
          <View style={{ height: 12 }} />
          <Text style={styles.emptyText}>받은 알림이 없습니다</Text>
        </View>
      );
    }
    return <NotificationList data={notifications} onCancel={handleCancel} />;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <PageHeader
        title="알림함"
        onBack={handleBack}
        right={
          <TouchableOpacity onPress={() => router.push('/profile/NotificationSettingsScreen')}>
            <Ionicons name="settings-outline" size={24} color="#111" />
          </TouchableOpacity>
        }
      />
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
});
