import {
  ConsolidateData,
  CreateDataFrom,
  HandleLoadBaseDataFile,
  HandleLoadJsonDataFile,
  HandleLoadParsedDataFile,
  RunComparisons,
} from './update-data/index';
import { WriteFile } from './file-info';
import { BrandData } from '@/models/brand-data';

const useParsedData = false;

Promise.all([
  CreateDataFrom(HandleLoadBaseDataFile),
  useParsedData
    ? CreateDataFrom(HandleLoadParsedDataFile)
    : Promise.resolve({} as Record<string, BrandData>),
  CreateDataFrom(HandleLoadJsonDataFile),
])
  .then(([baseData, parsedData, overrideData]) =>
    ConsolidateData(baseData, parsedData, overrideData),
  )
  .then((globalData) => RunComparisons(globalData))
  .then((results) => WriteFile(results.globalData, 'paints.json'))
  .then(() => console.log('DONE!'));
