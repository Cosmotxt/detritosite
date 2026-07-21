import './App.css'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footer from './components/sections/footer'
import Shows from './components/sections/shows'
import Hero from './components/sections/hero'
import Lancamento from './components/sections/lancamento'
import Members from './components/sections/members'
import Musicas from './components/sections/musicas'
import { useRumble } from './hooks/useRumble'

gsap.registerPlugin(ScrollSmoother, ScrollTrigger)

ScrollSmoother.create({
  wrapper: '#smooth-wrapper',
  content: '#smooth-content',
  smooth: 1,
  effects: true,
})

function App() {
  const rumbleRef = useRumble()

  return (
    <>
      <div ref={rumbleRef} className="rumble-overlay" />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="relative">
            <Hero />
            <Lancamento />
          </div>
          <Members />
          <Musicas />
          <div className="relative">
            <Shows />
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
