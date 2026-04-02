// ─── Render Data (from Claude) ────────────────────────────────────────────────

export interface Vector3 {
  x: number
  y: number
  z: number
}

export interface Dimensions3D {
  width: number
  height: number
  depth: number
}

export interface Furniture {
  type: 'bed' | 'sofa' | 'dining_table' | 'desk' | 'toilet' | 'bathtub' | 'sink' | 'stove' | 'washer'
  position: Vector3
  rotation: number
  dimensions: { width: number; depth: number }
}

export interface Room {
  id: string
  type: 'bedroom' | 'living_room' | 'kitchen' | 'bathroom' | 'office' | 'dining_room' | 'hallway' | 'utility'
  label: string
  position: Vector3
  dimensions: Dimensions3D
  floor_material: 'hardwood' | 'tile' | 'carpet' | 'concrete'
  wall_color: string
  furniture: Furniture[]
}

export interface Wall {
  id: string
  start: { x: number; z: number }
  end: { x: number; z: number }
  height: number
  thickness: number
}

export interface Door {
  id: string
  wall_id: string
  position: { x: number; z: number }
  width: number
  swing: 'left' | 'right'
}

export interface Window {
  id: string
  wall_id: string
  position: { x: number; z: number }
  width: number
  height: number
  sill_height: number
}

export interface RenderData {
  rooms: Room[]
  walls: Wall[]
  doors: Door[]
  windows: Window[]
  total_area_sqm: number
  building_type: 'residential' | 'commercial' | 'mixed'
  estimated_scale: string
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface Project {
  _id: string
  userId: string
  title: string
  renderedImageUrl?: string
  originalSketchBase64?: string
  isPublic: boolean
  shareToken?: string
  version: number
  createdAt: string
  updatedAt: string
}

// ─── API Response shapes ──────────────────────────────────────────────────────

export interface ApiError {
  error: string
  code?: string
}

export interface AnalyzeResponse {
  success: true
  project: Project
}

export interface UserProfile {
  _id: string
  clerkId: string
  email: string
  username?: string
  plan: 'free' | 'pro'
  generationsUsed: number
  generationsLimit: number
}
