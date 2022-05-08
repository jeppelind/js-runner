import { createHmac } from 'crypto';
import { contextBridge } from 'electron';
import { watch } from 'fs';
import { readdir } from 'fs/promises';

contextBridge.exposeInMainWorld('electron', {
  doIt: (data?: string) => {
    const secret = data || 'abcdefg';
    const hmac = createHmac('sha256', secret);
    hmac.update('I like cupcakes');
    const hash = hmac.digest('hex');
    return `Hello ${hash}`;
  },
  readdir: async (dir: string) => {
    const files = await readdir(dir, { withFileTypes: true });
    return files;
  },
  readdir2: readdir,
  watchdir: watch,
});
