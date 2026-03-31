import { Suspense, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei'
import { useAppSelector } from '@/store/hooks'
import { updateProjectThumbnail } from '@/store/slices/projectSlice'
import { useAppDispatch } from '@/store/hooks'
import RoomMesh from './RoomMesh'
import WallMesh from './WallMesh'
import FurnitureMesh from './FurnitureMesh'
import LoadingSkeleton from './LoadingSkeleton'
import api from '@/lib/api'
import type { RenderData } from '@/lib/types'

// Captures thumbnail after render
function ThumbnailCapture({ projectId }: { projectId: string }) {
  const { gl } = useThree()
  const dispatch = useAppDispatch()
  const captured = useRef(false)

  if (!captured.current) {
    captured.current = true
    requestAnimationFrame(() => {
      const thumbnail = gl.domElement.toDataURL('image/jpeg', 0.7)
      dispatch(updateProjectThumbnail({ id: projectId, thumbnailBase64: thumbnail }))
      api.patch(`/api/projects/${projectId}`, { thumbnailBase64: thumbnail }).catch(() => null)
    })
  }

  return null
}

function Scene({ projectId }: { projectId: string }) {
  const raw = useAppSelector((s) => s.render.data)

  if (!raw) {
    console.warn('[Canvas3D] renderData is null — scene empty')
    return null
  }

  // Normalise: Gemini sometimes returns slightly different key names
  const renderData = raw as unknown as RenderData
  const rooms  = Array.isArray(renderData.rooms)   ? renderData.rooms   : []
  const walls  = Array.isArray(renderData.walls)   ? renderData.walls   : []

  console.log('[Canvas3D] Rendering scene — rooms:', rooms.length, 'walls:', walls.length)

  return (
    <>
      <ThumbnailCapture projectId={projectId} />

      {/* Lighting */}
      <color attach="background" args={['#0f172a']} />
      <ambientLight intensity={1.0} />
      <directionalLight castShadow position={[10, 20, 10]} intensity={2.0} />
      <directionalLight position={[-10, 10, -10]} intensity={0.5} />
      <hemisphereLight args={['#dbeafe', '#1e3a5f', 0.6]} />

      {/* Ground plane — always visible so we know canvas is working */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Ground grid */}
      <Grid
        args={[50, 50]}
        cellSize={1}
        cellThickness={0.4}
        cellColor="#334155"
        sectionSize={5}
        sectionThickness={0.8}
        sectionColor="#3b82f6"
        fadeDistance={40}
        position={[0, 0, 0]}
      />

      {/* Rooms */}
      {rooms.map((room, i) => (
        <RoomMesh key={room.id ?? i} room={room} />
      ))}

      {/* Walls */}
      {walls.map((wall, i) => (
        <WallMesh key={wall.id ?? i} wall={wall} />
      ))}

      {/* Furniture */}
      {rooms.flatMap((room, ri) =>
        (room.furniture ?? []).map((item, idx) => (
          <FurnitureMesh
            key={`${room.id ?? ri}-${idx}`}
            furniture={item}
            roomPosition={room.position}
          />
        )),
      )}

      <OrbitControls
        makeDefault
        minDistance={2}
        maxDistance={60}
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
    <div className="relative w-full" style={{ height: 'calc(100vh - 56px)' }}>
      {loading && <LoadingSkeleton />}

      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0f172a', 1)
        }}
      >
        <PerspectiveCamera makeDefault position={[8, 12, 12]} fov={55} />
        <Suspense fallback={null}>
          <Scene projectId={projectId} />
        </Suspense>
      </Canvas>
    </div>
  )
}
