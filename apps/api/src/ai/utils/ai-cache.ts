const cache = new Map<
  string,
  {
    data: any;
    expires: number;
  }
>();

export function getCache(key: string) {

  const item = cache.get(key);

  if (!item) return null;

  if (Date.now() > item.expires) {

    cache.delete(key);

    return null;
  }

  return item.data;
}

export function setCache(

  key: string,

  data: any,

  ttl = 60000

) {

  cache.set(key, {

    data,

    expires:

      Date.now() + ttl,

  });

}