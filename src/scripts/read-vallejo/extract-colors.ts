import { intToRGBA, Jimp } from 'jimp';
import { ColorInfo } from './color-info';

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return (
    '#' + toHex(Math.round(r)) + toHex(Math.round(g)) + toHex(Math.round(b))
  );
}

export async function ExtractColors(buffer: ArrayBuffer): Promise<ColorInfo> {
  const image = await Jimp.read(buffer);

  const xStart = 15,
    yStart = 150,
    size = 10;

  let r = 0,
    g = 0,
    b = 0;

  for (let x = xStart; x < xStart + size; x++) {
    for (let y = yStart; y < yStart + size; y++) {
      const pixelColor = image.getPixelColor(x, y);
      const rgba = intToRGBA(pixelColor);
      r += Math.pow(rgba.r, 2);
      g += Math.pow(rgba.g, 2);
      b += Math.pow(rgba.b, 2);
    }
  }

  r = Math.sqrt(r / Math.pow(size, 2));
  g = Math.sqrt(g / Math.pow(size, 2));
  b = Math.sqrt(b / Math.pow(size, 2));

  // Convert RGBA to RGB (optional)
  const rgb = {
    r: r,
    g: g,
    b: b,
  };

  // Convert RGB to Hex (optional)
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

  return {
    hex,
    rgb,
  };
}
