-- name: GetPaymentTrackByID :one
SELECT * FROM payment_tracks WHERE id = $1 LIMIT 1;

-- name: GetPaymentTrackByTrackID :one
SELECT * FROM payment_tracks WHERE track_id = $1 LIMIT 1;

-- name: ListPaymentTracks :many
SELECT 
    pt.*,
    w.number_of_saham,
    w.total_amount as waqf_amount
FROM payment_tracks pt
JOIN waqfs w ON pt.waqf_id = w.id
ORDER BY pt.created_date DESC;

-- name: CreatePaymentTrack :one
INSERT INTO payment_tracks (
    waqf_id, ref, track_id, amount, status_id
) VALUES (
    $1, $2, $3, $4, $5
) RETURNING *;

-- name: UpdatePaymentStatus :one
UPDATE payment_tracks SET
    tran_id = $2,
    result = $3,
    error_text = $4,
    order_id = $5,
    status_id = $6,
    modified_date = NOW()
WHERE track_id = $1
RETURNING *;

-- name: GetPaymentsByWaqfID :many
SELECT * FROM payment_tracks 
WHERE waqf_id = $1 
ORDER BY created_date DESC;

-- name: GetPaymentConfigurationByOrganizationID :one
SELECT * FROM payment_configurations 
WHERE organization_id = $1 AND is_active = true 
LIMIT 1;

-- name: CreatePaymentConfiguration :one
INSERT INTO payment_configurations (
    organization_id, merchant_id, terminal_id, gateway_url
) VALUES (
    $1, $2, $3, $4
) RETURNING *;

-- name: UpdatePaymentConfiguration :one
UPDATE payment_configurations SET
    merchant_id = $2,
    terminal_id = $3,
    gateway_url = $4,
    modified_date = NOW()
WHERE organization_id = $1 AND is_active = true
RETURNING *;
