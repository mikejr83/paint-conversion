import { Paint } from '@/models/paint';

import { ConvertNameToKey } from '../extract-data/convert-name-to-key';
import { WriteFile } from '../file-info';
import { ColorInfo } from './color-info';
import { ImageInfo } from './image-info';

export async function WriteData(
  filename: string,
  brand: string,
  series: string,
  imageColorData: (ImageInfo & { colorInfo: ColorInfo })[],
) {
  const paints = imageColorData.map((d) => {
    return {
      brand,
      color: d.colorInfo.hex,
      name: d.name,
      code: d.code,
      key: ConvertNameToKey(d.name),
      series,
    } as Paint;
  });

  await WriteFile(paints, filename);
}
