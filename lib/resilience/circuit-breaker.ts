/**
 * CIRCUIT BREAKER
 * Closed  → normal operation, failures counted
 * Open    → blocked after FAILURE_THRESHOLD consecutive failures
 * Half-Open → single probe after RECOVERY_TIMEOUT_MS
 */

import type { CircuitBreakerState } from '@/lib/types';

const FAILURE_THRESHOLD = 3;
const RECOVERY_TIMEOUT_MS = 60_000;

const registry = new Map<string, CircuitBreakerState>();

function get(courierId: string): CircuitBreakerState {
  return (
    registry.get(courierId) ?? {
      courierId,
      consecutiveFailures: 0,
      state: 'Closed',
      lastFailureAt: null,
      nextRetryAt: null,
    }
  );
}

export function recordSuccess(courierId: string): void {
  registry.set(courierId, {
    courierId,
    consecutiveFailures: 0,
    state: 'Closed',
    lastFailureAt: null,
    nextRetryAt: null,
  });
}

export function recordFailure(courierId: string): CircuitBreakerState {
  const current = get(courierId);
  const consecutiveFailures = current.consecutiveFailures + 1;
  const now = Date.now();

  if (consecutiveFailures >= FAILURE_THRESHOLD) {
    const next: CircuitBreakerState = {
      courierId,
      consecutiveFailures,
      state: 'Open',
      lastFailureAt: now,
      nextRetryAt: now + RECOVERY_TIMEOUT_MS,
    };
    registry.set(courierId, next);
    return next;
  }

  const next: CircuitBreakerState = {
    ...current,
    consecutiveFailures,
    lastFailureAt: now,
    nextRetryAt: null,
  };
  registry.set(courierId, next);
  return next;
}

export function isCircuitAllowing(courierId: string): boolean {
  const state = get(courierId);
  if (state.state === 'Closed') return true;
  if (state.state === 'Open') {
    const now = Date.now();
    if (state.nextRetryAt !== null && now >= state.nextRetryAt) {
      registry.set(courierId, { ...state, state: 'Half-Open' });
      return true;
    }
    return false;
  }
  return false; // Half-Open: probe already in flight
}

export function getCircuitState(courierId: string): CircuitBreakerState {
  return get(courierId);
}

export function getAllCircuitStates(): CircuitBreakerState[] {
  return Array.from(registry.values());
}
