
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const NotificationSettingsForm = () => {
  const [settings, setSettings] = useState({
    all: true,
    parade: true,
    event: true,
    rideStatus: true,
  });

  const toggle = (key: keyof typeof settings) => {
    if (key === 'all') {
      const next = !settings.all;
      setSettings({
        all: next,
        parade: next,
        event: next,
        rideStatus: next,
      });
    } else {
      const newSettings = { ...settings, [key]: !settings[key] };
      const allOn = newSettings.parade && newSettings.event && newSettings.rideStatus;
      newSettings.all = allOn;
      setSettings(newSettings);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ToggleItem
        label="전체 알림"
        description="전체 알림 수신 여부를 설정합니다."
        value={settings.all}
        onToggle={() => toggle('all')}
      />
      <ToggleItem
        label="공연/퍼레이드 알림"
        description="공연 및 퍼레이드 관련 정보를 알려드려요."
        value={settings.parade}
        onToggle={() => toggle('parade')}
      />
      <ToggleItem
        label="이벤트 알림"
        description="이벤트 관련 소식을 알려드려요."
        value={settings.event}
        onToggle={() => toggle('event')}
      />
      <ToggleItem
        label="어트랙션 운영 상태 알림"
        description="놀이기구의 운행 정보 상황을 알려드려요."
        value={settings.rideStatus}
        onToggle={() => toggle('rideStatus')}
      />
    </ScrollView>
  );
};

function ToggleItem({
  label,
  description,
  value,
  onToggle,
}: {
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.toggleItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleDesc}>{description}</Text>
      </View>
      <Switch value={value} onValueChange={onToggle} />
    </View>
  );
}

export default NotificationSettingsForm;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(24),
    gap: verticalScale(24),
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
  },
  toggleLabel: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: '#111',
  },
  toggleDesc: {
    fontSize: moderateScale(14),
    color: '#666',
    marginTop: verticalScale(6),
  },
});