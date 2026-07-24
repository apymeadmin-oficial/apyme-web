"use client"

import { useEffect, useRef, useState } from "react"

const EJES = [
  {
    label: "PROPUESTAS LEGISLATIVAS",
    title: "Reforma y Simplificación",
    desc: "Perfeccionamos propuestas de ley que impulsan la economía del emprendedor: reducción de cargas tributarias desproporcionadas, acceso simplificado al crédito y marcos regulatorios adaptados a la realidad de la micro y pequeña empresa.",
    stats: [{ v: "Reforma", l: "tributaria progresiva" }, { v: "Fondos", l: "de garantía estatales" }],
  },
  {
    label: "FALTA DE LIQUIDEZ",
    title: "Acceso al Financiamiento",
    desc: "Trabajamos para mitigar el principal obstáculo que enfrenta el pequeño empresario: la falta de flujo de caja. Promovemos líneas de financiamiento de emergencia, factoring y acceso a capital semilla con condiciones preferentes.",
    stats: [{ v: "Crédito", l: "blando CORFO" }, { v: "Capital", l: "semilla sin garantías" }],
  },
  {
    label: "COSTOS LABORALES",
    title: "Equilibrio Empleador-Trabajador",
    desc: "El alza desmedida de los costos laborales amenaza la viabilidad de miles de negocios. Abogamos por un marco laboral equilibrado que proteja al trabajador sin asfixiar al empleador que también arriesga su patrimonio y su familia.",
    stats: [{ v: "Subsidios", l: "a la contratación" }, { v: "Flexibilidad", l: "de contratos MIPES" }],
  },
  {
    label: "DESARROLLO REGIONAL",
    title: "Descentralización Económica",
    desc: "El crecimiento no puede concentrarse solo en Santiago. Impulsamos el emprendimiento en todas las regiones, con especial énfasis en la Macro Zona Sur y la Región de La Araucanía, integrando turismo, agricultura y comercio local.",
    stats: [{ v: "Turismo", l: "rural sostenible" }, { v: "Redes", l: "de proveedores locales" }],
  },
]

const STICKY_TOP   = 80   // matches top: 80px on first card
const STICKY_STEP  = 16   // each card stacks 16px lower
const SCALE_STEP   = 0.04 // scale reduction per card stacked on top
const OFFSET_STEP  = 8    // px pushed down per card stacked on top

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] tracking-widest font-sans font-bold text-red-600 bg-red-50 border border-red-100">
      {children}
    </span>
  )
}

export function StackingAgentCards() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [depth, setDepth] = useState<number[]>(EJES.map(() => 0))

  useEffect(() => {
    function onScroll() {
      const nextDepth = EJES.map((_, i) => {
        let count = 0
        for (let j = i + 1; j < EJES.length; j++) {
          const el = cardRefs.current[j]
          if (!el) continue
          const rect = el.getBoundingClientRect()
          const stickyTopJ = STICKY_TOP + j * STICKY_STEP
          if (rect.top <= stickyTopJ + 2) count++
        }
        return count
      })
      setDepth(nextDepth)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="flex flex-col" style={{ perspective: "1400px", perspectiveOrigin: "50% 0%" }}>
      {EJES.map((eje, i) => {
        const d         = depth[i]
        const scale     = 1 - d * SCALE_STEP
        const translateY = d * OFFSET_STEP

        return (
          <div
            key={eje.label}
            ref={el => { cardRefs.current[i] = el }}
            className="sticky mb-4"
            style={{ top: `${STICKY_TOP + i * STICKY_STEP}px`, zIndex: 10 + i }}
          >
            <div
              style={{
                transform:      `scale(${scale}) translateY(${translateY}px)`,
                transformOrigin: "top center",
                transition:     "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                willChange:     "transform",
              }}
            >
              <div className="group relative bg-[#F9FAFB] rounded-3xl border border-gray-200 overflow-hidden hover:border-red-200 hover:shadow-xl transition-all duration-500">

                {/* Number Watermark */}
                <div className="absolute right-8 top-8 text-8xl font-black text-gray-100 pointer-events-none group-hover:text-red-50 transition-colors duration-500">
                  0{i + 1}
                </div>

                {/* Text content */}
                <div className="relative z-10 p-10 md:p-12">
                  <div className="md:max-w-[75%]">
                    <div className="flex items-start justify-between mb-8">
                      <Tag>{eje.label}</Tag>
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-gray-900">{eje.title}</h3>
                    <p className="text-lg text-gray-600 leading-relaxed mb-10">{eje.desc}</p>
                  </div>
                  <div className="flex gap-12 pt-8 border-t border-gray-200">
                    {eje.stats.map(s => (
                      <div key={s.l}>
                        <div className="text-2xl font-bold text-gray-900">{s.v}</div>
                        <div className="text-sm font-medium text-red-600 mt-1">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
