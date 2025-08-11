package handlers

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/shopspring/decimal"

	"jabir-waqf-go/internal/db"
	"jabir-waqf-go/internal/models"
	"jabir-waqf-go/pkg/validator"
)

type PaymentHandler struct {
	queries   *db.Queries
	validator *validator.Validator
}

func NewPaymentHandler(queries *db.Queries, validator *validator.Validator) *PaymentHandler {
	return &PaymentHandler{
		queries:   queries,
		validator: validator,
	}
}

func (h *PaymentHandler) GetPaymentResponse(c *fiber.Ctx) error {
	trackID := c.Params("trackId")
	if trackID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Track ID is required",
		})
	}

	payment, err := h.queries.GetPaymentTrackByTrackID(context.Background(), trackID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(models.APIResponse{
			Success: false,
			Error:   "Payment not found",
		})
	}

	response := models.PaymentTrackResponse{
		ID:           payment.ID,
		WaqfID:       pgUUIDToUUID(payment.WaqfID),
		Ref:          payment.Ref,
		TrackID:      payment.TrackID,
		TranID:       payment.TranID,
		Amount:       pgNumericToDecimal(payment.Amount),
		Result:       payment.Result,
		ErrorText:    payment.ErrorText,
		OrderID:      payment.OrderID,
		StatusID:     string(payment.StatusID),
		CreatedDate:  payment.CreatedDate,
		ModifiedDate: payment.ModifiedDate,
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *PaymentHandler) UpdatePaymentStatus(c *fiber.Ctx) error {
	var req models.UpdatePaymentStatusRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid request body",
		})
	}

	if err := h.validator.Validate(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   err.Error(),
		})
	}

	// Parse status enum
	var statusEnum db.PaymentStatus
	switch req.Status {
	case "Pending":
		statusEnum = db.PaymentStatusPending
	case "Processing":
		statusEnum = db.PaymentStatusProcessing
	case "Completed":
		statusEnum = db.PaymentStatusCompleted
	case "Failed":
		statusEnum = db.PaymentStatusFailed
	case "Cancelled":
		statusEnum = db.PaymentStatusCancelled
	default:
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid payment status",
		})
	}

	payment, err := h.queries.UpdatePaymentStatus(context.Background(), &db.UpdatePaymentStatusParams{
		TrackID:   req.TrackID,
		TranID:    &req.TranID,
		Result:    &req.Result,
		ErrorText: &req.ErrorText,
		OrderID:   &req.OrderID,
		StatusID:  statusEnum,
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to update payment status",
		})
	}

	response := models.PaymentTrackResponse{
		ID:           payment.ID,
		WaqfID:       pgUUIDToUUID(payment.WaqfID),
		Ref:          payment.Ref,
		TrackID:      payment.TrackID,
		TranID:       payment.TranID,
		Amount:       pgNumericToDecimal(payment.Amount),
		Result:       payment.Result,
		ErrorText:    payment.ErrorText,
		OrderID:      payment.OrderID,
		StatusID:     string(payment.StatusID),
		CreatedDate:  payment.CreatedDate,
		ModifiedDate: payment.ModifiedDate,
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *PaymentHandler) GetPaymentTracks(c *fiber.Ctx) error {
	payments, err := h.queries.ListPaymentTracks(context.Background())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to fetch payment tracks",
		})
	}

	var response []models.PaymentTrackResponse
	for _, payment := range payments {
		// Convert WaqfAmount to pointer
		var waqfAmount *decimal.Decimal
		if payment.WaqfAmount.Valid {
			converted := pgNumericToDecimal(payment.WaqfAmount)
			waqfAmount = &converted
		}

		response = append(response, models.PaymentTrackResponse{
			ID:            payment.ID,
			WaqfID:        pgUUIDToUUID(payment.WaqfID),
			Ref:           payment.Ref,
			TrackID:       payment.TrackID,
			TranID:        payment.TranID,
			Amount:        pgNumericToDecimal(payment.Amount),
			Result:        payment.Result,
			ErrorText:     payment.ErrorText,
			OrderID:       payment.OrderID,
			StatusID:      string(payment.StatusID),
			CreatedDate:   payment.CreatedDate,
			ModifiedDate:  payment.ModifiedDate,
			NumberOfSaham: &payment.NumberOfSaham,
			WaqfAmount:    waqfAmount,
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *PaymentHandler) GetPaymentsByWaqf(c *fiber.Ctx) error {
	waqfID, err := uuid.Parse(c.Params("waqfId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid waqf ID",
		})
	}

	// Convert UUID to pgtype.UUID
	var pgWaqfID pgtype.UUID
	pgWaqfID.Scan(waqfID)

	payments, err := h.queries.GetPaymentsByWaqfID(context.Background(), pgWaqfID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to fetch payments",
		})
	}

	var response []models.PaymentTrackResponse
	for _, payment := range payments {
		response = append(response, models.PaymentTrackResponse{
			ID:           payment.ID,
			WaqfID:       pgUUIDToUUID(payment.WaqfID),
			Ref:          payment.Ref,
			TrackID:      payment.TrackID,
			TranID:       payment.TranID,
			Amount:       pgNumericToDecimal(payment.Amount),
			Result:       payment.Result,
			ErrorText:    payment.ErrorText,
			OrderID:      payment.OrderID,
			StatusID:     string(payment.StatusID),
			CreatedDate:  payment.CreatedDate,
			ModifiedDate: payment.ModifiedDate,
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}
