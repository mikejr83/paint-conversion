import { Paint } from '@/models/paint';
import { CompareBrands } from './compare-brands';
import { filesInfo, WriteFile } from '../file-info';
import { BrandData } from './brand-data';

export const RunComparisons = async (globalData: Record<string, BrandData>) => {
  const brands = Object.getOwnPropertyNames(globalData);

  const comparedData: Record<string, Paint[][]> = {};
  brands.forEach((brandOne) => {
    comparedData[brandOne] = [];
    const paintsForBrand: Record<string, Paint[]> = {};
    brands.forEach((brandTwo) => {
      if (brandOne !== brandTwo) {
        CompareBrands(globalData, paintsForBrand, brandOne, brandTwo);
      }
    });
    Object.getOwnPropertyNames(paintsForBrand).forEach((paintKey) => {
      comparedData[brandOne].push(paintsForBrand[paintKey]);
    });

    filesInfo.forEach(async (f) => {
      if (f.brandKey === brandOne) {
        await WriteFile(comparedData[brandOne], f.output);
      }
    });
  });

  return {
    comparedData,
    globalData,
  };
};
