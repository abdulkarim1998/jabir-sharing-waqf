package handlers

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"jabir-waqf-go/internal/db"
	"jabir-waqf-go/internal/models"
	"jabir-waqf-go/pkg/validator"
)

type DonationHandler struct {
	queries   *db.Queries
	validator *validator.Validator
}

func NewDonationHandler(queries *db.Queries, validator *validator.Validator) *DonationHandler {
	return &DonationHandler{
		queries:   queries,
		validator: validator,
	}
}

func (h *DonationHandler) GetDonationsByProject(c *fiber.Ctx) error {
	projectID, err := uuid.Parse(c.Params("projectId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid project ID",
		})
	}

	donations, err := h.queries.GetDonationsByProjectID(context.Background(), uuidToPgUUID(projectID))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to fetch donations",
		})
	}

	var response []models.DonationResponse
	for _, donation := range donations {
		response = append(response, models.DonationResponse{
			ID:                   donation.ID,
			ProjectID:            pgUUIDToUUID(donation.ProjectID),
			DonorName:            donation.DonorName,
			DonorEmail:           donation.DonorEmail,
			DonorPhone:           donation.DonorPhone,
			Amount:               interfaceToDecimal(donation.Amount),
			DonationType:         donation.DonationType,
			Message:              donation.Message,
			RecipientName:        donation.RecipientName,
			RecipientEmail:       donation.RecipientEmail,
			RecipientPhone:       donation.RecipientPhone,
			IsAnonymous:          donation.IsAnonymous,
			PaymentStatus:        string(donation.PaymentStatus),
			PaymentReference:     donation.PaymentReference,
			PaymentTransactionID: donation.PaymentTransactionID,
			CreatedDate:          donation.CreatedDate,
			ModifiedDate:         donation.ModifiedDate,
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *DonationHandler) GetDonationsByOrganization(c *fiber.Ctx) error {
	orgID, err := uuid.Parse(c.Params("organizationId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid organization ID",
		})
	}

	donations, err := h.queries.GetDonationsByOrganizationID(context.Background(), uuidToPgUUID(orgID))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to fetch donations",
		})
	}

	var response []models.DonationResponse
	for _, donation := range donations {
		response = append(response, models.DonationResponse{
			ID:                   donation.ID,
			ProjectID:            pgUUIDToUUID(donation.ProjectID),
			DonorName:            donation.DonorName,
			DonorEmail:           donation.DonorEmail,
			DonorPhone:           donation.DonorPhone,
			Amount:               interfaceToDecimal(donation.Amount),
			DonationType:         donation.DonationType,
			Message:              donation.Message,
			RecipientName:        donation.RecipientName,
			RecipientEmail:       donation.RecipientEmail,
			RecipientPhone:       donation.RecipientPhone,
			IsAnonymous:          donation.IsAnonymous,
			PaymentStatus:        string(donation.PaymentStatus),
			PaymentReference:     donation.PaymentReference,
			PaymentTransactionID: donation.PaymentTransactionID,
			CreatedDate:          donation.CreatedDate,
			ModifiedDate:         donation.ModifiedDate,
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *DonationHandler) GetProjectDonationStats(c *fiber.Ctx) error {
	projectID, err := uuid.Parse(c.Params("projectId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid project ID",
		})
	}

	stats, err := h.queries.GetProjectDonationStats(context.Background(), uuidToPgUUID(projectID))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to fetch donation statistics",
		})
	}

	response := models.DonationStatsResponse{
		TotalDonations: stats.TotalDonations,
		UniqueDonors:   stats.UniqueDonors,
		TotalAmount:    interfaceToDecimal(stats.TotalAmount),
		AverageAmount:  interfaceToDecimal(stats.AverageAmount),
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *DonationHandler) GetOrganizationDonationStats(c *fiber.Ctx) error {
	orgID, err := uuid.Parse(c.Params("organizationId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid organization ID",
		})
	}

	stats, err := h.queries.GetOrganizationDonationStats(context.Background(), uuidToPgUUID(orgID))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to fetch donation statistics",
		})
	}

	response := models.DonationStatsResponse{
		TotalDonations: stats.TotalDonations,
		UniqueDonors:   stats.UniqueDonors,
		TotalAmount:    interfaceToDecimal(stats.TotalAmount),
		AverageAmount:  interfaceToDecimal(stats.AverageAmount),
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}
