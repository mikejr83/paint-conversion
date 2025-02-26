import convert from 'color-convert';

export function calculateDeltaE(baseColor: string, compairedToColor: string) {
  const basePaintLabColor = convert.hex.lab(baseColor);
  const compariedToLabColor = convert.hex.lab(compairedToColor);

  const lDiff = basePaintLabColor[0] - compariedToLabColor[0];
  const aDiff = basePaintLabColor[1] - compariedToLabColor[1];
  const bDiff = basePaintLabColor[2] - compariedToLabColor[2];

  return Math.sqrt(lDiff * lDiff + aDiff * aDiff + bDiff * bDiff);
}
