"use client"

import { useRef, Suspense } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import * as THREE from "three"

// ─── Individual floating geometry with Logo Texture ───────────────────────
function FloatingGeometry({
  position,
  geometryType = "cube",
  textureUrl,
  floatSpeed = 1,
  floatAmplitude = 0.15,
  rotationSpeed = 0.3,
  delay = 0,
  size = 0.7,
}: {
  position: [number, number, number]
  geometryType?: "cube" | "pyramid"
  textureUrl: string
  floatSpeed?: number
  floatAmplitude?: number
  rotationSpeed?: number
  delay?: number
  size?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const initialY = position[1]
  const initialX = position[0]

  // Cargar la textura específica que pasemos (roja o plateada)
  const texture = useLoader(THREE.TextureLoader, textureUrl)
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime + delay

    // Floating — smooth sine wave on Y
    meshRef.current.position.y = initialY + Math.sin(t * floatSpeed) * floatAmplitude
    
    // Gentle X drift
    meshRef.current.position.x = initialX + Math.sin(t * floatSpeed * 0.7 + 1.2) * (floatAmplitude * 0.3)

    // Smooth rotation on all axes
    meshRef.current.rotation.x += rotationSpeed * 0.008
    meshRef.current.rotation.y += rotationSpeed * 0.012
    meshRef.current.rotation.z += rotationSpeed * 0.004
  })

  return (
    <mesh ref={meshRef} position={position}>
      {geometryType === "cube" ? (
        <boxGeometry args={[size, size, size]} />
      ) : (
        <coneGeometry args={[size * 0.7, size, 4]} /> // 4-sided pyramid
      )}
      
      {/* 
        MeshStandardMaterial: Usa luces. Al tener textura (map), respeta tus fotos, 
        pero reacciona a las luces 3D del entorno para que se note que es un cubo 3D 
        y no se vea como una estampa plana torciéndose.
      */}
      <meshStandardMaterial 
        map={texture} 
        side={THREE.DoubleSide} 
        metalness={0.4}
        roughness={0.5}
      />
    </mesh>
  )
}

// ─── Scene ───────────────────────────────────────────────────────────────────
function LogoScene() {
  const groupRef = useRef<THREE.Group>(null)

  // Gentle overall group sway
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.12
    groupRef.current.rotation.x = Math.sin(t * 0.1 + 0.5) * 0.06
  })

  return (
    <>
      {/* ── Luces para MeshStandardMaterial ── */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2.5} />
      <directionalLight position={[-5, 5, -5]} intensity={1.0} />
      <directionalLight position={[0, -5, 5]} intensity={0.5} />

      <group ref={groupRef}>
        {/* Primer cubo (Rojo - Mirror Glaze) */}
        <FloatingGeometry
          geometryType="cube"
          textureUrl="/textura_roja.png"
          position={[-0.55, 0.5, 0]}
          floatSpeed={0.9}
          floatAmplitude={0.18}
          rotationSpeed={0.25}
          delay={0}
          size={0.72}
        />

        {/* Cubo Plateado (Brushed Metal) */}
        <FloatingGeometry
          geometryType="cube"
          textureUrl="/textura_plateada.png"
          position={[0.55, 0.6, -0.3]}
          floatSpeed={1.1}
          floatAmplitude={0.14}
          rotationSpeed={0.2}
          delay={1.5}
          size={0.65}
        />

        {/* Segundo cubo (Rojo - Mirror Glaze) */}
        <FloatingGeometry
          geometryType="cube"
          textureUrl="/textura_roja.png"
          position={[0.45, -0.45, 0.2]}
          floatSpeed={0.8}
          floatAmplitude={0.2}
          rotationSpeed={0.3}
          delay={3.0}
          size={0.68}
        />
      </group>
    </>
  )
}

// ─── Exported component ──────────────────────────────────────────────────────
export function FloatingLogoCubes() {
  return (
    <div className="w-full h-full" style={{ minHeight: 300 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
        dpr={[1, 2]}
      >
        {/* Suspense es OBLIGATORIO en Three.js al cargar texturas externas */}
        <Suspense fallback={null}>
          <LogoScene />
        </Suspense>
      </Canvas>
    </div>
  )
}
