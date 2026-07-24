"use client"

import { useState } from "react"

const NAV_LINKS = [
  { label: "Inicio",         href: "#inicio" },
  { label: "Sobre APYME",    href: "#sobre" },
  { label: "Hitos",          href: "#hitos" },
  { label: "Ejes de Acción", href: "#ejes" },
  { label: "Visión",         href: "#vision" },
  { label: "Contacto",       href: "#contacto" },
]

const NAV_STYLE = {
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  background: "rgba(255,255,255,0.85)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)",
} as const

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-5xl">

        {/* Main bar */}
        <nav
          className="flex items-center justify-between pl-3 md:pl-4 pr-6 py-3 rounded-2xl border border-gray-200"
          style={NAV_STYLE}
        >
          <a href="#inicio" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo_perfecto.png" alt="Logo APYME" className="h-6 w-auto drop-shadow-sm" />
            <span className="bg-red-600 text-white font-black px-2 py-1 rounded text-[10px] tracking-wider">APYME</span>
            <span className="font-bold text-gray-900 text-sm">Chile</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 font-semibold">
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                className="text-xs text-gray-600 hover:text-red-600 transition-colors duration-200 tracking-wide"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a href="#contacto" className="text-xs px-5 py-2.5 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 hover:shadow-md transition-all duration-200 tracking-wide hidden md:block">
              ÚNETE AL GREMIO
            </a>

            {/* Burger — mobile only */}
            <button
              onClick={() => setOpen(v => !v)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span
                className="block h-px bg-gray-900 transition-all duration-300 origin-center"
                style={{
                  width: "18px",
                  transform: open ? "translateY(6px) rotate(45deg)" : "none",
                }}
              />
              <span
                className="block h-px bg-gray-900 transition-all duration-300"
                style={{
                  width: "18px",
                  opacity: open ? 0 : 1,
                  transform: open ? "scaleX(0)" : "none",
                }}
              />
              <span
                className="block h-px bg-gray-900 transition-all duration-300 origin-center"
                style={{
                  width: "18px",
                  transform: open ? "translateY(-6px) rotate(-45deg)" : "none",
                }}
              />
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        <div
          className="md:hidden mt-2 overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: open ? "320px" : "0px", opacity: open ? 1 : 0 }}
        >
          <div
            className="rounded-2xl border border-gray-200 px-2 py-2 flex flex-col"
            style={NAV_STYLE}
          >
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                onClick={close}
                className="px-4 py-3 text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors tracking-wide"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 px-2 pb-2">
              <a href="#contacto" onClick={close} className="block text-center w-full text-xs font-bold px-4 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all duration-200 tracking-wide">
                ÚNETE AL GREMIO
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
