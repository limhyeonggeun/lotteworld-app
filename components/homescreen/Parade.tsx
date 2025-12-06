import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
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
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = scale(width * 0.5); 
const SPACING = scale(12);
const SIDE_CARD_SCALE = 0.8;
const FULL_CARD_WIDTH = CARD_WIDTH + SPACING;

const rawParadeList = [
  {
    id: '1',
    title: '썸머 페스타 위드 포켓몬',
    location: '어드벤처 1층 퍼레이드 코스 및 가든스테이지 광장',
    time: '11:30 ~ 11:50',
    image: require('../../assets/images/parade01.jpg'),
  },
  {
    id: '2',
    title: '빅 밴드 공연',
    location: '어드벤처 1층 만남의 광장',
    time: '11:00 ~ 11:20',
    image: require('../../assets/images/parade02.jpg'),
  },
  {
    id: '3',
    title: 'DREAMS BEGIN',
    location: '어드벤처 전역',
    time: '21:30 ~ 21:40',
    image: require('../../assets/images/parade03.jpg'),
  },
];

const extendedList = [...rawParadeList, ...rawParadeList, ...rawParadeList];

export default function ParadeCarousel() {
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const middleIndex = rawParadeList.length;

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: middleIndex * FULL_CARD_WIDTH,
        animated: false,
      });
    }, 10);
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true }
  );

  const handleMomentumEnd = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(offsetX / FULL_CARD_WIDTH);
    const totalItems = rawParadeList.length;

    if (currentIndex <= totalItems - 1 || currentIndex >= extendedList.length - totalItems) {
      flatListRef.current?.scrollToOffset({
        offset: (middleIndex + (currentIndex % totalItems)) * FULL_CARD_WIDTH,
        animated: false,
      });
    }
  };
  const handleMorePress = () => {
    router.push({ pathname: '/MapScreen', params: { chip: '퍼레이드' } });
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        다양한 공연 및 퍼레이드를{'\n'}확인해보세요
      </Text>

      <Animated.FlatList
        ref={flatListRef}
        data={extendedList}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={FULL_CARD_WIDTH}
        decelerationRate="fast"
        bounces={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumEnd}
        contentContainerStyle={{
          paddingHorizontal: scale((width - CARD_WIDTH) / 2.5),
        }}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * FULL_CARD_WIDTH,
            index * FULL_CARD_WIDTH,
            (index + 1) * FULL_CARD_WIDTH,
          ];

          const scaleAnim = scrollX.interpolate({
            inputRange,
            outputRange: [SIDE_CARD_SCALE, 1, SIDE_CARD_SCALE],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>
              <ImageBackground
                source={item.image}
                style={styles.cardImage}
                imageStyle={{ borderRadius: scale(12) }}
              >
                <View style={styles.overlay}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.location}>{item.location}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
              </ImageBackground>
            </Animated.View>
          );
        }}
      />
      <TouchableOpacity style={styles.moreButton} onPress={handleMorePress}>
        <Text style={styles.moreButtonText}>더 많은 공연 보기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(40),
    marginHorizontal: scale(16),
  },
  heading: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: '#111',
    marginBottom: verticalScale(24),
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: SPACING / 2,
  },
  cardImage: {
    height: verticalScale(260),
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: scale(12),
    borderBottomLeftRadius: scale(12),
    borderBottomRightRadius: scale(12),
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: verticalScale(4),
  },
  location: {
    fontSize: moderateScale(12),
    color: '#fff',
  },
  time: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#fff',
    marginTop: verticalScale(4),
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