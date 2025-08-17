-- name: GetProjectByID :one
SELECT * FROM projects WHERE id = $1 AND is_active = true LIMIT 1;

-- name: ListProjects :many
SELECT * FROM projects WHERE is_active = true ORDER BY created_date DESC;

-- name: GetProjectsByOrganizationID :many
SELECT * FROM projects 
WHERE organization_id = $1 AND is_active = true 
ORDER BY created_date DESC;

-- name: CreateProject :one
INSERT INTO projects (
    title, description, value, address, organization_id
) VALUES (
    $1, $2, $3, $4, $5
) RETURNING *;

-- name: UpdateProject :one
UPDATE projects SET
    title = $2,
    description = $3,
    value = $4,
    address = $5,
    is_complete = $6,
    modified_date = NOW()
WHERE id = $1 AND is_active = true
RETURNING *;

-- name: DeleteProject :exec
UPDATE projects SET 
    is_active = false,
    modified_date = NOW()
WHERE id = $1;

-- name: GetProjectFinancialStatus :one
SELECT 
    p.id,
    p.title,
    p.value as target_amount,
    COALESCE(SUM(d.amount), 0) as collected_amount,
    COUNT(d.id) as total_donations
FROM projects p
LEFT JOIN donations d ON p.id = d.project_id AND d.payment_status = 'Completed'
WHERE p.id = $1 AND p.is_active = true
GROUP BY p.id, p.title, p.value;

-- name: GetProjectCountByOrganizationID :one
SELECT COUNT(*) as project_count
FROM projects 
WHERE organization_id = $1 AND is_active = true;
