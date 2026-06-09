const Redis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redisClient = null;try {
  redisClient = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true
  });
} catch (e) {
  console.warn('[CACHE] Redis no disponible, modo sin cache');
}

const CACHE_TTL = parseInt(process.env.CACHE_TTL) || 60;

const cache = {
  async get(key) {
    if (!redisClient) return null;
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async set(key, data, ttl = CACHE_TTL) {
    if (!redisClient) return;
    try {
      await redisClient.setex(key, ttl, JSON.stringify(data));
    } catch {}
  },

  async del(pattern) {
    if (!redisClient) return;
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) await redisClient.del(...keys);
    } catch {}
  },

  async invalidateAll() { await this.del('prop:*'); },

  key(path) { return `prop:${path}`; },

  async close() {
    if (redisClient) {
      try {
        await redisClient.quit();
        console.log('[CACHE] Conexión Redis cerrada');
      } catch (err) {
        console.error('[CACHE] Error cerrando Redis:', err.message);
      }
    }
  }
};

(async () => {
  if (redisClient) {
    try {
      await redisClient.connect();
      console.log('[CACHE] Redis conectado en', REDIS_URL);
    } catch {
      console.warn('[CACHE] Redis no disponible, las consultas iran directo a PostgreSQL');
      redisClient = null;
    }
  }
})();

module.exports = cache;
