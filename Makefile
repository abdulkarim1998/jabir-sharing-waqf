# Makefile for Jabir Waqf Go API

.PHONY: help build run test clean deps sqlc migrate-up migrate-down docker-build docker-run seed seed-images seed-data seed-clean seed-docker

# Default target
help:
	@echo "Available commands:"
	@echo "  deps         Install dependencies"
	@echo "  sqlc         Generate SQLC code"
	@echo "  build        Build the application"
	@echo "  run          Run the application"
	@echo "  test         Run tests"
	@echo "  clean        Clean build artifacts"
	@echo "  migrate-up   Run database migrations up"
	@echo "  migrate-down Run database migrations down"
	@echo "  docker-build Build Docker image"
	@echo "  docker-run   Run with Docker Compose"
	@echo ""
	@echo "Seeding commands:"
	@echo "  seed         Seed both database and images (local)"
	@echo "  seed-images  Seed only images (local)"
	@echo "  seed-data    Seed only database (local)"
	@echo "  seed-clean   Clean all seeded data (local)"
	@echo "  seed-docker  Seed using Docker Compose"

# Install dependencies
deps:
	go mod download
	go mod tidy

# Generate SQLC code
sqlc:
	sqlc generate

# Build the application
build:
	go build -o bin/jabir-waqf-api cmd/api/main.go

# Run the application
run:
	go run cmd/api/main.go

# Run tests
test:
	go test ./... -v

# Clean build artifacts
clean:
	rm -rf bin/
	go clean

# Database migrations
migrate-up:
	migrate -path migrations -database "$(DATABASE_URL)" up

migrate-down:
	migrate -path migrations -database "$(DATABASE_URL)" down

# Docker commands
docker-build:
	docker build -t jabir-waqf-api .

docker-run:
	docker-compose up --build

docker-stop:
	docker-compose down

# Development helpers
dev: deps sqlc run

install-tools:
	go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest
	go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# ============================================================================
# SEEDING COMMANDS
# ============================================================================

# Seed everything (database + images) locally
seed: deps
	@echo "🌱 Seeding all data locally..."
	cd server2 && go run cmd/seeder/main.go all

# Seed only images locally
seed-images: deps
	@echo "🖼️  Seeding images locally..."
	cd server2 && go run cmd/seeder/main.go images

# Seed only database locally
seed-data: deps
	@echo "📊 Seeding database locally..."
	cd server2 && go run cmd/seeder/main.go data

# Clean all seeded data locally
seed-clean: deps
	@echo "🧹 Cleaning seeded data locally..."
	cd server2 && go run cmd/seeder/main.go clean

# Seed using Docker Compose (recommended for development)
seed-docker:
	@echo "🐳 Seeding with Docker Compose..."
	docker-compose --profile seeding up seeder --remove-orphans

# Clean and reseed everything with Docker
seed-docker-fresh:
	@echo "🔄 Fresh seeding with Docker Compose..."
	cd server2 && docker-compose --profile seeding run --rm seeder ./scripts/seed.sh all true

# Development setup with seeding
dev-setup: docker-run seed-docker
	@echo "🚀 Development environment ready with seed data!"

# Production-like seeding (for staging/demo environments)
seed-production:
	@echo "🏭 Production seeding..."
	@read -p "Are you sure you want to seed production data? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		cd server2 && ./scripts/seed.sh all false; \
	else \
		echo "Seeding cancelled."; \
	fi
