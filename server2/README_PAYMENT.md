# SIPG Payment Gateway Integration

This document describes how to use the SIPG (Sohar International Payment Gateway) integration in the Jabir Waqf application.

## Overview

The payment service provides a secure interface to integrate with the Sohar International Payment Gateway using AES-256-GCM encryption.

## Configuration

### Environment Variables

Add the following environment variables to your `.env` file:

```env
# SIPG Payment Gateway Configuration
SIPG_MERCHANT_ID=215077
SIPG_ACCESS_CODE=AVJV37MC46AR74VJRA
SIPG_WORKING_KEY=D76A35AD2AC055B221D2E40E7986188F
SIPG_GATEWAY_URL=https://pguattrans.soharinternational.com/transaction.do?command=initiateTransaction
SIPG_REDIRECT_URL=https://yoursite.com/response
SIPG_CANCEL_URL=https://yoursite.com/cancel
```

**Important Notes:**
- `SIPG_WORKING_KEY` must be exactly 32 characters for AES-256 encryption
- `SIPG_REDIRECT_URL` is where users will be redirected after successful payment
- `SIPG_CANCEL_URL` is where users will be redirected if they cancel the payment

## API Endpoints

### 1. Initiate Payment

**Endpoint:** `POST /api/payments/initiate`

**Request Body:**
```json
{
  "project_id": "550e8400-e29b-41d4-a716-446655440000",  // Required - UUID of the project
  "amount": 10.500,
  "currency": "OMR",
  "donation_type": "regular",  // Optional: regular, gift, anonymous (default: regular)
  "message": "Donation for charity",  // Optional
  "is_anonymous": false,  // Optional (default: false)
  // Donor information (optional, only name and phone stored in DB)
  "donor_name": "John Doe",  // Optional
  "donor_email": "john.doe@example.com",  // Optional (not stored, used for SIPG)
  "donor_phone": "96812345678",  // Optional
  // Gift recipient information (optional, only name and phone stored in DB)
  "recipient_name": "Jane Doe",  // Optional
  "recipient_email": "jane.doe@example.com",  // Optional (not stored)
  "recipient_phone": "96887654321",  // Optional
  // Billing address (required for SIPG gateway, but NOT stored in database)
  "billing_address": "123 Main Street",
  "billing_city": "Muscat",
  "billing_state": "Muscat",
  "billing_zip": "100",
  "billing_country": "Oman"
}
```

**Note:** 
- Donor name, email, and phone are **optional**. Only name and phone are stored in the database.
- Recipient fields are **optional**. Only name and phone are stored in the database.
- Billing address fields are **required** by the SIPG payment gateway but are **NOT stored** in the database.
- If donor information is not provided, default values will be used for the payment gateway.

**Response:**
```json
{
  "success": true,
  "payment_url": "https://pguattrans.soharinternational.com/transaction.do?command=initiateTransaction&access_code=AVJV37MC46AR74VJRA&encRequest=..."
}
```

**Usage:**
1. Call this endpoint to initiate a payment
2. **A donation record is automatically created with status "Pending"**
3. Redirect the user to the `payment_url` returned in the response
4. The user will complete the payment on the SIPG gateway
5. SIPG will redirect back to your `redirect_url` or `cancel_url`
6. The donation status will be updated via the callback endpoint

### 2. Handle Payment Callback

**Endpoint:** `POST /api/payments/callback`

**Request Body (Form Data):**
```
encResp=<encrypted_response_from_sipg>
```

**Response:**
```json
{
  "success": true,
  "order_id": "ORD1696800000",
  "donation_id": "650e8400-e29b-41d4-a716-446655440000",
  "status": "Completed",
  "tracking_id": "123456789",
  "order_status": "Success",
  "data": {
    "order_id": "ORD1696800000",
    "order_status": "Success",
    "tracking_id": "123456789",
    "bank_ref_no": "987654321",
    "amount": "10.500",
    "currency": "OMR",
    "billing_name": "John Doe",
    "billing_email": "john.doe@example.com"
  }
}
```

**Note:** This endpoint automatically updates the donation record status based on the payment result:
- `Success` → `Completed`
- `Failure`/`Failed` → `Failed`
- `Cancelled`/`Aborted` → `Cancelled`
- Others → `Processing`

## Usage Example

### Frontend Integration

```javascript
// Initiate payment
const initiatePayment = async (projectId, amount, donorInfo, billingAddress) => {
  const response = await fetch('/api/payments/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      project_id: projectId,
      amount: amount,
      currency: 'OMR',
      donation_type: 'regular',
      message: 'Supporting this great cause',
      // Donor info (optional, only name and phone stored in DB)
      donor_name: donorInfo.name,
      donor_email: donorInfo.email,  // Not stored, used for SIPG
      donor_phone: donorInfo.phone,
      // Billing address (required for SIPG, not stored in DB)
      billing_address: billingAddress.street,
      billing_city: billingAddress.city,
      billing_state: billingAddress.state,
      billing_zip: billingAddress.zip,
      billing_country: 'Oman'
    })
  });

  const result = await response.json();
  
  if (result.success) {
    // Redirect to payment gateway
    window.location.href = result.payment_url;
  } else {
    console.error('Payment initiation failed:', result.error);
  }
};
```

### Go Service Usage

```go
package main

import (
    "jabir-waqf-go/internal/payment"
)

func example() {
    // Initialize service
    service, err := payment.NewSIPGService(&payment.SIPGConfig{
        MerchantID:  "215077",
        AccessCode:  "AVJV37MC46AR74VJRA",
        WorkingKey:  "D76A35AD2AC055B221D2E40E7986188F",
        GatewayURL:  "https://pguattrans.soharinternational.com/transaction.do?command=initiateTransaction",
        RedirectURL: "https://yoursite.com/response",
        CancelURL:   "https://yoursite.com/cancel",
    })
    if err != nil {
        log.Fatal(err)
    }

    // Create payment request
    req := &payment.PaymentRequest{
        OrderID:        "ORD123456",
        Currency:       "OMR",
        Amount:         "10.500",
        BillingName:    "John Doe",
        BillingTel:     "96812345678",
        BillingEmail:   "john.doe@example.com",
        BillingAddress: "123 Main Street",
        BillingCity:    "Muscat",
        BillingState:   "Muscat",
        BillingZip:     "100",
        BillingCountry: "Oman",
    }

    // Generate payment URL
    response, err := service.GeneratePaymentURL(req)
    if err != nil {
        log.Fatal(err)
    }

    // Use response.PaymentURL to redirect user
    fmt.Println("Payment URL:", response.PaymentURL)
}
```

## Security Features

1. **AES-256-GCM Encryption**: All payment data is encrypted using AES-256-GCM with a 16-byte nonce
2. **Secure Key Management**: Working keys are stored in environment variables
3. **Input Validation**: All payment requests are validated before processing

## Testing

### Using cURL

```bash
curl -X POST http://localhost:8080/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 10.500,
    "currency": "OMR",
    "donation_type": "regular",
    "donor_name": "John Doe",
    "donor_phone": "96812345678",
    "billing_address": "123 Main Street",
    "billing_city": "Muscat",
    "billing_state": "Muscat",
    "billing_zip": "100",
    "billing_country": "Oman"
  }'
```

## Payment Flow

1. **Initiate Payment**: Frontend calls `/api/payments/initiate` with project ID and payment details
2. **Create Donation**: Backend creates a donation record with status "Pending" and unique order ID
3. **Generate URL**: Backend encrypts payment data and generates payment URL
4. **Redirect User**: Frontend redirects user to SIPG payment gateway using the payment URL
5. **User Pays**: User completes payment on SIPG gateway
6. **Callback**: SIPG redirects back to your callback URL with encrypted response
7. **Process Response**: Backend decrypts the payment response
8. **Update Status**: Backend automatically updates donation status based on payment result
   - Success → Completed
   - Failure → Failed
   - Cancelled → Cancelled

## Response Parameters

### Success Response Parameters

- `order_status`: Payment status (Success, Failure, Cancelled, etc.)
- `tracking_id`: SIPG tracking ID
- `bank_ref_no`: Bank reference number
- `order_id`: Your order ID
- `amount`: Payment amount
- `currency`: Payment currency

## Error Handling

The service includes comprehensive error handling for:

- Invalid configuration (merchant ID, access code, working key)
- Encryption/decryption failures
- Network errors
- Invalid request parameters

## Support

For issues related to:
- **Integration**: Check this documentation and service code
- **Gateway Issues**: Contact Sohar International Bank support
- **Configuration**: Verify environment variables and credentials

