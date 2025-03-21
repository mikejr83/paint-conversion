import { BrandData } from '../../models/brand-data';

export const ConsolidateData = (
  baseData: Record<string, BrandData>,
  parsedData: Record<string, BrandData>,
  overrideData: Record<string, BrandData>,
) => {
  const globalData = {
    ...baseData,
  };

  Object.getOwnPropertyNames(parsedData).forEach((brandKey) => {
    const currentBrand = globalData[brandKey];
    const parsedBrand = parsedData[brandKey];

    Object.getOwnPropertyNames(parsedBrand.paintMap).forEach((paintKey) => {
      const currentPaint = currentBrand.paintMap[paintKey];
      const parsedPaint = parsedBrand.paintMap[paintKey];

      if (!currentPaint) {
        console.log('adding new parsed paint');
      }
      currentBrand.paintMap[paintKey] = parsedPaint;
    });
  });

  Object.getOwnPropertyNames(overrideData).forEach((brandKey) => {
    const currentBrand = globalData[brandKey];
    const overrideBrand = overrideData[brandKey];

    Object.getOwnPropertyNames(overrideBrand.paintMap).forEach((paintKey) => {
      const currentPaint = currentBrand.paintMap[paintKey];
      const overridePaint = overrideBrand.paintMap[paintKey];

      if (!currentPaint) {
        console.log(
          `Adding new override paint ${overridePaint.name} for ${overridePaint.brand}`,
        );
      } else {
        console.log(
          `Overriding ${overridePaint.name} for ${overridePaint.brand}`,
        );
      }
      currentBrand.paintMap[paintKey] = overridePaint;
    });
  });

  return globalData;
};
