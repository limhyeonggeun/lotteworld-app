import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

type Row = { label: string; value: string };
type Counts = { adult?: number; teen?: number; child?: number };

interface Props {
  title?: string;
  orderId?: string;
  orderName?: string;
  amount?: number;
  visitDate?: string;
  ticketNo?: string;
  quantityLabel?: string;
  counts?: Counts;
  paymentMethod?: string;
  couponAmount?: number;
  pointAmount?: number;
  leftButtonLabel?: string;
  rightButtonLabel?: string;
  onPressLeft: () => void;
  onPressRight: () => void;
  extraRows?: Row[];
}

export default function PaymentCompleteCard({
  title = '예매가 완료되었습니다.',
  orderId,
  orderName,
  amount = 0,
  visitDate = '',
  ticketNo = '',
  quantityLabel,
  counts,
  paymentMethod = '삼성카드',
  couponAmount = 0,
  pointAmount = 0,
  leftButtonLabel = '예매내역',
  rightButtonLabel = '티켓확인',
  onPressLeft,
  onPressRight,
  extraRows = [],
}: Props) {
  const resolvedQuantityLabel = useMemo(() => {
    if (quantityLabel) return quantityLabel;
    const parts: string[] = [];
    const a = counts?.adult ?? 0;
    const t = counts?.teen ?? 0;
    const c = counts?.child ?? 0;
    const total = a + t + c;
    if (a > 0) parts.push(`어른 ${a}명`);
    if (t > 0) parts.push(`청소년 ${t}명`);
    if (c > 0) parts.push(`어린이 ${c}명`);
    if (parts.length === 0) return '총 0매';
    return `총 ${total}매 (${parts.join(', ')})`;
  }, [quantityLabel, counts]);

  const rows: Row[] = useMemo(() => {
    const money = (n: number) => `${Number(n || 0).toLocaleString()} 원`;
    return [
      { label: '주문번호', value: orderId || '-' },
      { label: '예매상품', value: orderName || '-' },
      { label: '수량', value: resolvedQuantityLabel },
      { label: '예매번호', value: ticketNo || '-' },
      { label: '이용예정일', value: visitDate || '-' },
      { label: '총티켓금액', value: money(amount) },
      { label: '결제수단', value: paymentMethod },
      { label: '결제금액', value: money(amount) },
      { label: '쿠폰할인', value: money(couponAmount) },
      { label: '포인트 결제금액', value: money(pointAmount) },
      ...extraRows,
    ];
  }, [
    orderId,
    orderName,
    resolvedQuantityLabel,
    ticketNo,
    visitDate,
    amount,
    paymentMethod,
    couponAmount,
    pointAmount,
    extraRows,
  ]);

  return (
    <View>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={styles.check}>✓</Text>
        </View>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.actionBtn, styles.actionBtnOutline]}
            onPress={onPressLeft}
          >
            <Text style={[styles.actionText, styles.actionTextOutline]}>{leftButtonLabel}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.actionBtn, styles.actionBtnFilled]}
            onPress={onPressRight}
          >
            <Text style={styles.actionText}>{rightButtonLabel}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.table}>
          {rows.map((r, idx) => (
            <View key={idx} style={styles.row}>
              <View style={styles.cellLabel}>
                <Text style={styles.label}>{r.label}</Text>
              </View>
              <View style={styles.cellValue}>
                <Text style={styles.value}>{r.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeTitle}>예매취소 및 변경</Text>
          <Text style={styles.noticeItem}>• 인터넷/모바일 예매건은 예매취소 후 다시 예매해 주세요.</Text>
          <Text style={styles.noticeItem}>• 사용 후에는 취소가 불가합니다.</Text>
          <Text style={styles.noticeItem}>• 일부 상품은 취소/변경이 제한될 수 있습니다.</Text> 

          <Text style={styles.noticeTitle}>이용안내</Text>
          <Text style={styles.noticeItem}>1. 카카오톡 알림톡으로 발송된 웹티켓 URL 확인</Text>
          <Text style={styles.noticeItem}>2. 게이트에서 웹티켓 제시 후 입장</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    card: {
      paddingVertical: verticalScale(24),
    },
    iconCircle: {
      width: scale(56),
      height: scale(56),
      borderRadius: scale(28),
      borderWidth: 2,
      borderColor: '#E4E4E4',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: verticalScale(10),
    },
    check: { 
        fontSize: moderateScale(24), 
        color: '#8c8c8c', 
        fontWeight: '700' 
    },
    title: {
      fontSize: moderateScale(18),
      color: '#111',
      textAlign: 'center',
      marginBottom: verticalScale(16),
      fontWeight: '600',
    },
    actionRow: {
      flexDirection: 'row',
      gap: scale(16),
      justifyContent: 'center',
      marginBottom: verticalScale(16),
    },
    actionBtn: {
      flex: 1,
      height: verticalScale(40),
      borderRadius: scale(4),
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionBtnOutline: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#DA291C',
    },
    actionBtnFilled: {
      backgroundColor: '#DA291C',
    },
    actionText: {
      color: '#fff',
      fontSize: moderateScale(16),
      fontWeight: '500',
    },
    actionTextOutline: {
      color: '#DA291C',
    },
    divider: {
      height: 1,
      backgroundColor: '#E4E4E4',
      marginVertical: verticalScale(16),
    },
    table: {
      borderWidth: 1,
      borderColor: '#E4E4E4',
      borderRadius: scale(4),
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#E4E4E4',
    },
    cellLabel: {
      width: '40%',
      backgroundColor: '#fafafa',
      paddingVertical: verticalScale(14),
      paddingHorizontal: scale(16),
      borderRightWidth: 1,
      borderRightColor: '#E4E4E4',
    },
    cellValue: {
      flex: 1,
      paddingVertical: verticalScale(14),
      paddingHorizontal: scale(16),
    },
    label: {
      fontSize: moderateScale(14),
      color: '#444',
    },
    value: {
      fontSize: moderateScale(14),
      color: '#111',
    },
    noticeBox: {
      marginTop: verticalScale(16),
      backgroundColor: '#fff',
    },
    noticeTitle: {
      fontSize: moderateScale(18),
      color: '#444',
      fontWeight: '600',
      marginTop: verticalScale(16),
      marginBottom: verticalScale(8),
    },
    noticeItem: {
      fontSize: moderateScale(14),
      color: '#666',
      lineHeight: verticalScale(16),
      marginBottom: verticalScale(4),
    },
  });