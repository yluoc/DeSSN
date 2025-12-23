import 'server-only';

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

/**
 * @dev Generic GET request helper with timeout, caching, and typed JSON parsing.
 */
export async function httpGet<T> (
    url: string,
    init?: RequestInit & { timeoutMs?: number; cacheTtlMs?: number }
): Promise<T> {
    const timeoutMs = init?.timeoutMs ?? 10_000; // Reduced from 15s to 10s
    const cacheTtlMs = init?.cacheTtlMs ?? 30_000; // 30 second cache by default
    
    // Check cache first
    const cacheKey = `${url}:${JSON.stringify(init)}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
        return cached.data as T;
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(url, { 
            ...init, 
            signal: controller.signal,
            headers: {
                'Cache-Control': 'max-age=30',
                ...init?.headers
            }
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        
        const data = await res.json() as T;
        
        // Cache the result
        cache.set(cacheKey, {
            data,
            timestamp: Date.now(),
            ttl: cacheTtlMs
        });
        
        return data;
    } finally {
        clearTimeout(id);
    }
}

/**
 * @dev Clear cache for a specific URL pattern or all cache
 */
export function clearCache(urlPattern?: string) {
    if (urlPattern) {
        for (const key of cache.keys()) {
            if (key.includes(urlPattern)) {
                cache.delete(key);
            }
        }
    } else {
        cache.clear();
    }
}