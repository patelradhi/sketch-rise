export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export const MAX_UPLOAD_SIZE_MB = 10
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024

export const ACCEPTED_IMAGE_TYPES = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
}

export const FLOOR_MATERIAL_COLORS: Record<string, string> = {
  hardwood: '#C68642',
  tile: '#D4D4D4',
  carpet: '#B8A99A',
  concrete: '#9E9E9E',
}

export const ROOM_WALL_DEFAULT = '#F5F5F0'

export const FREE_TIER_LIMIT = 10
