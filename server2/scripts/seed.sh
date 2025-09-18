#!/bin/bash

# Jabir Waqf Seeding Script
# This script handles seeding for both development and production environments

set -e

echo "🌱 Starting Jabir Waqf Seeding Process..."

# Function to wait for service to be ready
wait_for_service() {
    local service_name=$1
    local host=$2
    local port=$3
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if nc -z "$host" "$port" >/dev/null 2>&1; then
            echo "✅ $service_name is ready!"
            return 0
        fi
        
        echo "🔄 Attempt $attempt/$max_attempts: $service_name not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ $service_name failed to start within expected time"
    exit 1
}

# Set default environment variables
export DB_HOST=${DB_HOST:-"db"}
export DB_PORT=${DB_PORT:-"5432"}
export DB_USER=${DB_USER:-"postgres"}
export DB_PASSWORD=${DB_PASSWORD:-"123456"}
export DB_NAME=${DB_NAME:-"postgres"}
export DB_SSLMODE=${DB_SSLMODE:-"disable"}

export MINIO_ENDPOINT=${MINIO_ENDPOINT:-"minio:9000"}
export MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY:-"minioadmin"}
export MINIO_SECRET_KEY=${MINIO_SECRET_KEY:-"minioadmin"}
export MINIO_BUCKET_NAME=${MINIO_BUCKET_NAME:-"jabir-waqf"}
export MINIO_USE_SSL=${MINIO_USE_SSL:-"false"}

# Parse command line arguments
SEED_TYPE=${1:-"all"}
FORCE_CLEAN=${2:-"false"}

echo "📋 Seeding Configuration:"
echo "   Database: $DB_HOST:$DB_PORT/$DB_NAME"
echo "   MinIO: $MINIO_ENDPOINT/$MINIO_BUCKET_NAME"
echo "   Seed Type: $SEED_TYPE"
echo "   Force Clean: $FORCE_CLEAN"

# Wait for dependencies
if [ "$DB_HOST" != "localhost" ]; then
    wait_for_service "Database" "$DB_HOST" "$DB_PORT"
fi

if [ "$MINIO_ENDPOINT" != "localhost:9000" ]; then
    wait_for_service "MinIO" "${MINIO_ENDPOINT%:*}" "${MINIO_ENDPOINT##*:}"
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
go mod download
go mod tidy

# Clean existing data if requested
if [ "$FORCE_CLEAN" = "true" ]; then
    echo "🧹 Cleaning existing data..."
    go run cmd/seeder/main.go clean || {
        echo "⚠️  Warning: Failed to clean data, but continuing..."
    }
fi

# Run seeding based on type
case $SEED_TYPE in
    "images")
        echo "🖼️  Seeding images only..."
        go run cmd/seeder/main.go images
        ;;
    "data")
        echo "📊 Seeding database only..."
        go run cmd/seeder/main.go data
        ;;
    "all")
        echo "🌍 Seeding everything..."
        go run cmd/seeder/main.go all
        ;;
    "clean")
        echo "🧹 Cleaning data only..."
        go run cmd/seeder/main.go clean
        ;;
    *)
        echo "❌ Unknown seed type: $SEED_TYPE"
        echo "Available types: images, data, all, clean"
        exit 1
        ;;
esac

echo "🎉 Seeding completed successfully!"

# Optional: Display summary statistics
if [ "$SEED_TYPE" != "clean" ]; then
    echo "📊 Seeding Summary:"
    
    # Count organizations
    ORG_COUNT=$(psql "postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" -t -c "SELECT COUNT(*) FROM organizations;" 2>/dev/null | xargs || echo "N/A")
    echo "   Organizations: $ORG_COUNT"
    
    # Count projects  
    PROJECT_COUNT=$(psql "postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" -t -c "SELECT COUNT(*) FROM projects;" 2>/dev/null | xargs || echo "N/A")
    echo "   Projects: $PROJECT_COUNT"
    
    # Count donations
    DONATION_COUNT=$(psql "postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" -t -c "SELECT COUNT(*) FROM donations;" 2>/dev/null | xargs || echo "N/A")
    echo "   Donations: $DONATION_COUNT"
    
    # Total donation amount
    TOTAL_AMOUNT=$(psql "postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" -t -c "SELECT COALESCE(SUM(amount), 0) FROM donations WHERE payment_status = 'Completed';" 2>/dev/null | xargs || echo "N/A")
    echo "   Total Donations: $TOTAL_AMOUNT OMR"
fi
