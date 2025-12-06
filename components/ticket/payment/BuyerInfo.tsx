import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useUser } from '../../../context/UserContext';

interface BuyerInfoDisplayProps {
  onEdit?: () => void;
}

const BuyerInfoDisplay = ({ onEdit }: BuyerInfoDisplayProps) => {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useLocalSearchParams<Record<string, string>>();

  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      router.replace({
        pathname: '/auth/LoginScreen',
        params: {
          redirectTo: pathname.includes('/Login') ? '/(tabs)' : pathname,
          ...searchParams,
        },
      });
    }
  }, [user]);

  if (user === undefined) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (user === null) {
    return null;
  }

  const formatPhoneNumber = (phone: string) => {
    if (!phone || phone.length !== 11) return phone;
    return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7, 11)}`;
  };

  return (
    <>
      <View style={styles.headerRow}>
        <Text style={styles.title}>구매자 정보</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.label}>이름</Text>
          <View style={styles.contentWrapper}>
            <Text style={styles.content}>{user.name}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>이메일</Text>
          <View style={styles.contentWrapper}>
            <Text style={styles.content}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>휴대폰</Text>
          <View style={styles.contentWrapper}>
            <Text style={styles.content}>
              {user.phone ? formatPhoneNumber(user.phone) : '미등록'}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default BuyerInfoDisplay;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: -scale(16),
    paddingHorizontal: scale(16),
    backgroundColor: '#fafafa',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E4',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E4',
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: '500',
    paddingVertical: verticalScale(16),
    color: '#1d1d1d',
  },
  table: {
    paddingHorizontal: verticalScale(8),
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d9d9d9',
    paddingVertical: verticalScale(14),
  },
  label: {
    width: scale(80),
    fontSize: moderateScale(16),
    color: '#111',
    fontWeight: '500',
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'column',
    gap: verticalScale(8),
  },
  content: {
    fontSize: moderateScale(14),
    color: '#333',
  },
});