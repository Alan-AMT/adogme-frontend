// modules/shared/components/ui/ImageGallery.tsx
// Galería horizontal + lightbox con flechas y cierre con Escape
// Basado en dp-photo-frame (dogProfile.css): patrón back.jpg como marco
'use client'

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface GalleryImage { src: string; alt: string }

interface ImageGalleryProps {
  images:    GalleryImage[]
  videoUrl?: string
}

export function ImageGallery({ images, videoUrl }: ImageGalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const total = images.length

  // Teclado en lightbox
  useEffect(() => {
    if (lightbox === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')   setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox(i => ((i ?? 0) + 1) % total)
      if (e.key === 'ArrowLeft')  setLightbox(i => ((i ?? 0) - 1 + total) % total)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, total])

  // Lock scroll cuando el lightbox está abierto
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  return (
    <>
      {/* ── Imagen principal ── (dp-photo-frame) */}
      <div
        className="rounded-[1.5rem] p-3 cursor-pointer"
        style={{
          backgroundImage: "url('/assets/ui/back.jpg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '180px auto',
          boxShadow: '0 8px 28px rgba(0,0,0,0.09)',
        }}
        onClick={() => setLightbox(0)}
      >
        <div className="bg-white rounded-[1rem] overflow-hidden border border-black/5">
          <div className="relative w-full aspect-square">
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 340px"
              priority
            />
            {total > 1 && (
              <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-[800]">
                +{total - 1}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Thumbnails ── */}
      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none mt-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setLightbox(i)}
              className={`relative w-16 h-16 rounded-[10px] overflow-hidden flex-shrink-0 border-2 transition-all
                ${lightbox === i ? 'border-[var(--brand)]' : 'border-transparent hover:border-[#e4e4e7]'}`}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="64px" />
            </button>
          ))}
          {videoUrl && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-16 h-16 rounded-[10px] overflow-hidden flex-shrink-0 bg-[#18181b] flex items-center justify-center border-2 border-transparent hover:border-[#e4e4e7] transition-all"
            >
              <span className="material-symbols-outlined text-white" style={{ fontSize: 28, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 28" }}>
                play_circle
              </span>
            </a>
          )}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          {/* Imagen central */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] w-full flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative w-full" style={{ maxHeight: '85vh', aspectRatio: '1/1' }}>
              <Image
                src={images[lightbox].src}
                alt={images[lightbox].alt}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
          </div>

          {/* Cerrar */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>close</span>
          </button>

          {/* Flechas */}
          {total > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setLightbox((lightbox - 1 + total) % total) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>chevron_left</span>
              </button>
              <button
                onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % total) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>chevron_right</span>
              </button>
            </>
          )}

          {/* Contador */}
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-[700]">
            {lightbox + 1} / {total}
          </span>
        </div>
      )}
    </>
  )
}
