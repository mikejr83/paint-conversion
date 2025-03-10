import { FileInfo, ReadPublicDataFile } from '../file-info';
import { BrandData } from './brand-data';
import { HandlePaintComparison } from './handle-paint-comparison';

export const HandleLoadBaseDataFile = async (
  globalData: Record<string, BrandData>,
  fileInfo: FileInfo,
) => {
  const data = await ReadPublicDataFile(fileInfo.output);

  if (data && data.length > 0) {
    console.log(
      `Processing current data ${data.length} for ${fileInfo.output}`,
    );

    data.forEach((paints) => {
      HandlePaintComparison(globalData, paints);
    });
  } else {
    console.log('no data to update');
  }
};
