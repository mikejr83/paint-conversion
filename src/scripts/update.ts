import { writeFile } from 'fs-extra';

import {
  ConsolidateData,
  CreateDataFrom,
  HandleLoadBaseDataFile,
  HandleLoadJsonDataFile,
  HandleLoadParsedDataFile,
  RunComparisons,
} from './update-data/index';

Promise.all([
  CreateDataFrom(HandleLoadBaseDataFile),
  CreateDataFrom(HandleLoadParsedDataFile),
  CreateDataFrom(HandleLoadJsonDataFile),
])
  .then(([baseData, parsedData, overrideData]) => {
    return ConsolidateData(baseData, parsedData, overrideData);
  })
  .then((globalData) => {
    // writeFile('./dump-all.json', JSON.stringify(globalData, null, 2));
    return RunComparisons(globalData);
  })
  .then((results) => {
    console.log('Writing dump of data...');
    return Promise.all([
      writeFile('./dump-all.json', JSON.stringify(results.globalData, null, 2)),
      writeFile('./dump.json', JSON.stringify(results.comparedData, null, 2)),
    ]);
  });
// CreateDataFromBase()
//   .then(() => {
//     return UpdateFromData();
//   })
//   .then((globalData) => {
//     return RunComparisons(globalData);
//   })
//   .then((results) => {
//     console.log('Writing dump of data...');
//     return Promise.all([
//       writeFile('./dump-all.json', JSON.stringify(results.globalData, null, 2)),
//       writeFile('./dump.json', JSON.stringify(results.comparedData, null, 2)),
//     ]);
//   });
