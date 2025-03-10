import { JSDOM } from 'jsdom';

export async function ParsePage(url: string) {
  console.log(`Parsing page ${url}`);
  const fetchResponse = await fetch(url);

  if (fetchResponse.status !== 200) {
    throw new Error('Oh no - ' + fetchResponse.statusText);
  }
  const pageAsString = await fetchResponse.text();

  return new JSDOM(pageAsString);
}

export async function ParsePageWithJSDOM(url: string) {
  const pageDOM = await JSDOM.fromURL(url, {
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  });

  return pageDOM;
}
