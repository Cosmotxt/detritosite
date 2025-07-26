"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Music, Play, Calendar, ChevronDown } from "lucide-react"
import PixelButton from "@/components/pixel-button"
import StarField from "@/components/star-field"
import PixelText from "@/components/pixel-text"
import AlbumCard from "@/components/album-card"
import TourDate from "@/components/tour-date"
import MemberCard from "@/components/member-card"
import { motion } from "framer-motion"
import Header from "@/components/header"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState("home")
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({
    home: null,
    music: null,
    tour: null,
    about: null,
    contact: null,
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)

      // Determine active section
      const scrollPosition = window.scrollY + window.innerHeight / 3

      Object.entries(sectionsRef.current).forEach(([key, section]) => {
        if (
          section &&
          scrollPosition >= section.offsetTop &&
          scrollPosition < section.offsetTop + section.offsetHeight
        ) {
          setActiveSection(key)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const bandMembers = [
    {
      id: 1,
      name: "Ind",
      role: "A vocalista entrou no comecinho da banda e foi quem animou todo mundo a não desistir do projeto (achar vocalista em Fortaleza não é fácil)",
      avatar: "/images/integrantes/ind.jpg",
      bio: "",
    },
    {
      id: 2,
      name: "Reni",
      role: "Nosso guitarrista base tocava jazz até resolver aprender a fazer scream pra ser punk rocker",
      avatar: "/images/integrantes/reni.jpg",
      bio: "",
    },
    {
      id: 5,
      name: "Gabs",
      role: "O guitarrista solo fechou a formação. Reza a lenda que o Gabs não sabia tocar, mas depois de sumir por 3 anos, ele voltou solando como um mestre.",
      avatar: "/images/integrantes/gabs.jpg",
      bio: "",
    },
    {
      id: 3,
      name: "Vince",
      role: "Graças ao nosso baterista a banda tem um nome, sem ele seríamos só um bando de gente triste que toca sem bateria",
      avatar: "/images/integrantes/vince.jpg",
      bio: "",
    },
    {
      id: 4,
      name: "Tilas",
      role: "Nosso baixista foi o integrante mais inusitado da banda, porque se ele não foi mandado dos céus, eu arrisco dizer que ganhamos na loteria.",
      avatar: "/images/integrantes/tilas.jpg",
      bio: "",
    },

  ]

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      <StarField />

      {/* Hero Section */}
      <section
        id="inicio"
        className="min-h-screen flex flex-col items-center justify-center relative pt-16 pb-8"
      >

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 z-10 text-center"
        >
          <div className="flex justify-center">
            <Image
              src="images/logo.png"
              width={2000}
              height={760}
              className="mx-auto max-w-xl lg:max-w-5xl"
              alt="Logo da Detrito Espacial"
            />
            {/* <PixelText
              text="DETRITO ESPACIAL"
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-red-500 font-bold font-pixelify"
              pixelated={true}
              glitchEffect={true}
            /> */}
          </div>

          <p className="max-w-2xl mx-auto mb-8 text-white/80 font-pixelify text-sm sm:text-2xl">
            Grintando os sentimentos que não podem ser contidos
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 font-pixelify">
            <PixelButton href="/links" variant="secondary">
              <Music className="w-6 h-6 mr-2" />
              Ouça Agora
            </PixelButton>
            <PixelButton href="/musicas">
              Conheça nossas músicas
            </PixelButton>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* Latest Release */}
      <section className="py-16 relative" id="musicas">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="pixel-border p-1 bg-black inline-block relative">
                <Image
                  src="/images/capa_devaneios.png"
                  alt="Devaneios de uma Colisão"
                  width={500}
                  height={500}
                  className="w-full max-w-md mx-auto"
                />
                <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay"></div>
              </div>
              <div className="absolute -inset-2 border border-red-500/30 -z-10"></div>
              <div className="absolute -inset-3 border border-red-500/20 -z-20"></div>
              <div className="absolute -inset-4 border border-red-500/10 -z-30"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="font-pixelify text-3xl sm:text-4xl text-white mb-4 inline-block relative">
                <span className="relative z-10 font-extrabold uppercase text-red-500">
                  Momento errado pra estar no escuro
                </span>
                <div className="absolute inset-0 bg-red-500/20 blur-sm -z-10"></div>
              </h2>

              <p className="text-white/80 mb-6">Chegou! Ouça nas suas plataformas favoritas</p>

              <div className="grid grid-cols-2 sm:max-w-xl gap-3 mb-8">
                {[
                  ['Spotify', 'https://open.spotify.com/intl-pt/artist/3mxopIe9nts1L5O5SzFgBu?si=AIQWbuWrTveHczfV-AtB-Q'],
                  ['Deezer', 'https://www.deezer.com/br/artist/293432921'],
                  ['Apple Music', 'https://music.apple.com/br/artist/detrito-espacial/1784592297'],
                  ['YouTube Music', 'https://music.youtube.com/channel/UCew4VT6GE48EftVBFxhA_lw'],
                  ['Amazon Music', 'https://music.amazon.com.br/artists/B0DQ2KJ83N/detrito-espacial'],
                  ['Explore outras músicas', '/musicas']
                ].map((platform) => (
                  <Link
                    key={platform[0]}
                    href={platform[1]}
                    className="px-4 py-4 bg-black/90 border border-red-500/60 hover:bg-red-500/50 transition-colors flex items-center justify-center gap-2 text-lg"
                  >
                    <div className="w-4 h-4 pixel-icon" data-icon={platform[0].toLowerCase().replace(" ", "-")}></div>
                    {platform[0]}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/50 z-0"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-pixel text-3xl sm:text-4xl text-white mb-4 inline-block relative">
              <span className="relative z-10">A BANDA</span>
              <div className="absolute inset-0 bg-red-500/20 blur-sm -z-10"></div>
            </h2>
            <div className="w-24 h-1 bg-red-500 mx-auto"></div>
          </div>

          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-white/80 text-center mb-6">
              Final de 2023, dois amigos entendendo que a vida não era tão fácil quanto parecia. Em meio as novas responsabilidades familiares, trabalho, e faculdade, surge a necessidade de falar sobre raiva, frustração, ansiedade, condições humanas que todos guardam dentro de si esperando o momento de gritar. A Detrito Espacial é um produto do nosso tempo e do nosso meio. Vivemos numa era de solidão crônica, sobreinformação e sofrimento individual, nós somos apenas um mero registro da nossa geração.
            </p>
            <p className="text-white/80 text-center">
              Depois de pesar o clima, vamos explicar pros leigos:<br /> 
              A Detrito Espacial é uma banda brasileira de post-hardcore de Fortaleza-CE, que vem atuando na cena local desde 2024. Buscamos um som visceral, honesto, sentimental e que se não te faz chorar, te faz bater a cabeça contra a parede.<br />              
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {bandMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MemberCard member={member} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-pixel text-3xl sm:text-4xl text-white mb-4 inline-block relative">
              <span className="relative z-10">CONTATO</span>
              <div className="absolute inset-0 bg-red-500/20 blur-sm -z-10"></div>
            </h2>
            <div className="w-24 h-1 bg-red-500 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <img
              src={'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXJ0c3VpZjY2Y2xuNXppb3k4OXR0czJjYW5jMHBxb3QzbGx2cjl0YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/feR3HGIRuOMc52PAWL/giphy.gif'}
              alt={'gatinho tocando guitarra'}
              className="hidden lg:flex w-48"
            />
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-black/50 border border-red-500/30 p-6"
            >
              <h3 className="font-pixel text-xl text-red-500 mb-4">ENVIE UMA MENSAGEM</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-pixel mb-1">
                    NOME
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-black/70 border border-red-500/30 px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-pixel mb-1">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-black/70 border border-red-500/30 px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-pixel mb-1">
                    MENSAGEM
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full bg-black/70 border border-red-500/30 px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  ></textarea>
                </div>
                <PixelButton type="submit" variant="primary" className="w-full">
                  Enviar Mensagem
                </PixelButton>
              </form>
            </motion.div>

            <img
              src={'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExajk0emFsc3dzanV1cnc2MXYyYWV4eHpndTJhZmZmdWUzZWlvODlwMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/10HTAgEA1o5A9a/giphy.gif'}
              alt={'gatinho espacial'}
              className="hidden lg:flex ml-6 w-48"
            />

            {/* <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-black/50 border border-red-500/30 p-6"
            >
              <h3 className="font-pixel text-xl text-red-500 mb-4">INFORMAÇÕES</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-pixel text-sm text-white/90 mb-1">BOOKING & MANAGEMENT</h4>
                  <p className="text-white/70">contato@detritoespacial.com</p>
                </div>

                <div>
                  <h4 className="font-pixel text-sm text-white/90 mb-1">IMPRENSA</h4>
                  <p className="text-white/70">imprensa@detritoespacial.com</p>
                </div>

                <div>
                  <h4 className="font-pixel text-sm text-white/90 mb-1">REDES SOCIAIS</h4>
                  <div className="flex gap-4 mt-2">
                    {["instagram", "spotify", "youtube", "tiktok", "bandcamp"].map((platform) => (
                      <Link
                        key={platform}
                        href="#"
                        className="text-white/70 hover:text-red-500 transition-colors"
                        aria-label={platform}
                      >
                        <div className="w-6 h-6 pixel-icon" data-icon={platform}></div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-red-500/30">
                  <h4 className="font-pixel text-sm text-white/90 mb-3">NEWSLETTER</h4>
                  <p className="text-white/70 text-sm mb-3">
                    Receba novidades, datas de shows e lançamentos exclusivos:
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Seu email"
                      className="flex-1 bg-black/70 border border-red-500/30 px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                    <PixelButton variant="secondary" className="whitespace-nowrap">
                      Inscrever
                    </PixelButton>
                  </div>
                </div>
              </div>
            </motion.div> */}
          </div>
        </div>
      </section>     
    </main>
  )
}
