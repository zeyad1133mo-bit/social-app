export interface ICacheProvider {
    set(key: string, value: string | number, ttl: number): Promise<string>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<number>;
    ttl(key: string): Promise<number | null>;
}