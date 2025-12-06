import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
  ViewToken,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { scale } from 'react-native-size-matters';

const { width: screenWidth } = Dimensions.get('window');

const images = [
  require('../../assets/images/sample-ad01.jpg'),
  require('../../assets/images/sample-ad02.jpg'),
  require('../../assets/images/sample-ad03.jpg'),
  require('../../assets/images/sample-ad04.jpg'),
  require('../../assets/images/sample-ad05.jpg'),
  require('../../assets/images/sample-ad06.jpg'),
];

export default function AdBanner() {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemWidth = screenWidth - scale(32);
  const itemHeight = itemWidth * 0.52;

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: (currentIndex + 1) % images.length,
          animated: true,
        });
      }
    }, 5000); 

    return () => clearInterval(interval);
  }, [currentIndex]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.container, { width: itemWidth, height: itemHeight }]}>
            <Image source={item} style={styles.image} resizeMode="cover" />
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      {/* 페이지 인디케이터 */}
      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: scale(16),
    marginTop: scale(12),
  },
  container: {
    borderRadius: scale(8),
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: scale(8),
  },
  dot: {
    width: scale(6),
    height: scale(6),
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginHorizontal: scale(4),
  },
  activeDot: {
    backgroundColor: '#333',
  },
});