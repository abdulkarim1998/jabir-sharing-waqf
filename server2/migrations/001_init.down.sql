-- ============================================================================
-- Rollback Complete Database Schema for Jabir Waqf Platform
-- ============================================================================

-- Drop all tables in reverse dependency order
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS payment_configurations CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS permission_scope CASCADE;
DROP TYPE IF EXISTS permission_resource CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;

-- Drop UUID extension (only if no other databases use it)
-- DROP EXTENSION IF EXISTS "uuid-ossp";
