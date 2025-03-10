import { filesInfo } from '../file-info';
import { BrandData } from './brand-data';
import { HandleLoadDataFile } from './handle-load-data-file';

export const UpdateFromData = async (): Promise<Record<string, BrandData>> => {
  const tasks: Promise<void>[] = [];
  const globalData: Record<string, BrandData> = {};

  filesInfo.forEach((fileInfo) => {
    tasks.push(HandleLoadDataFile(globalData, fileInfo));
  });

  await Promise.all(tasks);

  return globalData;
};
