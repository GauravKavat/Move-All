-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Domain Enums
CREATE TYPE tenant_tier AS ENUM ('Starter', 'Pro', 'Enterprise');
CREATE TYPE tenant_health AS ENUM ('Healthy', 'At-Risk', 'Limited');
CREATE TYPE courier_health AS ENUM ('Operational', 'Degraded', 'Down');
CREATE TYPE order_status AS ENUM ('Pending', 'Confirmed', 'Shipped', 'In Transit', 'Delivered', 'Failed', 'Returned');
CREATE TYPE shipment_status AS ENUM ('Pending', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed', 'RTO');
CREATE TYPE exception_status AS ENUM ('Open', 'In Progress', 'Resolved');
CREATE TYPE rto_status AS ENUM ('Initiated', 'In Transit', 'Received', 'Refunded');
CREATE TYPE pickup_status AS ENUM ('Pending', 'Scheduled', 'In Transit', 'Completed', 'Cancelled');
CREATE TYPE vehicle_type AS ENUM ('2-wheeler', '4-wheeler', 'SUV', 'Truck');
CREATE TYPE vendor_name AS ENUM ('DHL', 'DTDC', 'FedEx', 'Bluedart', 'Local');

-- Tenant Metadata Registry
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    tier tenant_tier NOT NULL DEFAULT 'Starter',
    health tenant_health NOT NULL DEFAULT 'Healthy',
    monthly_gmv NUMERIC(15, 2) DEFAULT 0.00,
    active_shipments INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Core Orders Registry (Tenant Isolated)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    status order_status NOT NULL DEFAULT 'Pending',
    cost NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Shipments Operational Matrix (Tenant Isolated)
CREATE TABLE shipments (
    awb VARCHAR(100) PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    courier_partner VARCHAR(100) NOT NULL,
    status shipment_status NOT NULL DEFAULT 'Pending',
    eta TIMESTAMPTZ NOT NULL,
    cost NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Exception Telemetry Registry
CREATE TABLE exceptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    shipment_awb VARCHAR(100) NOT NULL REFERENCES shipments(awb) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    last_attempt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status exception_status NOT NULL DEFAULT 'Open',
    override_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    eta_delta_hours INT NOT NULL DEFAULT 0
);

-- Advanced Pickup Dispatch Request Matrix
CREATE TABLE pickup_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    delivery_address TEXT NOT NULL,
    billing_address TEXT NOT NULL,
    weight NUMERIC(8, 3) NOT NULL,
    length_cm NUMERIC(6, 2) NOT NULL,
    width_cm NUMERIC(6, 2) NOT NULL,
    height_cm NUMERIC(6, 2) NOT NULL,
    boxes_count INT NOT NULL DEFAULT 1,
    preferred_vendor vendor_name NOT NULL DEFAULT 'Local',
    vehicle_allocation vehicle_type NOT NULL DEFAULT '2-wheeler',
    requested_time TIMESTAMPTZ NOT NULL,
    scheduled_time TIMESTAMPTZ,
    status pickup_status NOT NULL DEFAULT 'Pending',
    vehicle_number VARCHAR(50),
    driver_name VARCHAR(255),
    driver_phone VARCHAR(50),
    estimated_pickup TIMESTAMPTZ,
    actual_pickup TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Global Audit Logging Registry
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    target VARCHAR(255) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    severity VARCHAR(50) NOT NULL
);

-- Enable Row-Level Security on Tenant-Facing Datasets
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_requests ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation RLS Policies
CREATE POLICY tenant_isolation_policy ON orders
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_policy ON shipments
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_policy ON exceptions
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_policy ON pickup_requests
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
