package handlers

import (
	"context"
	"fmt"
	"io"
	"jabir-waqf-go/internal/config"
	"jabir-waqf-go/internal/models"

	"github.com/gofiber/fiber/v2"
	"github.com/minio/minio-go/v7"
)

type UploadHandler struct {
	minio *config.MinioConfig
}

func NewUploadHandler(minio *config.MinioConfig) *UploadHandler {
	return &UploadHandler{
		minio: minio,
	}
}

// UploadImage handles image uploads for organizations and projects
func (h *UploadHandler) UploadImage(c *fiber.Ctx) error {
	// Parse form data
	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to parse form data",
		})
	}

	// Get the file and folder type
	files := form.File["image"]
	if len(files) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "No image file provided",
		})
	}

	folderType := c.FormValue("type") // "organization" or "project"
	if folderType == "" {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Folder type is required (organization or project)",
		})
	}

	// Validate file type
	file := files[0]
	contentType := file.Header.Get("Content-Type")
	if contentType != "image/jpeg" && contentType != "image/png" && contentType != "image/gif" {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Only JPEG, PNG, and GIF images are allowed",
		})
	}

	// Validate file size (max 5MB)
	if file.Size > 5*1024*1024 {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "File size must be less than 5MB",
		})
	}

	// Upload to MinIO
	filename, err := h.minio.UploadFile(file, folderType)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to upload image: " + err.Error(),
		})
	}

	// Get the public URL
	fileURL := h.minio.GetFileURL(filename)

	return c.JSON(models.APIResponse{
		Success: true,
		Data: map[string]interface{}{
			"filename": filename,
			"url":      fileURL,
			"size":     file.Size,
			"type":     contentType,
		},
	})
}

// DeleteImage handles image deletion from MinIO
func (h *UploadHandler) DeleteImage(c *fiber.Ctx) error {
	var req struct {
		Filename string `json:"filename"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid request body",
		})
	}

	if req.Filename == "" {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Filename is required",
		})
	}

	// Delete from MinIO
	err := h.minio.DeleteFile(req.Filename)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to delete image: " + err.Error(),
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Message: "Image deleted successfully",
	})
}

// ServeImage serves images from MinIO through the API
func (h *UploadHandler) ServeImage(c *fiber.Ctx) error {
	filename := c.Params("*")
	if filename == "" {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Filename is required",
		})
	}

	// Get object from MinIO
	ctx := context.Background()
	object, err := h.minio.Client.GetObject(ctx, h.minio.BucketName, filename, minio.GetObjectOptions{})
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(models.APIResponse{
			Success: false,
			Error:   "Image not found",
		})
	}
	defer object.Close()

	// Get object info
	objInfo, err := object.Stat()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to get image info",
		})
	}

	data, err := io.ReadAll(object)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to read image data",
		})
	}

	// Set correct headers
	c.Set("Content-Type", objInfo.ContentType)
	c.Set("Cache-Control", "public, max-age=31536000")
	c.Set("Content-Length", fmt.Sprintf("%d", len(data)))

	// Handle HEAD requests
	if string(c.Request().Header.Method()) == "HEAD" {
		return c.SendStatus(fiber.StatusOK)
	}

	// Send the actual data
	return c.Send(data)
}
