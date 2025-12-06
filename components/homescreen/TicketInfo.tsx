import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  moderateScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';

const benefitList = [
  {
    id: '1',
    title: '롯데월드 카드 전용',
    description: '본인+동반 1인 45%',
    price: '26,000 ~',
    image: require('../../assets/images/ticket01.png'),
  },
  {
    id: '2',
    title: '포켓몬 패키지',
    description: '포켓몬 코스프레 PKG',
    price: '45,000 ~',
    image: require('../../assets/images/ticket02.png'),
  },
  {
    id: '3',
    title: '1일권(7월)',
    description: '제휴카드 50% 할인',
    price: '31,000 ~',
    image: require('../../assets/images/ticket03.png'),
  },
  {
    id: '4',
    title: 'AFTER4\n(16시이후)_7월',
    description: '제휴카드 50% 할인',
    price: '25,000 ~',
    image: require('../../assets/images/ticket04.png'),
  },
  {
    id: '5',
    title: '쿠팡와우카드와 함께\n혜택이 팡팡',
    description: '쿠팡 와우카드 전용',
    price: '37,750 ~',
    image: require('../../assets/images/ticket05.png'),
  },
  {
    id: '6',
    title: '다같이 모여 월드한바퀴\n(3, 4인권)',
    description: '3인권',
    price: '124,500 ~',
    image: require('../../assets/images/ticket05.png'),
  },
];

export default function TicketInfo() {
  const router = useRouter();

  const handlePressTicket = (ticketId: string) => {
    router.push(`/ticket/${ticketId}`);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>
        나에게 꼭 맞는 혜택을{'\n'}확인해 보세요
      </Text>
      <FlatList
        data={benefitList}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardList}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePressTicket(item.id)}>
            <ImageBackground
              source={item.image}
              style={styles.image}
              imageStyle={styles.imageStyle}
            >
              <View style={styles.overlayBottom}>
                <Text style={styles.overlayTitle}>{item.title}</Text>
                <Text style={styles.overlayDesc}>{item.description}</Text>
                <Text style={styles.cardPrice}>{item.price}</Text>
              </View>
              <View style={styles.button}>
                <Text style={styles.buttonText}>예매하기</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => router.push('/TicketScreen?tab=purchase')}
      >
        <Text style={styles.moreButtonText}>더 많은 혜택 보기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: verticalScale(40),
    marginHorizontal: scale(16),
  },
  heading: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: '#111',
    marginBottom: verticalScale(24),
  },
  cardList: {
    gap: scale(16),
  },
  image: {
    width: scale(140),
    height: verticalScale(200),
    borderRadius: scale(8),
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: scale(8),
  },
  overlayBottom: {
    alignItems: 'center',
  },
  overlayTitle: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  overlayDesc: {
    color: '#fff',
    fontSize: moderateScale(10),
  },
  cardPrice: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#fff',
    marginBottom: verticalScale(8),
  },
  button: {
    borderRadius: scale(4),
    width: scale(140),
    height: verticalScale(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    marginBottom: verticalScale(6),
    fontSize: moderateScale(14),
    color: '#fff',
    fontWeight: '600',
  },
  moreButton: {
    marginTop: verticalScale(24),
    alignSelf: 'center',
    backgroundColor: '#DA291C',
    paddingHorizontal: scale(30),
    paddingVertical: verticalScale(10),
    borderRadius: 999,
  },
  moreButtonText: {
    fontSize: moderateScale(14),
    color: '#fff',
    fontWeight: '600',
  },
});