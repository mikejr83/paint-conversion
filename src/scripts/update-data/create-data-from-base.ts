import { filesInfo } from '../file-info';
import { BrandData } from './brand-data';
import { HandleLoadBaseDataFile } from './handle-load-base-data-file';

export const CreateDataFromBase = async (): Promise<void> => {
  const tasks: Promise<void>[] = [];
  const globalData: Record<string, BrandData> = {};

  filesInfo.forEach((fileInfo) => {
    tasks.push(HandleLoadBaseDataFile(globalData, fileInfo));
  });

  await Promise.all(tasks);
};
