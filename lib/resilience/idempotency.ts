/**
 * IDEMPOTENCY ENGINE — RTO SAFETY RAILS
 * Composite SHA-256 key: AWB + status event + request index
 * Deduplication window: 5000ms
 *
 * Server-side only (uses Node.js crypto).
 * Replace Map store with Redis SET + 5s TTL for production.
 */

import { createHash } from 'crypto';
import type { IdempotencyRecord } from '@/lib/types';

const WINDOW_MS = 5_000;
const store = new Map<string, IdempotencyRecord>();

export function generateIdempotencyHash(
  awb: string,
  statusEvent: string,
  requestIndex: number
): string {
  const composite = `${awb.toUpperCase()}::${statusEvent.toUpperCase()}::${requestIndex}`;
  return createHash('sha256').update(composite, 'utf8').digest('hex');
}

export interface IdempotencyCheckResult {
  isDuplicate: boolean;
  hash: string;
  existingRecord: IdempotencyRecord | null;
}

export function checkIdempotency(
  awb: string,
  statusEvent: string,
  requestIndex: number
): IdempotencyCheckResult {
  const hash = generateIdempotencyHash(awb, statusEvent, requestIndex);
  const existing = store.get(hash);

  if (existing) {
    if (Date.now() - existing.processedAt <= WINDOW_MS) {
      return { isDuplicate: true, hash, existingRecord: existing };
    }
    store.delete(hash);
  }

  return { isDuplicate: false, hash, existingRecord: null };
}

export function registerProcessedEvent(
  awb: string,
  statusEvent: string,
  requestIndex: number
): IdempotencyRecord {
  const hash = generateIdempotencyHash(awb, statusEvent, requestIndex);
  const record: IdempotencyRecord = {
    key: `${awb}::${statusEvent}::${requestIndex}`,
    awb,
    statusEvent,
    requestIndex,
    processedAt: Date.now(),
    sha256Hash: hash,
  };
  store.set(hash, record);
  return record;
}

export function purgeExpiredRecords(): number {
  const now = Date.now();
  let count = 0;
  for (const [key, record] of store.entries()) {
    if (now - record.processedAt > WINDOW_MS) {
      store.delete(key);
      count++;
    }
  }
  return count;
}
