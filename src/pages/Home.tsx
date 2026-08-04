import '../App.css'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import Footer from '../components/sections/footer'
import Shows from '../components/sections/shows'
import Hero from '../components/sections/hero'
import Lancamento from '../components/sections/lancamento'
import Members from '../components/sections/members'
import Musicas from '../components/sections/musicas'
import { useRumble } from '../hooks/useRumble'

gsap.registerPlugin(ScrollSmoother, ScrollTrigger, useGSAP)
ScrollTrigger.config({ ignoreMobileResize: true })

const Home = () => {
  const rumbleRef = useRumble()
  const rootRef = useRef<HTMLDivElement | null>(null)

  useGSAP(() => {
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 2.2,
      smoothTouch: 0.1,
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
    })

    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        ScrollTrigger.refresh()
      } else {
        window.addEventListener('load', () => ScrollTrigger.refresh())
      }
    }

    return () => {
      smoother.kill()
    }
  }, { scope: rootRef })

  return (
    <>
      <div ref={rumbleRef} className="rumble-overlay" />
      <div id="smooth-wrapper" ref={rootRef}>
        <div id="smooth-content">
          <div className="relative">
            <Hero />
            <Lancamento />
          </div>
          <Shows />
          <Musicas />
          <div className="relative">
            <Members />
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
