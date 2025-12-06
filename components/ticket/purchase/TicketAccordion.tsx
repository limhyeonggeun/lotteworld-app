import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface AccordionItem {
  key: string;
  title: string;
}

const accordionData: AccordionItem[] = [
  { key: 'product', title: '상품안내' },
  { key: 'usage', title: '이용안내' },
  { key: 'refund', title: '취소/환불' },
];

export default function TicketAccordion() {
  const [accordionOpen, setAccordionOpen] = useState<string | null>(null);

  return (
    <>
      {accordionData.map((item) => (
        <View key={item.key} style={styles.accordionContainer}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setAccordionOpen((prev) => (prev === item.key ? null : item.key))}
          >
            <Text style={styles.accordionTitle}>{item.title}</Text>
            <Ionicons
              name={accordionOpen === item.key ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#111"
            />
          </TouchableOpacity>

          {accordionOpen === item.key && (
            <View style={styles.accordionContent}>
              {item.key === 'product' && (
                <View style={styles.productImagesWrapper}>
                  <Image
                    source={require('../../../assets/images/Productinformation01.jpeg')}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.accordionText}>모험과 신비의 나라 롯데월드 어드벤처</Text>
                  <Image
                    source={require('../../../assets/images/Productinformation02.jpeg')}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.accordionText}>다채로운 놀이시설, 실내 어드벤처</Text>
                  <Image
                    source={require('../../../assets/images/Productinformation03.jpeg')}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.accordionText}>스릴이 가득한, 매직아일랜드</Text>
                </View>
              )}
              {item.key === 'usage' && (
                <View style={styles.informationImagesWrapper}>
                  <Text style={styles.accordionText}>1. 어드벤처 예매페이지 및 모바일 APP을 통한 티켓 예매</Text>
                  <View style={styles.centerImageWrapper}>
                    <Image
                      source={require('../../../assets/images/Usageinformation01.jpeg')}
                      style={styles.informationImage}
                      resizeMode="cover"
                    />
                  </View>
                  <Text style={styles.accordionText}>2. 카카오톡 알림톡(또는 문자메시지)으로 웹티켓 URL 발송</Text>
                  <View style={styles.centerImageWrapper}>
                    <Image
                      source={require('../../../assets/images/Usageinformation02.jpeg')}
                      style={styles.informationImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.accordionSubText}>
                      ※ 알림톡 수신과정에서 와이파이 환경이 아닌 경우 데이터 통신 요금이 발생할 수 있습니다.
                    </Text>
                  </View>
                  <Text style={styles.accordionText}>3. 웹티켓을 게이트에 제시 후 빠른 입장</Text>
                  <View style={styles.centerImageWrapper}>
                    <Image
                      source={require('../../../assets/images/Usageinformation03.jpeg')}
                      style={styles.informationImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.accordionSubText}>
                      ・ 예매 후에는 반드시 마이티켓을 통하여 구매하신 웹티켓을 확인해주시기 바랍니다.{''}・ 티켓은 선택한 날짜에만 방문 및 이용 가능합니다.(다른 날짜에는 사용 불가)
                    </Text>
                  </View>
                </View>
              )}
              {item.key === 'refund' && (
                <View>
                  <Text style={styles.refundTitle}>예매취소 안내</Text>
                  <Text style={styles.refundNote}>
                    ・ 온라인 예매 시 선택한 날짜에만 방문 및 이용이 가능하며, 미사용 시 해당 날짜가 지나면 자동 취소됩니다. {'\n'}(사용 후에는 취소가 불가능합니다.)
                  </Text>
                  <Text style={styles.refundBullet}>- 본인+동반인 티켓 구매 후 동반인 티켓만 사용 시 본인 티켓 취소는 불가합니다.</Text>
                  <Text style={styles.refundBullet}>- 본인+동반인 티켓 구매 후 취소하실 경우 동반인 티켓을 먼저 취소하셔야 합니다.</Text>
                  <Text style={styles.refundBullet}>- 시스템 자동 취소가 될 경우 제휴카드 실적은 은행 영업일 기준 2~3일 후에 복구됩니다.</Text>
                  <Text style={styles.refundBullet}>- 별도의 취소 수수료는 없으나 구매 후 환불 요청 시 각 카드사에 따라 수수료를 차감합니다.</Text>
                  <Text style={styles.refundBullet}>- 예매 취소를 원하시는 경우 [마이페이지 결제내역]에서 취소하실 수 있습니다.</Text>
                  <Text style={styles.refundNote}>・ 예매 후에는 반드시 마이티켓을 통하여 예매내역을 확인해 주시기 바랍니다.</Text>
                </View>
              )}
            </View>
          )}
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  accordionContainer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingVertical: verticalScale(12),
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  accordionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '500',
    color: '#111',
  },
  accordionContent: {
    marginTop: verticalScale(16),
  },
  accordionText: {
    fontSize: moderateScale(14),
    color: '#222',
    marginVertical: verticalScale(4),
  },
  accordionSubText: {
    fontSize: moderateScale(12),
    color: '#333',
    marginVertical: verticalScale(8),
  },
  productImagesWrapper: {
    gap: verticalScale(16),
  },
  productImage: {
    width: '100%',
    height: verticalScale(180),
  },
  informationImagesWrapper: {
    gap: verticalScale(16),
  },
  centerImageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: verticalScale(16),
  },
  informationImage: {
    width: '60%',
    height: verticalScale(172),
  },
  refundTitle: {
    fontSize: moderateScale(16),
    color: '#111',
    fontWeight: '700',
    marginBottom: verticalScale(8),
    lineHeight: moderateScale(20),
  },
  refundNote: {
    fontSize: moderateScale(14),
    color: '#333',
    marginBottom: verticalScale(8),
  },
  refundBullet: {
    fontSize: moderateScale(12),
    color: '#666',
    marginLeft: scale(8),
    marginBottom: verticalScale(4),
    lineHeight: moderateScale(16),
  },
});
