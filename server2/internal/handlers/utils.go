package handlers

import (
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/shopspring/decimal"
)

// Helper function to convert pgtype.UUID to uuid.UUID
func pgUUIDToUUID(pgUUID pgtype.UUID) uuid.UUID {
	if !pgUUID.Valid {
		return uuid.Nil
	}
	return pgUUID.Bytes
}

// Helper function to convert pgtype.Numeric to decimal.Decimal
func pgNumericToDecimal(pgNum pgtype.Numeric) decimal.Decimal {
	if !pgNum.Valid {
		return decimal.Zero
	}
	// Convert to float64 first, then to decimal
	f64, err := pgNum.Float64Value()
	if err != nil {
		return decimal.Zero
	}
	return decimal.NewFromFloat(f64.Float64)
}

// Helper function to convert uuid.UUID to pgtype.UUID
func uuidToPgUUID(u uuid.UUID) pgtype.UUID {
	var pgUUID pgtype.UUID
	pgUUID.Scan(u)
	return pgUUID
}

// Helper function to convert decimal.Decimal to pgtype.Numeric
func decimalToPgNumeric(d decimal.Decimal) pgtype.Numeric {
	var pgNum pgtype.Numeric
	pgNum.Scan(d.String())
	return pgNum
}

// Helper function to convert interface{} to decimal.Decimal
func interfaceToDecimal(val interface{}) decimal.Decimal {
	if val == nil {
		return decimal.Zero
	}

	switch v := val.(type) {
	case string:
		if d, err := decimal.NewFromString(v); err == nil {
			return d
		}
	case float64:
		return decimal.NewFromFloat(v)
	case int64:
		return decimal.NewFromInt(v)
	}

	return decimal.Zero
}
