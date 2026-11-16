import Redis from "ioredis";
import { logger } from "../logger/logger.js";


interface RedisConfig {
    host: string;
    port: number;
    password?: string;
}

export class RedisCacheProvider{
    client: Redis;
    private connecting: Promise<void> | null;

    
    constructor(config: RedisConfig) { 
        this.client = new Redis({
            host: config.host,
            port: config.port,
            password: config.password,
            lazyConnect: true,
            maxRetriesPerRequest: 1,
            enableOfflineQueue: false,
            connectTimeout: 1000,
            commandTimeout: 1000,
            retryStrategy() {
                return null;
            },
        });
        this.client.on('error',(err)=>logger.error('Redis error', { error: err.message }));
        this.connecting = null;
    }

    async ensureConnected() {
        if (this.client.status === 'ready') return;

        if (!this.connecting) {
            this.connecting = this.client.connect().finally(() => {
                this.connecting = null;
            });
        }

        await this.connecting;
    }
    
    async set(key: string, value: string | number, ttl: number) {
        await this.ensureConnected();
        return this.client.set(key, value, 'EX', ttl);
    }

    async get(key: string) {
        await this.ensureConnected();
        return this.client.get(key);
    }

    async del(key: string) {
        await this.ensureConnected();
        return this.client.del(key);
    }

    async ttl(key: string) {
        await this.ensureConnected();
        return this.client.ttl(key);
    }

    async disconnect() {
        if (this.client.status === 'ready') {
            await this.client.quit();
            return;
        }

        this.client.disconnect();
    }
}
