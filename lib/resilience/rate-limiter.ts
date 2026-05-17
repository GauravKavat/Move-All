/**
 * TOKEN BUCKET RATE LIMITER (tier-adaptive)
 * Starter    → 60 req/min
 * Pro        → 300 req/min
 * Enterprise → 3000 req/min (customisable)
 *
 * NOTE: In-process store. Replace with Redis for multi-instance deployments.
 */

import type { TenantTier, RateLimitConfig } from '@/lib/types';

export const TIER_CONFIGS: Record<TenantTier, RateLimitConfig> = {
  Starter:    { tier: 'Starter',    maxRequestsPerMinute: 60,   burstCapacity: 10  },
  Pro:        { tier: 'Pro',        maxRequestsPerMinute: 300,  burstCapacity: 50  },
  Enterprise: { tier: 'Enterprise', maxRequestsPerMinute: 3000, burstCapacity: 500 },
};

interface Bucket {
  tokens: number;
  lastRefillAt: number;
  config: RateLimitConfig;
}

const buckets = new Map<string, Bucket>();

function getOrCreate(tenantId: string, tier: TenantTier): Bucket {
  const existing = buckets.get(tenantId);
  if (existing) return existing;
  const config = TIER_CONFIGS[tier];
  const bucket: Bucket = {
    tokens: config.maxRequestsPerMinute + config.burstCapacity,
    lastRefillAt: Date.now(),
    config,
  };
  buckets.set(tenantId, bucket);
  return bucket;
}

function refill(bucket: Bucket): void {
  const now = Date.now();
  const elapsedMs = now - bucket.lastRefillAt;
  const add = (elapsedMs / 60_000) * bucket.config.maxRequestsPerMinute;
  bucket.tokens = Math.min(
    bucket.tokens + add,
    bucket.config.maxRequestsPerMinute + bucket.config.burstCapacity
  );
  bucket.lastRefillAt = now;
}

export interface RateLimitDecision {
  allowed: boolean;
  remainingTokens: number;
  resetInMs: number;
  tier: TenantTier;
}

export function checkRateLimit(
  tenantId: string,
  tier: TenantTier,
  tokensConsumed = 1
): RateLimitDecision {
  const bucket = getOrCreate(tenantId, tier);
  refill(bucket);

  if (bucket.tokens >= tokensConsumed) {
    bucket.tokens -= tokensConsumed;
    return {
      allowed: true,
      remainingTokens: Math.floor(bucket.tokens),
      resetInMs: 0,
      tier,
    };
  }

  const needed = tokensConsumed - bucket.tokens;
  const resetInMs = Math.ceil((needed / bucket.config.maxRequestsPerMinute) * 60_000);
  return { allowed: false, remainingTokens: Math.floor(bucket.tokens), resetInMs, tier };
}

export function setEnterpriseCustomLimit(
  tenantId: string,
  maxRequestsPerMinute: number,
  burstCapacity: number
): void {
  const existing = buckets.get(tenantId);
  buckets.set(tenantId, {
    tokens: existing?.tokens ?? maxRequestsPerMinute + burstCapacity,
    lastRefillAt: existing?.lastRefillAt ?? Date.now(),
    config: { tier: 'Enterprise', maxRequestsPerMinute, burstCapacity },
  });
}
