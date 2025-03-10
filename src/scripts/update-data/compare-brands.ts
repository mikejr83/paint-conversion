import { Paint } from '@/models/paint';
import { BrandData } from './brand-data';
import { CalculateDeltaE } from './calc-delta-e';

function insertSorted<T>(
  array: T[],
  value: T,
  compareFn: (a: T, b: T) => number,
): T[] {
  let low = 0;
  let high = array.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (compareFn(array[mid], value) < 0) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  array.splice(low, 0, value);
  return array;
}

export const CompareBrands = (
  globalData: Record<string, BrandData>,
  paintsForBrand: Record<string, Paint[]>,
  brandOneKey: string,
  brandTwoKey: string,
) => {
  console.log(`Comparing ${brandOneKey} to ${brandTwoKey}`);

  const brandOne = globalData[brandOneKey];
  const brandTwo = globalData[brandTwoKey];

  const brandTwoPaintKeys = Object.getOwnPropertyNames(brandTwo.paintMap);

  Object.getOwnPropertyNames(brandOne.paintMap).forEach((paintKey) => {
    const paint = brandOne.paintMap[paintKey];
    if (paint === undefined) {
      console.log('bad key', paintKey);
      return;
    }

    const comparedPaints: Paint[] = [];

    brandTwoPaintKeys.forEach((compareToPaint) => {
      const paintTwo = brandTwo.paintMap[compareToPaint];
      const deltaE = CalculateDeltaE(paint, paintTwo);

      insertSorted(
        comparedPaints,
        { ...paintTwo, matchStrength: deltaE },
        (a, b) => {
          return a.matchStrength! - b.matchStrength!;
        },
      );
    });

    if (!paintsForBrand[paint.key]) {
      paintsForBrand[paint.key] = [paint];
    }

    paintsForBrand[paint.key].push(comparedPaints[0]);
  });
};
