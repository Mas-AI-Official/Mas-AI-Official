'use client'

import { useEffect, useState, useRef, useMemo, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { X, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { useSectionState } from '@/hooks/useSectionState'

/**
 * DaenaPresence: 3D living portrait using Three.js displacement mapping.
 *
 * The portrait image is mapped onto a plane with a depth map applied as
 * displacement. Mouse movement drives the camera angle, creating a
 * parallax "photo alive" effect. Mood changes shift the lighting color
 * and intensity, making her "expression" change per section.
 */

const MOOD_CONFIG: Record<string, {
  glowColor: string
  lightColor: string
  lightIntensity: number
  caption: string
}> = {
  hero:         { glowColor: '#00c8ff', lightColor: '#00c8ff', lightIntensity: 1.0, caption: '' },
  'what-we-do': { glowColor: '#7c3aed', lightColor: '#9966ff', lightIntensity: 1.2, caption: 'This is what we build.' },
  daena:        { glowColor: '#00c8ff', lightColor: '#00ddff', lightIntensity: 1.5, caption: "That's me." },
  portfolio:    { glowColor: '#d4a853', lightColor: '#ffd700', lightIntensity: 1.1, caption: 'We ship real products.' },
  enterprise:   { glowColor: '#d4a853', lightColor: '#e8b84d', lightIntensity: 0.9, caption: 'Enterprise governance.' },
  credibility:  { glowColor: '#00c8ff', lightColor: '#00b8e8', lightIntensity: 0.8, caption: 'Real engineering.' },
  contact:      { glowColor: '#7c3aed', lightColor: '#aa77ff', lightIntensity: 1.3, caption: "Let's build something." },
  faq:          { glowColor: '#00c8ff', lightColor: '#00c8ff', lightIntensity: 0.7, caption: '' },
}

// ─── 3D Portrait Plane ──────────────────────────────────────────────────────
function PortraitPlane({ lightColor, lightIntensity }: { lightColor: string; lightIntensity: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const { mouse } = useThree()

  const [colorMap, depthMap] = useLoader(THREE.TextureLoader, [
    '/assets/img/daena-nobg.png',
    '/assets/img/daena-depth.png',
  ])

  // Custom shader for depth displacement + transparency
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTexture: { value: colorMap },
        uDepth: { value: depthMap },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0 },
        uLightColor: { value: new THREE.Color(lightColor) },
        uLightIntensity: { value: lightIntensity },
      },
      vertexShader: `
        uniform sampler2D uDepth;
        uniform vec2 uMouse;
        uniform float uTime;
        varying vec2 vUv;
        varying float vDepth;

        void main() {
          vUv = uv;
          float depth = texture2D(uDepth, uv).r;
          vDepth = depth;

          // Displace vertices based on depth map
          vec3 pos = position;
          pos.z += depth * 0.15;

          // Subtle breathing
          pos.z += sin(uTime * 1.5) * 0.005;

          // Mouse parallax: very subtle shift based on depth
          pos.x += uMouse.x * depth * 0.03;
          pos.y += uMouse.y * depth * 0.02;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec3 uLightColor;
        uniform float uLightIntensity;
        uniform vec2 uMouse;
        varying vec2 vUv;
        varying float vDepth;

        void main() {
          vec4 texColor = texture2D(uTexture, vUv);

          // Discard transparent pixels
          if (texColor.a < 0.1) discard;

          // Apply mood-based lighting tint
          float lightFactor = vDepth * uLightIntensity * 0.15;
          vec3 tinted = texColor.rgb + uLightColor * lightFactor;

          // Subtle rim light effect based on mouse position
          float rimX = abs(vUv.x - 0.5 - uMouse.x * 0.1);
          float rimY = abs(vUv.y - 0.5 - uMouse.y * 0.1);
          float rim = smoothstep(0.3, 0.5, max(rimX, rimY)) * 0.1;
          tinted += uLightColor * rim;

          gl_FragColor = vec4(tinted, texColor.a);
        }
      `,
    })
  }, [colorMap, depthMap, lightColor, lightIntensity])

  // Update uniforms every frame
  useFrame((state) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.ShaderMaterial

    // Smooth mouse follow
    const targetX = mouse.x * 0.5
    const targetY = mouse.y * 0.5
    mat.uniforms.uMouse.value.x += (targetX - mat.uniforms.uMouse.value.x) * 0.05
    mat.uniforms.uMouse.value.y += (targetY - mat.uniforms.uMouse.value.y) * 0.05
    mat.uniforms.uTime.value = state.clock.elapsedTime

    // Update light color smoothly
    const tc = new THREE.Color(lightColor)
    mat.uniforms.uLightColor.value.lerp(tc, 0.05)
    mat.uniforms.uLightIntensity.value += (lightIntensity - mat.uniforms.uLightIntensity.value) * 0.05

    // Subtle mesh rotation following mouse (reduced to prevent drift)
    meshRef.current.rotation.y += (mouse.x * 0.04 - meshRef.current.rotation.y) * 0.05
    meshRef.current.rotation.x += (-mouse.y * 0.03 - meshRef.current.rotation.x) * 0.05
  })

  return (
    <mesh ref={meshRef} material={shaderMaterial}>
      <planeGeometry args={[1, 0.72, 64, 64]} />
    </mesh>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function DaenaPresence() {
  const { activeSection, scrollProgress } = useSectionState()
  const [expanded, setExpanded] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isReduced, setIsReduced] = useState(false)
  const [canRender3D, setCanRender3D] = useState(true)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    setIsReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    // Check WebGL support
    try {
      const c = document.createElement('canvas')
      setCanRender3D(!!(c.getContext('webgl2') || c.getContext('webgl')))
    } catch { setCanRender3D(false) }

    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    const t = setTimeout(() => setVisible(true), 1200)
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t) }
  }, [])

  const mood = MOOD_CONFIG[activeSection] || MOOD_CONFIG.hero

  if (!visible) return null

  // Mobile: simple image with glow
  if (isMobile) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setExpanded(!expanded)}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-2xl overflow-hidden border-2 transition-all duration-500"
        style={{
          borderColor: mood.glowColor + '50',
          boxShadow: `0 0 24px ${mood.glowColor}25`,
        }}
      >
        <Image src="/assets/img/daena-nobg.png" alt="Daena AI" width={56} height={56} className="object-cover" />
      </motion.button>
    )
  }

  // Desktop: 3D portrait
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 1.5, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3"
    >
      {/* Thought bubble ABOVE */}
      <AnimatePresence mode="wait">
        {mood.caption && (
          <motion.div
            key={mood.caption}
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
            className="relative mb-1"
          >
            <div
              className="rounded-xl px-4 py-2 text-xs font-medium max-w-[140px] text-center leading-snug"
              style={{
                background: 'rgba(8,11,20,0.9)',
                border: `1px solid ${mood.glowColor}30`,
                color: mood.glowColor,
                boxShadow: `0 0 20px ${mood.glowColor}15`,
              }}
            >
              {mood.caption}
            </div>
            <div className="flex flex-col items-center gap-1 mt-1">
              <div className="w-2 h-2 rounded-full" style={{ background: mood.glowColor + '40' }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: mood.glowColor + '25' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Portrait Canvas */}
      <div
        className="relative w-28 h-36 rounded-2xl overflow-hidden cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        style={{
          boxShadow: `0 0 40px ${mood.glowColor}20, 0 8px 32px rgba(0,0,0,0.5)`,
          border: `1px solid ${mood.glowColor}25`,
        }}
      >
        {canRender3D && !isReduced ? (
          <Suspense fallback={
            <Image src="/assets/img/daena-nobg.png" alt="Daena AI" width={112} height={144} className="object-cover object-top w-full h-full" />
          }>
            <Canvas
              camera={{ position: [0, 0, 1], fov: 45 }}
              style={{ background: 'transparent' }}
              gl={{ alpha: true, antialias: true }}
            >
              <ambientLight intensity={0.8} />
              <PortraitPlane lightColor={mood.lightColor} lightIntensity={mood.lightIntensity} />
            </Canvas>
          </Suspense>
        ) : (
          <Image src="/assets/img/daena-nobg.png" alt="Daena AI" width={112} height={144} className="object-cover object-top w-full h-full" />
        )}
      </div>

      {/* Scroll depth bar */}
      <div className="w-px h-12 bg-gray-800/50 relative rounded-full overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-full"
          style={{ background: mood.glowColor }}
          animate={{ height: `${scrollProgress * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: 10 }}
            transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
            className="absolute right-full mr-4 top-0 w-72 rounded-2xl p-5"
            style={{
              background: 'rgba(8,11,20,0.95)',
              border: `1px solid ${mood.glowColor}20`,
              backdropFilter: 'blur(24px)',
              boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${mood.glowColor}10`,
            }}
          >
            <button onClick={() => setExpanded(false)} className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors">
              <X size={16} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden border" style={{ borderColor: mood.glowColor + '30' }}>
                <Image src="/assets/img/daena-nobg.png" alt="Daena" width={40} height={40} className="object-cover object-top" />
              </div>
              <div>
                <p className="text-sm font-bold text-white font-[family-name:var(--font-display)]">Daena</p>
                <p className="text-xs font-[family-name:var(--font-mono)]" style={{ color: mood.glowColor }}>MAS-AI Flagship Platform</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Governance-first AI agent orchestration. Every agent governed, every decision traced, every action auditable.
            </p>
            <a
              href="https://daena.mas-ai.co"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="cta"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-[1.02]"
              style={{ background: mood.glowColor, color: '#080b14' }}
            >
              Explore Daena <ExternalLink size={14} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
