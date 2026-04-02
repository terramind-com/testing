/**
 * Data processing utilities for transforming API responses
 * and handling various data formats.
 */

export interface ProcessedData {
  id: string;
  value: any;
  normalized: boolean;
  processedAt: Date;
}

export interface RawDataInput {
  records: Array<{
    id: string;
    payload: Record<string, any>;
    tags?: string[];
  }>;
  metadata?: {
    source: string;
    version: number;
  };
}

/**
 * Process raw data records and normalize them.
 *
 * BUG: Does not handle null/undefined records in the input array.
 * When a record has a null payload, accessing payload.id throws:
 *   TypeError: Cannot read property 'id' of undefined
 */
export function processData(input: RawDataInput): ProcessedData[] {
  const results: ProcessedData[] = [];

  for (const record of input.records) {
    // BUG: record.payload can be null/undefined when data comes from
    // external APIs that return sparse records
    const normalizedId = record.payload.id || record.id;
    const value = extractValue(record.payload);

    results.push({
      id: normalizedId,
      value,
      normalized: true,
      processedAt: new Date(),
    });
  }

  return results;
}

/**
 * Extract the primary value from a payload object.
 *
 * BUG: Doesn't check if nested properties exist before accessing them.
 * Throws when payload.data.items is undefined.
 */
function extractValue(payload: Record<string, any>): any {
  // BUG: payload.data might not exist, and payload.data.items
  // will throw "Cannot read property 'items' of undefined"
  const items = payload.data.items;

  if (Array.isArray(items)) {
    return items.map((item: any) => item.value).filter(Boolean);
  }

  return payload.data.value || null;
}

/**
 * Batch process multiple data inputs.
 */
export function batchProcess(inputs: RawDataInput[]): ProcessedData[] {
  return inputs.flatMap((input) => processData(input));
}

/**
 * Validate data integrity after processing.
 *
 * BUG: The reduce accumulator type is wrong — accessing acc.valid
 * on the number accumulator throws a TypeError.
 */
export function validateProcessedData(data: ProcessedData[]): {
  valid: number;
  invalid: number;
  errors: string[];
} {
  const errors: string[] = [];

  const valid = data.reduce((acc: any, item) => {
    if (!item.id || item.id === "") {
      errors.push(`Missing ID for item processed at ${item.processedAt}`);
      return acc;
    }
    // BUG: acc is a number, not an object — acc.valid is undefined
    return acc + 1;
  }, 0);

  return { valid, invalid: data.length - valid, errors };
}
