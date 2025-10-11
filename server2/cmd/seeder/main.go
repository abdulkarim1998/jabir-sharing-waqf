package main

import (
	"bytes"
	"context"
	"database/sql"
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"image/jpeg"
	"log"
	"os"
	"strings"

	"jabir-waqf-go/internal/config"

	"github.com/golang/freetype"
	"github.com/golang/freetype/truetype"
	_ "github.com/lib/pq"
	"github.com/minio/minio-go/v7"
	"golang.org/x/image/font/gofont/goregular"
)

type SeederConfig struct {
	DB    *sql.DB
	Minio *config.MinioConfig
}

// Sample image generator for placeholder images
type ImageGenerator struct {
	font *truetype.Font
}

func NewImageGenerator() (*ImageGenerator, error) {
	font, err := freetype.ParseFont(goregular.TTF)
	if err != nil {
		return nil, fmt.Errorf("failed to parse font: %v", err)
	}

	return &ImageGenerator{font: font}, nil
}

func (ig *ImageGenerator) GenerateImage(text string, width, height int, bgColor color.RGBA) ([]byte, error) {
	// Create a new image
	img := image.NewRGBA(image.Rect(0, 0, width, height))

	// Fill with background color
	draw.Draw(img, img.Bounds(), &image.Uniform{bgColor}, image.Point{}, draw.Src)

	// Create context for drawing text
	c := freetype.NewContext()
	c.SetDPI(72)
	c.SetFont(ig.font)
	c.SetFontSize(24)
	c.SetClip(img.Bounds())
	c.SetDst(img)
	c.SetSrc(&image.Uniform{color.RGBA{255, 255, 255, 255}}) // White text

	// Calculate text position (centered)
	textWidth := len(text) * 12 // Rough estimation
	x := (width - textWidth) / 2
	y := height / 2

	// Draw the text
	pt := freetype.Pt(x, y)
	_, err := c.DrawString(text, pt)
	if err != nil {
		return nil, fmt.Errorf("failed to draw text: %v", err)
	}

	// Convert to JPEG
	var buf bytes.Buffer
	err = jpeg.Encode(&buf, img, &jpeg.Options{Quality: 80})
	if err != nil {
		return nil, fmt.Errorf("failed to encode image: %v", err)
	}

	return buf.Bytes(), nil
}

func main() {
	log.Println("Starting Jabir Waqf Seeder...")

	// Initialize database connection
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "postgres")
	dbPassword := getEnv("DB_PASSWORD", "123456")
	dbName := getEnv("DB_NAME", "postgres")
	dbSSLMode := getEnv("DB_SSLMODE", "disable")

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		dbHost, dbPort, dbUser, dbPassword, dbName, dbSSLMode)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Test database connection
	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}
	log.Println("✅ Database connection established")

	// Initialize MinIO
	minioConfig := config.NewMinioConfig()
	log.Println("✅ MinIO connection established")

	// Initialize seeder
	seeder := &SeederConfig{
		DB:    db,
		Minio: minioConfig,
	}

	// Run seeding operations
	if len(os.Args) > 1 {
		switch os.Args[1] {
		case "images":
			if err := seeder.SeedImages(); err != nil {
				log.Fatalf("Failed to seed images: %v", err)
			}
		case "data":
			if err := seeder.SeedDatabase(); err != nil {
				log.Fatalf("Failed to seed database: %v", err)
			}
		case "all":
			if err := seeder.SeedImages(); err != nil {
				log.Printf("Warning: Failed to seed images: %v", err)
			}
			if err := seeder.SeedDatabase(); err != nil {
				log.Fatalf("Failed to seed database: %v", err)
			}
		case "clean":
			if err := seeder.CleanData(); err != nil {
				log.Fatalf("Failed to clean data: %v", err)
			}
		default:
			log.Printf("Unknown command: %s", os.Args[1])
			printUsage()
		}
	} else {
		printUsage()
	}

	log.Println("🎉 Seeding completed successfully!")
}

func (s *SeederConfig) SeedImages() error {
	log.Println("🖼️  Starting image seeding...")

	imageGen, err := NewImageGenerator()
	if err != nil {
		return fmt.Errorf("failed to create image generator: %v", err)
	}

	// Define colors for different types
	orgColors := []color.RGBA{
		{52, 152, 219, 255}, // Blue
		{46, 204, 113, 255}, // Green
		{155, 89, 182, 255}, // Purple
		{241, 196, 15, 255}, // Yellow
	}

	projectColors := []color.RGBA{
		{231, 76, 60, 255},  // Red
		{230, 126, 34, 255}, // Orange
		{26, 188, 156, 255}, // Teal
		{142, 68, 173, 255}, // Dark Purple
	}

	// Organization images
	organizations := []struct {
		name     string
		logoPath string
		imgPath  string
	}{
		{"Khair Charity", "organization/khair-logo.png", "organization/khair-image.jpg"},
		{"Bir Foundation", "organization/bir-logo.png", "organization/bir-image.jpg"},
		{"Nizwa Heritage", "organization/nizwa-logo.png", "organization/nizwa-image.jpg"},
		{"Amal Development", "organization/amal-logo.png", "organization/amal-image.jpg"},
	}

	for i, org := range organizations {
		// Generate logo (smaller, square)
		logoData, err := imageGen.GenerateImage(org.name+" Logo", 200, 200, orgColors[i%len(orgColors)])
		if err != nil {
			log.Printf("Warning: Failed to generate logo for %s: %v", org.name, err)
			continue
		}

		// Upload logo
		if err := s.uploadImageToMinio(org.logoPath, logoData, "image/png"); err != nil {
			log.Printf("Warning: Failed to upload logo for %s: %v", org.name, err)
		} else {
			log.Printf("✅ Uploaded logo: %s", org.logoPath)
		}

		// Generate main image (larger, rectangular)
		imgData, err := imageGen.GenerateImage(org.name, 800, 400, orgColors[i%len(orgColors)])
		if err != nil {
			log.Printf("Warning: Failed to generate image for %s: %v", org.name, err)
			continue
		}

		// Upload image
		if err := s.uploadImageToMinio(org.imgPath, imgData, "image/jpeg"); err != nil {
			log.Printf("Warning: Failed to upload image for %s: %v", org.name, err)
		} else {
			log.Printf("✅ Uploaded image: %s", org.imgPath)
		}
	}

	// Project images and logos
	projects := []struct {
		name     string
		imgPath  string
		logoPath string
	}{
		{"Mosque Project", "project/mosque-hidaya.jpg", "project/mosque-logo.png"},
		{"Quran School", "project/quran-school.jpg", "project/quran-logo.png"},
		{"Medical Center", "project/medical-center.jpg", "project/medical-logo.png"},
		{"Knowledge Library", "project/knowledge-library.jpg", "project/library-logo.png"},
		{"Craftsmen Training", "project/craftsmen-training.jpg", "project/craftsmen-logo.png"},
		{"Widows & Orphans", "project/widows-orphans.jpg", "project/widows-logo.png"},
	}

	for i, project := range projects {
		// Generate and upload image
		imgData, err := imageGen.GenerateImage(project.name, 800, 500, projectColors[i%len(projectColors)])
		if err != nil {
			log.Printf("Warning: Failed to generate image for %s: %v", project.name, err)
			continue
		}

		if err := s.uploadImageToMinio(project.imgPath, imgData, "image/jpeg"); err != nil {
			log.Printf("Warning: Failed to upload image for %s: %v", project.name, err)
		} else {
			log.Printf("✅ Uploaded image: %s", project.imgPath)
		}

		// Generate and upload logo (smaller, square)
		logoData, err := imageGen.GenerateImage(project.name+" Logo", 200, 200, projectColors[i%len(projectColors)])
		if err != nil {
			log.Printf("Warning: Failed to generate logo for %s: %v", project.name, err)
			continue
		}

		if err := s.uploadImageToMinio(project.logoPath, logoData, "image/jpeg"); err != nil {
			log.Printf("Warning: Failed to upload logo for %s: %v", project.name, err)
		} else {
			log.Printf("✅ Uploaded logo: %s", project.logoPath)
		}
	}

	log.Println("🖼️  Image seeding completed!")
	return nil
}

func (s *SeederConfig) uploadImageToMinio(path string, data []byte, contentType string) error {
	ctx := context.Background()

	_, err := s.Minio.Client.PutObject(ctx, s.Minio.BucketName, path,
		bytes.NewReader(data), int64(len(data)), minio.PutObjectOptions{
			ContentType: contentType,
		})

	return err
}

func (s *SeederConfig) SeedDatabase() error {
	log.Println("📊 Starting database seeding...")

	// Read and execute seed file
	seedFile := "migrations/seed_data.sql"
	sqlContent, err := os.ReadFile(seedFile)
	if err != nil {
		return fmt.Errorf("failed to read seed file %s: %v", seedFile, err)
	}

	// Split SQL content by statements and filter out comments
	statements := strings.Split(string(sqlContent), ";")

	tx, err := s.DB.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %v", err)
	}
	defer tx.Rollback()

	for i, stmt := range statements {
		stmt = strings.TrimSpace(stmt)

		// Skip empty statements and single-line comments
		if stmt == "" || strings.HasPrefix(stmt, "--") {
			continue
		}

		// Skip multi-line comment blocks
		if strings.HasPrefix(stmt, "/*") || strings.HasSuffix(stmt, "*/") {
			continue
		}

		// Skip verification queries specifically
		if strings.Contains(stmt, "VERIFICATION QUERIES") ||
			strings.Contains(stmt, "Uncomment the following") ||
			strings.Contains(stmt, "Check organizations") ||
			strings.Contains(stmt, "Check projects") ||
			strings.Contains(stmt, "Check donations") ||
			strings.Contains(stmt, "Check users and roles") {
			continue
		}

		// Only execute if it looks like a valid SQL statement
		if strings.HasPrefix(strings.ToUpper(stmt), "INSERT") ||
			strings.HasPrefix(strings.ToUpper(stmt), "UPDATE") ||
			strings.HasPrefix(strings.ToUpper(stmt), "DELETE") ||
			strings.HasPrefix(strings.ToUpper(stmt), "CREATE") ||
			strings.HasPrefix(strings.ToUpper(stmt), "ALTER") {

			preview := stmt
			if len(stmt) > 50 {
				preview = stmt[:50]
			}
			log.Printf("Executing SQL: %s...", preview)
			if _, err := tx.Exec(stmt); err != nil {
				return fmt.Errorf("failed to execute statement %d: %v\nStatement: %s", i+1, err, stmt)
			}
		}
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %v", err)
	}

	log.Println("📊 Database seeding completed!")
	return nil
}

func (s *SeederConfig) CleanData() error {
	log.Println("🧹 Cleaning existing data...")

	// Clean database tables (in reverse order due to foreign keys)
	tables := []string{
		"permissions",
		"user_roles",
		"payment_configurations",
		"donations",
		"projects",
		"organizations",
		"roles",
		"users",
	}

	tx, err := s.DB.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %v", err)
	}
	defer tx.Rollback()

	for _, table := range tables {
		if _, err := tx.Exec(fmt.Sprintf("DELETE FROM %s", table)); err != nil {
			log.Printf("Warning: Failed to clean table %s: %v", table, err)
		} else {
			log.Printf("✅ Cleaned table: %s", table)
		}
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %v", err)
	}

	// Clean MinIO bucket
	ctx := context.Background()
	objectCh := s.Minio.Client.ListObjects(ctx, s.Minio.BucketName, minio.ListObjectsOptions{
		Recursive: true,
	})

	for object := range objectCh {
		if object.Err != nil {
			log.Printf("Warning: Error listing object: %v", object.Err)
			continue
		}

		err := s.Minio.Client.RemoveObject(ctx, s.Minio.BucketName, object.Key, minio.RemoveObjectOptions{})
		if err != nil {
			log.Printf("Warning: Failed to remove object %s: %v", object.Key, err)
		} else {
			log.Printf("🗑️  Removed: %s", object.Key)
		}
	}

	log.Println("🧹 Data cleaning completed!")
	return nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func printUsage() {
	fmt.Println("Usage: go run cmd/seeder/main.go [command]")
	fmt.Println("Commands:")
	fmt.Println("  images  - Seed only images to MinIO")
	fmt.Println("  data    - Seed only database data")
	fmt.Println("  all     - Seed both images and data (recommended)")
	fmt.Println("  clean   - Clean all existing data")
	fmt.Println("")
	fmt.Println("Examples:")
	fmt.Println("  go run cmd/seeder/main.go all")
	fmt.Println("  go run cmd/seeder/main.go clean")
}
