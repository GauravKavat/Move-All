/**
 * EXPONENTIAL BACKOFF WITH DECORRELATED JITTER
 * Retry window: 500ms minimum → 30,000ms maximum
 * Prevents thundering herd via decorrelated jitter (AWS recommendation)
 */

export interface BackoffConfig {
  baseDelayMs?: number;
  maxDelayMs?: number;
  maxAttempts?: number;
}

export interface BackoffResult<T> {
  data: T | null;
  attempts: number;
  totalDelayMs: number;
  success: boolean;
  lastError: Error | null;
}

const DEFAULTS = {
  baseDelayMs: 500,
  maxDelayMs: 30_000,
  maxAttempts: 8,
} as const;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function calcDelay(
  attempt: number,
  previousDelayMs: number,
  cfg: Required<BackoffConfig>
): number {
  const jitterRange = Math.min(previousDelayMs * 3, cfg.maxDelayMs);
  const jittered =
    cfg.baseDelayMs + Math.random() * (jitterRange - cfg.baseDelayMs);
  const exponential = cfg.baseDelayMs * Math.pow(2, attempt);
  return Math.min(exponential, jittered, cfg.maxDelayMs);
}

export async function withExponentialBackoff<T>(
  operation: () => Promise<T>,
  isRetriable: (err: unknown) => boolean = () => true,
  config: BackoffConfig = {}
): Promise<BackoffResult<T>> {
  const cfg = { ...DEFAULTS, ...config };
  let attempt = 0;
  let totalDelayMs = 0;
  let previousDelayMs = cfg.baseDelayMs;
  let lastError: Error | null = null;

  while (attempt < cfg.maxAttempts) {
    try {
      const data = await operation();
      return { data, attempts: attempt + 1, totalDelayMs, success: true, lastError: null };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (!isRetriable(err)) break;
      attempt++;
      if (attempt >= cfg.maxAttempts) break;
      const delay = calcDelay(attempt, previousDelayMs, cfg);
      previousDelayMs = delay;
      totalDelayMs += delay;
      await sleep(delay);
    }
  }

  return { data: null, attempts: attempt, totalDelayMs, success: false, lastError };
}

export function isHttpRetriable(status: number): boolean {
  return status >= 500 || status === 429 || status === 408;
}
