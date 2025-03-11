import { RGBAColor } from 'jimp';

export interface ColorInfo {
  hex: string;
  rgba?: RGBAColor;
  rgb: { r: number; g: number; b: number };
}
