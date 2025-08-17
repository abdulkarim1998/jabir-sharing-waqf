package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

// Standard API response
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

type RoleResponse struct {
	ID          uuid.UUID            `json:"id"`
	Name        string               `json:"name"`
	Description *string              `json:"description"`
	IsActive    bool                 `json:"is_active"`
	CreatedDate time.Time            `json:"created_date"`
	Permissions []PermissionResponse `json:"permissions,omitempty"`
}

type PermissionResponse struct {
	ID       uuid.UUID `json:"id"`
	Resource string    `json:"resource"`
	Scope    string    `json:"scope"`
}

// Organization responses
type OrganizationUserResponse struct {
	ID           uuid.UUID      `json:"id"`
	KeycloakID   uuid.UUID      `json:"keycloak_id"`
	Email        string         `json:"email"`
	FirstName    string         `json:"first_name"`
	LastName     string         `json:"last_name"`
	IsActive     bool           `json:"is_active"`
	CreatedDate  time.Time      `json:"created_date"`
	ModifiedDate time.Time      `json:"modified_date"`
	Roles        []RoleResponse `json:"roles,omitempty"`
}

type OrganizationResponse struct {
	ID           uuid.UUID                  `json:"id"`
	Name         string                     `json:"name"`
	Location     *string                    `json:"location"`
	IsActive     bool                       `json:"is_active"`
	Twitter      *string                    `json:"twitter"`
	Instagram    *string                    `json:"instagram"`
	Website      *string                    `json:"website"`
	Description  *string                    `json:"description"`
	Email        string                     `json:"email"`
	Phone        *string                    `json:"phone"`
	Logo         *string                    `json:"logo"`
	CreatedDate  time.Time                  `json:"created_date"`
	ModifiedDate time.Time                  `json:"modified_date"`
	Projects     []ProjectResponse          `json:"projects,omitempty"`
	Users        []OrganizationUserResponse `json:"users,omitempty"`
}

type ProjectResponse struct {
	ID             uuid.UUID        `json:"id"`
	Title          string           `json:"title"`
	Description    string           `json:"description"`
	Value          *decimal.Decimal `json:"value"`
	IsActive       bool             `json:"is_active"`
	IsComplete     bool             `json:"is_complete"`
	Address        *string          `json:"address"`
	OrganizationID uuid.UUID        `json:"organization_id"`
	CreatedDate    time.Time        `json:"created_date"`
	ModifiedDate   time.Time        `json:"modified_date"`
}

type ProjectFinancialStatusResponse struct {
	ID              uuid.UUID        `json:"id"`
	Title           string           `json:"title"`
	TargetAmount    *decimal.Decimal `json:"target_amount"`
	CollectedAmount decimal.Decimal  `json:"collected_amount"`
	TotalWaqfs      int64            `json:"total_waqfs"`
}

// Waqf Type responses
type WaqfTypeResponse struct {
	ID           uuid.UUID       `json:"id"`
	Name         string          `json:"name"`
	Description  *string         `json:"description"`
	FixedAmount  decimal.Decimal `json:"fixed_amount"`
	IsActive     bool            `json:"is_active"`
	CreatedDate  time.Time       `json:"created_date"`
	ModifiedDate time.Time       `json:"modified_date"`
}

// Waqf responses
type WaqfResponse struct {
	ID            uuid.UUID        `json:"id"`
	WaqfTypeID    uuid.UUID        `json:"waqf_type_id"`
	ProjectID     uuid.UUID        `json:"project_id"`
	NumberOfSaham int32            `json:"number_of_saham"`
	TotalAmount   *decimal.Decimal `json:"total_amount"`
	CreatedDate   time.Time        `json:"created_date"`
	ModifiedDate  time.Time        `json:"modified_date"`

	// Related data
	WaqfTypeName *string          `json:"waqf_type_name,omitempty"`
	ProjectTitle *string          `json:"project_title,omitempty"`
	FixedAmount  *decimal.Decimal `json:"fixed_amount,omitempty"`
}

// Payment responses
type PaymentTrackResponse struct {
	ID           uuid.UUID       `json:"id"`
	WaqfID       uuid.UUID       `json:"waqf_id"`
	Ref          string          `json:"ref"`
	TrackID      string          `json:"track_id"`
	TranID       *string         `json:"tran_id"`
	Amount       decimal.Decimal `json:"amount"`
	Result       *string         `json:"result"`
	ErrorText    *string         `json:"error_text"`
	OrderID      *int32          `json:"order_id"`
	StatusID     string          `json:"status_id"`
	CreatedDate  time.Time       `json:"created_date"`
	ModifiedDate time.Time       `json:"modified_date"`

	// Related data
	NumberOfSaham *int32           `json:"number_of_saham,omitempty"`
	WaqfAmount    *decimal.Decimal `json:"waqf_amount,omitempty"`
}

type PaymentConfigurationResponse struct {
	ID             uuid.UUID `json:"id"`
	OrganizationID uuid.UUID `json:"organization_id"`
	MerchantID     *string   `json:"merchant_id"`
	TerminalID     *string   `json:"terminal_id"`
	GatewayURL     *string   `json:"gateway_url"`
	IsActive       bool      `json:"is_active"`
	CreatedDate    time.Time `json:"created_date"`
	ModifiedDate   time.Time `json:"modified_date"`
}

// Dashboard responses
type DashboardReportResponse struct {
	TotalWaqfs    int64           `json:"total_waqfs"`
	TotalAmount   decimal.Decimal `json:"total_amount"`
	TotalProjects int64           `json:"total_projects"`
}

type WaqfTypeDonatedReportResponse struct {
	ID          uuid.UUID       `json:"id"`
	Name        string          `json:"name"`
	TotalWaqfs  int64           `json:"total_waqfs"`
	TotalAmount decimal.Decimal `json:"total_amount"`
}

type MonthlyDonationTrendResponse struct {
	Month       time.Time       `json:"month"`
	TotalWaqfs  int64           `json:"total_waqfs"`
	TotalAmount decimal.Decimal `json:"total_amount"`
}

// Donation responses
type DonationResponse struct {
	ID                   uuid.UUID       `json:"id"`
	ProjectID            uuid.UUID       `json:"project_id"`
	DonorName            string          `json:"donor_name"`
	DonorEmail           *string         `json:"donor_email"`
	DonorPhone           *string         `json:"donor_phone"`
	Amount               decimal.Decimal `json:"amount"`
	DonationType         *string         `json:"donation_type"`
	Message              *string         `json:"message"`
	RecipientName        *string         `json:"recipient_name"`
	RecipientEmail       *string         `json:"recipient_email"`
	RecipientPhone       *string         `json:"recipient_phone"`
	IsAnonymous          *bool           `json:"is_anonymous"`
	PaymentStatus        string          `json:"payment_status"`
	PaymentReference     *string         `json:"payment_reference"`
	PaymentTransactionID *string         `json:"payment_transaction_id"`
	CreatedDate          time.Time       `json:"created_date"`
	ModifiedDate         time.Time       `json:"modified_date"`
}

type DonationStatsResponse struct {
	TotalDonations int64           `json:"total_donations"`
	UniqueDonors   int64           `json:"unique_donors"`
	TotalAmount    decimal.Decimal `json:"total_amount"`
	AverageAmount  decimal.Decimal `json:"average_amount"`
}

type DonationTypesReportResponse struct {
	DonationType   string          `json:"donation_type"`
	TotalDonations int64           `json:"total_donations"`
	TotalAmount    decimal.Decimal `json:"total_amount"`
}
