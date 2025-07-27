"use client"

import { use, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Play, Pause, Volume2, Share2, Heart, Download, Clock, Eye, Calendar, Music } from "lucide-react"
import StarField from "@/components/star-field"
import PixelText from "@/components/pixel-text"
import PixelButton from "@/components/pixel-button"
import Header from "@/components/header"

type Song = {
  id: string
  title: string
  album: string
  videoUrl: string
  spotify: string
  description: string
  lyrics: string[]
}

const songsData: { [key: string]: Song } = {
  "devaneios": {
    id: "devaneios",
    title: "Devaneios de uma Colisão",
    album: "Sangue Visceral",
    videoUrl: "https://res.cloudinary.com/dw5b1yiwd/video/upload/v1753645851/colisao_pxlmre.mp4",
    spotify: "https://open.spotify.com/intl-pt/track/3qvTEcL1Rf5mxLoS3wTWJA?si=5a08b632028e4eb5",
    description: "",
    lyrics: [
    "Noite irracional",
    "Não me entenda mal",
    "Mas atravesso a cidade sem notar",
    "Nessa escuridão",
    "Eu perco a visão",
    "Da estrada que eu vou acelerar",
    "Eu penso muito",
    "Eu penso demais",
    "Me sinto mal pelo cara de trás",
    "Ele não vai sobreviver",
    "Mas eu não posso evitar",
    "Eu não duvido do que eu sou capaz",
    "Ultimamente eu não tenho paz",
    "Eu não quero morrer",
    "Mas isso não vai mudar",
    "Amor",
    "É inevitável o que tá pra acontecer",
    "Eu sinto muito, mas o carro vai bater",
    "Não dou certeza se vamos sobreviver",
    "",
    "Sendo sincera",
    "Eu nem sequer tô aqui",
    "Olha bem pra mim",
    "Olha bem pra mim",
    "Eu tô aí com você",
    "Ontem me vi na TV",
    "Eu tô em todo lugar",
    "E eu não sei o porquê",
    "As pessoas só falam quando pensam em nada",
    "E acabam falando",
    "Nada com nada",
    "E eu penso muito",
    "Eu penso demais",
    "Já ficou fácil me deixar pra trás",
    "Eu quero que me dê",
    "Motivo pra não bater",
    "Amor",
    "É inevitável o que tá pra acontecer",
    "Eu sinto muito, mas o carro vai bater",
    "Não dou certeza se vamos sobreviver",
    "",
    "Isso não vai mudar",
    "Isso não vai mudar",
    "Isso não vai mudar",
    "",
    "Isso não vai mudar",
    "Isso não vai mudar",
    "Isso não vai mudar",
    "",
    "Isso não vai mudar (isso não vai mudar)",
    "Isso não vai mudar (e nessa estrada molhada)",
    "Isso não vai mudar (não vale parar)",
    "",
    "Isso não vai mudar (tudo que eu tenho a perder)",
    "Isso não vai mudar (no fim, não vai importar)",
    "Isso não vai mudar (e nessa estrada molhada)",
    "",
    "Isso não vai mudar (não vale parar)",
    "Isso não vai mudar (tudo que eu tenho a perder)",
    "Isso não vai mudar (no fim, não vai mudar)",
  ],

  },
  "momento-errado": {
    id: "momento-errado",
    title: "momento errado pra estar no escuro",
    album: "Sangue Visceral",
    videoUrl: "https://res.cloudinary.com/dw5b1yiwd/video/upload/v1753643635/momento_errado_vrxwyz.mp4",
    spotify: "#",
    description: "",
    lyrics: [
      "Eu cerro os olhos tentando enxergar",
      "um monte de merda que não vai acontecer",
      "mas a verdade é que eu respirei demais",
      "pra me enforcar",
      "também sei que isso tá além",
      "do que os meus olhos podem ver",
      "",
      "Eu te entendo mas eu me sinto mal",
      "(mas isso não é sobre mim)",
      "Você me entende e eu me sinto mal",
      "(mas isso não é sobre mim)",
      "",
      "Eu já vi tantas vezes isso dar errado",
      "",
      "Um cigarro com um gosto ruim",
      "me faz tentar lembrar",
      "o dia em que ele morreu",
      "porque desceu amargo",
      "",
      "Então perco um pouco de mim",
      "da janela tentando te enxergar daqui",
      "eu tô perdida mais do que quero assumir",
      "o peso tá inteiro",
      "completamente em ti",
      "",
      "Eu te entendo mas eu me sinto mal",
      "(mas isso não é sobre mim)",
      "Você me entende e eu me sinto mal",
      "(mas isso não é sobre mim)",
      "",
      "Eu tenho medo de estar olhando pro vazio",
      "tentando ver o que não importa",
      "porque o que importa muda muito rápido",
      "e eu não sei como lidar",
      "",
      "O prazer da dor é recompensador",
      "mas memórias corrompidas",
      "é um suicídio fracassado",
      "e o meu pulmão apodreceu",
      "de respirar o ar desse quarto",
      "",
      "Já é tarde demais",
      "Já é tarde demais",
      "(pra dormir acordado)",
      "Já é tarde demais",
      "(pra pensar no passado)",
      "Eu não consigo focar",
      "Eu não consigo focar em nada",
      "",
      "Eu cerro os olhos tentando enxergar",
      "um monte de merda que não vai acontecer",
      "mas a verdade é que eu respirei demais",
      "pra me enforcar",
      "também sei que isso tá além",
      "do que os meus olhos podem ver",
    ],

  },
  "entrelacamento-quantico": {
    id: "entrelacamento-quantico",
    title: "Entrelaçamento Quântico",
    album: "Sangue Visceral",
    videoUrl: "https://res.cloudinary.com/dw5b1yiwd/video/upload/v1753642977/entrelacamento_xnhbcl.mp4",
    spotify: "",
    description: "",
    lyrics: [
      "É agora que eu não sei",
      "mais o que eu vou fazer",
      "por que você não me responde agora?",
      "",
      "porque agora eu me sinto bem",
      "ontem à noite eu tava tão bem",
      "mas por que você não me responde agora?",
      "",
      "é culpa do entrelaçamento quântico",
      "é culpa do entrelaçamento quântico",
      "é culpa do entrelaçamento quântico",
      "é culpa do entrelaçamento quântico",
      "e se eu não voltar até às dez",
      "pode se tranquilizar",
      "porque eu não vou voltar",
      "eu não vou voltar",
      "",
      "Acho que eu fracassei",
      "Quando tentei te dizer",
      "Por que você não me responde agora?",
      "",
      "Porque eu só quero que termine bem",
      "Tô cansada desse vai e vem",
      "Mas por que você não me responde agora",
      "",
      "é culpa do entrelaçamento quântico",
      "é culpa do entrelaçamento quântico",
      "é culpa do entrelaçamento quântico",
      "é culpa do entrelaçamento quântico",
      "e se eu não voltar até às dez",
      "pode se tranquilizar",
      "porque eu não vou voltar",
      "eu não vou voltar",
      "",
      "Esse é o meu problema",
      "eu complico as coisas",
      "eu crio dilemas",
      "foi a quarentena",
      "depois desse tempo",
      "eu não consigo mais respirar",
      "responde agora",
      "quem sabe isso não vai me ajudar",
      "Eu cansei",
    ],
  },
  "ponto-cego": {
    id: "ponto-cego",
    title: "Ponto Cego",
    album: "Sangue Visceral",
    videoUrl: "https://res.cloudinary.com/dw5b1yiwd/video/upload/v1753646047/ponto_cego_i7kwza.mp4",
    spotify: "",
    description: "",
    lyrics: [
      "Minha lágrima agora é suor",
      "minha tristeza agora é raiva",
      "Meu medo agora é aflição",
      "E o meu cansaço agora é tesão",
      "",
      "Vamos sair agora",
      "Topo qualquer lugar",
      "eu não tenho hora pra voltar",
      "me avisa se quiser voltar",
      "",
      "Te vi sangrando em sacos",
      "Não quis te magoar",
      "eu não tenho hora pra voltar",
      "mas acho que já vou voltar",
      "",
      "O dia acaba",
      "e o sol continua",
      "Ele nunca vai embora",
      "",
      "A noite chega",
      "ela não é fria",
      "O sol não me incomoda",
      "",
      "Sonho com a minha pele",
      "queimando com o calor",
      "dessa estrada",
      "",
      "Massa infinita",
      "Me aperta e me diga",
      "tudo o que você precisa",
      "que eu te darei",
      "Sou eu amor",
      "(Eu quero me consertar)",
      "",
      "Eu te darei",
      "Eu me darei",
      "(Não, não, não)",
      "Eu tentei lutar",
      "Eu tentei te aceitar",
      'Meu amigo me disse "isso não é normal"',
      "Eu não sabia que esse era eu",
      "Me aponte meu ponto cego",
    ],
  },
    "letargia": {
    id: "letargia",
    title: "Letargia",
    album: "",
    videoUrl: "https://res.cloudinary.com/dw5b1yiwd/video/upload/v1753646014/letargia_r16ryk.mp4",
    spotify: "",
    description: "",
    lyrics: [
      "Desde que eu nasci",
      "Até um tempo atrás",
      "não me sinto humano",
      "não entendi conceitos básicos da vida",
      "",
      "em janeiro eu tô",
      "me sentindo mal",
      "porque eu sei que eu sou",
      "apenas um fantasma do passado",
      "mas só vejo no final",
      "desse ano que vai ser tão bom",
      "",
      "ele vai sentir",
      "falta de mim",
      "no seu ano novo tão sozinho",
      "",
      "eu percebi",
      "uma coisa que",
      "eu não reparei no tempo que eu sofri",
      "",
      "O que eu senti",
      "O que eu mostrei",
      "me aprisionou em minha própria mente",
      "eu sofri",
      "Eu vi",
      "uma coisa em ti",
      "Que eu não gostei",
      "",
      "E só o que eu via eram cinzas de um corpo sem alma",
      "o erro foi eu me entregar",
      "o erro foi eu me entregar?",
      "E aquelas suas palavras tinham o olhar tão vazio",
      "nada parecia real",
      "o erro foi eu me entregar",
      "o erro foi eu me entregar?",
      "desde que eu nasci",
      "desde que nasci",
      "",
      "me aprisionei em minha própria mente",
      "eu sofri",
      "eu não gostei",
      "me aprisionei em minha própria mente",
      "eu sofri",
      "eu não gostei",
      "",
      "O que eu senti",
      "O que eu mostrei",
      "me aprisionou em minha própria mente",
      "eu sofri",
      "Eu vi",
      "uma coisa em ti",
      "Que eu não gostei",
      "",
      "E agora que",
      "Eu me sinto bem",
      "chegou janeiro e eu não entendo quem eu sou",
      "Eu não gostei",
    ],
  },
  "coisas_dancantes": {
    id: "coisas_dancantes",
    title: "coisas_dancantes.mov",
    album: "",
    videoUrl: "https://res.cloudinary.com/dw5b1yiwd/video/upload/v1753645262/coisas_dancantes_xqfzt2.mp4",
    spotify: "",
    description: "",
    lyrics: [
      "Nessa estrada",
      "Cem por hora",
      "abre a janela e olha",
      "nem parece tão rápido, né?",   
      "",
      "Os buracos ",
      "não me incomodam",
      "eu posso facilmente desviar",
      "E essas luzes de vermelho me cegam",
      "Eu vou acelerar",
      "",
      "",
      "Mas parece que",
      "quando cê vai embora",
      "minha juventude seca",
      "minha mente incompleta",
      "não consegue proceder",
      "",
      "Eu te garanto que",
      "de todas minhas memórias",
      "você é minha predileta",
      "madrugada tão deserta",
      "que dá vontade de dançar"
    ]
  },
}

export default function MusicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [showLyrics, setShowLyrics] = useState(true)

  const song = songsData[slug]

  if (!song) {
    return (
      <main className="relative min-h-screen bg-black text-white flex items-center justify-center">
        <StarField />
        <div className="text-center z-10">
          <h1 className="font-pixel-alt text-2xl text-red-500 mb-4">MÚSICA NÃO ENCONTRADA</h1>
          <Link href="/musicas">
            <PixelButton variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar às Músicas
            </PixelButton>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      <StarField />

      {/* Header */}
      <div className="relative z-10 pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/musicas"
              className="text-white/70 hover:text-red-500 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-pixel text-sm">VOLTAR</span>
            </Link>
          </div>

          {/* Song Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Video/Thumbnail */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
            <iframe
            src={ song.videoUrl }
            width="640"
            height="360" 
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture" />

            </motion.div>

            {/* Song Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <PixelText
                  text={song.title}
                  className="text-4xl text-left text-red-500 font-bold mb-2"
                  glitchEffect={true}
                />
                <p className="text-white/80 font-pixel text-lg">{song.album}</p>
              </div>

              <p className="text-white/70 text-base leading-relaxed">{song.description}</p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <PixelButton variant="primary" className="flex-1 sm:flex-none">
                  <Play className="w-4 h-4 mr-2" />
                  <Link href={song.spotify} target="_blank">Ouvir no Spotify</Link>
                </PixelButton>
                <PixelButton
                  variant="outline"
                  onClick={() => setShowLyrics(!showLyrics)}
                  className="flex-1 sm:flex-none"
                >
                  {showLyrics ? "Ocultar" : "Mostrar"} Letra
                </PixelButton>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Lyrics Section */}
      {showLyrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 pb-16"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-pixel-alt text-2xl text-white mb-4">LETRA</h2>
                <div className="w-24 h-1 bg-red-500 mx-auto"></div>
              </div>

              <div className="bg-black/50 border border-red-500/30 p-8">
                <div className="space-y-4 font-mono text-white/90 leading-relaxed">
                  {song.lyrics.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`${
                        line.startsWith("[") && line.endsWith("]")
                          ? "text-red-500 font-pixel text-sm font-bold mt-6 first:mt-0"
                          : line === ""
                            ? "h-4"
                            : "text-white/80 hover:text-white transition-colors cursor-pointer"
                      }`}
                    >
                      {line || "\u00A0"}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Lyrics Footer */}
              <div className="mt-6 text-center">
                <p className="text-white/50 font-pixel text-sm">
                  © Detrito Espacial. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Related Songs */}
      <div className="relative z-10 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-pixel-alt text-xl text-white mb-6 text-center">OUTRAS MÚSICAS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(songsData)
                .filter((s) => s.id !== song.id)
                .slice(0, 3)
                .map((relatedSong) => (
                  <Link key={relatedSong.id} href={`/musicas/${relatedSong.id}`}>
                    <div className="bg-black/30 border border-red-500/20 p-4 hover:border-red-500/50 hover:bg-red-500/5 transition-colors">
                      <h4 className="font-pixel text-white text-sm mb-1">{relatedSong.title}</h4>
                      <p className="text-white/60 text-xs">{relatedSong.album}</p>
                      <div className="flex items-center justify-between mt-2 text-white/50 text-xs">
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
