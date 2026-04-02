/**
 * Data service — fetches and transforms data from external sources.
 */

import { processData, type RawDataInput, type ProcessedData } from "../utils/data-processor";

interface ExternalApiResponse {
  success: boolean;
  data: any;
  pagination?: {
    page: number;
    totalPages: number;
    totalItems: number;
  };
}

interface CacheEntry {
  data: ProcessedData[];
  expiresAt: number;
}

const cache: Map<string, CacheEntry> = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch data from an external API and process it.
 *
 * BUG: When the external API returns { success: true, data: null },
 * the processData() call receives null records and crashes with:
 *   TypeError: Cannot read properties of null (reading 'records')
 */
export async function fetchAndParse(
  endpoint: string,
  options: { useCache?: boolean } = {}
): Promise<ProcessedData[]> {
  // Check cache first
  if (options.useCache) {
    const cached = cache.get(endpoint);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }
  }

  // Fetch from external API
  const response = await fetchExternal(endpoint);

  if (!response.success) {
    throw new Error(`API request failed for ${endpoint}`);
  }

  // BUG: response.data could be null even when success is true
  // This passes null to processData which expects RawDataInput
  const rawInput: RawDataInput = response.data;
  const processed = processData(rawInput);

  // Cache the result
  if (options.useCache) {
    cache.set(endpoint, {
      data: processed,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });
  }

  return processed;
}

/**
 * Fetch and aggregate data from multiple endpoints.
 */
export async function fetchAndAggregate(
  endpoints: string[]
): Promise<{ results: ProcessedData[]; errors: string[] }> {
  const results: ProcessedData[] = [];
  const errors: string[] = [];

  for (const endpoint of endpoints) {
    try {
      const data = await fetchAndParse(endpoint, { useCache: true });
      results.push(...data);
    } catch (err: any) {
      errors.push(`${endpoint}: ${err.message}`);
    }
  }

  return { results, errors };
}

/**
 * Invalidate cached data for a specific endpoint.
 */
export function invalidateCache(endpoint: string): void {
  cache.delete(endpoint);
}

/**
 * Clear the entire cache.
 */
export function clearCache(): void {
  cache.clear();
}

// Internal helpers

async function fetchExternal(endpoint: string): Promise<ExternalApiResponse> {
  // Simulated external API call
  // In production, this would use fetch() or axios
  return {
    success: true,
    data: {
      records: [
        { id: "1", payload: { data: { items: [{ value: "a" }] } } },
        { id: "2", payload: { data: { items: [{ value: "b" }] } } },
      ],
      metadata: { source: endpoint, version: 1 },
    },
  };
}
