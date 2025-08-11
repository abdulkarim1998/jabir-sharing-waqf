-- Drop all tables in reverse order
DROP TABLE IF EXISTS payment_tracks CASCADE;
DROP TABLE IF EXISTS payment_configurations CASCADE;
DROP TABLE IF EXISTS gift_details CASCADE;
DROP TABLE IF EXISTS waqfs CASCADE;

DROP TABLE IF EXISTS waqf_types CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS organization_users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop enums
DROP TYPE IF EXISTS payment_status;
DROP TYPE IF EXISTS permission_scope;
DROP TYPE IF EXISTS permission_resource;

-- Drop extension (only if no other tables use it)
-- DROP EXTENSION IF EXISTS "uuid-ossp";
