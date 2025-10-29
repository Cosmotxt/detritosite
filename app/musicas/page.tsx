"use client"

import { ArrowLeft, Clock, Eye, Headphones, Music2, Play } from "lucide-react"

import Image from "next/image"
import Link from "next/link"
import PixelText from "@/components/pixel-text"
import StarField from "@/components/star-field"
import { motion } from "framer-motion"
import { useState } from "react"

type Song = {
  id: string
  title: string
  album: string
  thumbnail: string
  videoUrl: string
  releaseDate: string
  description: string
}

const songs: Song[] = [
  {
    id: "devaneios",
    title: "Devaneios de uma Colisão",
    album: "Sangue Visceral",
    thumbnail: "https://i.scdn.co/image/ab67616d0000b273520cdacb33da5d90662f6254",
    videoUrl: "https://www.youtube.com/watch?v=SV0c3asr--s",
    releaseDate: "2024",
    description: "",
  },
  {
    id: "momento-errado",
    title: "Momento Errado Para Estar No Escuro",
    album: "Sangue Visceral",
    thumbnail: "https://res.cloudinary.com/dw5b1yiwd/image/upload/v1756244976/OFICIAL_mais_leve_sbkhqx.png",
    videoUrl: "",
    releaseDate: "2025",
    description: "",
  },
  {
    id: "entrelacamento-quantico",
    title: "Entrelaçamento Quântico",
    album: "Sangue Visceral",
    thumbnail: "https://res.cloudinary.com/dw5b1yiwd/image/upload/v1756244976/OFICIAL_mais_leve_sbkhqx.png",
    videoUrl: "",
    releaseDate: "Em Breve",
    description: "",
  },
  {
    id: "ponto-cego",
    title: "Ponto Cego",
    album: "Sangua Visceral",
    thumbnail: "https://res.cloudinary.com/dw5b1yiwd/image/upload/v1756244976/OFICIAL_mais_leve_sbkhqx.png",
    videoUrl: "",
    releaseDate: "Em Breve",
    description: "",
  },
  {
    id: "letargia",
    title: "Letargia",
    album: "",
    thumbnail: "/placeholder.svg?height=300&width=400",
    videoUrl: "",
    releaseDate: "Para o Futuro",
    description: "",
  },
  {
    id: "coisas-dancantes",
    title: "coisas_dancantes.MOV",
    album: "",
    thumbnail: "/placeholder.svg?height=300&width=400",
    videoUrl: "",
    releaseDate: "Para o Futuro",
    description: "",
  },
  {
    id: "me-diga-vc",
    title: "me diga vc",
    album: "",
    thumbnail: "/placeholder.svg?height=300&width=400",
    videoUrl: "",
    releaseDate: "Para o Futuro",
    description: "",
  },
]

export default function MusicasPage() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSongs = songs.filter((song) => {
    const matchesFilter = filter === "all" || song.album.toLowerCase().includes(filter.toLowerCase())
    const matchesSearch =
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.album.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      <StarField />

      {/* Header */}
      <div className="relative z-10 pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="text-white/70 hover:text-red-500 transition-colors flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-pixel text-sm">VOLTAR</span>
            </Link>
          </div>

          <div className="text-center mb-12">
            <PixelText
              text="MÚSICAS"
              className="text-5xl lg:text-7xl text-red-500 font-bold mb-4"
              glitchEffect={true}
            />
            <p className="text-white/80 font-pixel text-sm max-w-2xl mx-auto">
              Explore nossas composições. Aqui vocês encontram os sons lançados e os não lançados. Aqui é uma sessão para quem quer aprender a cantar nossas músicas e entender melhor o contexto por trás!
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar músicas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/70 border border-red-500/30 px-4 py-2 text-white font-pixel text-sm focus:outline-none focus:border-red-500 placeholder:text-white/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Songs Grid */}
      <div className="relative z-10 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <Link href={`/musicas/${song.id}`}>
                  <div className="relative overflow-hidden pixel-border bg-black hover:bg-red-500/5 transition-colors">
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={song.thumbnail || "/placeholder.svg"}
                        alt={song.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Play Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-red-500 p-3 rounded-full">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </div>

                      {/* Album Badge */}
                      <div className="absolute top-2 left-2 bg-black/80 px-2 py-1">
                        <span className="font-pixel text-xs text-red-500">{song.album}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-pixel-alt text-lg text-white mb-2 group-hover:text-red-500 transition-colors">
                        {song.title}
                      </h3>

                      <p className="text-white/70 text-sm mb-3 line-clamp-2">{song.description}</p>

                      <div className="flex items-center justify-between text-white/50 text-sm">
                        <div className="flex items-center gap-4">
                          
                        </div>
                        <span className="font-pixel">{song.releaseDate}</span>
                      </div>
                    </div>

                    {/* Pixel Border Animation */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500/50 transition-colors pointer-events-none"></div>
                  </div>
                </Link>

              </motion.div>
            ))}
          </div>

          {filteredSongs.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🌌</div>
              <h3 className="font-pixel-alt text-xl text-white/80 mb-2">NENHUMA MÚSICA ENCONTRADA</h3>
              <p className="text-white/60 font-pixel text-sm">Tente ajustar os filtros ou termo de busca</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
