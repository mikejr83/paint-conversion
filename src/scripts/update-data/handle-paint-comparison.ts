import { Paint } from '@/models/paint';
import { BrandData } from '../../models/brand-data';

export const HandlePaintComparison = async (
  globalData: Record<string, BrandData>,
  paints: Paint[],
) => {
  paints.forEach((paint) => {
    if (!globalData[paint.brand]) {
      globalData[paint.brand] = {
        paintMap: {},
      };
    }

    if (!globalData[paint.brand].paintMap[paint.key]) {
      globalData[paint.brand].paintMap[paint.key] = paint;
    } else {
      globalData[paint.brand].paintMap[paint.key] = {
        ...globalData[paint.brand].paintMap[paint.key],
        ...paint,
        matchStrength: null,
      };
    }
  });
};
