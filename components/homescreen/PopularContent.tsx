import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
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

export default function PopularContent() {
  const [selectedTab, setSelectedTab] = useState<'attraction' | 'menu'>('attraction');

  const attractionList = [
    {
      id: '1',
      title: '후렌치레볼루션',
      description: '스릴 만점 롯데월드 대표 롤러코스터',
      image: require('../../assets/images/attraction01.jpg'),
    },
    {
      id: '2',
      title: '자이로드롭',
      description: '한순간에 추락하는 짜릿한 수직 낙하',
      image: require('../../assets/images/attraction03.jpg'),
    },
    {
      id: '3',
      title: '아트란티스',
      description: '시원한 물보라, 가족 인기 워터 어트랙션',
      image: require('../../assets/images/attraction02.jpg'),
    },
  ];

  const menuList = [
    {
      id: '1',
      title: '로니로티빵',
      description: '로니·로티 캐릭터 모양의 귀여운 빵',
      image: require('../../assets/images/menu01.jpg'),
    },
    {
      id: '2',
      title: '오레오 츄러스',
      description: '오레오와 바삭한 츄러스의 조합',
      image: require('../../assets/images/menu02.jpg'),
    },
    {
      id: '3',
      title: '소금빵 젤라또',
      description: '소금빵에 바닐라 젤라또를 더한 디저트',
      image: require('../../assets/images/menu03.jpg'),
    },
  ];

  const contentToShow = selectedTab === 'attraction' ? attractionList : menuList;

  const handleMorePress = () => {
    const chip = selectedTab === 'attraction' ? '어트랙션' : '레스토랑';
    router.push({ pathname: '/MapScreen', params: { chip } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        지금 인기 있는 콘텐츠를{'\n'}확인해 보세요
      </Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={selectedTab === 'attraction' ? styles.activeTab : styles.inactiveTab}
          onPress={() => setSelectedTab('attraction')}
        >
          <Text style={[styles.tabText, selectedTab !== 'attraction' && { color: '#717171' }]}>
            요즘 핫한 어트랙션
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={selectedTab === 'menu' ? styles.activeTab : styles.inactiveTab}
          onPress={() => setSelectedTab('menu')}
        >
          <Text style={[styles.tabText, selectedTab !== 'menu' && { color: '#717171' }]}>
            요즘 잘 나가는 메뉴
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listContainer}>
        {contentToShow.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.thumbnail} />
            <View style={styles.textBox}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.moreButton} onPress={handleMorePress}>
        <Text style={styles.moreButtonText}>
          {selectedTab === 'attraction' ? '더 많은 어트랙션 보기' : '더 많은 메뉴 보기'}
        </Text>
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: verticalScale(16),
  },
  activeTab: {
    flex: 1,
    paddingVertical: verticalScale(12),
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderColor: '#DA291C',
    alignItems: 'center',
  },
  inactiveTab: {
    flex: 1,
    paddingVertical: verticalScale(12),
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
  },
  tabText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#111',
  },
  listContainer: {
    maxHeight: verticalScale(276),
    borderRadius: moderateScale(8),
    backgroundColor: '#f8f8f8',
    padding: moderateScale(24),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(24),
  },
  thumbnail: {
    width: scale(60),
    height: scale(60),
    borderRadius: moderateScale(6),
    marginRight: scale(16),
  },
  textBox: {
    flexShrink: 1,
  },
  cardTitle: {
    fontSize: moderateScale(18),
    color: '#111',
    marginBottom: verticalScale(5),
    fontWeight: '500',
  },
  cardDesc: {
    fontSize: moderateScale(14),
    color: '#717171',
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