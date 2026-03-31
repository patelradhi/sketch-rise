import type { Furniture } from '@/lib/types'

interface Props {
  furniture: Furniture
  roomPosition: { x: number; y: number; z: number }
}

const FURNITURE_COLORS: Record<string, string> = {
  bed: '#8B7355',
  sofa: '#6B7280',
  dining_table: '#92400E',
  desk: '#78716C',
  toilet: '#E5E7EB',
  bathtub: '#DBEAFE',
  sink: '#E5E7EB',
  stove: '#374151',
  washer: '#CBD5E1',
}

export default function FurnitureMesh({ furniture, roomPosition }: Props) {
  const { type, position, rotation, dimensions } = furniture
  const color = FURNITURE_COLORS[type] ?? '#888888'
  const height = type === 'bed' ? 0.5 : type === 'sofa' ? 0.8 : type === 'dining_table' ? 0.75 : 0.7

  return (
    <mesh
      castShadow
      position={[
        roomPosition.x + position.x,
        roomPosition.y + height / 2,
        roomPosition.z + position.z,
      ]}
      rotation={[0, rotation, 0]}
    >
      <boxGeometry args={[dimensions.width, height, dimensions.depth]} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
    </mesh>
  )
}
