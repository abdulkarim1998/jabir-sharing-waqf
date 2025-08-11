package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"

	"jabir-waqf-go/internal/config"
	"jabir-waqf-go/internal/db"
	"jabir-waqf-go/internal/handlers"
	"jabir-waqf-go/pkg/validator"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Load configuration
	cfg := config.Load()

	// Initialize database connection
	dbPool, err := initDatabase(cfg)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer dbPool.Close()

	// Initialize services
	queries := db.New(dbPool)
	validator := validator.New()

	// Initialize handlers
	organizationHandler := handlers.NewOrganizationHandler(queries, validator)
	projectHandler := handlers.NewProjectHandler(queries, validator)
	waqfTypeHandler := handlers.NewWaqfTypeHandler(queries, validator)
	paymentHandler := handlers.NewPaymentHandler(queries, validator)
	dashboardHandler := handlers.NewDashboardHandler(queries)

	// Initialize Fiber app
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"success": false,
				"error":   err.Error(),
			})
		},
	})

	// Middleware
	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
		AllowCredentials: false,
	}))

	// Routes
	setupRoutes(app, organizationHandler, projectHandler, waqfTypeHandler, paymentHandler, dashboardHandler)

	// Start server
	go func() {
		if err := app.Listen(":" + cfg.Server.Port); err != nil {
			log.Fatal("Failed to start server:", err)
		}
	}()

	log.Printf("Server started on port %s", cfg.Server.Port)

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")
	if err := app.Shutdown(); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}
	log.Println("Server exited")
}

func initDatabase(cfg *config.Config) (*pgxpool.Pool, error) {
	dbURL := fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=%s",
		cfg.Database.User,
		cfg.Database.Password,
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.DBName,
		cfg.Database.SSLMode,
	)

	pool, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		return nil, fmt.Errorf("failed to create connection pool: %w", err)
	}

	// Test the connection
	if err := pool.Ping(context.Background()); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Println("Successfully connected to database")
	return pool, nil
}

func setupRoutes(
	app *fiber.App,
	organizationHandler *handlers.OrganizationHandler,
	projectHandler *handlers.ProjectHandler,
	waqfTypeHandler *handlers.WaqfTypeHandler,
	paymentHandler *handlers.PaymentHandler,
	dashboardHandler *handlers.DashboardHandler,
) {
	// API v1 routes
	api := app.Group("/api")

	// Health check
	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"message": "Jabir Waqf API is running",
		})
	})

	// Organization routes
	orgs := api.Group("/organizations")
	orgs.Get("/", organizationHandler.GetOrganizations)
	orgs.Get("/:id", organizationHandler.GetOrganization)
	orgs.Post("/", organizationHandler.CreateOrganization)
	orgs.Put("/:id", organizationHandler.UpdateOrganization)
	orgs.Delete("/:id", organizationHandler.DeleteOrganization)

	// Project routes
	projects := api.Group("/projects")
	projects.Get("/", projectHandler.GetProjects)
	projects.Get("/:id", projectHandler.GetProject)
	projects.Get("/:id/financial-status", projectHandler.GetProjectFinancialStatus)
	projects.Get("/organization/:organizationId", projectHandler.GetProjectsByOrganization)
	projects.Post("/", projectHandler.CreateProject)
	projects.Put("/:id", projectHandler.UpdateProject)
	projects.Delete("/:id", projectHandler.DeleteProject)

	// Waqf Type routes
	waqfTypes := api.Group("/waqf-types")
	waqfTypes.Get("/", waqfTypeHandler.GetWaqfTypes)
	waqfTypes.Get("/:id", waqfTypeHandler.GetWaqfType)
	waqfTypes.Post("/", waqfTypeHandler.CreateWaqfType)
	waqfTypes.Put("/:id", waqfTypeHandler.UpdateWaqfType)
	waqfTypes.Delete("/:id", waqfTypeHandler.DeleteWaqfType)

	// Payment routes
	payments := api.Group("/payments")
	payments.Get("/", paymentHandler.GetPaymentTracks)
	payments.Get("/track/:trackId", paymentHandler.GetPaymentResponse)
	payments.Get("/waqf/:waqfId", paymentHandler.GetPaymentsByWaqf)
	payments.Post("/update-status", paymentHandler.UpdatePaymentStatus)

	// Dashboard routes
	dashboard := api.Group("/dashboard")
	dashboard.Get("/", dashboardHandler.GetDashboardReport)
	dashboard.Get("/waqf-types", dashboardHandler.GetWaqfTypeDonatedReport)
	dashboard.Get("/organization/:organizationId", dashboardHandler.GetOrganizationDashboard)
	dashboard.Get("/date-range", dashboardHandler.GetDashboardByDateRange)
	dashboard.Get("/monthly-trend", dashboardHandler.GetMonthlyDonationTrend)
}
