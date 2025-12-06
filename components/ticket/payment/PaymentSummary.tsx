import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface SummaryProps {
  benefitTitle: string;
  visitDate: string;
  baseTotal: number;
  discountedTotal: number;
  couponDiscount?: number;
  onFinalPriceChange?: (price: number) => void;
}

const PaymentSummary = ({
  benefitTitle,
  visitDate,
  baseTotal,
  discountedTotal,
  couponDiscount = 0,
  onFinalPriceChange,
}: SummaryProps) => {
  const finalPrice = discountedTotal - couponDiscount;

  useEffect(() => {
    onFinalPriceChange?.(finalPrice);
  }, [finalPrice]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.benefitTitle}>{benefitTitle}</Text>
        <Text style={styles.visitDate}>{visitDate}</Text>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.row}>
          <View style={styles.badge}><Text style={styles.badgeText}>1</Text></View>
          <Text style={styles.label}>어른 (본인)</Text>
          <View style={styles.priceRow}>
            <Text style={styles.originalPrice}>{baseTotal.toLocaleString()}원</Text>
            <Text style={styles.discountedPrice}>{discountedTotal.toLocaleString()}원</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>총 주문금액</Text>
          <View style={styles.priceRow}>
            <Text style={styles.originalPrice}>{baseTotal.toLocaleString()}원</Text>
            <Text style={styles.discountedPrice}>{discountedTotal.toLocaleString()}원</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <View>
            <Text style={styles.label}>추가 할인금액</Text>
            <Text style={styles.subLabel}>· 쿠폰 할인</Text>
          </View>
          <Text style={styles.discountedPrice}>{couponDiscount.toLocaleString()}원</Text>
        </View>
      </View>
     
      <View style={styles.finalBox}>
        <Text style={styles.finalLabel}>결제예정금액</Text>
        <Text style={styles.finalPrice}>{finalPrice.toLocaleString()}원</Text>
      </View>
    </View>
  );
};

export default PaymentSummary;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: scale(8),
    overflow: 'hidden',
    marginTop: verticalScale(24),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
  },
  benefitTitle: {
    fontSize: moderateScale(16),
    color: '#111',
    fontWeight: '500',
    paddingVertical: verticalScale(4),
  },
  visitDate: {
    fontSize: moderateScale(16),
    color: '#007aff',
    fontWeight: '500',
  },
  infoBox: {
    borderTopWidth: 1,
    borderColor: '#d9d9d9',
  },
  badge: {
    backgroundColor: '#007aff',
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
    borderRadius: scale(4),
    marginRight: scale(8),
  },
  badgeText: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  label: {
    fontSize: moderateScale(14),
    color: '#111',
    flex: 1,
  },
  subLabel: {
    marginTop: verticalScale(4),
    fontSize: moderateScale(14),
    color: '#555',
  },
  priceRow: {
    flexDirection: 'row',
    gap: scale(8),
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: moderateScale(14),
    color: '#aaa',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#111',
  },
  finalBox: {
    backgroundColor: '#f9f9f9',
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
    borderTopWidth: 1,
    borderTopColor: '#d9d9d9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  finalLabel: {
    fontSize: moderateScale(16),
    color: '#111',
    fontWeight: '500',
  },
  finalPrice: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#DA291C',
  },
  divider: {
    height: 1,
    backgroundColor: '#d9d9d9',
    marginHorizontal: scale(16),
  },
});

