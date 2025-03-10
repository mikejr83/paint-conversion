import { writeFile } from 'fs-extra';

import {
  CreateDataFromBase,
  RunComparisons,
  UpdateFromData,
} from './update-data/index';

CreateDataFromBase()
  .then(() => {
    return UpdateFromData();
  })
  .then((globalData) => {
    return RunComparisons(globalData);
  })
  .then((results) => {
    console.log('Writing dump of data...');
    return Promise.all([
      writeFile('./dump-all.json', JSON.stringify(results.globalData, null, 2)),
      writeFile('./dump.json', JSON.stringify(results.comparedData, null, 2)),
    ]);
  });
