"use client"

import { useEffect, useRef } from "react"

type Star = {
  x: number
  y: number
  size: number
  opacity: number
  blinkSpeed: number
}

const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const requestIdRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      generateStars()
    }

    const generateStars = () => {
      const starCount = Math.floor((window.innerWidth * window.innerHeight) / 1000)
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        blinkSpeed: Math.random() * 0.01 + 0.001,
      }))
    }

    const drawStars = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      starsRef.current.forEach((star) => {
        // Update star opacity for blinking effect
        star.opacity = 0.2 + (Math.sin(time * star.blinkSpeed) + 1) * 0.4

        // Draw star as a pixel art dot
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fillRect(Math.floor(star.x), Math.floor(star.y), Math.ceil(star.size), Math.ceil(star.size))
      })

      // Add occasional shooting star
      if (Math.random() < 0.01) {
        drawShootingStar(ctx, canvas.width, canvas.height)
      }

      requestIdRef.current = requestAnimationFrame(drawStars)
    }

    const drawShootingStar = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const startX = Math.random() * width
      const startY = Math.random() * (height / 3)
      const length = 50 + Math.random() * 100
      const angle = Math.PI / 4 + (Math.random() * Math.PI) / 4

      const endX = startX + Math.cos(angle) * length
      const endY = startY + Math.sin(angle) * length

      const gradient = ctx.createLinearGradient(startX, startY, endX, endY)
      gradient.addColorStop(0, "rgba(255, 255, 255, 0)")
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.8)")
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.strokeStyle = gradient
      ctx.lineWidth = 2
      ctx.stroke()
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    requestIdRef.current = requestAnimationFrame(drawStars)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(requestIdRef.current)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-black" />
      <div className="fixed inset-0 z-0 bg-gradient-radial from-transparent to-black/80 pointer-events-none"></div>
    </>
  )
}

export default StarField
