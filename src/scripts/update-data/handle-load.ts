import {
  FileInfo,
  ReadParsedDataFile,
  ReadBaseDataFile,
  ReadJsonDataFile,
} from '../file-info';
import { BrandData } from '../../models/brand-data';
import { HandlePaintComparison } from './handle-paint-comparison';

export const HandleLoadBaseDataFile = async (
  globalData: Record<string, BrandData>,
  fileInfo: FileInfo,
) => {
  const data = await ReadBaseDataFile(fileInfo.output);

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

export const HandleLoadParsedDataFile = async (
  globalData: Record<string, BrandData>,
  fileInfo: FileInfo,
) => {
  const data = await ReadParsedDataFile(fileInfo.output);

  if (data && data.length > 0) {
    console.log(
      `Processing current data ${data.length} for ${fileInfo.output}`,
    );

    data.forEach((paints) => {
      HandlePaintComparison(globalData, [paints]);
    });
  } else {
    console.log('no data to update');
  }
};

export const HandleLoadJsonDataFile = async (
  globalData: Record<string, BrandData>,
  fileInfo: FileInfo,
) => {
  const data = await ReadJsonDataFile(fileInfo.output);

  if (data && data.length > 0) {
    console.log(
      `Processing current data ${data.length} for ${fileInfo.output}`,
    );

    data.forEach((paints) => {
      HandlePaintComparison(globalData, [paints]);
    });
  } else {
    console.log('no data to update');
  }
};
