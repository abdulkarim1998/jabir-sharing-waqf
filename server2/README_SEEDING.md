# 🌱 Jabir Waqf Seeding Guide

This guide covers the comprehensive seeding strategy for the Jabir Waqf platform, including both database seeding and MinIO image uploads.

## 🎯 Quick Start (Recommended)

For the fastest setup with Docker Compose:

```bash
# Start all services and seed data
cd server2
make docker-run
make seed-docker

# Or do everything in one command
make dev-setup
```

## 📋 Available Seeding Methods

### 1. Docker Compose Seeding (Recommended for Development)

```bash
# Basic seeding with Docker
make seed-docker

# Fresh seeding (cleans existing data first)
make seed-docker-fresh

# Full development setup
make dev-setup
```

### 2. Local Seeding (Direct Go commands)

```bash
# Prerequisites: Database and MinIO must be running
# Seed everything
make seed

# Seed specific components
make seed-images    # Only images to MinIO
make seed-data      # Only database
make seed-clean     # Clean all data

# Or run directly
go run cmd/seeder/main.go all
go run cmd/seeder/main.go images
go run cmd/seeder/main.go data
go run cmd/seeder/main.go clean
```

### 3. Manual Script Execution

```bash
# Using the shell script directly
cd server2
./scripts/seed.sh all          # Seed everything
./scripts/seed.sh images       # Images only
./scripts/seed.sh data         # Database only
./scripts/seed.sh clean        # Clean data
./scripts/seed.sh all true     # Fresh seed (clean first)
```

## 📊 What Gets Seeded

### Database Data

- **4 Organizations** with Arabic names and complete details
- **6 Projects** across different categories (mosque, school, medical, etc.)
- **15+ Donations** with realistic amounts and Arabic donor names
- **User Management** (admin user, roles, permissions)
- **Payment Configurations** for each organization

### MinIO Images

- **Organization logos** (200x200 PNG)
- **Organization images** (800x400 JPG)
- **Project images** (800x500 JPG)
- All images are auto-generated with proper naming and colorful designs

## 🔧 Configuration

### Environment Variables

The seeder uses these environment variables (with defaults):

```bash
# Database
DB_HOST=db                    # or localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123456
DB_NAME=postgres
DB_SSLMODE=disable

# MinIO
MINIO_ENDPOINT=minio:9000     # or localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=jabir-waqf
MINIO_USE_SSL=false
```

### Custom Configuration

You can override defaults by setting environment variables:

```bash
# For production-like seeding
export DB_HOST=your-db-host
export MINIO_ENDPOINT=your-minio-host
make seed
```

## 📁 Project Structure

```
server2/
├── cmd/seeder/main.go           # Go seeding utility
├── scripts/seed.sh              # Shell script wrapper
├── migrations/seed_data.sql     # Enhanced SQL seed data
├── Makefile                     # Convenient make commands
└── README_SEEDING.md           # This guide
```

## 🎨 Sample Data Overview

### Organizations (4 total)

1. **جمعية الخير الوقفية** - Muscat-based charity
2. **مؤسسة البر والإحسان** - Salalah-based foundation
3. **مؤسسة نزوى الخيرية** - Heritage-focused Nizwa charity
4. **جمعية الأمل للتنمية** - Development-focused Sohar charity

### Projects (6 total)

1. **مشروع بناء مسجد الهداية** - Mosque construction (50,000 OMR)
2. **مشروع مدرسة تحفيظ القرآن** - Quran school (75,000 OMR)
3. **مشروع مركز طبي خيري** - Medical center (120,000 OMR)
4. **مشروع مكتبة المعرفة** - Knowledge library (35,000 OMR)
5. **مشروع تدريب الحرفيين** - Craftsmen training (45,000 OMR)
6. **مشروع دعم الأرامل والأيتام** - Widows & orphans support (80,000 OMR)

### Donations

- **15+ realistic donations** across all projects
- Mix of regular, gift, and anonymous donations
- Arabic donor names with realistic amounts
- Meaningful messages in Arabic

## 🚀 Production Deployment

For production or staging environments:

```bash
# Interactive confirmation required
make seed-production

# Or use script directly with production configs
export DB_HOST=prod-db-host
export MINIO_ENDPOINT=prod-minio-host
./scripts/seed.sh all false
```

## 🔍 Verification

After seeding, verify the data:

```bash
# The seeding script will show a summary like:
📊 Seeding Summary:
   Organizations: 4
   Projects: 6
   Donations: 15
   Total Donations: 24,550.00 OMR
```

You can also check MinIO console at http://localhost:9001 to see uploaded images.

## 🐛 Troubleshooting

### Common Issues

1. **Database connection failed**

   ```bash
   # Ensure database is running
   docker-compose up db -d
   ```

2. **MinIO connection failed**

   ```bash
   # Ensure MinIO is running
   docker-compose up minio -d
   ```

3. **Permission denied on scripts**

   ```bash
   chmod +x scripts/seed.sh
   ```

4. **Go dependencies missing**
   ```bash
   make deps
   ```

### Clean Start

If you need to completely reset:

```bash
# Stop everything
docker-compose down -v

# Remove volumes (WARNING: This deletes all data)
docker volume prune

# Start fresh
make dev-setup
```

## 📝 Notes

- The seeder is **idempotent** - you can run it multiple times safely
- Images are **auto-generated** if not provided - perfect for testing
- All Arabic text is properly encoded and realistic
- The database schema supports the generated data structure
- MinIO bucket is created automatically if it doesn't exist

## 🤝 Contributing

To add more seed data:

1. Update `migrations/seed_data.sql` for database data
2. Modify `cmd/seeder/main.go` for image generation logic
3. Test with `make seed-clean && make seed`

Happy seeding! 🌱
