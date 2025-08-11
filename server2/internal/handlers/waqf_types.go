package handlers

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"jabir-waqf-go/internal/db"
	"jabir-waqf-go/internal/models"
	"jabir-waqf-go/pkg/validator"
)

type WaqfTypeHandler struct {
	queries   *db.Queries
	validator *validator.Validator
}

func NewWaqfTypeHandler(queries *db.Queries, validator *validator.Validator) *WaqfTypeHandler {
	return &WaqfTypeHandler{
		queries:   queries,
		validator: validator,
	}
}

func (h *WaqfTypeHandler) GetWaqfTypes(c *fiber.Ctx) error {
	waqfTypes, err := h.queries.ListWaqfTypes(context.Background())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to fetch waqf types",
		})
	}

	var response []models.WaqfTypeResponse
	for _, wt := range waqfTypes {
		response = append(response, models.WaqfTypeResponse{
			ID:           wt.ID,
			Name:         wt.Name,
			Description:  wt.Description,
			FixedAmount:  pgNumericToDecimal(wt.FixedAmount),
			IsActive:     *wt.IsActive,
			CreatedDate:  wt.CreatedDate,
			ModifiedDate: wt.ModifiedDate,
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *WaqfTypeHandler) GetWaqfType(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid waqf type ID",
		})
	}

	waqfType, err := h.queries.GetWaqfTypeByID(context.Background(), id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(models.APIResponse{
			Success: false,
			Error:   "Waqf type not found",
		})
	}

	response := models.WaqfTypeResponse{
		ID:           waqfType.ID,
		Name:         waqfType.Name,
		Description:  waqfType.Description,
		FixedAmount:  pgNumericToDecimal(waqfType.FixedAmount),
		IsActive:     *waqfType.IsActive,
		CreatedDate:  waqfType.CreatedDate,
		ModifiedDate: waqfType.ModifiedDate,
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *WaqfTypeHandler) CreateWaqfType(c *fiber.Ctx) error {
	var req models.CreateWaqfTypeRequest
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

	waqfType, err := h.queries.CreateWaqfType(context.Background(), &db.CreateWaqfTypeParams{
		Name:        req.Name,
		Description: &req.Description,
		FixedAmount: decimalToPgNumeric(req.FixedAmount),
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to create waqf type",
		})
	}

	response := models.WaqfTypeResponse{
		ID:           waqfType.ID,
		Name:         waqfType.Name,
		Description:  waqfType.Description,
		FixedAmount:  pgNumericToDecimal(waqfType.FixedAmount),
		IsActive:     *waqfType.IsActive,
		CreatedDate:  waqfType.CreatedDate,
		ModifiedDate: waqfType.ModifiedDate,
	}

	return c.Status(fiber.StatusCreated).JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *WaqfTypeHandler) UpdateWaqfType(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid waqf type ID",
		})
	}

	var req models.UpdateWaqfTypeRequest
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

	waqfType, err := h.queries.UpdateWaqfType(context.Background(), &db.UpdateWaqfTypeParams{
		ID:          id,
		Name:        req.Name,
		Description: &req.Description,
		FixedAmount: decimalToPgNumeric(req.FixedAmount),
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to update waqf type",
		})
	}

	response := models.WaqfTypeResponse{
		ID:           waqfType.ID,
		Name:         waqfType.Name,
		Description:  waqfType.Description,
		FixedAmount:  pgNumericToDecimal(waqfType.FixedAmount),
		IsActive:     *waqfType.IsActive,
		CreatedDate:  waqfType.CreatedDate,
		ModifiedDate: waqfType.ModifiedDate,
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *WaqfTypeHandler) DeleteWaqfType(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid waqf type ID",
		})
	}

	err = h.queries.DeleteWaqfType(context.Background(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to delete waqf type",
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Message: "Waqf type deleted successfully",
	})
}
