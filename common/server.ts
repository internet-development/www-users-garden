import * as Constants from '@common/constants';
import * as Utilities from '@common/utilities';

import aesjs from 'aes-js';

// NOTE(jimmylee)
/*
Some endpoints on https://api.internet.dev require server-side decryption. Without it, you won’t be able to perform actions like password recovery or Google authentication. To enable these features, you’ll need to set two environment variables with the correct values, and have an active partnership with us.

When we built this open-source template for learning purposes, we aimed to make it fully open and accessible. However, since we are also running a service, certain restrictions are necessary. We appreciate your understanding.

API_AES_KEY=
API_IV_KEY=
*/

export function decrypt(hex) {
  if (Utilities.isEmpty(process.env.API_AES_KEY)) {
    throw new Error('process.env.API_AES_KEY');
    return;
  }

  if (Utilities.isEmpty(process.env.API_IV_KEY)) {
    throw new Error('process.env.API_IV_KEY');
    return;
  }

  const aesKey = aesjs.utils.utf8.toBytes(process.env.API_AES_KEY);
  const base64IV = process.env.API_IV_KEY;

  if (!base64IV) {
    throw new Error('process.env.API_IV_KEY is undefined. Please set the environment variable.');
  }

  const ivBytes = aesjs.utils.hex.toBytes(Buffer.from(base64IV, 'base64').toString('hex'));
  const aesCtr = new aesjs.ModeOfOperation.ctr(aesKey, new aesjs.Counter(ivBytes));
  const encryptedBytes = aesjs.utils.hex.toBytes(hex);
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);
  const decrypted = aesjs.utils.utf8.fromBytes(decryptedBytes);

  return decrypted;
}

export async function setup(context): Promise<{ sessionKey?: any; viewer?: Record<string, any> | null }> {
  let viewer = null;
  let sessionKey = context.req.cookies['gardening_session'] || '';

  if (!Utilities.isEmpty(sessionKey)) {
    try {
      const response = await fetch(`${Constants.HOST}/api/users/viewer`, {
        method: 'GET',
        headers: { 'X-API-KEY': sessionKey, 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (result && result.viewer) {
        viewer = result.viewer;
      }
    } catch (e) {}
  }

  return { sessionKey, viewer };
}

export async function tryKeyWithoutCookie(key): Promise<{ sessionKey?: any; viewer?: Record<string, any> | null }> {
  let viewer = null;

  if (!Utilities.isEmpty(key)) {
    try {
      const response = await fetch(`${Constants.HOST}/api/users/viewer`, {
        method: 'GET',
        headers: { 'X-API-KEY': key, 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (result && result.viewer) {
        viewer = result.viewer;
      }
    } catch (e) {}
  }

  return { sessionKey: key, viewer };
}
