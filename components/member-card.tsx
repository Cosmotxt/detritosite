"use client"

import Image from "next/image"
import { motion } from "framer-motion"

type BandMember = {
  id: number
  name: string
  role: string
  avatar: string
  bio: string
}

type MemberCardProps = {
  member: BandMember
}

const MemberCard = ({ member }: MemberCardProps) => {
  return (
    <motion.div className="group relative" whileHover={{ y: -5 }}>
      <div className="pixel-border p-1 bg-black">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={member.avatar || "/placeholder.svg"}
            alt={member.name}
            width={200}
            height={500}
            className="w-full h-full object-cover lg:grayscale group-hover:grayscale-0 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-pixel-alt text-red-500 text-lg">{member.name}</h3>
            <p className="text-white/80 text-sm">{member.role}</p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 translate-x-2 translate-y-2 bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white/70 text-sm">{member.bio}</p>
      </div>
    </motion.div>
  )
}

export default MemberCard
