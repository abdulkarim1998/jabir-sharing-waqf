# Jabir Waqf Go API

A Go implementation of the Jabir Waqf Islamic charitable giving platform, built with Go Fiber, SQLC, and PostgreSQL.

## Features

- **Clean Architecture** with CQRS patterns
- **JWT Authentication** with Keycloak integration
- **Role-based Access Control** (RBAC)
- **PostgreSQL** database with migrations
- **SQLC** for type-safe SQL queries
- **Docker** support for easy deployment
- **RESTful API** with comprehensive endpoints

## Tech Stack

- **Go 1.21+**
- **Fiber v2** - Web framework
- **SQLC** - Type-safe SQL query generation
- **PostgreSQL** - Database
- **Keycloak** - Authentication and authorization
- **Docker** - Containerization
- **golang-migrate** - Database migrations

## Quick Start

### Prerequisites

- Go 1.21 or higher
- PostgreSQL 13+
- Docker (optional)
- SQLC CLI tool

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd server2
```

2. Install dependencies:

```bash
go mod download
```

3. Set up environment variables:

```bash
cp env.example .env
# Edit .env with your configuration
```

4. Run database migrations:

```bash
# Using golang-migrate CLI
migrate -path migrations -database "postgres://user:password@host:port/dbname?sslmode=disable" up
```

5. Generate SQLC code:

```bash
sqlc generate
```

6. Run the application:

```bash
go run cmd/api/main.go
```

### Using Docker

1. Build and run with Docker Compose:

```bash
docker-compose up --build
```

This will start:

- API server on port 8080
- PostgreSQL database on port 5432

## API Endpoints

### Authentication

All endpoints except health check and payment callbacks require JWT authentication.

### Users

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Organizations

- `GET /api/organizations` - List all organizations
- `GET /api/organizations/:id` - Get organization by ID
- `POST /api/organizations` - Create new organization
- `PUT /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id` - Delete organization
- `POST /api/organizations/:id/users` - Add user to organization
- `DELETE /api/organizations/:id/users/:userId` - Remove user from organization

### Projects

- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project by ID
- `GET /api/projects/:id/financial-status` - Get project financial status
- `GET /api/projects/organization/:organizationId` - Get projects by organization
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Waqf Types

- `GET /api/waqf-types` - List all waqf types
- `GET /api/waqf-types/:id` - Get waqf type by ID
- `POST /api/waqf-types` - Create new waqf type
- `PUT /api/waqf-types/:id` - Update waqf type
- `DELETE /api/waqf-types/:id` - Delete waqf type

### Payments

- `GET /api/payments` - List all payment tracks
- `GET /api/payments/track/:trackId` - Get payment by track ID (public)
- `GET /api/payments/waqf/:waqfId` - Get payments by waqf
- `POST /api/payments/update-status` - Update payment status (public)

### Dashboard

- `GET /api/dashboard` - Get overall dashboard report
- `GET /api/dashboard/waqf-types` - Get waqf types donation report
- `GET /api/dashboard/organization/:organizationId` - Get organization dashboard
- `GET /api/dashboard/date-range?start_date=2024-01-01&end_date=2024-12-31` - Get dashboard by date range
- `GET /api/dashboard/monthly-trend?start_date=2024-01-01&end_date=2024-12-31` - Get monthly donation trend

## Database Schema

The application uses the following main entities:

- **Users** - System users with Keycloak integration
- **Roles** - User roles for RBAC
- **Permissions** - Granular permissions (Resource + Scope)
- **Organizations** - Charitable organizations
- **Projects** - Projects under organizations
- **WaqfTypes** - Types of charitable giving with fixed amounts

- **Waqfs** - Saham-based donations
- **PaymentTracks** - Payment transaction tracking

## Environment Variables

| Variable                 | Description            | Default       |
| ------------------------ | ---------------------- | ------------- |
| `DB_HOST`                | Database host          | `localhost`   |
| `DB_PORT`                | Database port          | `5432`        |
| `DB_USER`                | Database user          | `postgres`    |
| `DB_PASSWORD`            | Database password      | -             |
| `DB_NAME`                | Database name          | `jabir_waqf`  |
| `DB_SSLMODE`             | SSL mode               | `disable`     |
| `PORT`                   | Server port            | `8080`        |
| `APP_ENV`                | Environment            | `development` |
| `KEYCLOAK_URL`           | Keycloak server URL    | -             |
| `KEYCLOAK_REALM`         | Keycloak realm         | `apps`        |
| `KEYCLOAK_CLIENT_ID`     | Keycloak client ID     | -             |
| `KEYCLOAK_CLIENT_SECRET` | Keycloak client secret | -             |
| `JWT_SECRET`             | JWT secret key         | -             |

## Development

### Adding New Queries

1. Write SQL in `sqlc/queries/*.sql`
2. Run `sqlc generate` to generate Go code
3. Use the generated queries in your handlers

### Database Migrations

1. Create new migration files in `migrations/`
2. Use format: `NNN_description.up.sql` and `NNN_description.down.sql`
3. Run migrations with `golang-migrate`

### Adding New Endpoints

1. Create handler in `internal/handlers/`
2. Add routes in `cmd/api/main.go`
3. Add appropriate permission checks

## Testing

```bash
# Run tests
go test ./...

# Run tests with coverage
go test -cover ./...
```

## Deployment

### Production Build

```bash
# Build binary
go build -o jabir-waqf-api cmd/api/main.go

# Run
./jabir-waqf-api
```

### Docker Deployment

```bash
# Build image
docker build -t jabir-waqf-api .

# Run container
docker run -p 8080:8080 --env-file .env jabir-waqf-api
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
