import { StateStorage } from 'zustand/middleware';

export const createCacheStorage = (): StateStorage & { getCache(): Map<string, string> } => {
    const cache = new Map();
    return {
        getItem(name: string) {
            return cache.get(name);
        },
        setItem(name: string, value: string) {
            cache.set(name, value);
        },
        removeItem(name: string) {
            cache.delete(name);
        },
        getCache() {
            return cache;
        },
    };
};
