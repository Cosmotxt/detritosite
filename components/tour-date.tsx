"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, ExternalLink } from "lucide-react"
import PixelButton from "./pixel-button"

type TourDate = {
  id: number
  date: string
  venue: string
  city: string
  ticketLink: string
}

type TourDateProps = {
  date: TourDate
}

const TourDate = ({ date }: TourDateProps) => {
  const formattedDate = new Date(date.date).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <motion.div
      className="border border-red-500/30 bg-black/50 mb-4 p-4 hover:bg-red-500/10 transition-colors"
      whileHover={{ x: 5 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="bg-red-500/20 p-2 rounded-sm">
            <Calendar className="w-5 h-5 text-red-500" />
          </div>

          <div>
            <p className="font-pixel-alt text-white text-sm">{formattedDate}</p>
            <div className="flex items-center gap-1 text-white/70 text-sm mt-1">
              <MapPin className="w-3 h-3" />
              <span>
                {date.venue} • {date.city}
              </span>
            </div>
          </div>
        </div>

        <PixelButton href={date.ticketLink} variant="outline" className="sm:w-auto w-full">
          <span>Ingressos</span>
          <ExternalLink className="w-3 h-3 ml-2" />
        </PixelButton>
      </div>
    </motion.div>
  )
}

export default TourDate
