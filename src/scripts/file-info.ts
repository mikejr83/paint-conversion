import { ensureDir, exists, readJSON, writeJSON } from 'fs-extra';
import { JSDOM } from 'jsdom';
import * as path from 'path';
import {
  armyPainter,
  citadel,
  p3,
  vallejoGame,
  vallejoModel,
} from '@/constants/brands';
import { Paint } from '@/models/paint';

export interface FileInfo {
  brandKey: string;
  brandOrder: string[];
  filename: string;
  output: string;
}

export const htmlFileLocation = './public';
export const jsonOutputLocation = './public/json';
export const jsonDataLocation = './src/data';
export const jsonParsedDataLocation = './src/data/from-parse';

export const filesInfo: FileInfo[] = [
  {
    brandKey: citadel.key,
    brandOrder: [
      citadel.key,
      vallejoGame.key,
      vallejoModel.key,
      p3.key,
      armyPainter.key,
    ],
    filename: 'index-old.html',
    output: 'citadel.json',
  },
  {
    brandKey: p3.key,
    brandOrder: [
      p3.key,
      citadel.key,
      vallejoGame.key,
      vallejoModel.key,
      armyPainter.key,
    ],
    filename: 'p3.html',
    output: 'p3.json',
  },
  {
    brandKey: vallejoModel.key,
    brandOrder: [
      vallejoModel.key,
      citadel.key,
      vallejoGame.key,
      p3.key,
      armyPainter.key,
    ],
    filename: 'vallejo-model.html',
    output: 'vallejo-model.json',
  },
  {
    brandKey: vallejoGame.key,
    brandOrder: [
      vallejoGame.key,
      citadel.key,
      vallejoModel.key,
      p3.key,
      armyPainter.key,
    ],
    filename: 'vallejo-game.html',
    output: 'vallejo-game.json',
  },
  {
    brandKey: armyPainter.key,
    brandOrder: [
      armyPainter.key,
      citadel.key,
      vallejoGame.key,
      vallejoModel.key,
      p3.key,
    ],
    filename: 'army-painter.html',
    output: 'army-painter.json',
  },
];

export async function ReadFileToJSDOM(filename: string) {
  const filePath = path.join(htmlFileLocation, filename);

  console.log('Loading', filePath);

  const jsdom = await JSDOM.fromFile(filePath);

  return jsdom;
}

async function DoJsonRead<T>(filePath: string) {
  const fileExists = await exists(filePath);

  if (fileExists) {
    console.log('Loading', filePath);

    return (await readJSON(filePath)) as T[];
  } else {
    return [];
  }
}

/**
 * Loads the parsed datafile for a paint manufacturer.
 * @param filename Filename to read
 * @returns JSON data
 */
export async function ReadParsedDataFile(filename: string) {
  const filePath = path.join(jsonParsedDataLocation, filename);

  return await DoJsonRead<Paint>(filePath);
}

/**
 * Loads a base data file for a paint manufacturer.
 * This is the original base data pulled from the HTML.
 * @param filename Filename to read
 * @returns JSON data
 */
export async function ReadBaseDataFile(filename: string) {
  const filePath = path.join(jsonOutputLocation, filename);

  return await DoJsonRead<Paint[]>(filePath);
}

/**
 * Loads override data file for a paint manufacturer.
 * This data takes precedence over base and parsed data.
 * @param filename Filename to read.
 * @returns JSON data
 */
export async function ReadJsonDataFile(filename: string) {
  const filePath = path.join(jsonDataLocation, filename);

  return await DoJsonRead<Paint>(filePath);
}

export async function WriteFile(data: unknown, filename: string) {
  const filePath = path.join(jsonOutputLocation, filename);

  console.log(`Writing data to: ${filePath}`);

  await ensureDir(path.dirname(filePath));

  await writeJSON(filePath, data);
}
