"use client"

import type React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type PixelButtonProps = {
  children: React.ReactNode
  href?: string
  variant?: "primary" | "secondary" | "outline"
  className?: string
  type?: "button" | "submit" | "reset"
  onClick?: () => void
}

const PixelButton = ({
  children,
  href,
  variant = "primary",
  className,
  type = "button",
  onClick,
}: PixelButtonProps) => {
  const baseClasses =
    "relative inline-flex items-center justify-center px-6 py-2 font-pixel text-lg uppercase transition-all duration-200 overflow-hidden"

  const variantClasses = {
    primary: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-black border-2 border-red-500 text-red-500 hover:bg-red-500/20",
    outline: "bg-transparent border-2 border-red-500/50 text-white hover:border-red-500 hover:bg-red-500/10",
  }

  const buttonContent = (
    <>
      <span className="relative z-10 flex items-center">{children}</span>
      <span className="absolute inset-0 z-0 pixel-button-border"></span>
    </>
  )

  const buttonClasses = cn(baseClasses, variantClasses[variant], className)

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {buttonContent}
      </Link>
    )
  }

  return (
    <motion.button type={type} className={buttonClasses} onClick={onClick} whileTap={{ scale: 0.98 }}>
      {buttonContent}
    </motion.button>
  )
}

export default PixelButton
