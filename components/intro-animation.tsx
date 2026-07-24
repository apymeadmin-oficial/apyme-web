"use client"

import { useEffect, useState, useRef, useCallback } from "react"

const HOLD_DURATION = 1200;
const SLIDE_DURATION = 1000;
const FADE_DURATION = 600;

export const INTRO_DURATION_MS = HOLD_DURATION + SLIDE_DURATION + FADE_DURATION;
export const HERO_REVEAL_MS = INTRO_DURATION_MS - 300;

type Phase = "idle" | "slide" | "fade" | "done";

export function IntroAnimation({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle")
  const textRef = useRef<HTMLDivElement>(null)
  const cubesRef = useRef<HTMLDivElement>(null)
  const [textDelta, setTextDelta] = useState({ x: 0, y: 0 })
  const [cubesDelta, setCubesDelta] = useState({ x: 0, y: 0 })
  const [cubesScale, setCubesScale] = useState(1)

  const measure = useCallback(() => {
    const heroTitle = document.getElementById("hero-title")
    const heroCubes = document.getElementById("hero-cubes")
    const textEl = textRef.current
    const cubesEl = cubesRef.current

    if (!heroTitle || !heroCubes || !textEl || !cubesEl) return

    const titleRect = heroTitle.getBoundingClientRect()
    const cubesContainerRect = heroCubes.getBoundingClientRect()
    const textRect = textEl.getBoundingClientRect()
    const cubesImgRect = cubesEl.getBoundingClientRect()

    setTextDelta({
      x: titleRect.left - textRect.left,
      y: titleRect.top - textRect.top,
    })

    const targetVisualSize = Math.min(cubesContainerRect.width, cubesContainerRect.height) * 0.45
    const currentSize = Math.max(cubesImgRect.width, cubesImgRect.height)
    const scale = currentSize > 0 ? targetVisualSize / currentSize : 0.65

    setCubesScale(scale)
    setCubesDelta({
      x: (cubesContainerRect.left + cubesContainerRect.width / 2) - (cubesImgRect.left + cubesImgRect.width / 2),
      y: (cubesContainerRect.top + cubesContainerRect.height / 2) - (cubesImgRect.top + cubesImgRect.height / 2),
    })
  }, [])

  useEffect(() => {
    requestAnimationFrame(() => { measure() })
    window.addEventListener("resize", measure)

    const t1 = setTimeout(() => setPhase("slide"), HOLD_DURATION)
    const t2 = setTimeout(() => setPhase("fade"), HOLD_DURATION + SLIDE_DURATION)
    const t3 = setTimeout(() => onDone(), HERO_REVEAL_MS)
    const t4 = setTimeout(() => setPhase("done"), INTRO_DURATION_MS + 100)

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4)
      window.removeEventListener("resize", measure)
    }
  }, [onDone, measure])

  if (phase === "done") return null

  const isSliding = phase === "slide" || phase === "fade"
  const isFading = phase === "fade"

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none bg-white"
      aria-hidden="true"
      style={{
        opacity: isFading ? 0 : 1,
        transition: `opacity ${FADE_DURATION}ms ease-in-out`,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">

        {/*
          flex-row + items-end:
          - Texto a la izquierda, alineado al fondo
          - Cubos a la derecha, más altos, se extienden hacia arriba
          → Reproduce exactamente la composición del logo y usa tamaños reales (no scale) 
            para que el cálculo de coordenadas de la animación sea perfecto en celular.
        */}
        <div className="flex items-end">

          {/* ═══ TEXTO (izquierda, abajo) ═══ */}
          <div
            ref={textRef}
            style={{
              transform: isSliding
                ? `translate(${textDelta.x}px, ${textDelta.y}px)`
                : "translate(0, 0)",
              transition: isSliding
                ? `transform ${SLIDE_DURATION}ms cubic-bezier(0.76, 0, 0.24, 1)`
                : "none",
            }}
          >
            <div className="flex flex-col items-end">
              <span className="text-5xl sm:text-7xl md:text-[8rem] font-medium tracking-tighter text-black leading-none">
                APYME
              </span>
              <span className="text-lg sm:text-2xl md:text-4xl font-normal tracking-[0.35em] text-black uppercase mt-1 sm:mt-2 mr-1">
                CHILE
              </span>
            </div>
          </div>

          {/* ═══ CUBOS (derecha, más altos, se extienden arriba) ═══
              -ml-3/4/6: leve solapamiento horizontal con el "E" de APYME
              mb-3/4/6: sube ligeramente los cubos del fondo para alinear visualmente
          */}
          <div
            ref={cubesRef}
            className="-ml-3 sm:-ml-4 md:-ml-6 mb-3 sm:mb-4 md:mb-6"
            style={{
              transform: isSliding
                ? `translate(${cubesDelta.x}px, ${cubesDelta.y}px) scale(${cubesScale})`
                : "translate(0, 0) scale(1)",
              transition: isSliding
                ? `transform ${SLIDE_DURATION}ms cubic-bezier(0.76, 0, 0.24, 1)`
                : "none",
              transformOrigin: "center bottom",
            }}
          >
            <img
              src="/logo_perfecto.png"
              alt="Cubos APYME"
              className="w-32 h-32 sm:w-56 sm:h-56 md:w-80 md:h-80 object-contain"
            />
          </div>

        </div>

      </div>
    </div>
  )
}
