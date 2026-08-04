'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface ArtistasAlbumProps {
  imagenes: { url: string; alt: string }[]
}

export default function ArtistasAlbum({ imagenes }: ArtistasAlbumProps) {
  const [actual, setActual] = useState(0)

  useEffect(() => {
    if (imagenes.length <= 1) return
    const id = window.setInterval(() => {
      setActual((prev) => (prev + 1) % imagenes.length)
    }, 5000)
    return () => window.clearInterval(id)
  }, [imagenes.length])

  if (!imagenes.length) return null

  return (
    <div className="relative left-1/2 aspect-[4/3] w-screen -translate-x-1/2 overflow-hidden bg-gray-100 sm:left-auto sm:w-full sm:translate-x-0 sm:aspect-[16/9] sm:rounded-2xl">
      {imagenes.map((img, index) => (
        <div
          key={`${img.url}-${index}`}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === actual ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={index !== actual}
        >
          <Image
            src={img.url}
            alt={img.alt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1100px"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  )
}
