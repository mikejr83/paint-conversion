import { JSDOM } from 'jsdom';

import { ImageInfo } from './image-info';
import { ParsePage } from './parse-page';

export async function FindImages(
  pageDOM: JSDOM,
  depth?: number,
  bail: number | null = null,
) {
  const images: ImageInfo[] = [];
  if (bail === null || (depth ?? 0) < bail) {
    const next = pageDOM.window.document.querySelector('a.next.page-numbers');

    if (next) {
      const href = next.getAttribute('href');
      if (href) {
        images.push(
          ...(await FindImages(await ParsePage(href), (depth ?? 0) + 1, bail)),
        );
      }
    }
  } else {
    console.log('No more recursion', bail, depth);
  }
  const products = pageDOM.window.document.querySelectorAll('li.product');

  products.forEach((node) => {
    const codeNode = node.querySelector('div.referencia');
    const nameNode = node.querySelector('.product-description h2');
    const imageNode = node.querySelector('img');
    const src = imageNode!.getAttribute('data-src');
    if (src) {
      images.push({
        filename: src,
        code: codeNode!.innerHTML.trim(),
        name: nameNode!.innerHTML.trim(),
      });
    } else {
      console.log('no data-src');
    }
  });

  return images;
}
