import { FileInfo, ReadJsonDataFile } from '../file-info';
import { BrandData } from './brand-data';
import { HandlePaintComparison } from './handle-paint-comparison';

export const HandleLoadDataFile = async (
  globalData: Record<string, BrandData>,
  fileInfo: FileInfo,
) => {
  const data = await ReadJsonDataFile(fileInfo.output);

  if (data && data.length > 0) {
    console.log(
      `Processing current data ${data.length} for ${fileInfo.output}`,
    );

    data.forEach((paint) => {
      HandlePaintComparison(globalData, [paint]);
    });
  } else {
    console.log('no data to update');
  }
};
