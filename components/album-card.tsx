"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Disc, Play, X } from "lucide-react"
import PixelButton from "./pixel-button"

type Album = {
  id: number
  title: string
  year: string
  cover: string
  tracks: string[]
}

type AlbumCardProps = {
  album: Album
}

const AlbumCard = ({ album }: AlbumCardProps) => {
  const [showTracks, setShowTracks] = useState(false)

  return (
    <div className="group relative">
      <div className="relative overflow-hidden pixel-border bg-black">
        <Image
          src={album.cover || "/placeholder.svg"}
          alt={album.title}
          width={500}
          height={500}
          className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="font-pixel-alt text-lg text-white">{album.title}</h3>
          <p className="text-white/70 text-sm">{album.year}</p>

          <div className="mt-4 flex gap-2">
            <PixelButton variant="primary" className="flex-1 py-1 px-3">
              <Play className="w-4 h-4 mr-1" />
              Ouvir
            </PixelButton>
            <PixelButton variant="secondary" className="py-1 px-3" onClick={() => setShowTracks(true)}>
              <Disc className="w-4 h-4" />
            </PixelButton>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showTracks && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-0 bg-black/95 border border-red-500/30 z-10 p-4 overflow-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-pixel-alt text-lg text-red-500">{album.title}</h3>
                <p className="text-white/70 text-sm">{album.year}</p>
              </div>
              <button
                onClick={() => setShowTracks(false)}
                className="text-white/70 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ul className="space-y-2">
              {album.tracks.map((track, index) => (
                <li key={index} className="flex items-center gap-3 group/track">
                  <span className="text-white/50 font-pixel text-sm w-5 text-right">{index + 1}</span>
                  <span className="text-white/80 group-hover/track:text-red-500 transition-colors flex-1">{track}</span>
                  <button className="opacity-0 group-hover/track:opacity-100 transition-opacity text-white/70 hover:text-red-500">
                    <Play className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AlbumCard
