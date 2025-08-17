-- name: GetTotalDonationsReport :one
SELECT 
    COUNT(d.id) as total_waqfs,
    COALESCE(SUM(d.amount), 0) as total_amount,
    COUNT(DISTINCT d.project_id) as total_projects
FROM donations d
JOIN projects p ON d.project_id = p.id
WHERE p.is_active = true AND d.payment_status = 'Completed';

-- name: GetDonationTypesReport :many
SELECT 
    d.donation_type,
    COUNT(d.id) as total_donations,
    COALESCE(SUM(d.amount), 0) as total_amount
FROM donations d
JOIN projects p ON d.project_id = p.id
WHERE d.payment_status = 'Completed' AND p.is_active = true
GROUP BY d.donation_type
ORDER BY total_amount DESC;

-- name: GetOrganizationDashboardReport :one
SELECT 
    COUNT(DISTINCT p.id) as total_projects,
    COUNT(d.id) as total_waqfs,
    COALESCE(SUM(d.amount), 0) as total_donations
FROM organizations o
LEFT JOIN projects p ON o.id = p.organization_id AND p.is_active = true
LEFT JOIN donations d ON p.id = d.project_id AND d.payment_status = 'Completed'
WHERE o.id = $1 AND o.is_active = true;

-- name: GetDashboardReportByDateRange :one
SELECT 
    COUNT(d.id) as total_waqfs,
    COALESCE(SUM(d.amount), 0) as total_amount,
    COUNT(DISTINCT d.project_id) as total_projects
FROM donations d
JOIN projects p ON d.project_id = p.id
WHERE p.is_active = true 
AND d.payment_status = 'Completed'
AND d.created_date >= $1 
AND d.created_date <= $2;

-- name: GetMonthlyDonationTrend :many
SELECT 
    DATE_TRUNC('month', d.created_date) as month,
    COUNT(d.id) as total_waqfs,
    COALESCE(SUM(d.amount), 0) as total_amount
FROM donations d
JOIN projects p ON d.project_id = p.id
WHERE p.is_active = true 
AND d.payment_status = 'Completed'
AND d.created_date >= $1 
AND d.created_date <= $2
GROUP BY DATE_TRUNC('month', d.created_date)
ORDER BY month;
