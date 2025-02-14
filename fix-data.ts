import { JSDOM } from 'jsdom';
import { ensureDir, writeJSON } from 'fs-extra';
import * as path from 'path';
import { Paint } from './src/models/paint';

const htmlFileLocation = './public';
const jsonOutputLocation = '.public/json';

const files = [
  {
    brandOrder: [
      'Citadel',
      'Vallejo_Game',
      'Vallejo_Model',
      'P3',
      'Army_Painter',
    ],
    filename: 'index-old.html',
    output: 'citadel.json',
  },
  {
    brandOrder: [
      'P3',
      'Citadel',
      'Vallejo_Game',
      'Vallejo_Model',
      'Army_Painter',
    ],
    filename: 'p3.html',
    output: 'p3.json',
  },
  {
    brandOrder: [
      'Vallejo_Model',
      'Citadel',
      'Vallejo_Game',
      'P3',
      'Army_Painter',
    ],
    filename: 'vallejo-model.html',
    output: 'vallejo-model.json',
  },
  {
    brandOrder: [
      'Vallejo_Game',
      'Citadel',
      'Vallejo_Model',
      'P3',
      'Army_Painter',
    ],
    filename: 'vallejo-game.html',
    output: 'vallejo-game.json',
  },
  {
    brandOrder: [
      'Army_Painter',
      'Citadel',
      'Vallejo_Game',
      'Vallejo_Model',
      'P3',
    ],
    filename: 'army-painter.html',
    output: 'army-painter.json',
  },
];

async function ReadFile(filename: string) {
  const filePath = path.join(htmlFileLocation, filename);

  console.log('Loading', filePath);

  const jsdom = await JSDOM.fromFile(filePath);

  return jsdom;
}

async function WriteFile(data: any, filename: string) {
  const filePath = path.join(jsonOutputLocation, filename);

  console.log(`Writing data to: ${filePath}`);

  await ensureDir(path.dirname(filePath));

  await writeJSON(filePath, data);
}

async function ReadData(brandOrder: string[], jsdom: JSDOM) {
  let tableRows = jsdom.window.document.querySelectorAll('tr');
  const allPaints: Paint[][] = [];
  tableRows.forEach((row) => {
    const columns = row.querySelectorAll('td:not(.color-col)');

    if (columns.length === 0) {
      return;
    }

    const paints: Paint[] = [];
    for (let i = 0; i < columns.length; i++) {
      const brand = brandOrder[i];
      const paint: Partial<Paint> = {
        brand,
        altNames: { 'zh-Hans': '' },
      };

      const column = columns[i];
      const textParts: string[] = [];
      column.childNodes.forEach((node) => {
        if (node.nodeName.toLocaleLowerCase() === 'strong') {
          paint.name = (node as HTMLElement).innerHTML;
          paint.key = paint.name.toLocaleUpperCase().replaceAll(/\s+/gm, '_');
        } else if (node.nodeName.toLocaleLowerCase() !== 'br') {
          textParts.push(node.nodeValue ?? '');
        }
      });

      const otherInfo = textParts.join('');
      const match = otherInfo
        .trim()
        .replaceAll('\n', '')
        .replaceAll(/\s+/gi, ' ')
        .matchAll(
          /^([\w\s]+\s\-?\s?([\w\s]+))\s\-\s(#[a-fA-f0-9]{6})\s*([0-9\.]+)?/gm,
        );
      let result = match.next();
      do {
        if (result.value?.length ?? 0 >= 3) {
          paint.series = result.value![2];
        }
        if (result.value?.length ?? 0 >= 4) {
          paint.color = result.value![3];
        }
        if (result.value?.length ?? 0 >= 5) {
          paint.matchStrength = parseFloat(result.value![4]);
        }
        result = match.next();
      } while (!result.done);

      paints.push(paint as Paint);
    }

    allPaints.push(paints);
  });

  return allPaints;
}

async function HandleFile(
  brandOrder: string[],
  filename: string,
  outputFilename: string,
) {
  console.log(`Fixing data for: ${filename}`);

  const file = await ReadFile(filename);

  const comparablePaints = await ReadData(brandOrder, file);

  await WriteFile(comparablePaints, outputFilename);

  console.log(`Completed working on file ${filename}`);
}

const tasks: Promise<void>[] = [];

files.forEach((fileInfo) => {
  tasks.push(
    HandleFile(fileInfo.brandOrder, fileInfo.filename, fileInfo.output),
  );
});

Promise.all(tasks).then(() => {
  console.log('Done!');
});
