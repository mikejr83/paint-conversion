import { FetchAndProcessImages } from './read-vallejo/fetch-process-images';
import { FindImages } from './read-vallejo/find-images';
import { ParsePage } from './read-vallejo/parse-page';
import { WriteData } from './read-vallejo/write-data';

/*
  This task extracts the data from Vallejo's site. It runs the task for Game and
  Model Color lines. The data is output into a "raw" directory. This data is
  intended to be used by other scripts to update the base data.

  This script was developed and run against the site in March of 2025. The
  site's layout may change in the future. If this script fails to run correctly
  it most likely is due to the site's structure changing. The appropriate
  methods that fetch pages and image information will need to be changed.

  One note, please respect manufacturers and do not continually run scripts like
  this against their sites over and over. These scripts contain the ability to
  run on a single page or a collection of images. Keep this in mind when making
  updates to the scripts. It is likely that manufacturers will change their
  sites to make scraping much harder if scripts like this are continually run
  against their sites.
*/

const test = false;

if (!test) {
  Promise.all([
    ParsePage('https://acrylicosvallejo.com/en/category/hobby/game-color-en/')
      // Only process first page
      // .then((dom) => FindImages(dom, undefined, 0))
      // Get All
      .then((dom) => FindImages(dom))
      .then((imageInfos) => FetchAndProcessImages(imageInfos))
      .then((infos) =>
        WriteData(
          'public/json/raw/vallejo-game.json',
          'VALLEJO_GAME',
          'Game',
          infos,
        ),
      ),
    ParsePage('https://acrylicosvallejo.com/en/category/hobby/model-color-en/')
      // Only process first page
      // .then((dom) => FindImages(dom, undefined, 0))
      // Get All
      .then((dom) => FindImages(dom))
      .then((imageInfos) => FetchAndProcessImages(imageInfos))
      .then((infos) =>
        WriteData(
          'app/data/from-parse/vallejo-model.json',
          'VALLEJO_MODEL',
          'Model',
          infos,
        ),
      ),
  ]);
} else {
  const output = 'app/data/from-parse/vallejo-game.test.json';

  const testImgs = [
    {
      filename:
        'https://acrylicosvallejo.com/wp-content/uploads/2024/01/vallejo-game-color-72007-NewIC-300x300.jpg',
      code: '72.007',
      name: 'Gold Yellow',
    },
    {
      filename:
        'https://acrylicosvallejo.com/wp-content/uploads/2024/01/vallejo-game-color-72038-NewIC-300x300.jpg',
      code: '72.038',
      name: 'Scrofulous Brown',
    },
    {
      filename:
        'https://acrylicosvallejo.com/wp-content/uploads/2024/01/vallejo-game-color-72110-NewIC-300x300.jpg',
      code: '72.110',
      name: 'Sunset Orange',
    },
    {
      filename:
        'https://acrylicosvallejo.com/wp-content/uploads/2024/01/vallejo-game-color-72008-NewIC-300x300.jpg',
      code: '72.008',
      name: 'Orange Fire',
    },
    {
      filename:
        'https://acrylicosvallejo.com/wp-content/uploads/2023/11/vallejo-game-color-specialfx-72609-NewIC-300x300.jpg',
      code: '72.609',
      name: 'Rust',
    },
  ];
  FetchAndProcessImages(testImgs).then((infos) =>
    WriteData(output, 'VALLEJO_MODEL', 'Model', infos),
  );
}
