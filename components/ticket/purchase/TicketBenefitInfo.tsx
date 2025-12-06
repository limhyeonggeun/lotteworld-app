import api from '@/utils/axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import CardBenefitSection from './CardBenefitSection';
import MonthlyBenefitSection from './MonthlyBenefitSection';
import type { CountType } from './PersonCounter';
import TicketAccordion from './TicketAccordion';

interface Props {
  ticketId: string;
  counts?: { adult: number; teen: number; child: number };
  cardMap: Record<string, any>;
  onSelectTicket?: (optionName: string, cardName?: string) => void;
  onChangeMaxCounts?: (maxCounts?: Partial<Record<CountType, number>>) => void;
  onPriceChange?: (price: number) => void;
  visitDate?: string;
}

interface BenefitData {
  categoryMap: Record<'monthly' | 'card' | 'point', string[]>;
  cardMap: Record<string, any>;
}

export default function TicketBenefitInfo({
  ticketId,
  onSelectTicket,
  onChangeMaxCounts,
  counts,
  onPriceChange,
  visitDate,
}: Props) {
  const [benefitInfo, setBenefitInfo] = useState<BenefitData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'monthly' | 'card' | 'point'>('card');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedOptionName, setSelectedOptionName] = useState<string | undefined>(undefined);
  const [selectedCardName, setSelectedCardName] = useState<string | undefined>(undefined); 
  const router = useRouter();

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const response = await api.get(`/api/benefits/${ticketId}`, {
          params: { category: selectedCategory },
        });
  
        const { categoryMap, cardMap } = response.data;
  
        let filteredCardMap: Record<string, any> = {};
        const keys: string[] = categoryMap[selectedCategory] || [];
  
        if (keys.length === 0 && !benefitInfo) {
          const fallback = ['monthly', 'card', 'point'] as const;
          const next = fallback.find((cat) => categoryMap?.[cat]?.length > 0);
          if (next && next !== selectedCategory) {
            setSelectedCategory(next);
            return;
          }
        }
  
        keys.forEach((cardName: string) => {
          if (cardMap[cardName]) {
            filteredCardMap[cardName] = cardMap[cardName];
          }
        });
  
        setBenefitInfo({ categoryMap, cardMap: filteredCardMap });
      } catch (error) {
        console.error('혜택 불러오기 실패', error); 
      }
    };
  
    fetchBenefits();
  }, [ticketId, selectedCategory]);

  const totalBenefits = useMemo(() => {
    if (!benefitInfo?.cardMap) return 0;
    return Object.values(benefitInfo.cardMap).reduce(
      (acc, options) => acc + Object.keys(options).length,
      0
    );
  }, [benefitInfo]);

  if (!benefitInfo) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: 'gray' }}>혜택 정보를 불러오는 중입니다...</Text>
      </View>
    );
  }

  const { categoryMap, cardMap } = benefitInfo;

  const categoryCountMap = {
    monthly: { label: '이달의 혜택', count: categoryMap.monthly.length },
    card: { label: '제휴카드', count: categoryMap.card.length },
    point: { label: '포인트', count: categoryMap.point.length },
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>총 {totalBenefits}개의 혜택</Text>
      </View>

      <View style={styles.tabButtons}>
        {(['monthly', 'card', 'point'] as const).map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.tabButton, selectedCategory === key && styles.tabButtonSelected]}
            onPress={() => setSelectedCategory(key)}
          >
            <Text
              style={[
                styles.tabButtonText,
                selectedCategory === key && styles.tabButtonTextSelected,
              ]}
            >
              {categoryCountMap[key].label} ({categoryCountMap[key].count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedCategory === 'card' && Object.keys(cardMap).length > 0 ? (
        <CardBenefitSection
          ticketId={ticketId}
          cardMap={cardMap}
          counts={counts}
          onSelectTicket={(name, cardName) => {
            setSelectedOptionName(name);
            setSelectedCardName(cardName); 
            onSelectTicket?.(name, cardName);
          }}
          onChangeMaxCounts={onChangeMaxCounts}
          onPriceChange={(price) => {
            setTotalPrice(price);
            onPriceChange?.(price);
          }}
        />
      ) : selectedCategory === 'card' ? (
        <Text style={styles.emptyText}>해당 내역이 없습니다.</Text>
      ) : null}

      {selectedCategory === 'monthly' && Object.keys(cardMap).length > 0 ? (
        <MonthlyBenefitSection
          ticketId={ticketId}
          benefitOptions={cardMap}
          counts={counts}
          onSelectTicket={(name, cardName) => {
            setSelectedOptionName(name);
            setSelectedCardName(cardName); 
            onSelectTicket?.(name, cardName);
          }}
          onChangeMaxCounts={onChangeMaxCounts}
          onPriceChange={(price) => {
            setTotalPrice(price);
            onPriceChange?.(price);
          }}
        />
      ) : selectedCategory === 'monthly' ? (
        <Text style={styles.emptyText}>해당 내역이 없습니다.</Text>
      ) : null}

      {selectedCategory === 'point' && categoryMap.point.length > 0 ? (
        categoryMap.point.map((pointText, idx) => (
          <Text key={idx} style={styles.categoryText}>{pointText}</Text>
        ))
      ) : selectedCategory === 'point' ? (
        <Text style={styles.emptyText}>해당 내역이 없습니다.</Text>
      ) : null}

      <View style={styles.divider} />

      <TicketAccordion />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => {
            if (totalPrice === 0 || !selectedOptionName) return alert('티켓 옵션을 선택해 주세요.');
            router.push({
              pathname: `/ticket/TicketPaymentScreen`,
              params: {
                ticketId,
                selectedDate: visitDate ?? '',
                totalPrice: String(totalPrice),
                optionName: selectedOptionName,
                cardName: selectedCardName, 
                counts: JSON.stringify(counts ?? {}),
                cardMap: JSON.stringify(benefitInfo?.cardMap || {}),
              },
            } as never);
          }}
        >
          <Text style={styles.reserveButtonText}>{totalPrice.toLocaleString()}원 예매하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: verticalScale(32) },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: '500',
    paddingVertical: verticalScale(16),
    color: '#111',
  },
  tabButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(8),
    marginBottom: verticalScale(24),
  },
  tabButton: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: scale(8),
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  tabButtonSelected: {
    backgroundColor: '#007aff',
  },
  tabButtonText: {
    fontSize: moderateScale(14),
    color: '#333',
    fontWeight: '500',
  },
  tabButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  categoryText: {
    fontSize: moderateScale(14),
    color: '#333',
    marginBottom: verticalScale(4),
  },
  emptyText: {
    marginTop: verticalScale(24),
    textAlign: 'center',
    fontSize: moderateScale(16),
    color: '#999',
  },
  divider: {
    height: verticalScale(8),
    backgroundColor: '#f0f0f0',
    marginVertical: verticalScale(24),
  },
  footer: {
    marginTop: verticalScale(32),
    paddingVertical: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  reserveButton: {
    backgroundColor: '#DA291C',
    paddingVertical: verticalScale(16),
    borderRadius: scale(12),
    alignItems: 'center',
    width: '100%',
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: '600',
    lineHeight: moderateScale(24),
  },
});