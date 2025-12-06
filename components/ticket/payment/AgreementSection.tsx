import CustomCheckbox from '@/components/common/CustomCheckbox';
import { TERMS_CONTENT } from '@/components/ticket/data/termsContent';
import TermsModal from '@/components/ticket/modals/TermsModal';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const AGREEMENTS = [
  { id: 'terms', label: '전자상거래 이용약관', required: true },
  { id: 'privacy', label: '개인정보 수집ㆍ이용', required: true },
  { id: 'marketing', label: '마케팅 정보 수신 동의', required: false },
  { id: 'thirdParty', label: '제3자 제공 동의', required: false },
];

interface AgreementSectionProps {
  finalPrice: number;
  buyer: {
    name: string;
    email: string;
    phone: string;
  };
  visitor: {
    name: string;
    email: string;
    phone: string;
  };
  orderName: string;
  payMethod: string;
  visitDate?: string;
  visitDateISO?: string;
  counts: Record<string, number>;
  quantity: number;
  ticketId: string;
  userId: number | string;
  onSubmit: () => Promise<void>;
}

export default function AgreementSection({
  finalPrice,
  buyer,
  visitor,
  orderName,
  payMethod,
  visitDate,
  visitDateISO,
  counts,
  quantity,
  ticketId,
  userId,
}: AgreementSectionProps) {
  const router = useRouter();

  const [checkedItems, setCheckedItems] = useState(
    AGREEMENTS.reduce((acc, cur) => ({ ...acc, [cur.id]: false }), {} as Record<string, boolean>)
  );
  const [selectedTermsId, setSelectedTermsId] = useState<string | null>(null);

  const selectedTerms = TERMS_CONTENT.find((item) => item.id === selectedTermsId);
  const allAgreed = AGREEMENTS.every((item) => checkedItems[item.id]);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = () => {
    const next = !allAgreed;
    const updated = AGREEMENTS.reduce((acc, cur) => ({ ...acc, [cur.id]: next }), {});
    setCheckedItems(updated);
  };

  const handlePay = () => {
    if (!finalPrice || finalPrice <= 0) {
      alert('결제 금액 오류');
      return;
    }

    const requiredUnagreed = AGREEMENTS.some((item) => item.required && !checkedItems[item.id]);
    if (requiredUnagreed) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

    router.push({
      pathname: '/(stack)/ticket/TestCheckoutScreen',
      params: {
        mode: 'pay',
        amount: String(finalPrice),
        ticketId,
        userId,
        orderName,
        buyerName: buyer.name,
        buyerEmail: buyer.email,
        buyerTel: buyer.phone,
        visitorName: visitor.name,
        visitorEmail: visitor.email,
        visitorPhone: visitor.phone,
        visitDate: visitDateISO ?? visitDate,
        payMethod,
        quantity: String(quantity),
        counts: JSON.stringify(counts ?? {}),
      },
    } as never);
  };

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.title}>약관 동의</Text>
        <TouchableOpacity style={styles.allAgreeButton} onPress={toggleAll}>
          <CustomCheckbox checked={allAgreed} onChange={toggleAll} />
          <Text style={styles.allAgreeLabel}>전체동의</Text>
        </TouchableOpacity>
      </View>

      {AGREEMENTS.map((item) => (
        <View key={item.id} style={styles.agreementRow}>
          <CustomCheckbox
            checked={checkedItems[item.id]}
            onChange={() => toggleItem(item.id)}
          />
          <Text style={styles.agreementLabel}>
            {item.label}{' '}
            <Text style={item.required ? styles.requiredTag : styles.optionalTag}>
              ({item.required ? '필수' : '선택'})
            </Text>
          </Text>
          <TouchableOpacity onPress={() => setSelectedTermsId(item.id)} style={styles.detailButton}>
            <Text style={styles.detailButtonText}>전문보기</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TermsModal
        visible={!!selectedTermsId}
        onClose={() => setSelectedTermsId(null)}
        onConfirm={() => {
          if (selectedTermsId) {
            setCheckedItems((prev) => ({
              ...prev,
              [selectedTermsId]: true,
            }));
          }
          setSelectedTermsId(null);
        }}
        title={selectedTerms?.title ?? ''}
        content={selectedTerms?.content ?? ''}
      />

      <Text style={styles.notice}>필수 항목에 모두 동의하셔야 서비스를 이용하실 수 있습니다.</Text>
      <View style={styles.divider} />

      <TouchableOpacity style={styles.payButton} onPress={handlePay}>
        <Text style={styles.payButtonText}>{finalPrice.toLocaleString()}원 결제하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(32),
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
  allAgreeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allAgreeLabel: {
    marginLeft: scale(8),
    fontSize: moderateScale(16),
    color: '#111',
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(8),
  },
  detailButton: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: scale(4),
    borderWidth: 1,
    borderColor: '#ccc',
    marginLeft: scale(8),
  },
  detailButtonText: {
    fontSize: moderateScale(14),
    color: '#111',
  },
  notice: {
    fontSize: moderateScale(14),
    color: '#666',
    marginTop: verticalScale(8),
  },
  divider: {
    marginTop: verticalScale(16),
    height: 1,
    backgroundColor: '#ddd',
  },
  agreementLabel: {
    fontSize: moderateScale(16),
    marginLeft: scale(8),
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    color: '#111',
  },
  requiredTag: {
    color: '#DA291C',
    fontWeight: '500',
  },
  optionalTag: {
    color: '#555',
  },
  payButton: {
    marginVertical: verticalScale(16),
    backgroundColor: '#DA291C',
    paddingVertical: verticalScale(16),
    borderRadius: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: '600',
  },
});