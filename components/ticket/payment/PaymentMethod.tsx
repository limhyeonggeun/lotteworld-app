import CustomCheckbox from '@/components/common/CustomCheckbox';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface PaymentMethodProps {
  ticketId: string;
  selectedCard: string | null;
  onSelectCard: (cardName: string | null) => void;
  saved: boolean;
  onToggleSave: () => void;
  cardMap?: Record<string, any>;
}

const PaymentMethod = ({
  ticketId,
  selectedCard,
  onSelectCard,
  saved,
  onToggleSave,
  cardMap,
}: PaymentMethodProps) => {
  const cardList = cardMap ? Object.keys(cardMap) : [];
  const [selectedPaymentType, setSelectedPaymentType] = useState<'card' | 'lpay'>('card');

  const handleSelectPaymentType = (type: 'card' | 'lpay') => {
    setSelectedPaymentType(type);
    if (type === 'lpay') {
      onSelectCard(null);
    }
  };

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.title}>결제 수단</Text>
      </View>

      <View style={styles.paymentTypeRow}>
        <TouchableOpacity
          style={styles.radioBox}
          onPress={() => handleSelectPaymentType('card')}
        >
          <View style={styles.radioCircle}>
            {selectedPaymentType === 'card' && <View style={styles.radioDot} />}
          </View>
          <Text style={styles.radioLabel}>신용카드</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioBox}
          onPress={() => handleSelectPaymentType('lpay')}
        >
          <View style={styles.radioCircle}>
            {selectedPaymentType === 'lpay' && <View style={styles.radioDot} />}
          </View>
          <Text style={styles.radioLabel}>L.pay</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {selectedPaymentType === 'card' ? (
        <View style={styles.saveOptionRow}>
          <CustomCheckbox checked={saved} onChange={onToggleSave} />
          <Text style={styles.saveLabel}>선택한 결제수단 저장</Text>
        </View>
      ) : (
        <View style={styles.lpayNoticeWrapper}>
          <Text style={styles.lpayNotice}>L.pay에 아직 가입하지 않으셨습니다.</Text>
        </View>
      )}

      {selectedPaymentType === 'card' && (
        <View style={styles.cardListWrapper}>
          {cardList.length > 0 ? (
            cardList.map((cardName) => (
              <TouchableOpacity
                key={cardName}
                style={[
                  styles.cardButton,
                  selectedCard === cardName && styles.cardButtonSelected,
                ]}
                onPress={() =>
                  selectedCard === cardName
                    ? onSelectCard(null)
                    : onSelectCard(cardName)
                }
              >
                <Text
                  style={[
                    styles.cardText,
                    selectedCard === cardName && styles.cardTextSelected,
                  ]}
                >
                  {cardName}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>사용 가능한 카드가 없습니다.</Text>
          )}
        </View>
      )}

      <View style={styles.divider} />
    </View>
  );
};

export default PaymentMethod;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(16),
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
    color: '#111',
  },
  paymentTypeRow: {
    flexDirection: 'row',
    gap: scale(16),
    alignItems: 'center',
    marginVertical: verticalScale(16),
    paddingHorizontal: scale(8),
  },
  radioBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: scale(20),
    width: scale(20),
    borderRadius: scale(10),
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(8),
  },
  radioDot: {
    height: scale(8),
    width: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#DA291C',
  },
  radioLabel: {
    fontSize: moderateScale(16),
    color: '#111',
  },
  saveOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(16),
    paddingHorizontal: scale(8),
  },
  saveLabel: {
    marginLeft: scale(8),
    fontSize: moderateScale(16),
    color: '#111',
  },
  lpayNoticeWrapper: {
    marginVertical: verticalScale(16),
    paddingHorizontal: scale(8),
  },
  lpayNotice: {
    fontSize: moderateScale(16),
    color: '#DA291C',
    textAlign: 'center',
  },
  cardListWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(16),
    paddingHorizontal: scale(8),
    marginBottom: verticalScale(16),
  },
  cardButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: scale(6),
    width: '100%',
    paddingVertical: verticalScale(12),
    backgroundColor: '#fff',
  },
  cardButtonSelected: {
    borderWidth: 2,
    borderColor: '#DA291C',
    backgroundColor: '#fff',
  },
  cardText: {
    textAlign: 'center',
    fontSize: moderateScale(16),
    color: '#111',
  },
  cardTextSelected: {
    color: '#111',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: moderateScale(14),
    color: '#888',
    marginTop: verticalScale(8),
  },
  divider: {
    height: 1,
    backgroundColor: '#d9d9d9',
  },
});