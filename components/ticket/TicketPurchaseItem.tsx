import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ArrowRight from '../../assets/Icon/arrow-right.svg';

interface TicketPurchaseItemProps {
  title: string;
  description: string;
  price: string;
  image: any; 
  onPress?: () => void;
}

const TicketPurchaseItem = ({
  title,
  description,
  price,
  image,
  onPress,
}: TicketPurchaseItemProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={image}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.description} numberOfLines={1}>{description}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>
      <View style={styles.arrowWrapper}>
        <ArrowRight width={24} height={24} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    marginBottom: 8,
    position: 'relative', 
    borderBottomWidth: 1,            
    borderBottomColor: '#dcdcdc',
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 100,
    marginRight: 16,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1d1d1d',
  },
  description: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    marginTop: 6,
  },
  arrowWrapper: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -16 }], 
  },
});

export default TicketPurchaseItem;