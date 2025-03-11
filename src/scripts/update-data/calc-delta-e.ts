import convert from 'color-convert';
import { getDeltaE00 } from 'delta-e';

import { Paint } from '@/models/paint';

export const CalculateDeltaE = (basePaint: Paint, comparedTo: Paint) => {
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
};
