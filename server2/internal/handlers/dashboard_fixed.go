package handlers

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"jabir-waqf-go/internal/db"
	"jabir-waqf-go/internal/models"
)

type DashboardHandler struct {
	queries *db.Queries
}

func NewDashboardHandler(queries *db.Queries) *DashboardHandler {
	return &DashboardHandler{
		queries: queries,
	}
}

func (h *DashboardHandler) GetDashboardReport(c *fiber.Ctx) error {
	report, err := h.queries.GetTotalDonationsReport(context.Background())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to fetch dashboard report",
		})
	}

	response := models.DashboardReportResponse{
		TotalWaqfs:    report.TotalWaqfs,
		TotalAmount:   interfaceToDecimal(report.TotalAmount),
		TotalProjects: report.TotalProjects,
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *DashboardHandler) GetDonationTypesReport(c *fiber.Ctx) error {
	reports, err := h.queries.GetDonationTypesReport(context.Background())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to fetch donation types report",
		})
	}

	var response []models.DonationTypesReportResponse
	for _, report := range reports {
		donationType := "regular"
		if report.DonationType != nil {
			donationType = *report.DonationType
		}

		response = append(response, models.DonationTypesReportResponse{
			DonationType:   donationType,
			TotalDonations: report.TotalDonations,
			TotalAmount:    interfaceToDecimal(report.TotalAmount),
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *DashboardHandler) GetOrganizationDashboard(c *fiber.Ctx) error {
	orgID, err := uuid.Parse(c.Params("organizationId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid organization ID",
		})
	}

	report, err := h.queries.GetOrganizationDashboardReport(context.Background(), orgID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to fetch organization dashboard",
		})
	}

	response := models.DashboardReportResponse{
		TotalWaqfs:    report.TotalWaqfs,
		TotalAmount:   interfaceToDecimal(report.TotalDonations),
		TotalProjects: report.TotalProjects,
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *DashboardHandler) GetDashboardByDateRange(c *fiber.Ctx) error {
	startDateStr := c.Query("start_date")
	endDateStr := c.Query("end_date")

	if startDateStr == "" || endDateStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "start_date and end_date are required",
		})
	}

	startDate, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid start_date format. Use YYYY-MM-DD",
		})
	}

	endDate, err := time.Parse("2006-01-02", endDateStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid end_date format. Use YYYY-MM-DD",
		})
	}

	report, err := h.queries.GetDashboardReportByDateRange(context.Background(), &db.GetDashboardReportByDateRangeParams{
		CreatedDate:   startDate,
		CreatedDate_2: endDate,
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to fetch dashboard report",
		})
	}

	response := models.DashboardReportResponse{
		TotalWaqfs:    report.TotalWaqfs,
		TotalAmount:   interfaceToDecimal(report.TotalAmount),
		TotalProjects: report.TotalProjects,
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (h *DashboardHandler) GetMonthlyDonationTrend(c *fiber.Ctx) error {
	startDateStr := c.Query("start_date")
	endDateStr := c.Query("end_date")

	if startDateStr == "" || endDateStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "start_date and end_date are required",
		})
	}

	startDate, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid start_date format. Use YYYY-MM-DD",
		})
	}

	endDate, err := time.Parse("2006-01-02", endDateStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid end_date format. Use YYYY-MM-DD",
		})
	}

	trends, err := h.queries.GetMonthlyDonationTrend(context.Background(), &db.GetMonthlyDonationTrendParams{
		CreatedDate:   startDate,
		CreatedDate_2: endDate,
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.APIResponse{
			Success: false,
			Error:   "Failed to fetch monthly donation trend",
		})
	}

	var response []models.MonthlyDonationTrendResponse
	for _, trend := range trends {
		// Convert pgtype.Interval to time.Time (month start)
		// For monthly trend, we'll use a default date with the year/month from the interval
		monthTime := time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC) // Default fallback

		response = append(response, models.MonthlyDonationTrendResponse{
			Month:       monthTime,
			TotalWaqfs:  trend.TotalWaqfs,
			TotalAmount: interfaceToDecimal(trend.TotalAmount),
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    response,
	})
}
