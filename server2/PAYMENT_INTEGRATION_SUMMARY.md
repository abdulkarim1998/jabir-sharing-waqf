# Payment Integration Summary

## Overview
Successfully integrated SIPG payment gateway with automatic donation record management. When a payment is initiated, a donation record is created with "Pending" status, and automatically updated when the payment callback is received.

## What Was Changed

### 1. Database Schema Updates

#### New Migration: `002_add_order_id_to_donations.up.sql`
Added to the donations table:
- `order_id` (VARCHAR 255, UNIQUE) - Tracks SIPG payment gateway order ID
- `billing_address` (VARCHAR 500) - Billing address
- `billing_city` (VARCHAR 100) - Billing city
- `billing_state` (VARCHAR 100) - Billing state/province
- `billing_zip` (VARCHAR 20) - Postal code
- `billing_country` (VARCHAR 100) - Country
- Index on `order_id` for fast lookups

#### Updated Main Schema: `001_init.up.sql`
- Added all new fields to the main schema
- Added index for order_id
- Added documentation comments

### 2. SQLC Changes

#### Updated Queries (`sqlc/queries/donations.sql`)
- **Modified `CreateDonation`**: Now includes order_id and billing fields (19 parameters total)
- **Added `GetDonationByOrderID`**: Retrieve donation by order_id
- **Added `UpdateDonationPaymentStatusByOrderID`**: Update payment status using order_id

#### Regenerated Code
- `internal/db/models.go` - Updated Donation struct with new fields
- `internal/db/donations.sql.go` - New query implementations

### 3. Payment Handler Enhancements

#### Updated Request Structure (`InitiatePaymentRequest`)
**Added:**
- `project_id` (required) - UUID of the project to donate to
- `donation_type` (optional) - Type of donation (regular, gift, anonymous)
- `message` (optional) - Donor message
- `is_anonymous` (optional) - Anonymous donation flag
- `recipient_name`, `recipient_email`, `recipient_phone` (optional) - For gift donations

**Existing:**
- All billing information fields
- Amount and currency

#### Payment Initiation Flow
1. **Validates** project_id and verifies project exists
2. **Creates donation record** with status "Pending" and unique order_id
3. **Generates payment URL** with encrypted request
4. **Returns** payment URL + donation details (donation_id, project info, order_id)

#### Payment Callback Flow
1. **Decrypts** SIPG response
2. **Maps status** from SIPG to internal status:
   - "Success" → Completed
   - "Failure"/"Failed" → Failed
   - "Cancelled"/"Aborted" → Cancelled
   - Other → Processing
3. **Updates donation** record by order_id with new status and transaction_id
4. **Returns** updated donation information

### 4. Configuration Updates

#### Environment Variables (`env.example`)
Added SIPG payment gateway configuration:
```
SIPG_MERCHANT_ID=215077
SIPG_ACCESS_CODE=AVJV37MC46AR74VJRA
SIPG_WORKING_KEY=D76A35AD2AC055B221D2E40E7986188F
SIPG_GATEWAY_URL=https://pguattrans.soharinternational.com/transaction.do?command=initiateTransaction
SIPG_REDIRECT_URL=https://yoursite.com/response
SIPG_CANCEL_URL=https://yoursite.com/cancel
```

#### Config Package (`internal/config/config.go`)
- Added `PaymentConfig` struct
- Added `SIPGConfig` struct with all gateway settings
- Loads configuration from environment variables

### 5. Main Application (`main.go`)
- Initializes payment service with configuration
- Passes database queries to payment handler
- Sets up payment routes:
  - `POST /api/payments/initiate`
  - `POST /api/payments/callback`

## API Endpoints

### POST /api/payments/initiate
Initiates payment and creates donation record.

**Request:**
```json
{
  "project_id": "uuid",
  "amount": 10.500,
  "currency": "OMR",
  "donation_type": "regular",
  "donor_name": "John Doe",  // Optional
  "donor_phone": "96812345678",  // Optional
  "billing_address": "...",  // Required for SIPG, not stored
  "billing_city": "...",  // Required for SIPG, not stored
  "billing_state": "...",  // Required for SIPG, not stored
  "billing_zip": "...",  // Required for SIPG, not stored
  "billing_country": "Oman"  // Required for SIPG, not stored
}
```

**Response:**
```json
{
  "success": true,
  "payment_url": "https://pguattrans.soharinternational.com/transaction.do?command=initiateTransaction&access_code=...&encRequest=..."
}
```

### POST /api/payments/callback
Handles SIPG callback and updates donation status.

**Request:**
```
Form data: encResp=<encrypted_response>
```

**Response:**
```json
{
  "success": true,
  "order_id": "ORD123456",
  "donation_id": "uuid",
  "status": "Completed",
  "tracking_id": "123456789",
  "order_status": "Success"
}
```

## Database Fields Summary

### Donations Table - New/Modified Fields
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| order_id | VARCHAR(255) | No | SIPG payment order ID (unique) |
| donor_name | VARCHAR(255) | No | Optional donor name (was required, now optional) |
| donor_phone | VARCHAR(20) | No | Optional donor phone |
| recipient_name | VARCHAR(255) | No | Optional gift recipient name |
| recipient_phone | VARCHAR(20) | No | Optional gift recipient phone |

**Note:** Billing address fields are **NOT stored** in the database. They are only collected in the API request to send to SIPG gateway.

### Payment Status Enum
- `Pending` - Initial status when donation is created
- `Processing` - Payment in progress
- `Completed` - Payment successful
- `Failed` - Payment failed
- `Cancelled` - Payment cancelled by user

## Migration Instructions

### Apply Migrations
```bash
# Run migrations (if using migration tool)
migrate -path ./migrations -database "postgres://..." up

# OR apply manually
psql -U postgres -d your_database -f migrations/002_add_order_id_to_donations.up.sql
```

### Regenerate SQLC (Already Done)
```bash
cd server2
sqlc generate
```

## Key Features

✅ **Automatic Donation Creation** - Donation record created on payment initiation  
✅ **Order ID Tracking** - Unique order ID links payment to donation  
✅ **Status Synchronization** - Payment status automatically updated via callback  
✅ **Project Validation** - Verifies project exists before creating donation  
✅ **Billing Information** - Stores complete billing details  
✅ **Gift Donations** - Support for gift recipient information  
✅ **Anonymous Donations** - Support for anonymous donations  
✅ **Comprehensive Logging** - Logs all payment operations for debugging  

## Next Steps

1. **Run Migrations**: Apply the database migration to add new fields
2. **Update Environment**: Set SIPG credentials in `.env` file
3. **Test Locally**: Use the cURL examples in README_PAYMENT.md
4. **Configure Callback URL**: Update SIPG_REDIRECT_URL to your actual callback endpoint
5. **Frontend Integration**: Update frontend to use new API with project_id

## Files Modified

### Created
- `migrations/002_add_order_id_to_donations.up.sql`
- `migrations/002_add_order_id_to_donations.down.sql`
- `internal/payment/sipg.go`
- `internal/handlers/payment.go`
- `README_PAYMENT.md`
- `PAYMENT_INTEGRATION_SUMMARY.md`

### Modified
- `migrations/001_init.up.sql`
- `sqlc/schema/001_init.up.sql`
- `sqlc/queries/donations.sql`
- `internal/config/config.go`
- `internal/db/models.go` (auto-generated)
- `internal/db/donations.sql.go` (auto-generated)
- `main.go`
- `env.example`

## Testing Checklist

- [ ] Run database migration
- [ ] Start the server
- [ ] Create a test project
- [ ] Initiate payment with valid project_id
- [ ] Verify donation record created with "Pending" status
- [ ] Check payment URL is generated correctly
- [ ] Test payment callback with mock data
- [ ] Verify donation status updated correctly
- [ ] Test with invalid project_id (should fail)
- [ ] Test anonymous donation
- [ ] Test gift donation with recipient info

## Support

For detailed API documentation, see `README_PAYMENT.md`
For SIPG-specific issues, contact Sohar International Bank support

