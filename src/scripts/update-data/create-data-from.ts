import { FileInfo, filesInfo } from '../file-info';
import { BrandData } from './brand-data';

export const CreateDataFrom = async (
  handleDataFile: (
    globalData: Record<string, BrandData>,
    fileInfo: FileInfo,
  ) => Promise<void>,
): Promise<Record<string, BrandData>> => {
  const tasks: Promise<void>[] = [];
  const globalData: Record<string, BrandData> = {};

  filesInfo.forEach((fileInfo) => {
    tasks.push(handleDataFile(globalData, fileInfo));
  });

  await Promise.all(tasks);

  return globalData;
};
