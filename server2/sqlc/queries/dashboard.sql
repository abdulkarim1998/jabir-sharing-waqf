-- name: GetTotalDonationsReport :one
SELECT 
    COUNT(w.id) as total_waqfs,
    COALESCE(SUM(w.total_amount), 0) as total_amount,
    COUNT(DISTINCT w.project_id) as total_projects
FROM waqfs w
JOIN projects p ON w.project_id = p.id
WHERE p.is_active = true;

-- name: GetWaqfTypeDonatedReport :many
SELECT 
    wt.id,
    wt.name,
    COUNT(w.id) as total_waqfs,
    COALESCE(SUM(w.total_amount), 0) as total_amount
FROM waqf_types wt
LEFT JOIN waqfs w ON wt.id = w.waqf_type_id
WHERE wt.is_active = true
GROUP BY wt.id, wt.name
ORDER BY total_amount DESC;

-- name: GetOrganizationDashboardReport :one
SELECT 
    COUNT(DISTINCT p.id) as total_projects,
    COUNT(w.id) as total_waqfs,
    COALESCE(SUM(w.total_amount), 0) as total_donations
FROM organizations o
LEFT JOIN projects p ON o.id = p.organization_id AND p.is_active = true
LEFT JOIN waqfs w ON p.id = w.project_id
WHERE o.id = $1 AND o.is_active = true;

-- name: GetDashboardReportByDateRange :one
SELECT 
    COUNT(w.id) as total_waqfs,
    COALESCE(SUM(w.total_amount), 0) as total_amount,
    COUNT(DISTINCT w.project_id) as total_projects
FROM waqfs w
JOIN projects p ON w.project_id = p.id
WHERE p.is_active = true 
AND w.created_date >= $1 
AND w.created_date <= $2;

-- name: GetMonthlyDonationTrend :many
SELECT 
    DATE_TRUNC('month', w.created_date) as month,
    COUNT(w.id) as total_waqfs,
    COALESCE(SUM(w.total_amount), 0) as total_amount
FROM waqfs w
JOIN projects p ON w.project_id = p.id
WHERE p.is_active = true 
AND w.created_date >= $1 
AND w.created_date <= $2
GROUP BY DATE_TRUNC('month', w.created_date)
ORDER BY month;
