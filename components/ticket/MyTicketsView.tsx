import GiftTicketModal from '@/components/ticket/modals/GiftTicketModal';
import RegisterTicketModal from '@/components/ticket/modals/RegisterTicketModal';
import { useUser } from '@/context/UserContext';
import api from '@/utils/axios';
import { moderateScale, scale, shrinkScale, verticalScale } from '@/utils/esponsive';
import dayjs from 'dayjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken
} from 'react-native';

const DEFAULT_TICKET_IMAGE = require('../../assets/images/my-ticket.png');
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MyTicketsView() {
  const { user } = useUser();
  const [ticketList, setTicketList] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
  const [isGiftModalVisible, setGiftModalVisible] = useState(false);
  const asset = Image.resolveAssetSource(DEFAULT_TICKET_IMAGE);
  const IMG_RATIO = asset.height / asset.width;
  const MAX_DESIGN_W = scale(343);
  const CARD_W = Math.min(SCREEN_WIDTH - moderateScale(32), MAX_DESIGN_W);
  const CARD_H = CARD_W * IMG_RATIO;
  const INNER_W = CARD_W * (248 / 343);

  const fetchTickets = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`/api/orders/user/${user.id}`);
      const mapped = res.data
        .flatMap((t: any) => {
          const visitDate = dayjs(t.visitDate);
          const today = dayjs().startOf('day');
          const isExpired = visitDate.isBefore(today);
          const formattedBookingNo = String(t.bookingNo)
            .replace(/[^0-9]/g, '')
            .padStart(16, '0')
            .replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4');

          const parsedCounts: { [key: string]: number } =
            typeof t.counts === 'string' ? JSON.parse(t.counts) : t.counts || {};

          return Object.entries(parsedCounts)
            .filter(([, count]) => count > 0)
            .map(([key, count]) => {
              const label = key === 'adult' ? '어른' : key === 'teen' ? '청소년' : '어린이';
              return {
                id: `${t.id}-${key}`,
                type: t.optionName,
                date: t.visitDate,
                ageKey: key,
                ageLabel: label,
                count,
                ageType: `${label} ${count}매`,
                validText: isExpired ? '사용 불가한 티켓입니다' : '해당 입장일에 입장 가능합니다',
                ticketNumber: formattedBookingNo,
                status: t.status,
              };
            });
        })
        .filter((item: any) => !['취소완료', '사용완료'].includes(item.status))
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setTicketList(mapped);
    } catch (err) {
      console.error('티켓 불러오기 실패:', err);
    }
  }, [user?.id]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const onViewRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index ?? 0);
  });

  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  useEffect(() => {
    const animate = () => {
      translateX.setValue(SCREEN_WIDTH);
      Animated.timing(translateX, {
        toValue: -SCREEN_WIDTH * 2,
        duration: 20000,
        useNativeDriver: true,
      }).start(() => animate());
    };
    animate();
  }, [translateX]);

  const confirmCancel = (id: string) => {
    Alert.alert('티켓 취소/환불', '해당 티켓을 취소하시겠어요?', [
      { text: '아니요', style: 'cancel' },
      {
        text: '예',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.patch(`/api/orders/${id}`, { status: '취소완료' });
            fetchTickets();
          } catch {
            Alert.alert('취소 실패', '서버와 통신 중 문제가 발생했습니다.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.ticketTopBar}>
        <View style={styles.registerBox}>
          <TouchableOpacity onPress={() => setRegisterModalVisible(true)}>
            <Text style={styles.registerText}>티켓 등록</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.countBox}>
          <Text style={styles.ticketCount}>
            {Math.min(currentIndex + 1, ticketList.length)}/{ticketList.length}
          </Text>
        </View>
      </View>

      <FlatList
        data={ticketList}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        onViewableItemsChanged={onViewRef.current}
        renderItem={({ item }) => (
          <View style={[styles.ticketWrapper, { width: SCREEN_WIDTH }]}>
            <ImageBackground
              source={DEFAULT_TICKET_IMAGE}
              resizeMode="cover"
              style={[styles.ticketImage, { width: CARD_W, height: CARD_H }]}
              imageStyle={{ borderRadius: 8 }}
            >
              <View style={styles.overlay}>
                <View style={[styles.centerContent, { marginTop: CARD_H * 0.06 }]}>
                  <Text style={styles.typeText}>{item.type}</Text>
                  <View style={styles.row}>
                    <Text style={styles.dateText}>{item.date}</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.ageType}</Text>
                    </View>
                  </View>

                  <Text style={styles.validText}>{item.validText}</Text>

                  <View style={[styles.separator, { width: INNER_W }]} />
                  <View style={[styles.qrBox, { width: INNER_W }]} />
                  <Text style={styles.bookingNumber}>{item.ticketNumber}</Text>

                  <View style={[styles.noticeBar, { width: CARD_W }]}>
                    <Animated.View style={[styles.marqueeWrapper, { transform: [{ translateX }] }]}>
                      <Text style={styles.noticeText}>캡쳐하신 티켓은 사용 할 수 없습니다.</Text>
                      <Text style={styles.noticeText}>캡쳐하신 티켓은 사용 할 수 없습니다.</Text>
                      <Text style={styles.noticeText}>캡쳐하신 티켓은 사용 할 수 없습니다.</Text>
                    </Animated.View>
                  </View>

                  <View style={styles.bottomActions}>
                    <TouchableOpacity><Text style={styles.bottomText}>영수증 보기</Text></TouchableOpacity>
                    <Text style={styles.divider}>|</Text>
                    <TouchableOpacity onPress={() => setGiftModalVisible(true)}>
                      <Text style={styles.bottomText}>선물하기</Text>
                    </TouchableOpacity>
                    <Text style={styles.divider}>|</Text>
                    <TouchableOpacity><Text style={styles.bottomText}>이용안내</Text></TouchableOpacity>
                    <Text style={styles.divider}>|</Text>
                    <TouchableOpacity onPress={() => confirmCancel(item.id)}>
                      <Text style={styles.bottomText}>취소/환불요청</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
        )}
      />

      {isRegisterModalVisible && (
        <RegisterTicketModal visible={isRegisterModalVisible} onClose={() => setRegisterModalVisible(false)} />
      )}
      {isGiftModalVisible && (
        <GiftTicketModal visible={isGiftModalVisible} onClose={() => setGiftModalVisible(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  ticketTopBar: {
    paddingHorizontal: moderateScale(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: verticalScale(16),
  },
  registerBox: {
    borderColor: '#8e8e8e',
    borderWidth: 1,
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
  },
  registerText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#111',
  },
  countBox: {
    borderColor: '#8e8e8e',
    borderWidth: 1,
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(100),
  },
  ticketCount: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#111',
  },
  listContainer: {
    paddingBottom: verticalScale(16),
  },
  ticketWrapper: {
    width: scale(375),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketImage: {
    justifyContent: 'flex-start',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  centerContent: {
    alignItems: 'center',
    marginTop: verticalScale(32),
    gap: shrinkScale(12, 6),
  },
  typeText: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: '#fff',
    fontSize: moderateScale(16),
    marginRight: moderateScale(8),
  },
  badge: {
    backgroundColor: '#222',
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(4),
  },
  badgeText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  bookingNumber: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  validText: {
    color: '#fff',
    fontSize: moderateScale(18),
    textAlign: 'center',
    marginTop: verticalScale(32),
  },
  separator: {
    width: scale(248),
    height: 1,
    borderWidth: 0.5,
    borderColor: '#fff',
    borderStyle: 'dashed',
    marginTop: verticalScale(40),
    alignSelf: 'center',
  },
  qrBox: {
    width: scale(248),
    height: verticalScale(60),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: verticalScale(24),
    borderRadius: moderateScale(8),
  },
  noticeBar: {
    height: verticalScale(32),
    width: scale(343),
    backgroundColor: '#d9d9d9',
    overflow: 'hidden',
    justifyContent: 'center',
    marginTop: verticalScale(16),
  },
  marqueeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noticeText: {
    fontSize: moderateScale(14),
    color: '#111',
    marginRight: moderateScale(60),
    lineHeight: verticalScale(32),
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(8),
    gap: moderateScale(8),
  },
  bottomText: {
    fontSize: moderateScale(12),
    color: '#111',
    fontWeight: '600',
  },
  divider: {
    fontSize: moderateScale(12),
    color: '#999',
  },
});