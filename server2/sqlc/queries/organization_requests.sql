-- name: CreateOrganizationRequest :one
INSERT INTO organization_requests (
    name,
    phone,
    cr,
    description
) VALUES (
    $1, $2, $3, $4
) RETURNING *;

-- name: GetOrganizationRequestByID :one
SELECT * FROM organization_requests
WHERE id = $1;

-- name: ListOrganizationRequests :many
SELECT * FROM organization_requests
ORDER BY created_date DESC;

-- name: ListOrganizationRequestsByStatus :many
SELECT * FROM organization_requests
WHERE status = $1
ORDER BY created_date DESC;

-- name: UpdateOrganizationRequestStatus :one
UPDATE organization_requests
SET status = $1, modified_date = NOW()
WHERE id = $2
RETURNING *;

-- name: CreateOrganizationRequestDocument :one
INSERT INTO organization_request_documents (
    request_id,
    document_path
) VALUES (
    $1, $2
) RETURNING *;

-- name: GetOrganizationRequestDocuments :many
SELECT * FROM organization_request_documents
WHERE request_id = $1
ORDER BY created_date;

-- name: DeleteOrganizationRequestDocument :exec
DELETE FROM organization_request_documents
WHERE id = $1;


