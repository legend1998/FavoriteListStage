// cache.js
import memjs from "memjs";

const host = process.env.MEMCACHED_HOST || "127.0.0.1";
const port = process.env.MEMCACHED_PORT || 11211;

const MEMCACHED_URI = `${host}:${port}`; // Default Memcached host and port

const mc = memjs.Client.create(MEMCACHED_URI);

const getCache = (key: string, callback: Function) => {
  mc.get(key, (err, value) => {
    if (err) {
      console.error("Memcached error", err);
      return callback(err, null);
    }
    if (value) {
      return callback(null, JSON.parse(value.toString()));
    } else {
      return callback(null, null);
    }
  });
};

const setCache = (key: string, data: any, expiration = 3600) => {
  mc.set(key, JSON.stringify(data), { expires: expiration }, (err) => {
    if (err) {
      console.error("Memcached set error", err);
    }
  });
};

const deleteCache = async (key: string) => {
  let success: boolean = await mc.delete(key);
  return success;
};
export { getCache, setCache, deleteCache };
