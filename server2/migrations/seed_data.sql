-- ============================================================================
-- SAMPLE ORGANIZATIONS
-- ============================================================================

INSERT INTO organizations (id, name, location, email, phone, description, website, twitter, instagram, logo, image)
VALUES 
    (
        '3028b3a0-4d2c-439e-ae83-1de8c4d1c788',
        'جمعية الخير الوقفية',
        'مسقط، عمان',
        'info@khair.om',
        '+96899123456',
        'جمعية خيرية تهدف إلى خدمة المجتمع من خلال المشاريع الوقفية المتنوعة والشاملة',
        'https://khair.om',
        'https://twitter.com/khair_om',
        'https://instagram.com/khair_waqf',
        'organization/khair-logo.png',
        'organization/khair-image.jpg'
    ),
    (
        '5c9490f0-68c9-4969-8663-ad90395f4acd',
        'مؤسسة البر والإحسان',
        'صلالة، عمان',
        'info@bir.om',
        '+96899654321',
        'مؤسسة خيرية تعمل على تطوير المجتمع من خلال مشاريع البر والإحسان والتنمية المستدامة',
        'https://bir.om',
        'https://twitter.com/bir_om',
        'https://instagram.com/bir_om',
        'organization/bir-logo.png',
        'organization/bir-image.jpg'
    ),
    (
        '7d8e2f90-98a1-4b6c-9f7e-12345abcdef0',
        'مؤسسة نزوى الخيرية',
        'نزوى، عمان',
        'info@nizwa.om',
        '+96899777888',
        'مؤسسة خيرية تهتم بالتراث والثقافة العمانية ودعم المجتمع المحلي',
        'https://nizwa.om',
        'https://twitter.com/nizwa_charity',
        'https://instagram.com/nizwa_heritage',
        'organization/nizwa-logo.png',
        'organization/nizwa-image.jpg'
    ),
    (
        '9a1b2c3d-4e5f-6789-abcd-ef0123456789',
        'جمعية الأمل للتنمية',
        'صحار، عمان',
        'info@amal.om',
        '+96899555666',
        'جمعية تنموية تهدف إلى تمكين الشباب والمرأة وتطوير القدرات المجتمعية',
        'https://amal.om',
        'https://twitter.com/amal_dev',
        'https://instagram.com/amal_development',
        'organization/amal-logo.png',
        'organization/amal-image.jpg'
    );

-- ============================================================================
-- SAMPLE PROJECTS
-- ============================================================================

INSERT INTO projects (id, title, description, value, address, organization_id, image)
VALUES 
    (
        '6a5763c2-549b-4fcf-8911-2aa1f0c4ba21',
        'مشروع بناء مسجد الهداية',
        'مشروع خيري لبناء مسجد في منطقة الهداية لخدمة المجتمع المحلي وتوفير مكان للعبادة والأنشطة الدينية',
        50000.00,
        'منطقة الهداية، مسقط',
        '3028b3a0-4d2c-439e-ae83-1de8c4d1c788',
        'project/mosque-hidaya.jpg'
    ),
    (
        '8b9c1d2e-3f4a-5b6c-7d8e-9f0a1b2c3d4e',
        'مشروع مدرسة تحفيظ القرآن',
        'إنشاء مدرسة حديثة لتحفيظ القرآن الكريم للأطفال والشباب مع برامج تعليمية متطورة',
        75000.00,
        'الخوض، مسقط',
        '3028b3a0-4d2c-439e-ae83-1de8c4d1c788',
        'project/quran-school.jpg'
    ),
    (
        '1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f',
        'مشروع مركز طبي خيري',
        'إقامة مركز طبي خيري متطور لخدمة المحتاجين في المنطقة وتوفير الرعاية الصحية المجانية',
        120000.00,
        'صلالة المركز',
        '5c9490f0-68c9-4969-8663-ad90395f4acd',
        'project/medical-center.jpg'
    ),
    (
        '2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a',
        'مشروع مكتبة المعرفة',
        'إنشاء مكتبة عامة تحتوي على آلاف الكتب والموارد التعليمية لخدمة طلاب العلم',
        35000.00,
        'نزوى التاريخية',
        '7d8e2f90-98a1-4b6c-9f7e-12345abcdef0',
        'project/knowledge-library.jpg'
    ),
    (
        '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b',
        'مشروع تدريب الحرفيين',
        'برنامج تدريبي شامل للحرفيين التقليديين لتطوير مهاراتهم وزيادة دخلهم',
        45000.00,
        'صحار الصناعية',
        '9a1b2c3d-4e5f-6789-abcd-ef0123456789',
        'project/craftsmen-training.jpg'
    ),
    (
        '4f5a6b7c-8d9e-0f1a-2b3c-4d5e6f7a8b9c',
        'مشروع دعم الأرامل والأيتام',
        'برنامج دعم شامل للأرامل والأيتام يشمل التعليم والصحة والإسكان',
        80000.00,
        'مختلف محافظات السلطنة',
        '5c9490f0-68c9-4969-8663-ad90395f4acd',
        'project/widows-orphans.jpg'
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

-- Additional donations for Quran School project
INSERT INTO donations (project_id, donor_name, donor_email, donor_phone, amount, donation_type, payment_status, message)
VALUES 
    (
        '8b9c1d2e-3f4a-5b6c-7d8e-9f0a1b2c3d4e',
        'سعد محمد الشعيبي',
        'saad.shuaibi@example.com',
        '+96899444444',
        2000.00,
        'regular',
        'Completed',
        'نسأل الله أن يبارك في هذا المشروع التعليمي'
    ),
    (
        '8b9c1d2e-3f4a-5b6c-7d8e-9f0a1b2c3d4e',
        'زينب علي الكندي',
        'zainab.kindi@example.com',
        '+96899555555',
        1200.00,
        'gift',
        'Completed',
        'هدية لابنتي الحبيبة تقبل الله منا ومنكم'
    );

-- Donations for Medical Center project
INSERT INTO donations (project_id, donor_name, donor_email, donor_phone, amount, donation_type, payment_status, message)
VALUES 
    (
        '1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f',
        'أمينة سالم الرواحي',
        'amina.rawahi@example.com',
        '+96899666666',
        1500.00,
        'regular',
        'Completed',
        'جعله الله في ميزان حسنات الوالدين'
    ),
    (
        '1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f',
        'طالب سعيد المقبالي',
        'talib.maqbali@example.com',
        '+96899777777',
        3000.00,
        'regular',
        'Completed',
        'ندعو الله أن يشفي مرضى المسلمين'
    ),
    (
        '1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f',
        'مانح مجهول',
        null,
        null,
        500.00,
        'anonymous',
        'Completed',
        null
    );

-- Donations for Knowledge Library project
INSERT INTO donations (project_id, donor_name, donor_email, donor_phone, amount, donation_type, payment_status, message)
VALUES 
    (
        '2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a',
        'نادية حمد البطاشي',
        'nadia.battashi@example.com',
        '+96899888888',
        800.00,
        'regular',
        'Completed',
        'في سبيل نشر العلم والمعرفة'
    ),
    (
        '2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a',
        'أحمد يوسف الغافري',
        'ahmed.ghafri@example.com',
        '+96899999999',
        1500.00,
        'gift',
        'Completed',
        'هدية تخرج لابني الطبيب'
    );

-- Donations for Craftsmen Training project  
INSERT INTO donations (project_id, donor_name, donor_email, donor_phone, amount, donation_type, payment_status, message)
VALUES 
    (
        '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b',
        'سالم راشد العبري',
        'salem.abri@example.com',
        '+96899101010',
        2500.00,
        'regular',
        'Completed',
        'لدعم الحرفيين وتطوير مهاراتهم'
    );

-- Donations for Widows and Orphans project
INSERT INTO donations (project_id, donor_name, donor_email, donor_phone, amount, donation_type, payment_status, message)
VALUES 
    (
        '4f5a6b7c-8d9e-0f1a-2b3c-4d5e6f7a8b9c',
        'خديجة محمد الفارسي',
        'khadija.farisi@example.com',
        '+96899121212',
        1000.00,
        'regular',
        'Completed',
        'اللهم اكفل الأيتام واعن الأرامل'
    ),
    (
        '4f5a6b7c-8d9e-0f1a-2b3c-4d5e6f7a8b9c',
        'عبدالرحمن سيف الهاشمي',
        'abdulrahman.hashimi@example.com',
        '+96899131313',
        2000.00,
        'gift',
        'Completed',
        'باسم جدتي رحمها الله'
    ),
    (
        '4f5a6b7c-8d9e-0f1a-2b3c-4d5e6f7a8b9c',
        'مانح مجهول',
        null,
        null,
        750.00,
        'anonymous',
        'Completed',
        null
    );

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
-- SEEDING COMPLETED
-- ============================================================================
-- The seed data has been successfully inserted.
-- You can verify the data by running queries manually if needed.
