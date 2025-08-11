-- Remove all permissions for admin role
DELETE FROM permissions WHERE role_id IN (SELECT id FROM roles WHERE name = 'Admin');

-- Remove user role assignments
DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE email = 'admin@waqf.om');

-- Remove default roles
DELETE FROM roles WHERE name IN ('Admin', 'OrganizationAdmin');

-- Remove admin user
DELETE FROM users WHERE email = 'admin@waqf.om';
