-- name: GetWaqfTypeByID :one
SELECT * FROM waqf_types WHERE id = $1 AND is_active = true LIMIT 1;

-- name: ListWaqfTypes :many
SELECT * FROM waqf_types WHERE is_active = true ORDER BY name;

-- name: CreateWaqfType :one
INSERT INTO waqf_types (
    name, description, fixed_amount
) VALUES (
    $1, $2, $3
) RETURNING *;

-- name: UpdateWaqfType :one
UPDATE waqf_types SET
    name = $2,
    description = $3,
    fixed_amount = $4,
    modified_date = NOW()
WHERE id = $1 AND is_active = true
RETURNING *;

-- name: DeleteWaqfType :exec
UPDATE waqf_types SET 
    is_active = false,
    modified_date = NOW()
WHERE id = $1;
