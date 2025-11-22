import { redis } from '../config/redis.js';

const cacheService = {
    SERVICE_PREFIX: 'cache:',
    
    async set(key, value, ttl = 3600) {
        key = cacheService.constructKey(key);
        const data = typeof value === 'string' ? value : JSON.stringify(value);
        await redis.set(key, data, 'EX', ttl);
    },

    async get(key) {
        key = cacheService.constructKey(key);
        const data = await redis.get(key);
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch {
            return data;
        }
    },

    async remember(key, fetchFunction, ttl = 3600, ...args) {
        key = cacheService.constructKey(key);
        let data = await this.get(key);
        if (data !== null) return data;

        data = await fetchFunction(...args);
        await this.set(key, data, ttl);
        return data;
    },

    async del(key) {
        key = cacheService.constructKey(key);
        await redis.del(key);
    },

    async exists(key) {
        key = cacheService.constructKey(key);
        const result = await redis.exists(key);
        return result === 1;
    },

    async clearAll() {
        const keys = await redis.keys(`${cacheService.SERVICE_PREFIX}:*`);
        if (keys.length > 0) {
            await redis.del(keys);
        }
    },

    async ttl(key) {
        key = cacheService.constructKey(key);
        return redis.ttl(key);
    },

    async acquireLock(key, ttl = 5, retries = 3, delay = 100) {
        const lockKey = `${cacheService.SERVICE_PREFIX}:lock:${key}`;
        for (let i = 0; i < retries; i++) {
            const result = await redis.set(lockKey, 'locked', 'NX', 'EX', ttl);
            if (result === 'OK') return true;
            await new Promise(r => setTimeout(r, delay));
        }
        return false;
    },

    async releaseLock(key) {
        const lockKey = `${cacheService.SERVICE_PREFIX}:lock:${key}`;
        await redis.del(lockKey);
    },

    async cachedQuery(key, queryFn, ttl = 300) {
        return this.remember(key, async () => {
            return await queryFn();
        }, ttl);
    },
    
    constructKey(key) {
        return `${cacheService.SERVICE_PREFIX}${key}`;
    },
};

export default cacheService;
