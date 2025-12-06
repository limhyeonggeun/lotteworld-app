"use client";

import { modalStyles } from '@/styles/modalStyles';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '@/utils/axios';

interface FacilityStatusModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
}

const formatDate = (date: Date) =>
  `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;

const formatDateForQuery = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const isSameOrBeforeToday = (date: Date) => {
  const today = new Date();
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return d <= today;
};

export default function FacilityStatusModal({
  visible,
  onClose,
  selectedDate: initialDate,
}: FacilityStatusModalProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [dataForDate, setDataForDate] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedDate(initialDate);
  }, [initialDate]);

  useEffect(() => {
    fetchDataForDate(selectedDate);
  }, [selectedDate]);

  const fetchDataForDate = async (date: Date) => {
    const formattedDate = formatDateForQuery(date);
    setLoading(true);
    try {
      const res = await api.get(`/api/maintenance?date=${formattedDate}`);
      setDataForDate(res.data);
    } catch (error) {
      console.error('운휴 데이터 불러오기 실패:', error);
      setDataForDate([]);
    } finally {
      setLoading(false);
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const isTodayOrBefore = isSameOrBeforeToday(selectedDate);

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={modalStyles.overlay}>
        <View style={[styles.container]}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>운영 / 운휴 안내</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#1d1d1d" />
            </TouchableOpacity>
          </View>

          <View style={styles.dateRow}>
            <TouchableOpacity
              onPress={() => changeDate(-1)}
              disabled={isTodayOrBefore}
              style={isTodayOrBefore ? styles.disabledButton : undefined}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={isTodayOrBefore ? '#ccc' : '#1d1d1d'}
              />
            </TouchableOpacity>
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            <TouchableOpacity onPress={() => changeDate(1)}>
              <Ionicons name="chevron-forward" size={24} color="#1d1d1d" />
            </TouchableOpacity>
          </View>

          <ImageBackground
            source={require('@/assets/images/noticebg.jpg')}
            style={styles.banner}
            resizeMode="cover"
          >
            <View style={styles.timeOverlay}>
              <Text style={styles.timeLabel}>운영 시간</Text>
              <Text style={styles.timeValue}>10:00 - 22:00</Text>
            </View>
          </ImageBackground>

          <Text style={styles.sectionTitle}>오늘의 운휴 시설</Text>

          {loading ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>불러오는 중...</Text>
            </View>
          ) : dataForDate.length > 0 ? (
            <FlatList
              data={dataForDate}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              keyExtractor={(item) => item.id.toString()}
              style={{ minHeight: 130 }}
              renderItem={({ item }) => (
                <View style={styles.imageWrapper}>
                  <ImageBackground
                    source={{ uri: `${api.defaults.baseURL}${item.imageUrl}` }} 
                    style={styles.imageCard}
                    imageStyle={{ borderRadius: 12 }}
                  />
                  <Text style={styles.imageLabel}>{item.label}</Text>
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>오늘은 운휴 시설이 없습니다.</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    width: '90%',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  headerRow: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1d1d1d',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    gap: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '500',
  },
  banner: {
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  timeOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  imageCard: {
    width: '100%',
    height: 80,
    borderRadius: 4,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
  },
  imageLabel: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#1d1d1d',
  },
  emptyBox: {
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
  },
})