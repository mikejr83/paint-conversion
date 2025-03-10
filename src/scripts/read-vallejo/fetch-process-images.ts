import { ExtractColors } from './extract-colors';
import { ImageInfo } from './image-info';

export async function FetchAndProcessImages(imageInfos: ImageInfo[]) {
  const fetchPromises = imageInfos.map(async (imgInfo) => {
    const fetchResponse = await fetch(imgInfo.filename);

    const buffer = await fetchResponse.arrayBuffer();

    const colorInfo = await ExtractColors(buffer);

    return {
      ...imgInfo,
      colorInfo,
    };
  });

  return await Promise.all(fetchPromises);
}
