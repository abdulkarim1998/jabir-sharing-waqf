package handlers

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"

	"jabir-waqf-go/internal/config"
	"jabir-waqf-go/internal/db"
	"jabir-waqf-go/internal/models"
	"jabir-waqf-go/pkg/validator"
)

type OrganizationRequestHandler struct {
	queries   *db.Queries
	validator *validator.Validator
	minio     *config.MinioConfig
}

func NewOrganizationRequestHandler(queries *db.Queries, validator *validator.Validator, minio *config.MinioConfig) *OrganizationRequestHandler {
	return &OrganizationRequestHandler{
		queries:   queries,
		validator: validator,
		minio:     minio,
	}
}

func (h *OrganizationRequestHandler) CreateOrganizationRequest(c *fiber.Ctx) error {
	log.Info("Received organization request creation request")

	form, err := c.MultipartForm()
	if err != nil {
		log.Errorf("Failed to parse form data: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to parse form data",
		})
	}

	name := c.FormValue("name")
	phone := c.FormValue("phone")
	cr := c.FormValue("cr")
	description := c.FormValue("description")

	log.Infof("Form values - Name: %s, Phone: %s, CR: %s", name, phone, cr)

	if name == "" || phone == "" || cr == "" {
		log.Warn("Missing required fields")
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Name, phone, and CR are required",
		})
	}

	var descPtr *string
	if description != "" {
		descPtr = &description
	}

	log.Info("Attempting to create organization request in database...")
	orgRequest, err := h.queries.CreateOrganizationRequest(context.Background(), &db.CreateOrganizationRequestParams{
		Name:        name,
		Phone:       phone,
		Cr:          cr,
		Description: descPtr,
	})
	if err != nil {
		log.Errorf("Failed to create organization request in database: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to create organization request: " + err.Error(),
		})
	}

	log.Infof("Successfully created organization request with ID: %s, Name: %s", orgRequest.ID, orgRequest.Name)

	// Verify the record was actually created
	verifyRequest, verifyErr := h.queries.GetOrganizationRequestByID(context.Background(), orgRequest.ID)
	if verifyErr != nil {
		log.Errorf("CRITICAL: Failed to verify created request - record may not exist: %v", verifyErr)
	} else {
		log.Infof("Verified request exists in database: ID=%s, Name=%s, Status=%v", verifyRequest.ID, verifyRequest.Name, verifyRequest.Status)
	}

	documents := form.File["documents"]
	var documentResponses []models.OrganizationRequestDocumentResponse

	for _, file := range documents {
		contentType := file.Header.Get("Content-Type")
		if contentType != "application/pdf" &&
			contentType != "image/jpeg" &&
			contentType != "image/png" &&
			contentType != "image/jpg" &&
			contentType != "application/msword" &&
			contentType != "application/vnd.openxmlformats-officedocument.wordprocessingml.document" {
			log.Warnf("Skipping file %s: Invalid content type %s", file.Filename, contentType)
			continue
		}

		if file.Size > 10*1024*1024 {
			log.Warnf("Skipping file %s: File size too large (%d bytes)", file.Filename, file.Size)
			continue
		}

		filename, err := h.minio.UploadFile(file, "organization-requests")
		if err != nil {
			log.Errorf("Failed to upload file %s to MinIO: %v", file.Filename, err)
			continue
		}

		var requestIDPgType pgtype.UUID
		if err := requestIDPgType.Scan(orgRequest.ID); err != nil {
			log.Errorf("Failed to convert UUID for file %s: %v", file.Filename, err)
			continue
		}

		doc, err := h.queries.CreateOrganizationRequestDocument(context.Background(), &db.CreateOrganizationRequestDocumentParams{
			RequestID:    requestIDPgType,
			DocumentPath: filename,
		})
		if err != nil {
			log.Errorf("Failed to save document record for file %s in database: %v", file.Filename, err)
			// Try to cleanup the uploaded file since DB record failed
			if delErr := h.minio.DeleteFile(filename); delErr != nil {
				log.Errorf("Failed to cleanup orphaned file %s from MinIO: %v", filename, delErr)
			}
			continue
		}

		documentURL := h.minio.GetFileURL(filename)
		documentResponses = append(documentResponses, models.OrganizationRequestDocumentResponse{
			ID:           doc.ID,
			DocumentPath: doc.DocumentPath,
			DocumentURL:  documentURL,
			CreatedDate:  doc.CreatedDate,
		})
	}

	status := "pending"
	if orgRequest.Status.Valid {
		status = string(orgRequest.Status.OrganizationRequestStatus)
	}

	response := models.OrganizationRequestResponse{
		ID:           orgRequest.ID,
		Name:         orgRequest.Name,
		Phone:        orgRequest.Phone,
		CR:           orgRequest.Cr,
		Description:  orgRequest.Description,
		Status:       status,
		Documents:    documentResponses,
		CreatedDate:  orgRequest.CreatedDate,
		ModifiedDate: orgRequest.ModifiedDate,
	}

	return c.Status(fiber.StatusCreated).JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *OrganizationRequestHandler) GetOrganizationRequests(c *fiber.Ctx) error {
	statusFilter := c.Query("status")

	var orgRequests []*db.OrganizationRequest
	var err error

	if statusFilter != "" {
		var statusEnum db.NullOrganizationRequestStatus
		statusEnum.OrganizationRequestStatus = db.OrganizationRequestStatus(statusFilter)
		statusEnum.Valid = true
		orgRequests, err = h.queries.ListOrganizationRequestsByStatus(context.Background(), statusEnum)
	} else {
		orgRequests, err = h.queries.ListOrganizationRequests(context.Background())
	}

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to fetch organization requests",
		})
	}

	var responses []models.OrganizationRequestResponse
	for _, req := range orgRequests {
		var requestIDPgType pgtype.UUID
		requestIDPgType.Scan(req.ID)

		docs, _ := h.queries.GetOrganizationRequestDocuments(context.Background(), requestIDPgType)

		var documentResponses []models.OrganizationRequestDocumentResponse
		for _, doc := range docs {
			documentURL := h.minio.GetFileURL(doc.DocumentPath)
			documentResponses = append(documentResponses, models.OrganizationRequestDocumentResponse{
				ID:           doc.ID,
				DocumentPath: doc.DocumentPath,
				DocumentURL:  documentURL,
				CreatedDate:  doc.CreatedDate,
			})
		}

		status := "pending"
		if req.Status.Valid {
			status = string(req.Status.OrganizationRequestStatus)
		}

		responses = append(responses, models.OrganizationRequestResponse{
			ID:           req.ID,
			Name:         req.Name,
			Phone:        req.Phone,
			CR:           req.Cr,
			Description:  req.Description,
			Status:       status,
			Documents:    documentResponses,
			CreatedDate:  req.CreatedDate,
			ModifiedDate: req.ModifiedDate,
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    responses,
	})
}

func (h *OrganizationRequestHandler) GetOrganizationRequest(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid request ID",
		})
	}

	req, err := h.queries.GetOrganizationRequestByID(context.Background(), id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(models.APIResponse{
			Success: false,
			Error:   "Organization request not found",
		})
	}

	var requestIDPgType pgtype.UUID
	requestIDPgType.Scan(req.ID)

	docs, _ := h.queries.GetOrganizationRequestDocuments(context.Background(), requestIDPgType)

	var documentResponses []models.OrganizationRequestDocumentResponse
	for _, doc := range docs {
		documentURL := h.minio.GetFileURL(doc.DocumentPath)
		documentResponses = append(documentResponses, models.OrganizationRequestDocumentResponse{
			ID:           doc.ID,
			DocumentPath: doc.DocumentPath,
			DocumentURL:  documentURL,
			CreatedDate:  doc.CreatedDate,
		})
	}

	status := "pending"
	if req.Status.Valid {
		status = string(req.Status.OrganizationRequestStatus)
	}

	response := models.OrganizationRequestResponse{
		ID:           req.ID,
		Name:         req.Name,
		Phone:        req.Phone,
		CR:           req.Cr,
		Description:  req.Description,
		Status:       status,
		Documents:    documentResponses,
		CreatedDate:  req.CreatedDate,
		ModifiedDate: req.ModifiedDate,
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *OrganizationRequestHandler) UpdateOrganizationRequestStatus(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid request ID",
		})
	}

	var reqBody models.UpdateOrganizationRequestStatusRequest
	if err := c.BodyParser(&reqBody); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid request body",
		})
	}

	if err := h.validator.Validate(&reqBody); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   err.Error(),
		})
	}

	var statusEnum db.NullOrganizationRequestStatus
	statusEnum.OrganizationRequestStatus = db.OrganizationRequestStatus(reqBody.Status)
	statusEnum.Valid = true

	req, err := h.queries.UpdateOrganizationRequestStatus(context.Background(), &db.UpdateOrganizationRequestStatusParams{
		Status: statusEnum,
		ID:     id,
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to update organization request status",
		})
	}

	status := "pending"
	if req.Status.Valid {
		status = string(req.Status.OrganizationRequestStatus)
	}

	response := models.OrganizationRequestResponse{
		ID:           req.ID,
		Name:         req.Name,
		Phone:        req.Phone,
		CR:           req.Cr,
		Description:  req.Description,
		Status:       status,
		CreatedDate:  req.CreatedDate,
		ModifiedDate: req.ModifiedDate,
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}
