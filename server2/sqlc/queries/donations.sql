-- name: GetDonationsByProjectID :many
SELECT * FROM donations 
WHERE project_id = $1 
ORDER BY created_date DESC;

-- name: GetDonationsByOrganizationID :many
SELECT d.* FROM donations d
JOIN projects p ON d.project_id = p.id
WHERE p.organization_id = $1
ORDER BY d.created_date DESC;

-- name: GetDonationByID :one
SELECT * FROM donations WHERE id = $1 LIMIT 1;

-- name: CreateDonation :one
INSERT INTO donations (
    project_id, donor_name, donor_email, donor_phone, amount, 
    donation_type, message, recipient_name, recipient_email, 
    recipient_phone, is_anonymous, payment_status, payment_reference
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
) RETURNING *;

-- name: UpdateDonationPaymentStatus :one
UPDATE donations SET
    payment_status = $2,
    payment_transaction_id = $3,
    modified_date = NOW()
WHERE id = $1
RETURNING *;

-- name: GetProjectDonationStats :one
SELECT 
    COUNT(*) as total_donations,
    COUNT(DISTINCT donor_email) as unique_donors,
    COALESCE(SUM(amount), 0) as total_amount,
    COALESCE(AVG(amount), 0) as average_amount
FROM donations 
WHERE project_id = $1 AND payment_status = 'Completed';

-- name: GetOrganizationDonationStats :one
SELECT 
    COUNT(d.*) as total_donations,
    COUNT(DISTINCT d.donor_email) as unique_donors,
    COALESCE(SUM(d.amount), 0) as total_amount,
    COALESCE(AVG(d.amount), 0) as average_amount
FROM donations d
JOIN projects p ON d.project_id = p.id
WHERE p.organization_id = $1 AND d.payment_status = 'Completed';

-- name: GetTopDonorsByProject :many
SELECT 
    donor_name,
    donor_email,
    SUM(amount) as total_donated,
    COUNT(*) as donation_count
FROM donations
WHERE project_id = $1 AND payment_status = 'Completed'
GROUP BY donor_name, donor_email
ORDER BY total_donated DESC
LIMIT $2;

-- name: GetTopDonorsByOrganization :many
SELECT 
    d.donor_name,
    d.donor_email,
    SUM(d.amount) as total_donated,
    COUNT(*) as donation_count
FROM donations d
JOIN projects p ON d.project_id = p.id
WHERE p.organization_id = $1 AND d.payment_status = 'Completed'
GROUP BY d.donor_name, d.donor_email
ORDER BY total_donated DESC
LIMIT $2;
