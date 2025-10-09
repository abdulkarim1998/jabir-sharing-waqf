package handlers

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"

	"jabir-waqf-go/internal/db"
	"jabir-waqf-go/internal/payment"
	"jabir-waqf-go/pkg/validator"
)

// PaymentHandler handles payment-related HTTP requests
type PaymentHandler struct {
	paymentService *payment.SIPGService
	queries        *db.Queries
	validator      *validator.Validator
}

// NewPaymentHandler creates a new payment handler
func NewPaymentHandler(paymentService *payment.SIPGService, queries *db.Queries, validator *validator.Validator) *PaymentHandler {
	return &PaymentHandler{
		paymentService: paymentService,
		queries:        queries,
		validator:      validator,
	}
}

// InitiatePaymentRequest represents the request body for initiating a payment
type InitiatePaymentRequest struct {
	ProjectID    string  `json:"project_id" validate:"required,uuid"`
	Amount       float64 `json:"amount" validate:"required,gt=0"`
	DonationType string  `json:"donation_type,omitempty"`
	Message      string  `json:"message,omitempty"`
	IsAnonymous  bool    `json:"is_anonymous,omitempty"`
	// Donor information (all optional, only name and phone stored in DB)
	DonorName  string `json:"donor_name,omitempty"`
	DonorEmail string `json:"donor_email,omitempty"`
	DonorPhone string `json:"donor_phone,omitempty"`
	// Gift recipient information (optional, only name and phone stored in DB)
	RecipientName  string `json:"recipient_name,omitempty"`
	RecipientEmail string `json:"recipient_email,omitempty"`
	RecipientPhone string `json:"recipient_phone,omitempty"`
}

// InitiatePayment handles the payment initiation request
func (h *PaymentHandler) InitiatePayment(c *fiber.Ctx) error {
	var req InitiatePaymentRequest

	// Parse request body
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Invalid request body",
		})
	}

	// Validate request
	if err := h.validator.Validate(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Validation failed",
			"details": err.Error(),
		})
	}

	// Parse project UUID
	projectUUID, err := uuid.Parse(req.ProjectID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Invalid project ID",
		})
	}

	// Verify project exists
	project, err := h.queries.GetProjectByID(c.Context(), projectUUID)
	if err != nil {
		log.Printf("Project not found: %v", err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"error":   "Project not found",
		})
	}

	// Set default donation type if not provided
	donationType := req.DonationType
	if donationType == "" {
		donationType = "regular"
	}

	// Convert amount to numeric for database
	amountNumeric := pgtype.Numeric{}
	if err := amountNumeric.Scan(req.Amount); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Invalid amount format",
		})
	}

	// Generate unique order ID (this will be used for SIPG)
	orderID := fmt.Sprintf("ORD%d", c.Context().Value("requestId"))
	if orderID == "ORD<nil>" {
		orderID = fmt.Sprintf("ORD%d", uuid.New().ID())
	}

	// Helper function for string pointers
	strPtr := func(s string) *string {
		if s == "" {
			return nil
		}
		return &s
	}

	// Determine billing name for SIPG (use donor name or "Anonymous Donor")
	billingName := req.DonorName
	if billingName == "" {
		if req.IsAnonymous {
			billingName = "Anonymous Donor"
		} else {
			billingName = "Donor"
		}
	}

	// Determine billing phone for SIPG (use donor phone or default)
	billingPhone := req.DonorPhone
	if billingPhone == "" {
		billingPhone = "00000000" // Default for anonymous
	}

	// Determine billing email for SIPG
	billingEmail := req.DonorEmail
	if billingEmail == "" {
		billingEmail = "noreply@waqf.om" // Default email
	}

	// Create donation record with pending status
	donation, err := h.queries.CreateDonation(c.Context(), &db.CreateDonationParams{
		ProjectID: pgtype.UUID{
			Bytes: projectUUID,
			Valid: true,
		},
		DonorName:      strPtr(req.DonorName),
		DonorEmail:     strPtr(req.DonorEmail),
		DonorPhone:     strPtr(req.DonorPhone),
		Amount:         amountNumeric,
		DonationType:   strPtr(donationType),
		Message:        strPtr(req.Message),
		RecipientName:  strPtr(req.RecipientName),
		RecipientEmail: strPtr(req.RecipientEmail),
		RecipientPhone: strPtr(req.RecipientPhone),
		IsAnonymous:    &req.IsAnonymous,
		OrderID:        strPtr(orderID),
		PaymentStatus: db.NullPaymentStatus{
			PaymentStatus: db.PaymentStatusPending,
			Valid:         true,
		},
		PaymentReference: nil,
	})

	if err != nil {
		log.Printf("Failed to create donation record: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   "Failed to create donation record",
		})
	}

	log.Printf("Created donation record: %s for project: %s with order_id: %s",
		donation.ID, project.Title, orderID)

	// Convert amount to string with 3 decimal places (OMR format)
	amountStr := formatAmount(req.Amount)

	// Create payment request for SIPG (billing info required by gateway but not stored)
	// Currency is always OMR (Omani Rial)
	paymentReq := &payment.PaymentRequest{
		OrderID:        orderID,
		Currency:       "OMR",
		Amount:         amountStr,
		BillingName:    billingName,
		BillingTel:     billingPhone,
		BillingEmail:   billingEmail,
		BillingAddress: "N/A",
		BillingCity:    "Muscat",
		BillingState:   "Muscat",
		BillingZip:     "100",
		BillingCountry: "Oman",
	}

	// Generate payment URL
	response, err := h.paymentService.GeneratePaymentURL(paymentReq)
	if err != nil {
		log.Printf("Failed to generate payment URL: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   "Failed to generate payment URL",
		})
	}

	// Return payment URL only
	return c.JSON(fiber.Map{
		"success":     true,
		"payment_url": response.PaymentURL,
	})
}

// HandleCallback handles the payment gateway callback
func (h *PaymentHandler) HandleCallback(c *fiber.Ctx) error {
	// Get encrypted response from query params or form data
	encResponse := c.FormValue("encResp")
	if encResponse == "" {
		encResponse = c.Query("encResp")
	}

	if encResponse == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Missing encrypted response",
		})
	}

	// Decrypt the response
	decryptedData, err := h.paymentService.DecryptResponse(encResponse)
	if err != nil {
		log.Printf("Failed to decrypt payment response: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   "Failed to decrypt payment response",
		})
	}

	// Log the decrypted response for debugging
	log.Printf("Payment callback received: %+v", decryptedData)

	// Get order_id from response
	orderID, ok := decryptedData["order_id"]
	if !ok {
		log.Printf("Missing order_id in payment response")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Missing order_id in payment response",
		})
	}

	// Get payment status from response
	orderStatus, ok := decryptedData["order_status"]
	if !ok {
		orderStatus = "Unknown"
	}

	// Get tracking ID (transaction ID from gateway)
	trackingID := decryptedData["tracking_id"]

	// Map SIPG status to our payment status
	var paymentStatus db.PaymentStatus
	switch orderStatus {
	case "Success":
		paymentStatus = db.PaymentStatusCompleted
	case "Failure", "Failed":
		paymentStatus = db.PaymentStatusFailed
	case "Cancelled", "Aborted":
		paymentStatus = db.PaymentStatusCancelled
	default:
		paymentStatus = db.PaymentStatusProcessing
	}

	// Update donation payment status
	donation, err := h.queries.UpdateDonationPaymentStatusByOrderID(c.Context(), &db.UpdateDonationPaymentStatusByOrderIDParams{
		OrderID: &orderID,
		PaymentStatus: db.NullPaymentStatus{
			PaymentStatus: paymentStatus,
			Valid:         true,
		},
		PaymentTransactionID: &trackingID,
	})

	if err != nil {
		log.Printf("Failed to update donation payment status: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   "Failed to update donation payment status",
		})
	}

	log.Printf("Updated donation %s with order_id %s to status %s",
		donation.ID, orderID, paymentStatus)

	// Return success response
	return c.JSON(fiber.Map{
		"success":      true,
		"order_id":     orderID,
		"donation_id":  donation.ID,
		"status":       paymentStatus,
		"tracking_id":  trackingID,
		"order_status": orderStatus,
		"data":         decryptedData,
	})
}

// formatAmount formats the amount to 3 decimal places for OMR
func formatAmount(amount float64) string {
	return fmt.Sprintf("%.3f", amount)
}
