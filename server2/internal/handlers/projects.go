package handlers

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"

	"jabir-waqf-go/internal/db"
	"jabir-waqf-go/internal/models"
	"jabir-waqf-go/pkg/validator"
)

type ProjectHandler struct {
	queries   *db.Queries
	validator *validator.Validator
}

func NewProjectHandler(queries *db.Queries, validator *validator.Validator) *ProjectHandler {
	return &ProjectHandler{
		queries:   queries,
		validator: validator,
	}
}

func (h *ProjectHandler) GetProjects(c *fiber.Ctx) error {
	projects, err := h.queries.ListProjects(context.Background())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to fetch projects",
		})
	}

	var response []models.ProjectResponse
	for _, project := range projects {
		// Handle nullable boolean fields
		isActive := false
		if project.IsActive != nil {
			isActive = *project.IsActive
		}

		isComplete := false
		if project.IsComplete != nil {
			isComplete = *project.IsComplete
		}

		// Handle nullable decimal value
		var value *decimal.Decimal
		if project.Value.Valid {
			converted := pgNumericToDecimal(project.Value)
			value = &converted
		}

		response = append(response, models.ProjectResponse{
			ID:             project.ID,
			Title:          project.Title,
			Description:    project.Description,
			Value:          value,
			IsActive:       isActive,
			IsComplete:     isComplete,
			Address:        project.Address,
			OrganizationID: pgUUIDToUUID(project.OrganizationID),
			CreatedDate:    project.CreatedDate,
			ModifiedDate:   project.ModifiedDate,
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *ProjectHandler) GetProject(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid project ID",
		})
	}

	project, err := h.queries.GetProjectByID(context.Background(), id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(models.APIResponse{
			Success: false,
			Error:   "Project not found",
		})
	}

	// Handle nullable boolean fields
	isActive := false
	if project.IsActive != nil {
		isActive = *project.IsActive
	}

	isComplete := false
	if project.IsComplete != nil {
		isComplete = *project.IsComplete
	}

	// Handle nullable decimal value
	var value *decimal.Decimal
	if project.Value.Valid {
		converted := pgNumericToDecimal(project.Value)
		value = &converted
	}

	response := models.ProjectResponse{
		ID:             project.ID,
		Title:          project.Title,
		Description:    project.Description,
		Value:          value,
		IsActive:       isActive,
		IsComplete:     isComplete,
		Address:        project.Address,
		OrganizationID: pgUUIDToUUID(project.OrganizationID),
		CreatedDate:    project.CreatedDate,
		ModifiedDate:   project.ModifiedDate,
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *ProjectHandler) GetProjectsByOrganization(c *fiber.Ctx) error {
	orgID, err := uuid.Parse(c.Params("organizationId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid organization ID",
		})
	}

	projects, err := h.queries.GetProjectsByOrganizationID(context.Background(), uuidToPgUUID(orgID))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to fetch projects",
		})
	}

	var response []models.ProjectResponse
	for _, project := range projects {
		// Handle nullable boolean fields
		isActive := false
		if project.IsActive != nil {
			isActive = *project.IsActive
		}

		isComplete := false
		if project.IsComplete != nil {
			isComplete = *project.IsComplete
		}

		// Handle nullable decimal value
		var value *decimal.Decimal
		if project.Value.Valid {
			converted := pgNumericToDecimal(project.Value)
			value = &converted
		}

		response = append(response, models.ProjectResponse{
			ID:             project.ID,
			Title:          project.Title,
			Description:    project.Description,
			Value:          value,
			IsActive:       isActive,
			IsComplete:     isComplete,
			Address:        project.Address,
			OrganizationID: pgUUIDToUUID(project.OrganizationID),
			CreatedDate:    project.CreatedDate,
			ModifiedDate:   project.ModifiedDate,
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *ProjectHandler) CreateProject(c *fiber.Ctx) error {
	var req models.CreateProjectRequest
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

	project, err := h.queries.CreateProject(context.Background(), &db.CreateProjectParams{
		Title:          req.Title,
		Description:    req.Description,
		Value:          decimalToPgNumeric(req.Value),
		Address:        &req.Address,
		OrganizationID: uuidToPgUUID(req.OrganizationID),
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to create project",
		})
	}

	// Handle nullable boolean fields
	isActiveCreate := false
	if project.IsActive != nil {
		isActiveCreate = *project.IsActive
	}

	isCompleteCreate := false
	if project.IsComplete != nil {
		isCompleteCreate = *project.IsComplete
	}

	// Handle nullable decimal value
	var valueCreate *decimal.Decimal
	if project.Value.Valid {
		converted := pgNumericToDecimal(project.Value)
		valueCreate = &converted
	}

	response := models.ProjectResponse{
		ID:             project.ID,
		Title:          project.Title,
		Description:    project.Description,
		Value:          valueCreate,
		IsActive:       isActiveCreate,
		IsComplete:     isCompleteCreate,
		Address:        project.Address,
		OrganizationID: pgUUIDToUUID(project.OrganizationID),
		CreatedDate:    project.CreatedDate,
		ModifiedDate:   project.ModifiedDate,
	}

	return c.Status(fiber.StatusCreated).JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *ProjectHandler) UpdateProject(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid project ID",
		})
	}

	var req models.UpdateProjectRequest
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

	project, err := h.queries.UpdateProject(context.Background(), &db.UpdateProjectParams{
		ID:          id,
		Title:       req.Title,
		Description: req.Description,
		Value:       decimalToPgNumeric(req.Value),
		Address:     &req.Address,
		IsComplete:  &req.IsComplete,
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to update project",
		})
	}

	// Handle nullable boolean fields
	isActiveUpdate := false
	if project.IsActive != nil {
		isActiveUpdate = *project.IsActive
	}

	isCompleteUpdate := false
	if project.IsComplete != nil {
		isCompleteUpdate = *project.IsComplete
	}

	// Handle nullable decimal value
	var valueUpdate *decimal.Decimal
	if project.Value.Valid {
		converted := pgNumericToDecimal(project.Value)
		valueUpdate = &converted
	}

	response := models.ProjectResponse{
		ID:             project.ID,
		Title:          project.Title,
		Description:    project.Description,
		Value:          valueUpdate,
		IsActive:       isActiveUpdate,
		IsComplete:     isCompleteUpdate,
		Address:        project.Address,
		OrganizationID: pgUUIDToUUID(project.OrganizationID),
		CreatedDate:    project.CreatedDate,
		ModifiedDate:   project.ModifiedDate,
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *ProjectHandler) DeleteProject(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid project ID",
		})
	}

	err = h.queries.DeleteProject(context.Background(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to delete project",
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Message: "Project deleted successfully",
	})
}

func (h *ProjectHandler) GetProjectFinancialStatus(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid project ID",
		})
	}

	status, err := h.queries.GetProjectFinancialStatus(context.Background(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to fetch project financial status",
		})
	}

	// Handle nullable decimal values
	var targetAmount *decimal.Decimal
	if status.TargetAmount.Valid {
		converted := pgNumericToDecimal(status.TargetAmount)
		targetAmount = &converted
	}

	response := models.ProjectFinancialStatusResponse{
		ID:              status.ID,
		Title:           status.Title,
		TargetAmount:    targetAmount,
		CollectedAmount: interfaceToDecimal(status.CollectedAmount),
		TotalWaqfs:      status.TotalWaqfs,
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}
