import { useEffect, useRef } from 'react'

export function useRumble() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let frameId: number
    let lastTime = 0
    const minInterval = 1000 / 30

    const rumble = (time: number) => {
      frameId = requestAnimationFrame(rumble)
      if (time - lastTime < minInterval) return
      lastTime = time
      el.style.top = 50 * Math.random() - 100 + 'px'
      el.style.left = 50 * Math.random() - 100 + 'px'
    }

    frameId = requestAnimationFrame(rumble)

    return () => cancelAnimationFrame(frameId)
  }, [])

  return ref
}
