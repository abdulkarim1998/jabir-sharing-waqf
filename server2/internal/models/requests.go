package models

import (
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

// Role requests
type CreateRoleRequest struct {
	Name        string `json:"name" validate:"required"`
	Description string `json:"description"`
}

type UpdateRoleRequest struct {
	Name        string `json:"name" validate:"required"`
	Description string `json:"description"`
}

// Permission requests
type CreatePermissionRequest struct {
	RoleID   uuid.UUID `json:"role_id" validate:"required"`
	Resource string    `json:"resource" validate:"required"`
	Scope    string    `json:"scope" validate:"required"`
}

// User Role requests
type CreateUserRoleRequest struct {
	UserID uuid.UUID `json:"user_id" validate:"required"`
	RoleID uuid.UUID `json:"role_id" validate:"required"`
}

// Organization requests
type CreateOrganizationRequest struct {
	Name        string `json:"name" validate:"required,max=200"`
	Location    string `json:"location"`
	Twitter     string `json:"twitter" validate:"omitempty,url"`
	Instagram   string `json:"instagram" validate:"omitempty,url"`
	Website     string `json:"website" validate:"omitempty,url"`
	Description string `json:"description" validate:"max=1000"`
	Email       string `json:"email" validate:"required,email"`
	Phone       string `json:"phone"`
	Logo        string `json:"logo" validate:"omitempty,url"`
}

type UpdateOrganizationRequest struct {
	Name        string `json:"name" validate:"required,max=200"`
	Location    string `json:"location"`
	Twitter     string `json:"twitter" validate:"omitempty,url"`
	Instagram   string `json:"instagram" validate:"omitempty,url"`
	Website     string `json:"website" validate:"omitempty,url"`
	Description string `json:"description" validate:"max=1000"`
	Email       string `json:"email" validate:"required,email"`
	Phone       string `json:"phone"`
	Logo        string `json:"logo" validate:"omitempty,url"`
}

type CreateOrganizationUserRequest struct {
	KeycloakID uuid.UUID `json:"keycloak_id" validate:"required"`
	Email      string    `json:"email" validate:"required,email"`
	FirstName  string    `json:"first_name" validate:"required"`
	LastName   string    `json:"last_name" validate:"required"`
}

type UpdateOrganizationUserRequest struct {
	Email     string `json:"email" validate:"required,email"`
	FirstName string `json:"first_name" validate:"required"`
	LastName  string `json:"last_name" validate:"required"`
}

// Project requests
type CreateProjectRequest struct {
	Title          string          `json:"title" validate:"required,max=200"`
	Description    string          `json:"description" validate:"required,max=1000"`
	Value          decimal.Decimal `json:"value" validate:"required,gt=0"`
	Address        string          `json:"address" validate:"max=500"`
	OrganizationID uuid.UUID       `json:"organization_id" validate:"required"`
}

type UpdateProjectRequest struct {
	Title       string          `json:"title" validate:"required,max=200"`
	Description string          `json:"description" validate:"required,max=1000"`
	Value       decimal.Decimal `json:"value" validate:"required,gt=0"`
	Address     string          `json:"address" validate:"max=500"`
	IsComplete  bool            `json:"is_complete"`
}

// Waqf Type requests
type CreateWaqfTypeRequest struct {
	Name        string          `json:"name" validate:"required"`
	Description string          `json:"description"`
	FixedAmount decimal.Decimal `json:"fixed_amount" validate:"required,gt=0"`
}

type UpdateWaqfTypeRequest struct {
	Name        string          `json:"name" validate:"required"`
	Description string          `json:"description"`
	FixedAmount decimal.Decimal `json:"fixed_amount" validate:"required,gt=0"`
}

// Waqf requests
type CreateWaqfRequest struct {
	WaqfTypeID    uuid.UUID           `json:"waqf_type_id" validate:"required"`
	ProjectID     uuid.UUID           `json:"project_id" validate:"required"`
	NumberOfSaham int32               `json:"number_of_saham" validate:"required,gt=0"`
	GiftDetails   *GiftDetailsRequest `json:"gift_details,omitempty"`
}

type GiftDetailsRequest struct {
	RecipientName  string `json:"recipient_name"`
	RecipientEmail string `json:"recipient_email" validate:"omitempty,email"`
	Message        string `json:"message"`
	IsAnonymous    bool   `json:"is_anonymous"`
}

// Payment requests
type UpdatePaymentStatusRequest struct {
	TrackID   string `json:"track_id" validate:"required"`
	TranID    string `json:"tran_id"`
	Result    string `json:"result"`
	ErrorText string `json:"error_text"`
	OrderID   int32  `json:"order_id"`
	Status    string `json:"status" validate:"required"`
}

type CreatePaymentConfigurationRequest struct {
	OrganizationID uuid.UUID `json:"organization_id" validate:"required"`
	MerchantID     string    `json:"merchant_id"`
	TerminalID     string    `json:"terminal_id"`
	GatewayURL     string    `json:"gateway_url" validate:"omitempty,url"`
}
