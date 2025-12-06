import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import type { CountType } from './PersonCounter';

interface CardOptionDetail {
  basePrice: {
    adult: number;
    teen: number;
    child: number;
  };
  discountPercent: {
    adult: number;
    teen: number;
    child: number;
  };
  detailText: string;
  maxCount?: Partial<Record<CountType, number>>;
}

interface Props {
  ticketId: string;
  cardMap: Record<string, Record<string, CardOptionDetail>>;
  counts?: { adult: number; teen: number; child: number };
  onSelectTicket?: (option: string, cardName: string) => void;
  onChangeMaxCounts?: (maxCounts?: Partial<Record<CountType, number>>) => void;
  onPriceChange?: (price: number) => void;
}

const CardBenefitSection = ({
  cardMap,
  counts,
  onSelectTicket,
  onChangeMaxCounts,
  onPriceChange,
}: Props) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    if (!counts) return;
    for (const card of Object.values(cardMap)) {
      for (const detail of Object.values(card)) {
        const max = detail.maxCount;
        if (
          (max?.adult !== undefined && counts.adult > max.adult) ||
          (max?.teen === 0 && counts.teen > 0) ||
          (max?.child === 0 && counts.child > 0)
        ) {
          onChangeMaxCounts?.(max);
          return;
        }
      }
    }
  }, [counts, cardMap]);

  const isVisible = (max?: Partial<Record<CountType, number>>) => {
    if (!counts || !max) return true;
    if (max.adult !== undefined && counts.adult > max.adult) return false;
    if (max.teen === 0 && counts.teen > 0) return false;
    if (max.child === 0 && counts.child > 0) return false;
    return true;
  };

  const calcTotal = (detail: CardOptionDetail) => {
    const a = Math.round(detail.basePrice.adult * (1 - detail.discountPercent.adult / 100)) * (counts?.adult || 0);
    const t = Math.round(detail.basePrice.teen * (1 - detail.discountPercent.teen / 100)) * (counts?.teen || 0);
    const c = Math.round(detail.basePrice.child * (1 - detail.discountPercent.child / 100)) * (counts?.child || 0);
    return a + t + c;
  };

  return (
    <View>
      <Text style={styles.infoText}>
        고객님이 소유하고 계신 카드를 선택하시고 해당 카드에 최저가 상품을 확인해 보세요 (중복 선택 가능)
      </Text>

      <View style={styles.cardCountTextBox}>
        <Text style={styles.cardCountText}>선택한 카드 {selectedCard ? 1 : 0}장</Text>
      </View>

      <View style={styles.optionsWrapper}>
        {Object.keys(cardMap).map((card) => {
          const selected = card === selectedCard;
          return (
            <TouchableOpacity
              key={card}
              style={[styles.circleOption, selected && styles.circleOptionSelected]}
              onPress={() => {
                const next = selected ? null : card;
                setSelectedCard(next);
                setSelectedOption(null);
                onChangeMaxCounts?.(undefined);
                onPriceChange?.(0);
              }}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{card}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedCard &&
        Object.entries(cardMap[selectedCard])
          .filter(([_, detail]) => isVisible(detail.maxCount))
          .map(([option, detail], idx) => {
            const selected = selectedOption === option;
            const totalPrice = calcTotal(detail);
            const totalCount = (counts?.adult || 0) + (counts?.teen || 0) + (counts?.child || 0);

            return (
              <View key={option + idx} style={styles.detailCardBox}>
                <TouchableOpacity
                  onPress={() => {
                    const next = selected ? null : option;
                    setSelectedOption(next);
                    onSelectTicket?.(next ?? '', selectedCard!);
                    if (!selected) {
                      onChangeMaxCounts?.(detail.maxCount);
                      onPriceChange?.(totalPrice);
                    } else {
                      onPriceChange?.(0);
                    }
                  }}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <View style={styles.radioCircle}>{selected && <View style={styles.radioDot} />}</View>
                  <Text style={styles.cardName}>{selectedCard}</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{totalCount}매 할인</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.detailCardBox}>
                  <Text style={styles.detailText}>{detail.detailText}</Text>

                  <View style={styles.summaryContainer}>
                    {(['adult', 'teen', 'child'] as CountType[]).map((type) => {
                      const count = counts?.[type] || 0;
                      if (count === 0) return null;
                      const base = detail.basePrice[type];
                      const discount = detail.discountPercent[type];
                      const price = base * count;
                      const discounted = Math.round(base * (1 - discount / 100)) * count;

                      return (
                        <View key={type} style={styles.row}>
                          <View style={styles.badge}><Text style={styles.badgeText}>{count}인</Text></View>
                          <Text style={styles.label}>{type === 'adult' ? '어른' : type === 'teen' ? '청소년' : '어린이'}</Text>
                          <View style={styles.priceRow}>
                            <Text style={styles.originalPrice}>{price.toLocaleString()}원</Text>
                            <Text style={styles.discountedPrice}>{discounted.toLocaleString()}원</Text>
                          </View>
                        </View>
                      );
                    })}
                    <View style={styles.divider} />
                    <View style={styles.row}>
                      <Text style={styles.label}>총합계</Text>
                      <View style={styles.priceRow}>
                        <Text style={styles.originalPrice}>
                          {(
                            (detail.basePrice.adult * (counts?.adult || 0)) +
                            (detail.basePrice.teen * (counts?.teen || 0)) +
                            (detail.basePrice.child * (counts?.child || 0))
                          ).toLocaleString()}원
                        </Text>
                        <Text style={styles.discountedPriceFinal}>{totalPrice.toLocaleString()}원</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
    </View>
  );
};

const styles = StyleSheet.create({
  infoText: {
    fontSize: moderateScale(14),
    color: '#111',
    fontWeight: '500',
  },
  cardCountTextBox: {
    backgroundColor: '#eee',
    padding: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: verticalScale(16),
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cardCountText: {
    fontSize: moderateScale(14),
    color: '#111',
  },
  optionsWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: scale(16),
  },
  circleOption: {
    paddingVertical: verticalScale(8),
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    minWidth: scale(102),
  },
  circleOptionSelected: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  optionText: {
    fontSize: moderateScale(14),
    color: '#111',
  },
  optionTextSelected: {
    color: '#fff',
  },
  detailCardBox: {
    borderRadius: scale(8),
    padding: scale(8),
    backgroundColor: '#f4f4f4',
    marginTop: verticalScale(16),
  },
  cardName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#111',
  },
  discountBadge: {
    backgroundColor: '#e0f0ff',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(4),
    marginLeft: 'auto',
  },
  discountText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#007aff',
  },
  detailText: {
    marginTop: verticalScale(-16),
    fontSize: moderateScale(12),
    color: '#333',
    lineHeight: moderateScale(16),
  },
  summaryContainer: {
    marginTop: verticalScale(24),
    padding: scale(16),
    backgroundColor: '#fff',
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#007aff',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
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
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
  },
  originalPrice: {
    fontSize: moderateScale(14),
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: moderateScale(14),
    color: '#111',
    fontWeight: '600',
  },
  discountedPriceFinal: {
    fontSize: moderateScale(16),
    color: 'red',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: verticalScale(8),
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
    borderRadius: scale(5),
    backgroundColor: '#DA291C',
  },
});

export default CardBenefitSection;