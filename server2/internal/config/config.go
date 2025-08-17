package config

import (
	"os"
	"strconv"
)

type Config struct {
	Database DatabaseConfig
	Server   ServerConfig
	Auth     AuthConfig
}

type DatabaseConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
	SSLMode  string
}

type ServerConfig struct {
	Port string
	Env  string
}

type AuthConfig struct {
	KeycloakURL  string
	Realm        string
	ClientID     string
	ClientSecret string
	JWTSecret    string
	TokenURL     string
}

func Load() *Config {
	return &Config{
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "db"),
			Port:     getEnvAsInt("DB_PORT", 5432),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "123456"),
			DBName:   getEnv("DB_NAME", "postgres"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		Server: ServerConfig{
			Port: getEnv("PORT", "8081"),
			Env:  getEnv("APP_ENV", "development"),
		},
		Auth: AuthConfig{
			KeycloakURL:  getEnv("KEYCLOAK_URL", "https://keycloak-02.rihal.tech"),
			Realm:        getEnv("KEYCLOAK_REALM", "apps"),
			ClientID:     getEnv("KEYCLOAK_CLIENT_ID", "jw-app"),
			ClientSecret: getEnv("KEYCLOAK_CLIENT_SECRET", "Ou2YGQbmyX8gIca6av4N9voTLTJcOf1i"),
			JWTSecret:    getEnv("JWT_SECRET", "your-secret-key"),
			TokenURL:     getEnv("KEYCLOAK_TOKEN_URL", "https://keycloak-02.rihal.tech/auth/realms/apps/protocol/openid-connect/token"),
		},
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(name string, defaultVal int) int {
	valueStr := getEnv(name, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultVal
}
