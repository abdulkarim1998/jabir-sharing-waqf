package handlers

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"jabir-waqf-go/internal/db"
	"jabir-waqf-go/internal/models"
	"jabir-waqf-go/pkg/validator"
)

type OrganizationHandler struct {
	queries   *db.Queries
	validator *validator.Validator
}

func NewOrganizationHandler(queries *db.Queries, validator *validator.Validator) *OrganizationHandler {
	return &OrganizationHandler{
		queries:   queries,
		validator: validator,
	}
}

func (h *OrganizationHandler) GetOrganizations(c *fiber.Ctx) error {
	organizations, err := h.queries.ListOrganizations(context.Background())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to fetch organizations",
		})
	}

	var response []models.OrganizationResponse
	for _, org := range organizations {
		// Handle nullable boolean
		isActive := false
		if org.IsActive != nil {
			isActive = *org.IsActive
		}

		response = append(response, models.OrganizationResponse{
			ID:           org.ID,
			Name:         org.Name,
			Location:     org.Location,
			IsActive:     isActive,
			Twitter:      org.Twitter,
			Instagram:    org.Instagram,
			Website:      org.Website,
			Description:  org.Description,
			Email:        org.Email,
			Phone:        org.Phone,
			Logo:         org.Logo,
			CreatedDate:  org.CreatedDate,
			ModifiedDate: org.ModifiedDate,
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *OrganizationHandler) GetOrganization(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid organization ID",
		})
	}

	org, err := h.queries.GetOrganizationByID(context.Background(), id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(models.APIResponse{
			Success: false,
			Error:   "Organization not found",
		})
	}

	// Handle nullable boolean
	isActive := false
	if org.IsActive != nil {
		isActive = *org.IsActive
	}

	response := models.OrganizationResponse{
		ID:           org.ID,
		Name:         org.Name,
		Location:     org.Location,
		IsActive:     isActive,
		Twitter:      org.Twitter,
		Instagram:    org.Instagram,
		Website:      org.Website,
		Description:  org.Description,
		Email:        org.Email,
		Phone:        org.Phone,
		Logo:         org.Logo,
		CreatedDate:  org.CreatedDate,
		ModifiedDate: org.ModifiedDate,
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *OrganizationHandler) CreateOrganization(c *fiber.Ctx) error {
	var req models.CreateOrganizationRequest
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

	org, err := h.queries.CreateOrganization(context.Background(), &db.CreateOrganizationParams{
		Name:        req.Name,
		Location:    &req.Location,
		Twitter:     &req.Twitter,
		Instagram:   &req.Instagram,
		Website:     &req.Website,
		Description: &req.Description,
		Email:       req.Email,
		Phone:       &req.Phone,
		Logo:        &req.Logo,
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to create organization",
		})
	}

	// Handle nullable boolean
	isActiveCreate := false
	if org.IsActive != nil {
		isActiveCreate = *org.IsActive
	}

	response := models.OrganizationResponse{
		ID:           org.ID,
		Name:         org.Name,
		Location:     org.Location,
		IsActive:     isActiveCreate,
		Twitter:      org.Twitter,
		Instagram:    org.Instagram,
		Website:      org.Website,
		Description:  org.Description,
		Email:        org.Email,
		Phone:        org.Phone,
		Logo:         org.Logo,
		CreatedDate:  org.CreatedDate,
		ModifiedDate: org.ModifiedDate,
	}

	return c.Status(fiber.StatusCreated).JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *OrganizationHandler) UpdateOrganization(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid organization ID",
		})
	}

	var req models.UpdateOrganizationRequest
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

	org, err := h.queries.UpdateOrganization(context.Background(), &db.UpdateOrganizationParams{
		ID:          id,
		Name:        req.Name,
		Location:    &req.Location,
		Twitter:     &req.Twitter,
		Instagram:   &req.Instagram,
		Website:     &req.Website,
		Description: &req.Description,
		Email:       req.Email,
		Phone:       &req.Phone,
		Logo:        &req.Logo,
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to update organization",
		})
	}

	// Handle nullable boolean
	isActiveUpdate := false
	if org.IsActive != nil {
		isActiveUpdate = *org.IsActive
	}

	response := models.OrganizationResponse{
		ID:           org.ID,
		Name:         org.Name,
		Location:     org.Location,
		IsActive:     isActiveUpdate,
		Twitter:      org.Twitter,
		Instagram:    org.Instagram,
		Website:      org.Website,
		Description:  org.Description,
		Email:        org.Email,
		Phone:        org.Phone,
		Logo:         org.Logo,
		CreatedDate:  org.CreatedDate,
		ModifiedDate: org.ModifiedDate,
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *OrganizationHandler) DeleteOrganization(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid organization ID",
		})
	}

	err = h.queries.DeleteOrganization(context.Background(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to delete organization",
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Message: "Organization deleted successfully",
	})
}
