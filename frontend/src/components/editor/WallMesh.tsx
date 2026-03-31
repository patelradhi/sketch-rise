import { useMemo } from 'react'
import * as THREE from 'three'
import type { Wall } from '@/lib/types'

interface Props {
  wall: Wall
}

export default function WallMesh({ wall }: Props) {
  const { start, end, height, thickness } = wall

  const { position, rotation, length } = useMemo(() => {
    const dx = end.x - start.x
    const dz = end.z - start.z
    const len = Math.sqrt(dx * dx + dz * dz)
    const midX = (start.x + end.x) / 2
    const midZ = (start.z + end.z) / 2
    const rot = Math.atan2(dx, dz)
    return { position: [midX, height / 2, midZ] as [number, number, number], rotation: rot, length: len }
  }, [start, end, height])

  return (
    <mesh
      castShadow
      receiveShadow
      position={position}
      rotation={[0, rotation, 0]}
    >
      <boxGeometry args={[thickness, height, length]} />
      <meshStandardMaterial color="#F0EDE8" roughness={0.9} metalness={0.0} />
    </mesh>
  )
}
