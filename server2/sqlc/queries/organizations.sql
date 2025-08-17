-- name: GetOrganizationByID :one
SELECT * FROM organizations WHERE id = $1 AND is_active = true LIMIT 1;

-- name: ListOrganizations :many
SELECT * FROM organizations WHERE is_active = true ORDER BY name;

-- name: CreateOrganization :one
INSERT INTO organizations (
    name, location, twitter, instagram, website, description, 
    email, phone, logo
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9
) RETURNING *;

-- name: UpdateOrganization :one
UPDATE organizations SET
    name = $2,
    location = $3,
    twitter = $4,
    instagram = $5,
    website = $6,
    description = $7,
    email = $8,
    phone = $9,
    logo = $10,
    modified_date = NOW()
WHERE id = $1 AND is_active = true
RETURNING *;

-- name: DeleteOrganization :exec
UPDATE organizations SET 
    is_active = false,
    modified_date = NOW()
WHERE id = $1;

-- name: GetOrganizationProjectCount :one
SELECT COUNT(*) as count FROM projects 
WHERE organization_id = $1 AND is_active = true;

-- name: GetOrganizationProjectsTotalValue :one
SELECT COALESCE(SUM(value), 0) as total_value FROM projects 
WHERE organization_id = $1 AND is_active = true;

-- name: GetOrganizationDonorsCount :one
SELECT COUNT(DISTINCT donor_name) as count FROM waqfs w
JOIN projects p ON w.project_id = p.id
WHERE p.organization_id = $1;

-- name: GetOrganizationTotalDonations :one
SELECT COALESCE(SUM(w.total_amount), 0) as total_donations FROM waqfs w
JOIN projects p ON w.project_id = p.id
WHERE p.organization_id = $1;


