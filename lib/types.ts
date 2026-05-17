// ─── Primitive Enums ──────────────────────────────────────────────────────────

export type TenantTier = 'Starter' | 'Pro' | 'Enterprise';
export type TenantHealth = 'Healthy' | 'At-Risk' | 'Limited';
export type CourierHealth = 'Operational' | 'Degraded' | 'Down';
export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Shipped'
  | 'In Transit'
  | 'Delivered'
  | 'Failed'
  | 'Returned';
export type ShipmentStatus =
  | 'Pending'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Failed'
  | 'RTO';
export type ExceptionStatus = 'Open' | 'In Progress' | 'Resolved';
export type RTOStatus = 'Initiated' | 'In Transit' | 'Received' | 'Refunded';
export type PickupStatus =
  | 'Pending'
  | 'Scheduled'
  | 'In Transit'
  | 'Completed'
  | 'Cancelled';
export type VehicleType = '2-wheeler' | '4-wheeler' | 'SUV' | 'Truck';
export type VendorName = 'DHL' | 'DTDC' | 'FedEx' | 'Bluedart' | 'Local';
export type AuditSeverity = 'Info' | 'Warning' | 'Critical';
export type AccessStatus = 'Active' | 'Suspended' | 'Pending';
export type RevenueStatus = 'Settled' | 'Pending' | 'Failed';
export type PipelineStatus = 'Online' | 'Degraded' | 'Down';

// ─── Domain Models ────────────────────────────────────────────────────────────

export interface Tenant {
  id: string;
  name: string;
  tier: TenantTier;
  lastActivity: string;
  health: TenantHealth;
  monthlyGmv: number;
  activeShipments: number;
}

export interface Order {
  id: string;
  tenantId: string;
  customerName: string;
  phone: string;
  address: string;
  pincode: string;
  status: OrderStatus;
  cost: number;
  createdAt: Date;
}

export interface Shipment {
  awb: string;
  tenantId?: string;
  orderId?: string;
  customer: string;
  courier: string;
  status: ShipmentStatus;
  eta: Date;
  cost: number;
  createdAt: Date;
}

export interface ExceptionShipment {
  id: string;
  awb: string;
  tenant: string;
  corridor: string;
  courier: string;
  status: ExceptionStatus;
  etaDeltaHours: number;
  overrideEnabled: boolean;
  reason: string;
  lastAttempt: string;
}

export interface PickupRequest {
  id: string;
  orderId: string;
  customer: string;
  phone: string;
  deliveryAddress: string;
  billingAddress: string;
  weight: number;
  dimensions: { length: number; width: number; height: number };
  numberOfBoxes: number;
  preferredVendor: VendorName;
  vehicleType: VehicleType;
  requestedPickupTime: Date;
  scheduledPickupTime?: Date;
  status: PickupStatus;
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  estimatedPickupTime?: Date;
  actualPickupTime?: Date;
  notes?: string;
  createdAt: Date;
}

export interface RTOShipment {
  awb: string;
  tenantId: string;
  tenantName: string;
  customerName: string;
  courier: string;
  status: RTOStatus;
  refundAmount: number;
  initiatedAt: string;
  estimatedReceiptDate: string;
  idempotencyKey: string;
}

export interface CourierPartner {
  id: string;
  name: string;
  uptime: number;
  latencyMs: number;
  status: CourierHealth;
  lastIncident: string;
  failoverTarget?: string;
  currentLoadPercent?: number;
}

export interface PipelineStream {
  id: string;
  name: string;
  status: PipelineStatus;
  lastSync: string;
  lagMinutes: number;
  throughputPerMin: number;
}

export interface AccessUser {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantScope: string;
  lastSeen: string;
  status: AccessStatus;
  mfaEnabled: boolean;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  severity: AuditSeverity;
}

// ─── Resilience Models ────────────────────────────────────────────────────────

export interface CircuitBreakerState {
  courierId: string;
  consecutiveFailures: number;
  state: 'Closed' | 'Open' | 'Half-Open';
  lastFailureAt: number | null;
  nextRetryAt: number | null;
}

export interface IdempotencyRecord {
  key: string;
  awb: string;
  statusEvent: string;
  requestIndex: number;
  processedAt: number;
  sha256Hash: string;
}

export interface RateLimitConfig {
  tier: TenantTier;
  maxRequestsPerMinute: number;
  burstCapacity: number;
}

export interface FailoverDecision {
  sourceCourierId: string;
  targetCourierId: string;
  volumePercent: number;
  triggeredAt: number;
  reason: string;
}
