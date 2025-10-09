package payment

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"io"
	"net/url"
	"time"
)

// SIPGService handles SIPG payment gateway operations
type SIPGService struct {
	config *SIPGConfig
}

// SIPGConfig contains SIPG payment gateway configuration
type SIPGConfig struct {
	MerchantID  string
	AccessCode  string
	WorkingKey  string
	GatewayURL  string
	RedirectURL string
	CancelURL   string
}

// NewSIPGService creates a new SIPG payment service instance
func NewSIPGService(config *SIPGConfig) (*SIPGService, error) {
	if err := validateConfig(config); err != nil {
		return nil, fmt.Errorf("invalid SIPG configuration: %w", err)
	}

	return &SIPGService{
		config: config,
	}, nil
}

// validateConfig validates the SIPG configuration
func validateConfig(config *SIPGConfig) error {
	if config.MerchantID == "" {
		return fmt.Errorf("merchant ID is required")
	}
	if config.AccessCode == "" {
		return fmt.Errorf("access code is required")
	}
	if config.WorkingKey == "" {
		return fmt.Errorf("working key is required")
	}
	if len(config.WorkingKey) != 32 {
		return fmt.Errorf("working key must be exactly 32 characters, got %d", len(config.WorkingKey))
	}
	if config.GatewayURL == "" {
		return fmt.Errorf("gateway URL is required")
	}
	if config.RedirectURL == "" {
		return fmt.Errorf("redirect URL is required")
	}
	if config.CancelURL == "" {
		return fmt.Errorf("cancel URL is required")
	}
	return nil
}

// PaymentRequest represents a payment request to SIPG
type PaymentRequest struct {
	OrderID        string
	Currency       string
	Amount         string
	BillingName    string
	BillingTel     string
	BillingEmail   string
	BillingAddress string
	BillingCity    string
	BillingState   string
	BillingZip     string
	BillingCountry string
}

// PaymentResponse contains the generated payment URL and encrypted request
type PaymentResponse struct {
	PaymentURL       string
	EncryptedRequest string
	OrderID          string
}

// GeneratePaymentURL creates an encrypted payment request and returns the payment URL
func (s *SIPGService) GeneratePaymentURL(req *PaymentRequest) (*PaymentResponse, error) {
	// Generate unique order ID if not provided
	if req.OrderID == "" {
		req.OrderID = fmt.Sprintf("ORD%d", time.Now().Unix())
	}

	// Build request parameters
	values := url.Values{}
	values.Add("merchant_id", s.config.MerchantID)
	values.Add("order_id", req.OrderID)
	values.Add("currency", req.Currency)
	values.Add("amount", req.Amount)
	values.Add("redirect_url", s.config.RedirectURL)
	values.Add("cancel_url", s.config.CancelURL)
	values.Add("billing_name", req.BillingName)
	values.Add("billing_tel", req.BillingTel)
	values.Add("billing_email", req.BillingEmail)
	values.Add("billing_address", req.BillingAddress)
	values.Add("billing_city", req.BillingCity)
	values.Add("billing_state", req.BillingState)
	values.Add("billing_zip", req.BillingZip)
	values.Add("billing_country", req.BillingCountry)

	requestString := values.Encode()

	// Encrypt the request
	encryptedRequest, err := s.encrypt(requestString)
	if err != nil {
		return nil, fmt.Errorf("failed to encrypt request: %w", err)
	}

	// Build the payment URL
	paymentURL := fmt.Sprintf("%s&access_code=%s&encRequest=%s",
		s.config.GatewayURL,
		url.QueryEscape(s.config.AccessCode),
		url.QueryEscape(encryptedRequest),
	)

	return &PaymentResponse{
		PaymentURL:       paymentURL,
		EncryptedRequest: encryptedRequest,
		OrderID:          req.OrderID,
	}, nil
}

// DecryptResponse decrypts the response received from SIPG gateway
func (s *SIPGService) DecryptResponse(encryptedResponse string) (map[string]string, error) {
	// Decrypt the response
	decrypted, err := s.decrypt(encryptedResponse)
	if err != nil {
		return nil, fmt.Errorf("failed to decrypt response: %w", err)
	}

	// Parse the decrypted response
	values, err := url.ParseQuery(decrypted)
	if err != nil {
		return nil, fmt.Errorf("failed to parse decrypted response: %w", err)
	}

	// Convert to map
	result := make(map[string]string)
	for key, value := range values {
		if len(value) > 0 {
			result[key] = value[0]
		}
	}

	return result, nil
}

// encrypt encrypts plaintext using AES-256-GCM
func (s *SIPGService) encrypt(plainText string) (string, error) {
	key := s.config.WorkingKey

	if len(key) != 32 {
		return "", fmt.Errorf("key must be exactly 32 characters")
	}

	block, err := aes.NewCipher([]byte(key))
	if err != nil {
		return "", err
	}

	// Create GCM mode with 16-byte nonce size (SIPG requirement)
	aesgcm, err := cipher.NewGCMWithNonceSize(block, 16)
	if err != nil {
		return "", err
	}

	// Generate random 16-byte IV/nonce
	nonce := make([]byte, 16)
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	// Encrypt the data
	ciphertext := aesgcm.Seal(nil, nonce, []byte(plainText), nil)

	// Format: hex(nonce) + hex(ciphertext+tag)
	encryptedText := hex.EncodeToString(nonce) + hex.EncodeToString(ciphertext)

	return encryptedText, nil
}

// decrypt decrypts ciphertext using AES-256-GCM
func (s *SIPGService) decrypt(encryptedText string) (string, error) {
	key := s.config.WorkingKey

	if len(key) != 32 {
		return "", fmt.Errorf("key must be exactly 32 characters")
	}

	// Decode hex string
	encData, err := hex.DecodeString(encryptedText)
	if err != nil {
		return "", err
	}

	// Extract nonce (first 16 bytes)
	if len(encData) < 16 {
		return "", fmt.Errorf("encrypted data too short")
	}

	nonce := encData[:16]
	ciphertext := encData[16:]

	// Create cipher block
	block, err := aes.NewCipher([]byte(key))
	if err != nil {
		return "", err
	}

	// Create GCM mode with 16-byte nonce size
	aesgcm, err := cipher.NewGCMWithNonceSize(block, 16)
	if err != nil {
		return "", err
	}

	// Decrypt
	plaintext, err := aesgcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}

// GetConfig returns the current SIPG configuration (useful for debugging)
func (s *SIPGService) GetConfig() *SIPGConfig {
	return s.config
}
