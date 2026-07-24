"use client"

import * as React from "react"
import { useState } from "react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const photos = [
  {
    type: "video",
    videoId: "wX2VlmpQRrg",
    caption: "Entrevista en Canal 9 Bío Bío Televisión",
    src: "https://img.youtube.com/vi/wX2VlmpQRrg/maxresdefault.jpg",
    href: "https://www.youtube.com/watch?v=wX2VlmpQRrg"
  },
  {
    src: "/fotos/link 1.jpg",
    caption: "1° Encuentro de APYME Chile en la Araucanía",
    href: "https://www.superir.gob.cl/superintendencia-de-insolvencia-expone-en-1-encuentro-de-apyme-chile-en-la-araucania/"
  },
  {
    src: "/fotos/encuentro Caminos Viables para la Reactivación de tu Negocio.jpg",
    caption: "Encuentro Caminos Viables para la Reactivación de tu Negocio",
  },
  {
    src: "/fotos/Jorge peña fernandez en la mesa de reactivacion economica por pandemia, junto al expresidente piñera y demas ministros sectoriales.jpg",
    caption: "Jorge peña fernandez en la mesa de reactivacion economica por pandemia, junto al expresidente piñera y demas ministros sectoriales",
  },
  {
    src: "/fotos/LANZAMIENTO DE MODERNIZACION TRIBUTARIA.png",
    caption: "LANZAMIENTO DE MODERNIZACION TRIBUTARIA",
  },
  {
    src: "/fotos/Presidente de apyme chile en el palacio de la moneda representando a los gremios productivos del pais durante la conmemoracion delos 50 años de democracia.jpg",
    caption: "Presidente de apyme chile en el palacio de la moneda representando a los gremios productivos del pais durante la conmemoracion delos 50 años de democracia",
  },
  {
    src: "/fotos/Programa Piloto del Gobierno Regional 2.jfif",
    caption: "Programa Piloto del Gobierno Regional 2",
  },
  {
    src: "/fotos/Programa Piloto del Gobierno Regional.jfif",
    caption: "Programa Piloto del Gobierno Regional",
  },
  {
    src: "/fotos/segundo circulo empresarial.jfif",
    caption: "segundo circulo empresarial",
  },
]

export function PhotoCarousel() {
  const [playingVideoIndex, setPlayingVideoIndex] = useState<number | null>(null);
  
  const plugin = React.useRef(
    Autoplay({ delay: 7000, stopOnInteraction: false })
  )

  return (
    <div className="w-full mt-24 mb-8">
      <div className="max-w-5xl mx-auto px-0 md:px-20 relative">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={() => {
            // Only resume autoplay if we are NOT playing a video
            if (playingVideoIndex === null) {
              plugin.current.play();
            }
          }}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {photos.map((photo, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-black shadow-xl relative aspect-video flex items-center justify-center">
                    
                    {photo.type === "video" && playingVideoIndex === index ? (
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${photo.videoId}?autoplay=1&rel=0`} 
                        title={photo.caption} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="absolute inset-0 z-30"
                      ></iframe>
                    ) : (
                      <>
                        {photo.type === "video" && (
                           <button 
                             onClick={() => { 
                               setPlayingVideoIndex(index); 
                               plugin.current.stop(); 
                             }} 
                             className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
                             aria-label="Play video"
                           >
                             <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                             </div>
                           </button>
                        )}
                        {photo.href && photo.type !== "video" && (
                          <a 
                            href={photo.href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="absolute inset-0 z-20"
                            aria-label={photo.caption}
                          />
                        )}
                        <img 
                          src={photo.src} 
                          alt={photo.caption} 
                          className={`object-cover w-full h-full ${photo.href && photo.type !== 'video' ? 'group-hover:scale-105 transition-transform duration-700' : ''}`}
                        />
                        <div className="hidden md:block absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12 z-10 pointer-events-none">
                          <p className={`text-center font-medium text-lg md:text-xl drop-shadow-md transition-colors ${(photo.href && photo.type !== 'video') ? 'text-red-300 group-hover:text-red-400 group-hover:underline' : 'text-white'}`}>
                            {photo.caption}
                            {(photo.href && photo.type !== 'video') && <span className="inline-block ml-2 text-sm opacity-80">↗</span>}
                            {photo.type === "video" && (
                              <a 
                                href={photo.href} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="block mt-1 text-sm text-red-400 hover:text-red-300 pointer-events-auto underline"
                              >
                                Ver en YouTube ↗
                              </a>
                            )}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 h-12 w-12 bg-white shadow-md border-gray-200 hover:bg-gray-50 text-gray-700" />
          <CarouselNext className="hidden md:flex -right-12 h-12 w-12 bg-white shadow-md border-gray-200 hover:bg-gray-50 text-gray-700" />
        </Carousel>
      </div>
    </div>
  )
}
