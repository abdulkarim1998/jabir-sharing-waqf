# Schema Changes Summary

## What Changed

### Donations Table - Field Requirements Simplified

The donations table has been simplified to make donor and recipient information **optional** and **billing information is NOT stored**.

## Changes Made

### 1. Made Optional (Previously Required)
- `donor_name` - Now nullable, previously `NOT NULL`

### 2. Billing Fields REMOVED
The following fields were **removed** from the database schema:
- `billing_address`
- `billing_city`
- `billing_state`
- `billing_zip`
- `billing_country`

**Reason:** Billing information is only needed to send to the SIPG payment gateway. We don't need to store it in our database. It's collected in the API request and passed to SIPG, but not persisted.

### 3. Added Field
- `order_id` (VARCHAR 255, UNIQUE) - Tracks the payment gateway order ID

## Current Donations Table Schema

```sql
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Donor information (all optional)
    donor_name VARCHAR(255),          -- Optional
    donor_email VARCHAR(255),         -- Optional  
    donor_phone VARCHAR(20),          -- Optional
    
    -- Donation details
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    donation_type VARCHAR(50) DEFAULT 'regular',
    message TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    
    -- Gift recipient (all optional)
    recipient_name VARCHAR(255),      -- Optional
    recipient_email VARCHAR(255),     -- Optional
    recipient_phone VARCHAR(20),      -- Optional
    
    -- Payment tracking
    order_id VARCHAR(255) UNIQUE,
    payment_status payment_status DEFAULT 'Pending',
    payment_reference VARCHAR(255),
    payment_transaction_id VARCHAR(255),
    
    -- Timestamps
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## API Request Structure

### What's Stored vs What's Not

#### ✅ Stored in Database
- `donor_name` (optional)
- `donor_phone` (optional)
- `recipient_name` (optional)
- `recipient_phone` (optional)
- All payment tracking fields (order_id, status, etc.)

#### ❌ NOT Stored in Database (Only sent to SIPG)
- `donor_email` - Collected but not stored
- `recipient_email` - Collected but not stored
- `billing_address` - Required for SIPG, not stored
- `billing_city` - Required for SIPG, not stored
- `billing_state` - Required for SIPG, not stored
- `billing_zip` - Required for SIPG, not stored
- `billing_country` - Required for SIPG, not stored

## Migration

Since we're **removing** fields from the initial schema, no migration file is needed if you're starting fresh. If you have an existing database with the old schema, the existing migrations already have the correct simplified structure.

## Privacy & Data Minimization

This change follows data minimization principles:
- We only store what we need for donation records
- Billing addresses are temporary (only for payment processing)
- Donor email is optional and not stored (reduces PII)
- Anonymous donations are fully supported

## Default Values for SIPG Gateway

When donor information is not provided, the following defaults are used for SIPG:

- **Billing Name:** "Anonymous Donor" (if is_anonymous=true) or "Donor"
- **Billing Phone:** "00000000" 
- **Billing Email:** "noreply@waqf.om"

These defaults ensure SIPG gets the required fields while respecting donor privacy.


