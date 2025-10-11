// Utility functions for handling images from MinIO

const MINIO_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_MINIO_URL || 'http://localhost:9000'
  : 'http://localhost:9000'

const MINIO_BUCKET = 'jabir-waqf'

/**
 * Get the full URL for an image stored in MinIO
 * @param filename - The filename/path from MinIO (e.g., "organization/uuid.jpg")
 * @returns Full URL to the image
 */
export const getImageUrl = (filename?: string): string => {
  if (!filename) return ''
  
  // If it's already a full URL, return as is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename
  }
  
  // If it's a base64 data URL, return as is
  if (filename.startsWith('data:')) {
    return filename
  }
  
  // Construct MinIO URL
  return `${MINIO_BASE_URL}/${MINIO_BUCKET}/${filename}`
}

/**
 * Get the full URL for an organization image
 * @param image - The image filename or URL
 * @param fallback - Fallback image (usually logo)
 * @returns Full URL to the image
 */
export const getOrganizationImageUrl = (image?: string, fallback?: string): string => {
  if (image) {
    return getImageUrl(image)
  }
  if (fallback) {
    return fallback
  }
  return ''
}

/**
 * Get the full URL for a project image
 * @param image - The image filename or URL
 * @returns Full URL to the image
 */
export const getProjectImageUrl = (image?: string): string => {
  return getImageUrl(image)
}

/**
 * Get the full URL for a project logo
 * @param logo - The logo filename or URL
 * @param fallback - Fallback logo (usually organization logo)
 * @returns Full URL to the logo
 */
export const getProjectLogoUrl = (logo?: string, fallback?: string): string => {
  if (logo) {
    return getImageUrl(logo)
  }
  if (fallback) {
    return fallback
  }
  return ''
}
