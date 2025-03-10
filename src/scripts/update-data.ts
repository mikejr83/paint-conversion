import { Paint } from '@/models/paint';
import {
  FileInfo,
  filesInfo,
  ReadJsonDataFile,
  ReadPublicDataFile,
  WriteFile,
} from './file-info';
import { writeFile } from 'fs-extra';
import convert from 'color-convert';
import { getDeltaE00 } from 'delta-e';

interface BrandData {
  paintMap: Record<string, Paint>;
}

const globalData: Record<string, BrandData> = {};

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

function calculateDeltaE(basePaint: Paint, comparedTo: Paint) {
  const basePaintLabColor = convert.hex.lab.raw(basePaint.color);
  const compariedToLabColor = convert.hex.lab.raw(comparedTo.color);
  return getDeltaE00(
    {
      A: basePaintLabColor[1],
      B: basePaintLabColor[2],
      L: basePaintLabColor[0],
    },
    {
      A: compariedToLabColor[1],
      B: compariedToLabColor[2],
      L: compariedToLabColor[0],
    },
  );
}

async function HandlePaintComparison(paints: Paint[]) {
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
}

async function HandleLoadBaseDataFile(fileInfo: FileInfo) {
  const data = await ReadPublicDataFile(fileInfo.output);

  if (data && data.length > 0) {
    console.log(
      `Processing current data ${data.length} for ${fileInfo.output}`,
    );

    data.forEach((paints) => {
      HandlePaintComparison(paints);
    });
  } else {
    console.log('no data to update');
  }
}

async function HandleLoadDataFile(fileInfo: FileInfo) {
  const data = await ReadJsonDataFile(fileInfo.output);

  if (data && data.length > 0) {
    console.log(
      `Processing current data ${data.length} for ${fileInfo.output}`,
    );

    data.forEach((paint) => {
      HandlePaintComparison([paint]);
    });
  } else {
    console.log('no data to update');
  }
}

async function CreateDataFromBase(): Promise<void> {
  const tasks: Promise<void>[] = [];

  filesInfo.forEach((fileInfo) => {
    tasks.push(HandleLoadBaseDataFile(fileInfo));
  });

  await Promise.all(tasks);
}

async function UpdateFromData(): Promise<void> {
  const tasks: Promise<void>[] = [];

  filesInfo.forEach((fileInfo) => {
    tasks.push(HandleLoadDataFile(fileInfo));
  });

  await Promise.all(tasks);
}

function CompareBrands(
  paintsForBrand: Record<string, Paint[]>,
  brandOneKey: string,
  brandTwoKey: string,
) {
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
      const deltaE = calculateDeltaE(paint, paintTwo);

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
}

async function RunComparisons() {
  const brands = Object.getOwnPropertyNames(globalData);

  const comparedData: Record<string, Paint[][]> = {};
  brands.forEach((brandOne) => {
    comparedData[brandOne] = [];
    const paintsForBrand: Record<string, Paint[]> = {};
    brands.forEach((brandTwo) => {
      if (brandOne !== brandTwo) {
        CompareBrands(paintsForBrand, brandOne, brandTwo);
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

  return comparedData;
}

CreateDataFromBase()
  .then(() => {
    return UpdateFromData();
  })
  .then(() => {
    return RunComparisons();
  })
  .then((comapredData) => {
    console.log('Writing dump of data...');
    return Promise.all([
      writeFile('./dump-all.json', JSON.stringify(globalData, null, 2)),
      writeFile('./dump.json', JSON.stringify(comapredData, null, 2)),
    ]);
  });
