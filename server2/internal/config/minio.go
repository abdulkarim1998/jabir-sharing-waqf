package config

import (
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type MinioConfig struct {
	Endpoint        string
	AccessKeyID     string
	SecretAccessKey string
	UseSSL          bool
	BucketName      string
	Client          *minio.Client
}

func NewMinioConfig() *MinioConfig {
	config := &MinioConfig{
		Endpoint:        getMinioEnv("MINIO_ENDPOINT", "localhost:9000"),
		AccessKeyID:     getMinioEnv("MINIO_ACCESS_KEY", "minioadmin"),
		SecretAccessKey: getMinioEnv("MINIO_SECRET_KEY", "minioadmin"),
		UseSSL:          getMinioEnv("MINIO_USE_SSL", "false") == "true",
		BucketName:      getMinioEnv("MINIO_BUCKET_NAME", "jabir-waqf"),
	}

	client, err := minio.New(config.Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(config.AccessKeyID, config.SecretAccessKey, ""),
		Secure: config.UseSSL,
	})
	if err != nil {
		log.Fatalf("Failed to create MinIO client: %v", err)
	}

	config.Client = client

	// Ensure bucket exists
	err = config.ensureBucketExists()
	if err != nil {
		log.Printf("Warning: Failed to ensure bucket exists: %v", err)
	}

	return config
}

func (m *MinioConfig) ensureBucketExists() error {
	ctx := context.Background()

	exists, err := m.Client.BucketExists(ctx, m.BucketName)
	if err != nil {
		return fmt.Errorf("failed to check bucket existence: %v", err)
	}

	if !exists {
		err = m.Client.MakeBucket(ctx, m.BucketName, minio.MakeBucketOptions{})
		if err != nil {
			return fmt.Errorf("failed to create bucket: %v", err)
		}
		log.Printf("Created bucket: %s", m.BucketName)
	}

	return nil
}

func (m *MinioConfig) UploadFile(file *multipart.FileHeader, folder string) (string, error) {
	ctx := context.Background()

	// Open the uploaded file
	src, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open uploaded file: %v", err)
	}
	defer src.Close()

	// Generate unique filename
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%s/%s%s", folder, uuid.New().String(), ext)

	// Get content type
	contentType := file.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	// Upload to MinIO
	_, err = m.Client.PutObject(ctx, m.BucketName, filename, src, file.Size, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload file to MinIO: %v", err)
	}

	// Return the file URL/path
	return filename, nil
}

func (m *MinioConfig) DeleteFile(filename string) error {
	ctx := context.Background()

	err := m.Client.RemoveObject(ctx, m.BucketName, filename, minio.RemoveObjectOptions{})
	if err != nil {
		return fmt.Errorf("failed to delete file from MinIO: %v", err)
	}

	return nil
}

func (m *MinioConfig) GetFileURL(filename string) string {
	// Return API endpoint instead of direct MinIO URL
	// This ensures images are served through the API with proper authentication/caching
	return fmt.Sprintf("/api/images/%s", filename)
}

func (m *MinioConfig) GetFullFileURL(filename string, baseURL string) string {
	// Return full URL for frontend consumption
	return fmt.Sprintf("%s/api/images/%s", baseURL, filename)
}

func (m *MinioConfig) GetPresignedURL(filename string, expires time.Duration) (string, error) {
	ctx := context.Background()

	url, err := m.Client.PresignedGetObject(ctx, m.BucketName, filename, expires, nil)
	if err != nil {
		return "", fmt.Errorf("failed to generate presigned URL: %v", err)
	}

	return url.String(), nil
}

func getMinioEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
