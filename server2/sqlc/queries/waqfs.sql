-- name: GetWaqfByID :one
SELECT * FROM waqfs WHERE id = $1 LIMIT 1;

-- name: ListWaqfs :many
SELECT 
    w.*,
    wt.name as waqf_type_name,
    wt.fixed_amount,
    p.title as project_title
FROM waqfs w
JOIN waqf_types wt ON w.waqf_type_id = wt.id
JOIN projects p ON w.project_id = p.id
ORDER BY w.created_date DESC;

-- name: CreateWaqf :one
INSERT INTO waqfs (
    waqf_type_id, project_id, number_of_saham
) VALUES (
    $1, $2, $3
) RETURNING *;

-- name: GetWaqfsByProjectID :many
SELECT 
    w.*,
    wt.name as waqf_type_name,
    wt.fixed_amount
FROM waqfs w
JOIN waqf_types wt ON w.waqf_type_id = wt.id
WHERE w.project_id = $1
ORDER BY w.created_date DESC;
