import { HandleFile } from './extract-data/handle-file';
import { filesInfo } from './file-info';

/*
  This task extracts the initial data from the html pages that were originally in the
  repository when forked from redgrimm. This can be used to essentially reset the data
  to the same state it was in the last published HTML files from that repository.

  Other scripts essentially use this data as the base.
*/

const tasks: Promise<void>[] = [];

filesInfo.forEach((fileInfo) => {
  tasks.push(
    HandleFile(fileInfo.brandOrder, fileInfo.filename, fileInfo.output),
  );
});

Promise.all(tasks).then(() => {
  console.log('Done!');
});
