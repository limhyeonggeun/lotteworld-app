import ArrowDown from '@/assets/Icon/arrow-down.svg';
import ArrowUp from '@/assets/Icon/arrow-up.svg';
import MoreIcon from '@/assets/Icon/more.svg';
import SearchIcon from '@/assets/Icon/search.svg';
import { CHIP_LABELS, getSortedParkItems, PARK_ITEMS, ParkCategory } from '@/data/parkMap.data';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import BottomChips from './BottomChips';
import FilterDropdown, { FilterKey } from './FilterDropdown';

const FILTER_ITEMS: Array<{ label: string; key: FilterKey }> = [
  { label: '전체', key: '전체' },
  { label: '언더랜드 B1F', key: 'B1' },
  { label: '매직아일랜드', key: '실외' },
  { label: '어드벤처 1F', key: '1F' },
  { label: '어드벤처 2F', key: '2F' },
  { label: '어드벤처 3F', key: '3F' },
  { label: '어드벤처 4F', key: '4F' },
];

const FILTER_TITLES: Record<FilterKey, string> = {
  전체: '전체 지도 영역',
  B1: '언더랜드 지하 1층 지도 영역',
  '1F': '어드벤처 1층 지도 영역',
  '2F': '어드벤처 2층 지도 영역',
  '3F': '어드벤처 3층 지도 영역',
  '4F': '어드벤처 4층 지도 영역',
  실내: '어드벤처 지도 영역',
  실외: '매직아일랜드 지도 영역',
};

const makeShadow = (e: number) =>
  Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.0015 * e + 0.18,
      shadowRadius: 0.54 * e,
      shadowOffset: { width: 0, height: 0.6 * e },
    },
    android: {
      elevation: e,
      shadowColor: '#000',
    },
  });

export default function ParkMapMock() {
  const { chip } = useLocalSearchParams<{ chip?: string }>();

  const initialIndex = React.useMemo(() => {
    if (!chip) return 0;
    const idx = CHIP_LABELS.findIndex((label) => label.includes(chip));
    return idx >= 0 ? idx : 0;
  }, [chip]);

  const [expanded, setExpanded] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [activeChip, setActiveChip] = useState(initialIndex);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('전체');

  React.useEffect(() => {
    setActiveChip(initialIndex);
  }, [initialIndex]);

  const filtered = useMemo(() => {
    const paradeFirst = activeChip === 0;
    const sorted = getSortedParkItems(PARK_ITEMS, paradeFirst);

    let base =
      activeChip === 0
        ? sorted
        : sorted.filter((p) => p.category === (CHIP_LABELS[activeChip] as ParkCategory));

    if (selectedFilter === '실외') base = base.filter((p) => p.area === '실외');
    else if (selectedFilter === '실내') base = base.filter((p) => p.area === '실내');
    else if (selectedFilter === 'B1') base = base.filter((p) => p.level === 'B1');
    else if (selectedFilter !== '전체') base = base.filter((p) => p.level === selectedFilter);

    if (searchText.trim() !== '') {
      const lower = searchText.toLowerCase();
      base = base.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.desc.toLowerCase().includes(lower) ||
          p.meta.toLowerCase().includes(lower)
      );
    }

    return base;
  }, [activeChip, selectedFilter, searchText]);

  const mapTitle = FILTER_TITLES[selectedFilter] ?? '지도 영역';

  return (
    <View style={Style.wrap}>
      <View style={Style.topBar}>
        <View style={Style.searchInput}>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="어트랙션, 퍼레이드, 레스토랑 등"
            placeholderTextColor="#9a9a9a"
            style={Style.textInput}
            returnKeyType="search"
            onSubmitEditing={() => console.log('검색:', searchText)}
          />
          <TouchableOpacity
            onPress={() => console.log('검색 버튼 클릭:', searchText)}
            style={Style.searchIconBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <SearchIcon width={moderateScale(20)} height={moderateScale(20)} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={Style.iconBtn}
          onPress={() => setFilterVisible((v) => !v)}
          activeOpacity={0.7}
        >
          <MoreIcon width={moderateScale(20)} height={moderateScale(20)} />
        </TouchableOpacity>
      </View>

      <FilterDropdown
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        items={FILTER_ITEMS}
        selectedKey={selectedFilter}
        onSelect={(key) => {
          setSelectedFilter(key);
          setFilterVisible(false);
        }}
      />

      <View style={Style.mapArea}>
        <Text style={Style.mapPlaceholder}>{mapTitle}</Text>
      </View>

      <View
        style={[
          Style.bottomSheet,
          expanded ? Style.bottomSheetExpanded : Style.bottomSheetCollapsed,
        ]}
      >
        <TouchableOpacity
          style={Style.sheetHandle}
          onPress={() => setExpanded((v) => !v)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          {expanded ? (
            <ArrowDown width={moderateScale(24)} height={moderateScale(24)} />
          ) : (
            <ArrowUp width={moderateScale(24)} height={moderateScale(24)} />
          )}
        </TouchableOpacity>

        <BottomChips activeIndex={activeChip} onSelect={setActiveChip} />

        {expanded && (
          <ScrollView style={Style.list} showsVerticalScrollIndicator={false}>
            {filtered.map((item) => {
              const hasImage = !!item.image;

              if (item.category === '퍼레이드') {
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[Style.card, Style.paradeCard]}
                    activeOpacity={0.8}
                    onPress={() => console.log('퍼레이드 상세로 이동:', item.id)}
                  >
                    <View style={Style.paradeTop}>
                      <View style={Style.thumbBox}>
                        {hasImage ? (
                          <Image source={item.image!} style={Style.thumbImg} resizeMode="cover" />
                        ) : (
                          <View style={Style.thumbPlaceholder} />
                        )}
                      </View>
                      <View style={Style.paradeInfo}>
                        <Text style={Style.cardTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={Style.cardDesc} numberOfLines={2}>{item.desc}</Text>
                      </View>
                    </View>
                    <View style={Style.paradeBottom}>
                      <Text style={Style.cardMeta} numberOfLines={1}>
                        <Text style={Style.metaLabel}>공연시간: </Text>
                        {item.time}
                      </Text>
                      <Text style={Style.cardMeta} numberOfLines={1}>
                        <Text style={Style.metaLabel}>공연장소: </Text>
                        {item.meta}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={item.id}
                  style={Style.card}
                  activeOpacity={0.8}
                  onPress={() => console.log('상세로 이동:', item.id)}
                >
                  <View style={Style.thumbBox}>
                    {hasImage ? (
                      <>
                        <Image source={item.image!} style={Style.thumbImg} resizeMode="cover" />
                        <View style={Style.thumbOverlay} />
                        <Text style={Style.timeBadgeOverlay}>{item.time}</Text>
                      </>
                    ) : (
                      <View style={Style.thumbPlaceholder}>
                        <Text style={Style.timeBadgeDefault}>{item.time}</Text>
                      </View>
                    )}
                  </View>
                  <View style={Style.cardBody}>
                    <Text style={Style.cardTitle}>{item.title}</Text>
                    <Text style={Style.cardDesc} numberOfLines={2}>{item.desc}</Text>
                    <Text style={Style.cardMeta}>{item.meta}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const Style = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#e3e3e3',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    gap: scale(8),
  },
  searchInput: {
    flex: 1,
    height: verticalScale(40),
    backgroundColor: '#fff',
    borderRadius: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(12),
  },
  textInput: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#111',
    paddingVertical: 0,
  },
  searchIconBtn: {
    padding: scale(4),
  },
  iconBtn: {
    width: scale(40),
    height: verticalScale(40),
    borderRadius: scale(8),
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholder: {
    color: '#777',
    fontSize: moderateScale(14),
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: scale(32),
    borderTopRightRadius: scale(32),
    overflow: 'hidden',
  },
  bottomSheetExpanded: {
    maxHeight: verticalScale(360),
  },
  bottomSheetCollapsed: {
    height: verticalScale(80),
  },
  sheetHandle: {
    alignSelf: 'center',
    paddingVertical: verticalScale(8),
  },
  list: {
    marginTop: verticalScale(8),
    paddingHorizontal: scale(16),
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: scale(12),
    padding: scale(12),
    marginBottom: verticalScale(16),
    ...makeShadow(1),
  },
  paradeCard: {
    flexDirection: 'column',
  },
  thumbBox: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(8),
    marginRight: scale(12),
    overflow: 'hidden',
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: scale(8),
  },
  timeBadgeOverlay: {
    position: 'absolute',
    fontSize: moderateScale(12),
    color: '#fff',
    fontWeight: '600',
  },
  timeBadgeDefault: {
    fontSize: moderateScale(12),
    color: '#111',
    fontWeight: '600',
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: '#111',
  },
  cardDesc: {
    marginTop: verticalScale(4),
    fontSize: moderateScale(12),
    color: '#777',
  },
  cardMeta: {
    marginTop: verticalScale(2),
    fontSize: moderateScale(12),
    color: '#9a9a9a',
  },
  paradeTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(8),
  },
  paradeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  paradeBottom: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: verticalScale(4),
  },
  metaLabel: {
    color: '#333',
    fontWeight: '600',
  },
});