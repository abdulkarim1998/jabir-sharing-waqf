# Makefile for Jabir Waqf Go API

.PHONY: help build run test clean deps sqlc migrate-up migrate-down docker-build docker-run

# Default target
help:
	@echo "Available commands:"
	@echo "  deps        Install dependencies"
	@echo "  sqlc        Generate SQLC code"
	@echo "  build       Build the application"
	@echo "  run         Run the application"
	@echo "  test        Run tests"
	@echo "  clean       Clean build artifacts"
	@echo "  migrate-up  Run database migrations up"
	@echo "  migrate-down Run database migrations down"
	@echo "  docker-build Build Docker image"
	@echo "  docker-run  Run with Docker Compose"

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
