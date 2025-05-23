import { JSDOM } from 'jsdom';

import { Paint, PaintComparisonCollection } from '../../models/paint';
import { ConvertNameToKey } from './convert-name-to-key';

export async function ReadData(brandOrder: string[], jsdom: JSDOM) {
  const tableRows = jsdom.window.document.querySelectorAll('tr');
  const allPaints: PaintComparisonCollection = [];
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
          paint.key = ConvertNameToKey(paint.name);
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
          /^([\w\s]+\s-?\s?([\w\s]+))\s-\s(#[a-fA-f0-9]{6})\s*([0-9.]+)?/gm,
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
