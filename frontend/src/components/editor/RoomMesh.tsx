import { useMemo } from 'react'
import * as THREE from 'three'
import { FLOOR_MATERIAL_COLORS } from '@/lib/constants'
import type { Room } from '@/lib/types'

interface Props {
  room: Room
}

export default function RoomMesh({ room }: Props) {
  const { position, dimensions, floor_material, wall_color } = room

  const floorColor = useMemo(
    () => FLOOR_MATERIAL_COLORS[floor_material] ?? FLOOR_MATERIAL_COLORS.hardwood,
    [floor_material],
  )

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Floor */}
      <mesh
        receiveShadow
        position={[dimensions.width / 2, 0, dimensions.depth / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[dimensions.width, dimensions.depth]} />
        <meshStandardMaterial color={floorColor} roughness={0.8} metalness={0.0} />
      </mesh>

      {/* Thin floor border (room indicator) */}
      <lineSegments position={[dimensions.width / 2, 0.01, dimensions.depth / 2]}>
        <edgesGeometry
          args={[new THREE.BoxGeometry(dimensions.width, 0.01, dimensions.depth)]}
        />
        <lineBasicMaterial color={wall_color} opacity={0.3} transparent />
      </lineSegments>
    </group>
  )
}
