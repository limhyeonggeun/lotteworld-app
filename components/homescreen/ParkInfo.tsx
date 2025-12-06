import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function ParkInfo() {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [weatherIcon, setWeatherIcon] = useState<string | null>(null);
  const [noticeIndex, setNoticeIndex] = useState(0);

  const notices = [
    '후렌치 레볼레이션 이용 제한 안내 (09.21.)',
    '신밧드의모험 운영 변경 안내 (10.01.)',
    '<포켓몬 월드 어드벤처 : 고스트 대소동> (09.06.)',
  ];

  const today = new Date();
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const formattedDate = `${today.getFullYear()}년 ${String(today.getMonth() + 1).padStart(2, '0')}월 ${String(today.getDate()).padStart(2, '0')}일 ${days[today.getDay()]}`;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const lat = 37.5113; 
        const lon = 127.0980; 
        const apiKey = '35a445cd7d29116c4deff31057aa1cce'; 

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`
        );
        const data = await res.json();

        if (data && data.main && data.weather && data.weather[0]) {
          setTemperature(data.main.temp);
          setWeatherIcon(data.weather[0].icon);
        } 
      } catch (error) {
        console.error('날씨 가져오기 실패:', error);
      }
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNoticeIndex((prev) => (prev + 1) % notices.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.dateText}>{formattedDate}</Text>

      <View style={styles.mainRow}>
        <View>
          <Text style={styles.title}>오늘의 파크 운영 시간</Text>
          <Text style={styles.time}>10:00 ~ 22:00</Text>
        </View>
        <View style={styles.weatherBox}>
          {weatherIcon && (
            <Image
              source={{ uri: `https://openweathermap.org/img/wn/${weatherIcon}@2x.png` }}
              style={styles.weatherIcon}
            />
          )}
          {temperature !== null && (
            <Text style={styles.temperature}>{temperature.toFixed(1)}℃</Text>
          )}
        </View>
      </View>

      <View style={styles.noticeBox}>
        <Text
          style={styles.noticeText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {notices[noticeIndex]}
        </Text>
        <Text style={styles.noticePage}>
          <Text style={{ color: '#1d1d1d' }}>{noticeIndex + 1}</Text>
          <Text style={{ color: '#999' }}> / {notices.length}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 40,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    color: '#1d1d1d',
    fontWeight: 'bold',
  },
  time: {
    fontSize: 18,
    color: '#1d1d1d',
    fontWeight: 'bold',
    marginTop: 4,
  },
  weatherBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weatherIcon: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  temperature: {
    fontSize: 20,
    color: '#1d1d1d',
    fontWeight: 'bold',
  },
  noticeBox: {
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    marginTop: 16,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noticeText: {
    fontSize: 14,
    color: '#333',
    maxWidth: 250,
  },
  noticePage: {
    fontSize: 14,
    color: '#999',
  },
});