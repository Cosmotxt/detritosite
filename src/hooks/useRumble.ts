import { useEffect, useRef } from 'react'

export function useRumble() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let frameId: number

    const rumble = () => {
      el.style.top = 50 * Math.random() - 100 + 'px'
      el.style.left = 50 * Math.random() - 100 + 'px'
      frameId = requestAnimationFrame(rumble)
    }

    frameId = requestAnimationFrame(rumble)

    return () => cancelAnimationFrame(frameId)
  }, [])

  return ref
}
