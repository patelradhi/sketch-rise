import { Suspense, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Grid, PerspectiveCamera } from '@react-three/drei'
import { useAppSelector } from '@/store/hooks'
import { updateProjectThumbnail } from '@/store/slices/projectSlice'
import { useAppDispatch } from '@/store/hooks'
import RoomMesh from './RoomMesh'
import WallMesh from './WallMesh'
import FurnitureMesh from './FurnitureMesh'
import LoadingSkeleton from './LoadingSkeleton'
import api from '@/lib/api'

// Captures thumbnail after render
function ThumbnailCapture({ projectId }: { projectId: string }) {
  const { gl } = useThree()
  const dispatch = useAppDispatch()
  const captured = useRef(false)

  if (!captured.current) {
    captured.current = true
    // Wait one frame for scene to render
    requestAnimationFrame(() => {
      const thumbnail = gl.domElement.toDataURL('image/jpeg', 0.7)
      dispatch(updateProjectThumbnail({ id: projectId, thumbnailBase64: thumbnail }))
      api.patch(`/api/projects/${projectId}`, { thumbnailBase64: thumbnail }).catch(() => null)
    })
  }

  return null
}

function Scene({ projectId }: { projectId: string }) {
  const renderData = useAppSelector((s) => s.render.data)

  if (!renderData) return null

  return (
    <>
      <ThumbnailCapture projectId={projectId} />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[10, 20, 10]}
        intensity={1.2}
        shadow-mapSize={[2048, 2048]}
      />
      <Environment preset="city" />

      {/* Ground grid */}
      <Grid
        args={[50, 50]}
        cellSize={1}
        cellThickness={0.3}
        cellColor="#1e293b"
        sectionSize={5}
        sectionThickness={0.6}
        sectionColor="#334155"
        fadeDistance={30}
        position={[0, -0.01, 0]}
      />

      {/* Rooms */}
      {renderData.rooms.map((room) => (
        <RoomMesh key={room.id} room={room} />
      ))}

      {/* Walls */}
      {renderData.walls.map((wall) => (
        <WallMesh key={wall.id} wall={wall} />
      ))}

      {/* Furniture */}
      {renderData.rooms.flatMap((room) =>
        room.furniture.map((item, idx) => (
          <FurnitureMesh key={`${room.id}-${idx}`} furniture={item} roomPosition={room.position} />
        )),
      )}

      <OrbitControls
        makeDefault
        minDistance={3}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2.1}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  )
}

interface Props {
  projectId: string
}

export default function Canvas3D({ projectId }: Props) {
  const loading = useAppSelector((s) => s.render.loading)

  return (
    <div className="relative w-full h-full">
      {loading && <LoadingSkeleton />}

      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        className="w-full h-full"
      >
        <PerspectiveCamera makeDefault position={[0, 15, 15]} fov={50} />
        <Suspense fallback={null}>
          <Scene projectId={projectId} />
        </Suspense>
      </Canvas>
    </div>
  )
}
