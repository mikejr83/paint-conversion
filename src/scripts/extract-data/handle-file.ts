import { ReadFileToJSDOM, WriteFile } from '../file-info';
import { ReadData } from './read-data';

export async function HandleFile(
  brandOrder: string[],
  filename: string,
  outputFilename: string,
) {
  console.log(`Fixing data for: ${filename}`);

  const file = await ReadFileToJSDOM(filename);

  const comparablePaints = await ReadData(brandOrder, file);

  await WriteFile(comparablePaints, outputFilename);

  console.log(`Completed working on file ${filename}`);
}
