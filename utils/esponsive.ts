import { Dimensions } from 'react-native';

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const { width, height } = Dimensions.get('window');

export const scale = (size: number) => (width / guidelineBaseWidth) * size;

export const verticalScale = (size: number) =>
  (height / guidelineBaseHeight) * size;

export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const shrinkScale = (base: number, min: number) => {
  const ratio = width / guidelineBaseWidth;
  const maxRatio = 1.2; 
  const clampedRatio = Math.min(ratio, maxRatio);
  const progress = (clampedRatio - 1) / (maxRatio - 1); 
  return base - (base - min) * progress;
};