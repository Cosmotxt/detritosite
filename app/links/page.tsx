"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  Star,
  Ticket,
  Shirt
} from "lucide-react"
import { 
    SiInstagram,
    SiYoutube,
    SiSpotify, 
    SiTiktok,
    SiX,
} from '@icons-pack/react-simple-icons'
import StarField from "@/components/star-field"
import PixelText from "@/components/pixel-text"

type LinkItem = {
  id: string
  title: string
  subtitle: string
  description: string
  imageUrl?: string
  url: string
  icon: React.ReactNode
  color: string
  featured?: boolean
}

const links: LinkItem[] = [
{
    id: "momento-errado",
    title: "Momento Errado Para Estar No Escuro (Official Visualizer)",
    subtitle: "Novo Lançamento",
    description: "",
    imageUrl: "https://res.cloudinary.com/dw5b1yiwd/image/upload/v1756244976/OFICIAL_mais_leve_sbkhqx.png",
    url: "https://www.youtube.com/watch?v=jOGH0ypnxVY",
    icon: <SiYoutube className="w-6 h-6" />,
    color: "#FF0000",
    featured: true,
},
{
    id: "merch",
    title: "CAMISETAS DA DETRITO ESPACIAL",
    subtitle: "Todo o dinheiro será investido em nosso album! apoie a cena  independente :)",
    description: "USE O NOSSO CUPOM ''DETRITOESPACIAL'' E GANHE 10% DE DESCONTO",
    imageUrl: "https://res.cloudinary.com/dw5b1yiwd/image/upload/v1756476277/camiseta_licupd.webp",
    url: "https://www.numetalwear.com.br/numetalwear/collections/detrito-espacial?page=1",
    icon: <Shirt className="w-6 h-6" />,
    color: "#034c9b",
    featured: true,
},
{
    id: "ingresso-halloween",
    title: "Ingresso para o Halloween Emozero Fest 1° EDIÇÃO",
    subtitle: "VESTE TUA FANTASIA E VEM CURTIR COM A GENTE!",
    description: "Dia 15 de Outubro a Detrito Espacial vai tocar no Emozero Fest! vai ser um terror",
    imageUrl: "https://res.cloudinary.com/dw5b1yiwd/image/upload/v1756477589/Sem_t%C3%ADtulo_m7a0e2.jpg",
    url: "https://www.sympla.com.br/evento/libertariamente-festival-gritando-hc-em-fortaleza-ce/2980568?referrer=l.instagram.com",
    icon: <Ticket className="w-6 h-6" />,
    color: "#f5c207",
    featured: true,
},
{
    id: "ingresso-gritandohc",
    title: "INGRESSO PARA O SHOW DO GRITANDO HC",
    subtitle: "Garanta seu ingresso :)",
    description: "Dia 15 de Novembro a Detrito Espacial vai abrir pro Gritando HC em Fortaleza, vai ser FODA!",
    imageUrl: "https://res.cloudinary.com/dw5b1yiwd/image/upload/v1756476623/68437928e480a-lg_vt3rni.jpg",
    url: "https://www.sympla.com.br/evento/libertariamente-festival-gritando-hc-em-fortaleza-ce/2980568?referrer=l.instagram.com",
    icon: <Ticket className="w-6 h-6" />,
    color: "#f5c207",
    featured: true,
},
{
    id: "live_session",
    title: "Live Session - Estúdio em foco",
    subtitle: "Três músicas ao vivaço direto do estúdio",
    description: "",
    imageUrl: "https://res.cloudinary.com/dw5b1yiwd/image/upload/v1756474769/maxresdefault_udilt7.jpg",
    url: "https://youtu.be/MwqPi_zWjdE?si=W4j0Tk_fn1-YxV-A",
    icon: <SiYoutube className="w-6 h-6" />,
    color: "#FF0000",
    featured: true,
  },
  {
    id: "spotify",
    title: "Spotify",
    subtitle: "Ouça no Spotify",
    description: "Nos adcione na sua playlist :)",
    url: "https://open.spotify.com/artist/3mxopIe9nts1L5O5SzFgBu?si=HQcf2uGfTSCO5rTpGzDZqQ",
    icon: <SiSpotify className="w-6 h-6" />,
    color: "#1DB954",
    featured: true,
  },
    {
    id: "tiktok",
    title: "TikTok",
    subtitle: "@detritoespacial",
    description: "Só besteira",
    url: "https://tiktok.com/@detrito.espacial",
    icon: <SiTiktok className="w-4 h-4" />,
    color: "#69C9D0",
  },
  {
    id: "x",
    title: "x",
    subtitle: "@detritohc",
    description: "Vamos ser amigosss",
    url: "https://x.com/detritohc",
    icon: <SiX className="w-4 h-4" />,
    color: "#fffff0",
  },
  {
    id: "instagram",
    title: "Instagram",
    subtitle: "@detritoespacial",
    description: "Fotos dos bastidores, stories e novidades da banda",
    url: "https://instagram.com/detritoespacial",
    icon: <SiInstagram className="w-5 h-5" />,
    color: "#E4405F",
    featured: true,
  },
    
]

export default function LinksPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
        <>
            <main className="relative min-h-screen bg-black text-white">
            <StarField />

                {/* Header */}
                <div className="relative z-10 pt-20 pb-12">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-12"
                        >
                            {/* Logo and Title */}
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <div className="text-left">
                                    <PixelText
                                    text="LINKS OFICIAIS"
                                    className="text-4xl sm:text-3xl md:text-4xl text-red-500 font-bold"
                                    glitchEffect={true}
                                    />
                                    {/* <p className="text-white/60 font-pixel text-sm">Links Oficiais</p> */}
                                </div>
                            </div>

                            {/* Share Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={copyToClipboard}
                                className="px-6 py-3 bg-black/50 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2 mx-auto font-pixel text-sm rounded-lg"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? "LINK COPIADO!" : "COMPARTILHAR PÁGINA"}
                            </motion.button>
                        </motion.div>
                    </div>
                </div>

                {/* Featured Links */}
                <div className="relative z-10 mb-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-8">
                            <h2 className="font-pixel-alt text-xl text-white mb-2 flex items-center justify-center gap-2">
                                <Star className="w-5 h-5 text-red-500" />
                                NOS SIGAM NAS REDES SOCIAIS
                                <Star className="w-5 h-5 text-red-500" />
                            </h2>
                            <div className="w-24 h-1 bg-red-500 mx-auto"></div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
                        {links.map((link, index) => (
                            <motion.div
                            key={link.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            >

                            <Link href={link.url} target={link.url.startsWith("http") ? "_blank" : "_self"}>
                                <div className="group relative bg-black/80 border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/5 transition-all duration-300 rounded-xl p-6 h-full">
                                    {/* Featured Badge */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div
                                        className="w-14 h-14 rounded-xl border-2 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                                        style={{ borderColor: link.color, backgroundColor: `${link.color}20` }}
                                        >
                                            <div style={{ color: link.color }}>{link.icon}</div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-pixel-alt leading-none text-white/90 font-semibold text-lg mb-1 group-hover:text-red-500 transition-colors">
                                                {link.title}
                                            </h3>
                                            <p className="text-white/70 font-pixel text-xs mb-2">{link.subtitle}</p>
                                        </div>



                                        {link.url.startsWith("http") && (
                                        <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-red-500 transition-colors flex-shrink-0" />
                                        )}
                                    </div>

                                    <p className="text-white/80 text-sm leading-relaxed">{link.description}</p>

                                    {link.imageUrl &&
                                        <div className="aspect-video overflow-hidden mt-7">
                                            <Image 
                                                src={link.imageUrl} 
                                                width={300} height={300} 
                                                alt="capa do video" 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                            />
                                        </div>
                                    }
                                    <div className="mt-4 flex items-center text-white/40 group-hover:text-red-500 transition-colors">
                                        <span className="font-pixel text-xs">ACESSAR</span>
                                        <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>

                                </div>
                            </Link>
                            </motion.div>
                        ))}
                        </div>
                    </div>
                </div>

            </main>
        </>
    )
}
