-- ============================================================================
-- Seed Data for Jabir Waqf Platform
-- ============================================================================
-- This file contains sample data for testing and development
-- Run this AFTER the main schema migration (001_complete_schema.up.sql)
-- ============================================================================

-- ============================================================================
-- SYSTEM USERS AND ROLES
-- ============================================================================

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

-- ============================================================================
-- SAMPLE ORGANIZATIONS
-- ============================================================================

INSERT INTO organizations (id, name, location, email, phone, description, website, twitter, instagram, logo)
VALUES 
    (
        '3028b3a0-4d2c-439e-ae83-1de8c4d1c788',
        'جمعية الخير الوقفية',
        'مسقط، عمان',
        'info@khair.om',
        '+96899123456',
        'جمعية خيرية تهدف إلى خدمة المجتمع من خلال المشاريع الوقفية',
        'https://khair.om',
        'https://twitter.com/khair_om',
        'https://instagram.com/khair_waqf',
        'https://example.com/logo.png'
    ),
    (
        '5c9490f0-68c9-4969-8663-ad90395f4acd',
        'مؤسسة البر والإحسان',
        'صلالة، عمان',
        'info@bir.om',
        '+96899654321',
        'مؤسسة خيرية تعمل على تطوير المجتمع من خلال مشاريع البر والإحسان',
        'https://bir.om',
        'https://twitter.com/bir_om',
        'https://instagram.com/bir_om',
        'https://example.com/bir-logo.png'
    )
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- SAMPLE PROJECTS
-- ============================================================================

INSERT INTO projects (id, title, description, value, address, organization_id)
VALUES 
    (
        '6a5763c2-549b-4fcf-8911-2aa1f0c4ba21',
        'مشروع بناء مسجد الهداية',
        'مشروع خيري لبناء مسجد في منطقة الهداية لخدمة المجتمع المحلي',
        50000.00,
        'منطقة الهداية، مسقط',
        '3028b3a0-4d2c-439e-ae83-1de8c4d1c788'
    ),
    (
        uuid_generate_v4(),
        'مشروع مدرسة تحفيظ القرآن',
        'إنشاء مدرسة لتحفيظ القرآن الكريم للأطفال والشباب',
        75000.00,
        'الخوض، مسقط',
        '3028b3a0-4d2c-439e-ae83-1de8c4d1c788'
    ),
    (
        uuid_generate_v4(),
        'مشروع مركز طبي خيري',
        'إقامة مركز طبي خيري لخدمة المحتاجين في المنطقة',
        120000.00,
        'صلالة المركز',
        '5c9490f0-68c9-4969-8663-ad90395f4acd'
    );

-- ============================================================================
-- SAMPLE DONATIONS
-- ============================================================================

-- Donations for the first project (مشروع بناء مسجد الهداية)
INSERT INTO donations (project_id, donor_name, donor_email, donor_phone, amount, donation_type, payment_status, message)
VALUES 
    (
        '6a5763c2-549b-4fcf-8911-2aa1f0c4ba21',
        'محمد أحمد السالمي',
        'mohammed.salmi@example.com',
        '+96899111111',
        500.00,
        'regular',
        'Completed',
        'بارك الله فيكم على هذا المشروع المبارك'
    ),
    (
        '6a5763c2-549b-4fcf-8911-2aa1f0c4ba21',
        'فاطمة علي البلوشي',
        'fatima.balushi@example.com',
        '+96899222222',
        750.00,
        'regular',
        'Completed',
        'جعله الله في ميزان حسناتكم'
    ),
    (
        '6a5763c2-549b-4fcf-8911-2aa1f0c4ba21',
        'عبدالله سعيد الهنائي',
        'abdullah.hinai@example.com',
        '+96899333333',
        1000.00,
        'gift',
        'Completed',
        'هدية لوالدي رحمه الله'
    ),
    (
        '6a5763c2-549b-4fcf-8911-2aa1f0c4ba21',
        'مانح مجهول',
        null,
        null,
        300.00,
        'anonymous',
        'Completed',
        null
    );

-- Additional donations for other projects
INSERT INTO donations (project_id, donor_name, donor_email, amount, donation_type, payment_status)
SELECT 
    p.id,
    'سعد محمد الشعيبي',
    'saad.shuaibi@example.com',
    2000.00,
    'regular',
    'Completed'
FROM projects p 
WHERE p.title = 'مشروع مدرسة تحفيظ القرآن';

INSERT INTO donations (project_id, donor_name, donor_email, amount, donation_type, payment_status)
SELECT 
    p.id,
    'أمينة سالم الرواحي',
    'amina.rawahi@example.com',
    1500.00,
    'regular',
    'Completed'
FROM projects p 
WHERE p.title = 'مشروع مركز طبي خيري';

-- ============================================================================
-- SAMPLE PAYMENT CONFIGURATIONS
-- ============================================================================

INSERT INTO payment_configurations (organization_id, merchant_id, terminal_id, gateway_url)
VALUES 
    (
        '3028b3a0-4d2c-439e-ae83-1de8c4d1c788',
        'MERCHANT_001',
        'TERMINAL_001',
        'https://payment-gateway.example.com'
    ),
    (
        '5c9490f0-68c9-4969-8663-ad90395f4acd',
        'MERCHANT_002',
        'TERMINAL_002',
        'https://payment-gateway.example.com'
    );

-- ============================================================================
-- VERIFICATION QUERIES (OPTIONAL - FOR TESTING)
-- ============================================================================

-- Uncomment the following queries to verify the seed data was inserted correctly:

/*
-- Check organizations
SELECT 'Organizations Count:' as info, COUNT(*) as count FROM organizations;

-- Check projects
SELECT 'Projects Count:' as info, COUNT(*) as count FROM projects;

-- Check donations
SELECT 'Donations Count:' as info, COUNT(*) as count FROM donations;

-- Check total donation amounts by project
SELECT 
    p.title,
    COUNT(d.id) as donation_count,
    SUM(d.amount) as total_amount,
    COUNT(DISTINCT d.donor_email) as unique_donors
FROM projects p
LEFT JOIN donations d ON p.id = d.project_id AND d.payment_status = 'Completed'
GROUP BY p.id, p.title
ORDER BY total_amount DESC;

-- Check users and roles
SELECT 'Users Count:' as info, COUNT(*) as count FROM users;
SELECT 'Roles Count:' as info, COUNT(*) as count FROM roles;
SELECT 'Permissions Count:' as info, COUNT(*) as count FROM permissions;
*/
