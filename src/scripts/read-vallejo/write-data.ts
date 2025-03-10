import { ensureDir, writeJSON } from 'fs-extra';

import { Paint } from '@/models/paint';

import { ConvertNameToKey } from '../extract-data/convert-name-to-key';
import { ColorInfo } from './color-info';
import { ImageInfo } from './image-info';
import { dirname } from 'path';

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

  await ensureDir(dirname(filename));
  await writeJSON(filename, paints);
}
