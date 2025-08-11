-- Insert default admin user
INSERT INTO users (id, keycloak_id, email, first_name, last_name, created_date, modified_date)
VALUES (
    uuid_generate_v4(),
    uuid_generate_v4(),
    'admin@waqf.om',
    'Admin',
    'Waqf',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert default roles
INSERT INTO roles (id, name, description, created_by_id, modified_by_id, created_date, modified_date)
VALUES 
    (
        uuid_generate_v4(),
        'Admin',
        'System Administrator with full access',
        (SELECT id FROM users WHERE email = 'admin@waqf.om'),
        (SELECT id FROM users WHERE email = 'admin@waqf.om'),
        NOW(),
        NOW()
    ),
    (
        uuid_generate_v4(),
        'OrganizationAdmin',
        'Organization Administrator',
        (SELECT id FROM users WHERE email = 'admin@waqf.om'),
        (SELECT id FROM users WHERE email = 'admin@waqf.om'),
        NOW(),
        NOW()
    )
ON CONFLICT (name) DO NOTHING;

-- Assign admin user to admin role
INSERT INTO user_roles (user_id, role_id, created_by_id, modified_by_id, created_date, modified_date)
SELECT 
    u.id,
    r.id,
    u.id,
    u.id,
    NOW(),
    NOW()
FROM users u, roles r
WHERE u.email = 'admin@waqf.om' AND r.name = 'Admin'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Insert all permissions for Admin role
INSERT INTO permissions (role_id, resource, scope, created_by_id, modified_by_id, created_date, modified_date)
SELECT 
    r.id,
    resource_enum.resource,
    scope_enum.scope,
    u.id,
    u.id,
    NOW(),
    NOW()
FROM roles r
CROSS JOIN (
    SELECT unnest(enum_range(NULL::permission_resource)) AS resource
) resource_enum
CROSS JOIN (
    SELECT unnest(enum_range(NULL::permission_scope)) AS scope
) scope_enum
CROSS JOIN users u
WHERE r.name = 'Admin' AND u.email = 'admin@waqf.om'
ON CONFLICT (role_id, resource, scope) DO NOTHING;
