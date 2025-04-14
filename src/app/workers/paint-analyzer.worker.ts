/// <reference lib="webworker" />

import { BrandData } from '@/models/brand-data';
import { Paint } from '@/models/paint';
import { CompareBrands } from '@/scripts/update-data/compare-brands';

function paintsToBrands(paints: Paint[]): Record<string, BrandData> {
  const brands: Record<string, BrandData> = {};

  for (const paint of paints) {
    if (!brands[paint.brand]) {
      brands[paint.brand] = { paintMap: {} };
    }
    brands[paint.brand].paintMap[paint.key] = paint;
  }

  return brands;
}

function RunComparisons(globalData: Record<string, BrandData>) {
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
  });

  return {
    comparedData,
    globalData,
  };
}

addEventListener('message', ($event: MessageEvent<{ paints: Paint[] }>) => {
  console.log('breaking up paints into brands of paints');
  const paints = paintsToBrands($event.data.paints);

  const result = RunComparisons(paints);

  postMessage(result);
});
