"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import { IntroAnimation, INTRO_DURATION_MS, HERO_REVEAL_MS } from "@/components/intro-animation"
import { PixelIcon } from "@/components/pixel-icon"
import { RevealText } from "@/components/reveal-text"
import { StackingAgentCards } from "@/components/stacking-agent-cards"
import { MobileNav } from "@/components/mobile-nav"
import { PhotoCarousel } from "@/components/photo-carousel"
import dynamic from "next/dynamic"

// Dynamic import — Three.js must only load on the client
const FloatingLogoCubes = dynamic(
  () => import("@/components/floating-logo-cubes").then(m => ({ default: m.FloatingLogoCubes })),
  { ssr: false }
)

// ─── Intersection Observer hook ──────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── Auto Scroll Hook (Solo Móvil) ──────────────────────────────────────────
function useAutoScroll(delay = 7000) {
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const el = ref.current
    if (!el) return

    let intervalId: NodeJS.Timeout
    let isPaused = false

    const scrollNext = () => {
      if (isPaused || window.innerWidth >= 1024) return // Desactivado en desktop
      
      const maxScrollLeft = el.scrollWidth - el.clientWidth
      if (maxScrollLeft <= 0) return

      // Si estamos al final, volver al principio. Si no, avanzar.
      // El CSS de Tailwind (snap) se encargará de centrarlo exacto.
      if (el.scrollLeft >= maxScrollLeft - 20) {
        el.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        el.scrollBy({ left: window.innerWidth * 0.8, behavior: "smooth" })
      }
    }

    const pause = () => { isPaused = true }
    const resume = () => { isPaused = false }

    intervalId = setInterval(scrollNext, delay)

    el.addEventListener("touchstart", pause, { passive: true })
    el.addEventListener("touchend", resume, { passive: true })
    el.addEventListener("mousedown", pause, { passive: true })
    el.addEventListener("mouseup", resume, { passive: true })
    el.addEventListener("mouseleave", resume, { passive: true })

    return () => {
      clearInterval(intervalId)
      el.removeEventListener("touchstart", pause)
      el.removeEventListener("touchend", resume)
      el.removeEventListener("mousedown", pause)
      el.removeEventListener("mouseup", resume)
      el.removeEventListener("mouseleave", resume)
    }
  }, [delay])

  return ref
}

// ─── Bento card ──────────────────────────────────────────────────────────────
function BentoCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl border border-black/[0.07] bg-white overflow-hidden transition-all duration-700 hover:border-red-600/[0.2] hover:bg-white hover:shadow-xl hover:-translate-y-1 ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(229,16,37,0.03), transparent 60%)" }}
      />
      {children}
    </div>
  )
}

// ─── Pill tag ─────────────────────────────────────────────────────────────────
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-red-600 bg-red-50 font-bold border border-red-100 uppercase">
      {children}
    </span>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ApymePage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [heroReady, setHeroReady] = useState(false)

  // Referencias para el auto-scroll de los carruseles móviles
  const carouselPilares = useAutoScroll(7000)
  const carouselHitos = useAutoScroll(7000)
  const carouselProgramas = useAutoScroll(7000)
  const carouselVision = useAutoScroll(7000)
  
  const handleIntroDone = useCallback(() => {
    setHeroReady(true)
  }, [])

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    
    try {
      const response = await fetch("https://formspree.io/f/xbdnzbkd", {
        method: "POST",
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Hubo un error al enviar el mensaje. Por favor intenta de nuevo.");
      }
    } catch (error) {
      alert("Error de conexión. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`)
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`)
  }

  return (
    <div className="bg-[#F9FAFB] text-gray-900 min-h-screen font-sans antialiased selection:bg-red-200">

      {/* ── INTRO ANIMATION ───────────────────────────────────────────────── */}
      <IntroAnimation onDone={handleIntroDone} />

      {/* ── STICKY NAV ────────────────────────────────────────────────────── */}
      <MobileNav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section id="inicio" className="relative min-h-[90vh] md:h-screen flex items-end md:items-center overflow-hidden bg-gradient-to-b from-[#82191b] via-[#ad4e50] to-[#5a1012] md:bg-gradient-to-r md:from-[#82191b] md:from-0% md:via-[#ad4e50] md:via-30% md:to-[#F9FAFB] md:to-55%">

        {/* 3D Floating Cubes — matches the APYME logo */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            opacity: heroReady ? 1 : 0,
            transition: "opacity 2s ease-out 0.3s",
          }}
        >
          {/* On mobile: top right. On desktop: right-aligned, full opacity */}
          <div id="hero-cubes" className="absolute top-0 right-[-10%] w-[70%] h-[50%] md:inset-0 md:left-[40%] md:w-auto md:h-auto flex items-center justify-center">
            <FloatingLogoCubes />
          </div>
        </div>

        {/* Pill on Desktop: Aligned with the navbar (top-7) and same X-axis as text (left-12) */}
        <div
          className="hidden md:inline-flex absolute top-7 left-12 z-40 items-center gap-2 bg-white/80 backdrop-blur-md border border-green-200 text-green-700 text-sm font-semibold px-4 py-2 rounded-full w-fit shadow-sm"
          style={{
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? "translateY(0px)" : "translateY(20px)",
            transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 0ms, transform 1s cubic-bezier(0.16,1,0.3,1) 0ms",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Gremio Activo en Chile
        </div>

        <div className="relative z-30 flex flex-col px-6 md:px-12 pb-16 md:pb-0 pt-24 md:pt-0 max-w-3xl w-full">
          <div
            className="md:hidden inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-green-200 text-green-700 text-xs font-semibold px-4 py-2 rounded-full mb-8 w-fit shadow-sm"
            style={{
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "translateY(0px)" : "translateY(20px)",
              transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 0ms, transform 1s cubic-bezier(0.16,1,0.3,1) 0ms",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Gremio Activo en Chile
          </div>
          
          <h1
            id="hero-title"
            className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-[1.0] tracking-tighter mb-8"
            style={{
              opacity: heroReady ? 1 : 0,
              filter: heroReady ? "blur(0px)" : "blur(24px)",
              transform: heroReady ? "translateY(0px)" : "translateY(32px)",
              transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 100ms, filter 1s cubic-bezier(0.16,1,0.3,1) 100ms, transform 1s cubic-bezier(0.16,1,0.3,1) 100ms",
            }}
          >
            La Voz de los<br />
            <span className="text-red-100">Pequeños Empresarios</span><br />
            de Chile.
          </h1>

          {/* Metrics */}
          <div className="flex gap-8 sm:gap-12 bg-white/90 backdrop-blur-md border border-gray-100 p-6 md:p-8 rounded-2xl w-fit shadow-lg">
            {[
              { value: "23K+", label: "Asociados" },
              { value: "12", label: "Regiones" },
              { value: "7+", label: "Años" },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  opacity: heroReady ? 1 : 0,
                  filter: heroReady ? "blur(0px)" : "blur(16px)",
                  transform: heroReady ? "translateY(0px)" : "translateY(20px)",
                  transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${300 + i * 80}ms, filter 0.8s cubic-bezier(0.16,1,0.3,1) ${300 + i * 80}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${300 + i * 80}ms`,
                }}
              >
                <div className="text-3xl md:text-5xl text-gray-900 font-black tracking-tighter">
                  {stat.value.replace(/\D/g, '')}
                  <span className="text-red-500">{stat.value.replace(/\d/g, '')}</span>
                </div>
                <div className="text-xs text-gray-500 font-medium tracking-widest uppercase mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOBRE APYME ──────────────────────────────────────────────────────── */}
      <section id="sobre" className="py-32 px-6 md:px-12 lg:px-20 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="platform" size={48} />
            <div className="mt-6"><Tag>Quiénes Somos</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05]">
              {"Sobre APYME Chile."}
            </RevealText>
            <p className="mt-6 text-xl md:text-2xl text-gray-700 max-w-4xl font-light leading-relaxed">
              <strong className="font-bold text-gray-900">APYMEChile</strong> es una asociación gremial que cuenta con una base de más de 23 mil socios a nivel nacional, consolidándose como un motor de defensa y representación para las micro, pequeñas y medianas empresas del país. Bajo el liderazgo técnico de Jorge Peña, la institución se ha caracterizado por transformar las necesidades urgentes del ecosistema emprendedor en propuestas de políticas públicas y reformas legislativas con un fuerte arraigo regional.
            </p>
            <p className="mt-6 text-xl md:text-2xl text-gray-700 max-w-4xl font-light leading-relaxed">
              La identidad y gestión de APYME Chile se fundamenta en <strong className="font-bold text-red-600">tres pilares estratégicos:</strong>
            </p>
          </div>

          <div ref={carouselPilares} className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 md:gap-8 pb-8 md:pb-0 snap-x snap-mandatory hide-scrollbar">
            {/* Pilar 1 */}
            <BentoCard className="min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center p-8 bg-white flex flex-col border border-gray-100 shadow-xl relative overflow-hidden" delay={100}>
               <div className="absolute inset-0 bg-gradient-to-b from-red-50 to-transparent pointer-events-none opacity-50" />
               <div className="relative z-10 flex flex-col gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                 </div>
                 <div>
                   <h4 className="text-2xl font-bold text-gray-900 mb-3">Defensa y Estrategia Financiera</h4>
                   <p className="text-gray-600 font-light leading-relaxed text-lg">
                     A través de herramientas como el Programa Puente de Desarrollo Empresarial, la asociación capacita y entrega estrategias a empresarios y emprendedores para optimizar la toma de decisiones en sus finanzas generales y proteger sus flujos de caja frente a escenarios de volatilidad económica.
                   </p>
                 </div>
               </div>
            </BentoCard>

            {/* Pilar 2 */}
            <BentoCard className="min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center p-8 bg-white flex flex-col border border-gray-100 shadow-xl relative overflow-hidden" delay={200}>
               <div className="absolute inset-0 bg-gradient-to-b from-red-50 to-transparent pointer-events-none opacity-50" />
               <div className="relative z-10 flex flex-col gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                 </div>
                 <div>
                   <h4 className="text-2xl font-bold text-gray-900 mb-3">Articulación Gremial y Productiva</h4>
                   <p className="text-gray-600 font-light leading-relaxed text-lg">
                     Posee una alta capacidad para impulsar mesas de reactivación económica, logrando convocar de manera transversal a grandes dirigentes del sector productivo. Su red abarca sectores clave como el transporte logístico, el comercio, las pymes industriales y actividades marítimo-portuarias (armadores pesqueros, varaderos y agentes de carga).
                   </p>
                 </div>
               </div>
            </BentoCard>

            {/* Pilar 3 */}
            <BentoCard className="min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center p-8 bg-white flex flex-col border border-gray-100 shadow-xl relative overflow-hidden" delay={300}>
               <div className="absolute inset-0 bg-gradient-to-b from-red-50 to-transparent pointer-events-none opacity-50" />
               <div className="relative z-10 flex flex-col gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                 </div>
                 <div>
                   <h4 className="text-2xl font-bold text-gray-900 mb-3">Activismo Político y Civil</h4>
                   <p className="text-gray-600 font-light leading-relaxed text-lg">
                     La organización mantiene un rol activo en el debate constitucional del país. Participó como una de las agrupaciones civiles fundadoras del Comando Franja Ciudadana por el Rechazo durante el Plebiscito Constitucional de 2022. Su postura se fundamentó en que el borrador propuesto generaba incertidumbre económica para las pymes, desplegando campañas informativas territoriales con sus bases, instalando la consigna <strong>#RechazoXAmorAChile</strong> en redes sociales y participando con vocerías técnicas en paneles académicos y en la franja electoral televisiva.
                   </p>
                 </div>
               </div>
            </BentoCard>
          </div>
        </div>

        {/* Presencia Nacional - Directamente en el fondo */}
        <div className="w-full mt-24 max-w-7xl mx-auto flex flex-col items-center text-center px-6 relative z-10">
          <h3 className="text-5xl md:text-7xl font-black mb-6 text-gray-900 tracking-tight">
            Presencia Nacional
          </h3>
          <p className="text-2xl md:text-4xl text-gray-600 font-light leading-relaxed max-w-5xl">
            Actualmente contamos con presencia en <strong className="font-bold text-red-600">12 regiones</strong> y tenemos más de <strong className="font-bold text-red-600">23.000 socios</strong> en todo el país.
          </p>
        </div>

        {/* Mapa Extendido Gigante (Fondo transparente ya aplicado por script) */}
        <div className="w-full mt-4 md:-mt-4 flex justify-center relative z-0 overflow-visible pointer-events-none">
          <div className="max-w-7xl w-full relative h-[200px] md:h-[350px]">
            <img 
              src="/mapa_chile.png" 
              alt="Mapa de Chile" 
              className="absolute inset-0 w-full h-full object-contain object-top opacity-30 mix-blend-multiply drop-shadow-2xl scale-100 md:scale-110 origin-top" 
            />
          </div>
        </div>
      </section>

      {/* ── HITOS LEGALES Y ECONÓMICOS ──────────────────────────────────────── */}
      <section id="hitos" className="py-32 px-6 md:px-12 lg:px-20 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <Tag>Nuestro Impacto</Tag>
            <h2 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Hitos Legales y Económicos
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl leading-relaxed">
              El trabajo de APYME Chile se ha traducido en políticas públicas tangibles y cambios legislativos históricos que defienden y protegen a las micro, pequeñas y medianas empresas.
            </p>
          </div>

          <div ref={carouselHitos} className="flex overflow-x-auto lg:grid lg:grid-cols-2 gap-6 lg:gap-12 pb-8 lg:pb-0 snap-x snap-mandatory hide-scrollbar">
            {/* Hito 1: Ley a 30 Días */}
            <BentoCard className="min-w-[85vw] sm:min-w-[400px] lg:min-w-0 snap-center p-8 md:p-10 bg-[#F9FAFB] border border-gray-100 shadow-xl" delay={100}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Ley de Pago a 30 Días (Ley 21.131)</h3>
              </div>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Los dirigentes que hoy dirigen APYME Chile representando a una asociación de emprendedores actuaron como impulsores y articuladores técnicos y políticos fundamentales durante la tramitación de esta ley, logrando blindar la normativa para que se tradujera en liquidez real para las pymes a través de tres acciones clave:
              </p>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="text-red-500 mt-1">✓</div>
                  <div>
                    <strong className="text-gray-900 block mb-1">Fin al "bicicleteo" y cláusulas abusivas</strong>
                    <span className="text-gray-600 text-sm leading-relaxed">Evitaron que las grandes corporaciones impusieran contratos con plazos asimétricos de 90 o 120 días, logrando que el Ministerio de Economía catalogue como nula cualquier extensión que no cumpla con un registro estricto.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="text-red-500 mt-1">✓</div>
                  <div>
                    <strong className="text-gray-900 block mb-1">Inclusión del Sector Público</strong>
                    <span className="text-gray-600 text-sm leading-relaxed">Presionaron para que la obligatoriedad del pago a tiempo rigiera también para ministerios, municipalidades y servicios públicos, impulsando la aplicación de sumarios y sanciones administrativas a los funcionarios que incumplan los plazos.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="text-red-500 mt-1">✓</div>
                  <div>
                    <strong className="text-gray-900 block mb-1">Certeza financiera y Guía Electrónica</strong>
                    <span className="text-gray-600 text-sm leading-relaxed">Consiguieron que el retraso en el pago genere automáticamente intereses (tasa máxima convencional) y comisiones de cobranza sin necesidad de demandas judiciales. Además, defendieron el uso obligatorio de la guía de despacho electrónica para fijar con precisión el inicio exacto del plazo de pago.</span>
                  </div>
                </li>
              </ul>
            </BentoCard>

            {/* Hito 2: Pandemia */}
            <BentoCard className="min-w-[85vw] sm:min-w-[400px] lg:min-w-0 snap-center p-8 md:p-10 bg-[#F9FAFB] border border-gray-100 shadow-xl" delay={200}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Mitigación ante la Crisis Sanitaria</h3>
              </div>
              <p className="text-gray-600 mb-8 leading-relaxed">
                En el contexto de la crisis económica y sanitaria, la gestión liderada por Jorge Peña presentó soluciones estructurales al Ejecutivo y al Congreso:
              </p>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="text-red-500 mt-1">✓</div>
                  <div>
                    <strong className="text-gray-900 block mb-1">Autocrédito AFP (09-04-2020)</strong>
                    <span className="text-gray-600 text-sm leading-relaxed">Presentación de una propuesta formal ante el Ejecutivo para permitir el retiro de fondos previsionales bajo la modalidad de autocrédito para el resguardo de los trabajadores y emprendedores.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="text-red-500 mt-1">✓</div>
                  <div>
                    <strong className="text-gray-900 block mb-1">Rediseño de Créditos FOGAPE (09-04-2020)</strong>
                    <span className="text-gray-600 text-sm leading-relaxed">Propuesta técnica para flexibilizar e inyectar de manera urgente liquidez inmediata a las empresas que enfrentaban el congelamiento de sus operaciones.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="text-red-500 mt-1">✓</div>
                  <div>
                    <strong className="text-gray-900 block mb-1">Creación del Subsidio al Empleo</strong>
                    <span className="text-gray-600 text-sm leading-relaxed">De la propuesta a la realidad: APYME Chile diseñó y propuso activamente al Ejecutivo una política pública de subsidios focalizados para la contratación y retención de trabajadores, acogida con éxito como herramienta clave de reactivación laboral.</span>
                  </div>
                </li>
              </ul>
            </BentoCard>
          </div>

          {/* Otros Programas e Iniciativas */}
          <div ref={carouselProgramas} className="mt-12 flex overflow-x-auto md:grid md:grid-cols-3 gap-6 pb-6 md:pb-0 snap-x snap-mandatory hide-scrollbar">
            <BentoCard className="min-w-[80vw] sm:min-w-[280px] md:min-w-0 snap-center p-6 bg-[#F9FAFB] flex flex-col border border-gray-100 shadow-sm" delay={300}>
              <div className="text-red-500 mb-2 font-bold text-xl">❖</div>
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong className="text-gray-900 block mb-1">Mesas de Reactivación</strong>
                Impulsar mesas de reactivación económica con participación de grandes dirigentes del sector productivo de asociaciones de transporte, armadores pesqueros, varadero, portuaria, logística, agentes de carga, pymes industriales y comercio.
              </p>
            </BentoCard>
            <BentoCard className="min-w-[80vw] sm:min-w-[280px] md:min-w-0 snap-center p-6 bg-[#F9FAFB] flex flex-col border border-gray-100 shadow-sm" delay={400}>
              <div className="text-red-500 mb-2 font-bold text-xl">❖</div>
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong className="text-gray-900 block mb-1">Desarrollo Empresarial</strong>
                Programa puente de desarrollo empresarial, estrategia, toma de decisión y finanzas generales.
              </p>
            </BentoCard>
            <BentoCard className="min-w-[80vw] sm:min-w-[280px] md:min-w-0 snap-center p-6 bg-[#F9FAFB] flex flex-col border border-gray-100 shadow-sm" delay={500}>
              <div className="text-red-500 mb-2 font-bold text-xl">❖</div>
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong className="text-gray-900 block mb-1">Capacitación (La Araucanía)</strong>
                Programa de servicios de capacitación y plan de nivelación académica e industria para la corporación de agencia de desarrollo productivo de La Araucanía.
              </p>
            </BentoCard>
          </div>
        </div>
        <PhotoCarousel />
      </section>

      {/* ── EJES DE ACCIÓN ──────────────────────────────────────────────────── */}
      <section id="ejes" className="py-32 px-6 md:px-12 lg:px-20 border-t border-gray-200 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <PixelIcon type="workflow" size={48} />
              <div className="mt-6"><Tag>Lo que Hacemos</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
                {"Nuestros Ejes\nde Acción."}
              </RevealText>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed max-w-sm">
              Centramos nuestros esfuerzos en propuestas concretas que generan un impacto real en la vida diaria de los emprendedores.
            </p>
          </div>

          <StackingAgentCards />
        </div>
      </section>


      {/* ── VISIÓN Y POSICIONAMIENTO ────────────────────────────────────────── */}
      <section id="vision" className="py-32 px-6 md:px-12 lg:px-20 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <Tag>Visión Estratégica</Tag>
            <h2 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Visión y Posicionamiento Político-Económico
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-4xl leading-relaxed">
              Esta sección detalla la postura ideológica, la capacidad de análisis y el rol de APYME Chile como un actor clave en el debate macroeconómico y social del país, trascendiendo la mera gestión comercial:
            </p>
          </div>

          <div ref={carouselVision} className="flex overflow-x-auto lg:grid lg:grid-cols-3 gap-6 lg:gap-8 pb-8 lg:pb-0 snap-x snap-mandatory hide-scrollbar">
            <BentoCard className="min-w-[85vw] sm:min-w-[320px] lg:min-w-0 snap-center p-8 bg-[#F9FAFB] border border-gray-100 shadow-lg flex flex-col hover:shadow-xl transition-shadow duration-300" delay={100}>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0 mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Anticipación e Incidencia ante Escenarios de Crisis</h3>
              <p className="text-gray-600 leading-relaxed text-sm flex-grow">
                La directiva liderada por Jorge Peña demostró una alta capacidad de lectura política y económica al presentar propuestas de contingencia (como el Autocrédito AFP y el rediseño del FOGAPE) de manera simultánea al inicio de las restricciones por la crisis sanitaria (abril de 2020). Esto posiciona a la asociación no solo como un reactor ante las crisis, sino como un generador de agenda con capacidad de adelantarse a los impactos financieros en las bases productivas.
              </p>
            </BentoCard>

            <BentoCard className="min-w-[85vw] sm:min-w-[320px] lg:min-w-0 snap-center p-8 bg-[#F9FAFB] border border-gray-100 shadow-lg flex flex-col hover:shadow-xl transition-shadow duration-300" delay={200}>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0 mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Defensa de la Estabilidad Regulatoria y Certeza Jurídica</h3>
              <div className="text-gray-600 leading-relaxed text-sm space-y-4 flex-grow">
                <p>El alineamiento activo de APYME Chile con la opción Rechazo en el Plebiscito de 2022 visibilizó que para el gremio la certidumbre jurídica es un pilar intransable para el desarrollo empresarial.</p>
                <p>Su discurso se centró en advertir que las reglas del juego claras son un requisito básico para que los emprendedores puedan proyectar sus inversiones, generar empleo y mantener la operatividad de sus negocios sin riesgos de gobernanza.</p>
              </div>
            </BentoCard>

            <BentoCard className="min-w-[85vw] sm:min-w-[320px] lg:min-w-0 snap-center p-8 bg-[#F9FAFB] border border-gray-100 shadow-lg flex flex-col hover:shadow-xl transition-shadow duration-300" delay={300}>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0 mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Validación e Interlocución Técnica con el Poder Estado</h3>
              <div className="text-gray-600 leading-relaxed text-sm space-y-4 flex-grow">
                <p>Al lograr que propuestas complejas como el Subsidio al Empleo se concretaran en políticas públicas gubernamentales, y al fiscalizar el comportamiento de pago de ministerios y municipalidades, la dirigencia consolidó su rol como un interlocutor técnico válido frente al Poder Ejecutivo y Legislativo.</p>
                <p>La asociación actúa como un puente técnico indispensable que traduce las realidades de la calle y las regiones en normativas viables para el Estado chileno.</p>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ── CONTACTO / CTA ────────────────────────────────────────────────── */}
      <section id="contacto" className="relative py-32 px-6 md:px-12 lg:px-20 border-t border-gray-200 overflow-hidden bg-[#F9FAFB]">
        <div className="absolute inset-0 bg-red-600/[0.02] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <Tag>Contacto</Tag>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6 mt-6">
              Únete a APYME<br />Chile.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              ¿Quieres unirte al gremio, proponer una iniciativa o saber más sobre nosotros? Estamos aquí para escucharte.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-gray-600">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shrink-0 text-red-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">Email</div>
                  <a href="mailto:apymechile@gmail.com" className="hover:text-red-600 transition-colors">apymechile@gmail.com</a>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-600 mt-6">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shrink-0 text-red-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">Instagram</div>
                  <a href="https://www.instagram.com/apymechile/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">@apymechile</a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative z-20">
            {!submitted ? (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nombre completo</label>
                  <input type="text" name="nombre" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Correo electrónico</label>
                  <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Región</label>
                  <select name="region" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all">
                    <option value="">Selecciona tu región</option>
                    <option value="Arica y Parinacota">Región de Arica y Parinacota</option>
                    <option value="Tarapacá">Región de Tarapacá</option>
                    <option value="Antofagasta">Región de Antofagasta</option>
                    <option value="Atacama">Región de Atacama</option>
                    <option value="Coquimbo">Región de Coquimbo</option>
                    <option value="Valparaíso">Región de Valparaíso</option>
                    <option value="Metropolitana">Región Metropolitana de Santiago</option>
                    <option value="O'Higgins">Región del L.G. Bernardo O'Higgins</option>
                    <option value="Maule">Región del Maule</option>
                    <option value="Ñuble">Región de Ñuble</option>
                    <option value="Biobío">Región del Biobío</option>
                    <option value="Araucanía">Región de La Araucanía</option>
                    <option value="Los Ríos">Región de Los Ríos</option>
                    <option value="Los Lagos">Región de Los Lagos</option>
                    <option value="Aysén">Región de Aysén del G. Carlos Ibáñez del Campo</option>
                    <option value="Magallanes">Región de Magallanes y de la Antártica Chilena</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mensaje</label>
                  <textarea name="mensaje" rows={3} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all resize-none"></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full mt-2 px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:bg-gray-400 transition-colors shadow-lg shadow-red-600/20">
                  {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Mensaje Enviado!</h3>
                <p className="text-gray-500">Nos pondremos en contacto contigo a la brevedad.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 md:px-12 lg:px-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <span className="bg-red-600 text-white font-black px-2 py-1 rounded text-sm tracking-wider">APYME</span>
            <span className="font-bold text-xl">Chile</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {[
              { label: "Inicio", href: "#inicio" },
              { label: "Sobre APYME", href: "#sobre" },
              { label: "Ejes de Acción", href: "#ejes" },
              { label: "Liderazgo", href: "#liderazgo" },
              { label: "Contacto", href: "#contacto" },
            ].map(l => (
              <a key={l.label} href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</a>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center">
          <span className="text-sm text-gray-500">© 2026 APYME Chile. Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  )
}
