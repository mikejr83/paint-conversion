import { HandleFile } from './extract-data/handle-file';
import { filesInfo } from './file-info';

const tasks: Promise<void>[] = [];

filesInfo.forEach((fileInfo) => {
  tasks.push(
    HandleFile(fileInfo.brandOrder, fileInfo.filename, fileInfo.output),
  );
});

Promise.all(tasks).then(() => {
  console.log('Done!');
});
