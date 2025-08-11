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

CREATE TABLE waqf_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    fixed_amount DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE waqfs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    waqf_type_id UUID NOT NULL REFERENCES waqf_types(id),
    project_id UUID NOT NULL REFERENCES projects(id),
    number_of_saham INTEGER NOT NULL CHECK (number_of_saham > 0),
    total_amount DECIMAL(15,2) GENERATED ALWAYS AS (
        (SELECT fixed_amount FROM waqf_types WHERE id = waqf_type_id) * number_of_saham
    ) STORED,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE gift_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    waqf_id UUID NOT NULL REFERENCES waqfs(id) ON DELETE CASCADE,
    recipient_name VARCHAR(255),
    recipient_email VARCHAR(255),
    message TEXT,
    is_anonymous BOOLEAN DEFAULT false,
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

CREATE TABLE payment_tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    waqf_id UUID NOT NULL REFERENCES waqfs(id),
    ref VARCHAR(255) NOT NULL,
    track_id VARCHAR(255) NOT NULL UNIQUE,
    tran_id VARCHAR(255),
    amount DECIMAL(15,2) NOT NULL,
    result VARCHAR(500),
    error_text VARCHAR(1000),
    order_id INTEGER,
    status_id payment_status NOT NULL DEFAULT 'Pending',
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_projects_organization_id ON projects(organization_id);
CREATE INDEX idx_waqfs_project_id ON waqfs(project_id);
CREATE INDEX idx_waqfs_waqf_type_id ON waqfs(waqf_type_id);
CREATE INDEX idx_gift_details_waqf_id ON gift_details(waqf_id);
CREATE INDEX idx_payment_tracks_waqf_id ON payment_tracks(waqf_id);
CREATE INDEX idx_payment_tracks_track_id ON payment_tracks(track_id);
