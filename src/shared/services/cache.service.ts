import NodeCache, { Key } from 'node-cache';
import crypto from 'crypto';

class CacheService {
  public cache: NodeCache;

  constructor(ttlSeconds: number) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
  }

  get(key: Key, storeFunction: Function) {
    const value = this.cache.get(key);
    if (value) {
      return Promise.resolve(value);
    }

    return storeFunction().then((result) => {
      this.cache.set(key, result);
      return result;
    });
  }

  del(keys: Key | Key[]) {
    this.cache.del(keys);
  }

  delStartWith(startStr = '') {
    if (!startStr) {
      return;
    }

    const keys = this.cache.keys();

    for (const key of keys) {
      if (key.startsWith(startStr)) {
        this.del(key);
      }
    }
  }

  getKeyFromString(string: string, prefix?: string): Key {
    const hash: Key = crypto.createHash('sha1').update(string).digest('hex');

    return `${prefix ? prefix : ''}${hash}`;
  }

  flush() {
    this.cache.flushAll();
  }
}

export default CacheService;
