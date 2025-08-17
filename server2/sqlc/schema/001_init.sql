-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE payment_status AS ENUM (
    'Pending',
    'Processing',
    'Completed',
    'Failed',
    'Cancelled'
);

-- Base tables

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    location VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    twitter VARCHAR(500),
    instagram VARCHAR(500),
    website VARCHAR(500),
    description TEXT,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    logo VARCHAR(500),
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    value DECIMAL(15,2),
    is_active BOOLEAN DEFAULT true,
    is_complete BOOLEAN DEFAULT false,
    address VARCHAR(500),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    donor_name VARCHAR(255) NOT NULL,
    donor_email VARCHAR(255),
    donor_phone VARCHAR(20),
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    donation_type VARCHAR(50) DEFAULT 'regular', -- regular, gift, anonymous
    message TEXT,
    -- Gift details (if it's a gift donation)
    recipient_name VARCHAR(255),
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    is_anonymous BOOLEAN DEFAULT false,
    -- Payment tracking
    payment_status payment_status DEFAULT 'Pending',
    payment_reference VARCHAR(255),
    payment_transaction_id VARCHAR(255),
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payment_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    merchant_id VARCHAR(255),
    terminal_id VARCHAR(255),
    gateway_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_projects_organization_id ON projects(organization_id);
CREATE INDEX idx_donations_project_id ON donations(project_id);
CREATE INDEX idx_donations_donor_email ON donations(donor_email);
CREATE INDEX idx_donations_payment_status ON donations(payment_status);
CREATE INDEX idx_donations_created_date ON donations(created_date);
