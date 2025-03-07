import { JSDOM } from 'jsdom';
import { Jimp, intToRGBA, rgbaToInt } from 'jimp';

interface ImageInfo {
  filename: string;
  code: string;
  name: string;
}

const bail: number | null = 0;

async function parsePage(url: string) {
  console.log(`Parsing page ${url}`);
  const fetchResponse = await fetch(url);

  if (fetchResponse.status !== 200) {
    throw new Error('Oh no - ' + fetchResponse.statusText);
  }
  const pageAsString = await fetchResponse.text();

  return new JSDOM(pageAsString);
}

async function parsePageWithJSDOM(url: string) {
  const pageDOM = await JSDOM.fromURL(url, {
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  });

  return pageDOM;
}

async function findImages(pageDOM: JSDOM, depth?: number) {
  const images: ImageInfo[] = [];
  if (bail === null || (depth ?? 0) < bail) {
    const next = pageDOM.window.document.querySelector('a.next.page-numbers');

    if (next) {
      const href = next.getAttribute('href');
      if (href) {
        images.push(
          ...(await findImages(await parsePage(href), (depth ?? 0) + 1)),
        );
      }
    }
  } else {
    console.log('No more recursion', bail, depth);
  }
  const products = pageDOM.window.document.querySelectorAll('li.product');

  products.forEach((node, i) => {
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

async function extractColors(buffer: ArrayBuffer) {}

async function fetchImages(imageInfos: ImageInfo[]) {
  const fetchPromises = imageInfos.map(async (imgInfo) => {
    const fetchResponse = await fetch(imgInfo.filename);

    const buffer = await fetchResponse.arrayBuffer();

    const image = await Jimp.read(buffer);

    const pixelColor = image.getPixelColor(50, 50);
    const rgba = intToRGBA(pixelColor);

    // Convert RGBA to RGB (optional)
    const rgb = {
      r: rgba.r,
      g: rgba.g,
      b: rgba.b,
    };

    // Convert RGB to Hex (optional)
    const hex = rgbaToInt(rgba.r, rgba.g, rgba.b, 255)
      .toString(16)
      .padStart(8, '0')
      .slice(0, 6);

    return {
      ...imgInfo,
      hex,
      rgb,
      rgba,
    };
  });

  return await Promise.all(fetchPromises);
}

const initialPage =
  'https://acrylicosvallejo.com/en/category/hobby/game-color-en/';
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
];

// parsePage(initialPage)
//   .then((dom) => findImages(dom))
//   .then(imgInfos => console.log('infos', imgInfos));
//.then((imgSrcs) => fetchImages(imgSrcs));

fetchImages(testImgs).then(infos => console.log(infos));
