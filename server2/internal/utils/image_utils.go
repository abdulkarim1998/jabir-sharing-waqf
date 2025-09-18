package utils

import (
	"fmt"
	"os"
)

// GetImageURL converts a relative image path to a full URL
func GetImageURL(imagePath *string) *string {
	if imagePath == nil {
		return nil
	}

	// Get base URL from environment or use default
	baseURL := os.Getenv("API_BASE_URL")
	if baseURL == "" {
		baseURL = "http://localhost:8081"
	}

	fullURL := fmt.Sprintf("%s/api/images/%s", baseURL, *imagePath)
	return &fullURL
}
