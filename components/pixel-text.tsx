"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type PixelTextProps = {
  text: string
  className?: string
  glitchEffect?: boolean
  pixelated?: boolean
}

const PixelText = ({ text, className, glitchEffect = false, pixelated = true }: PixelTextProps) => {
  const letters = Array.from(text)

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div
      className={cn("inline-block", pixelated && "pixel-render", className)}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={child}
          className={cn("inline-block", glitchEffect && "hover:text-red-400 hover:animate-glitch transition-colors pixelifySans.className")}
          style={{
            textShadow: glitchEffect
              ? "0.05em 0 0 rgba(255,0,0,0.75), -0.025em -0.05em 0 rgba(0,255,0,0.75), 0.025em 0.05em 0 rgba(0,0,255,0.75)"
              : undefined,
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  )
}

export default PixelText
