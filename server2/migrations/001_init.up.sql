-- ============================================================================
-- Complete Database Schema for Jabir Waqf Platform
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE payment_status AS ENUM (
    'Pending',
    'Processing',
    'Completed',
    'Failed',
    'Cancelled'
);

CREATE TYPE permission_resource AS ENUM (
    'organizations',
    'projects',
    'donations',
    'users',
    'dashboard',
    'reports'
);

CREATE TYPE permission_scope AS ENUM (
    'create',
    'read',
    'update',
    'delete',
    'manage'
);

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    location VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    twitter VARCHAR(500),
    instagram VARCHAR(500),
    website VARCHAR(500),
    description TEXT,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    logo VARCHAR(500),
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects table
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

-- Donations table (simplified waqf system)
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

-- Payment configurations table
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

-- ============================================================================
-- USER MANAGEMENT TABLES
-- ============================================================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keycloak_id UUID NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by_id UUID REFERENCES users(id),
    modified_by_id UUID REFERENCES users(id),
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User roles junction table
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_by_id UUID REFERENCES users(id),
    modified_by_id UUID REFERENCES users(id),
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- Permissions table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    resource permission_resource NOT NULL,
    scope permission_scope NOT NULL,
    created_by_id UUID REFERENCES users(id),
    modified_by_id UUID REFERENCES users(id),
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(role_id, resource, scope)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Organizations indexes
CREATE INDEX idx_organizations_email ON organizations(email);
CREATE INDEX idx_organizations_is_active ON organizations(is_active);

-- Projects indexes
CREATE INDEX idx_projects_organization_id ON projects(organization_id);
CREATE INDEX idx_projects_is_active ON projects(is_active);
CREATE INDEX idx_projects_is_complete ON projects(is_complete);

-- Donations indexes
CREATE INDEX idx_donations_project_id ON donations(project_id);
CREATE INDEX idx_donations_donor_email ON donations(donor_email);
CREATE INDEX idx_donations_payment_status ON donations(payment_status);
CREATE INDEX idx_donations_created_date ON donations(created_date);
CREATE INDEX idx_donations_donation_type ON donations(donation_type);

-- Payment configurations indexes
CREATE INDEX idx_payment_configs_organization_id ON payment_configurations(organization_id);
CREATE INDEX idx_payment_configs_is_active ON payment_configurations(is_active);

-- User management indexes
CREATE INDEX idx_users_keycloak_id ON users(keycloak_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_roles_name ON roles(name);
CREATE INDEX idx_roles_is_active ON roles(is_active);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX idx_permissions_role_id ON permissions(role_id);
CREATE INDEX idx_permissions_resource ON permissions(resource);
CREATE INDEX idx_permissions_scope ON permissions(scope);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE organizations IS 'Organizations that can create and manage projects';
COMMENT ON TABLE projects IS 'Waqf projects created by organizations';
COMMENT ON TABLE donations IS 'Individual donations made to projects (simplified waqf system)';
COMMENT ON TABLE payment_configurations IS 'Payment gateway configurations for organizations';
COMMENT ON TABLE users IS 'System users with Keycloak integration';
COMMENT ON TABLE roles IS 'User roles for access control';
COMMENT ON TABLE user_roles IS 'Junction table linking users to roles';
COMMENT ON TABLE permissions IS 'Permissions assigned to roles';

COMMENT ON COLUMN donations.donation_type IS 'Type of donation: regular, gift, anonymous';
COMMENT ON COLUMN donations.payment_status IS 'Status of payment: Pending, Processing, Completed, Failed, Cancelled';
COMMENT ON COLUMN projects.value IS 'Target amount for the project in Omani Rials';
COMMENT ON COLUMN donations.amount IS 'Donation amount in Omani Rials';
