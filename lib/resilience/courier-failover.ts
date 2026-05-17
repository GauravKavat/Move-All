import type { CourierPartner, FailoverDecision } from '@/lib/types';
import { isCircuitAllowing, recordSuccess, recordFailure } from './circuit-breaker';
import { withExponentialBackoff, isHttpRetriable } from './backoff';

const FAILOVER_MATRIX: Record<string, string[]> = {
  '3PL-DHL':  ['3PL-FX',  '3PL-BD',  'LOCAL'],
  '3PL-BD':   ['3PL-DHL', '3PL-FX',  'LOCAL'],
  '3PL-FX':   ['3PL-DHL', '3PL-BD',  'LOCAL'],
  '3PL-DTDC': ['3PL-BD',  '3PL-DHL', 'LOCAL'],
  'LOCAL':    ['3PL-DTDC','3PL-BD'],
};

const failoverLog: FailoverDecision[] = [];

export function selectFailoverTarget(
  sourceCourierId: string,
  available: CourierPartner[]
): CourierPartner | null {
  for (const candidateId of FAILOVER_MATRIX[sourceCourierId] ?? []) {
    const c = available.find((p) => p.id === candidateId);
    if (c && c.status === 'Operational' && isCircuitAllowing(candidateId)) {
      return c;
    }
  }
  return null;
}

export async function executeWithFailover<T>(
  courierId: string,
  operation: () => Promise<T>,
  available: CourierPartner[],
  volumePercent = 100
): Promise<{ data: T | null; usedCourierId: string; failoverTriggered: boolean }> {
  if (!isCircuitAllowing(courierId)) {
    const target = selectFailoverTarget(courierId, available);
    if (!target) return { data: null, usedCourierId: courierId, failoverTriggered: false };
    failoverLog.push({
      sourceCourierId: courierId,
      targetCourierId: target.id,
      volumePercent,
      triggeredAt: Date.now(),
      reason: 'Circuit breaker OPEN — automatic rerouting',
    });
    return { data: null, usedCourierId: target.id, failoverTriggered: true };
  }

  const result = await withExponentialBackoff(operation, (err) => {
    const e = err as { status?: number };
    return typeof e.status === 'number' ? isHttpRetriable(e.status) : true;
  });

  if (result.success && result.data !== null) {
    recordSuccess(courierId);
    return { data: result.data, usedCourierId: courierId, failoverTriggered: false };
  }

  recordFailure(courierId);
  const target = selectFailoverTarget(courierId, available);
  if (target) {
    failoverLog.push({
      sourceCourierId: courierId,
      targetCourierId: target.id,
      volumePercent,
      triggeredAt: Date.now(),
      reason: 'Exceeded 3 consecutive failures — failover activated',
    });
    return { data: null, usedCourierId: target.id, failoverTriggered: true };
  }

  return { data: null, usedCourierId: courierId, failoverTriggered: false };
}

export function getFailoverLog(): FailoverDecision[] {
  return [...failoverLog];
}
