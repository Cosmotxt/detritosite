import Star from '../../assets/icons/star.svg?react'
import InstagramSvg from '../../assets/icons/instagram.svg?react'
import TikokSvg from '../../assets/icons/tiktok.svg?react'
import EmailSvg from '../../assets/icons/email.svg?react'
import Spotify from '../../assets/icons/spotify.svg?react'
import SvgLogo from '../ui/SvgLogo.svg?react'
import { useGSAP } from '@gsap/react'
import { SplitText } from 'gsap/SplitText'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import gsap from 'gsap'
import { useRef } from 'react'

gsap.registerPlugin(SplitText)

interface SocialLink {
  text: string
  Icon: React.FC<React.SVGProps<SVGSVGElement>>
  className: string
}

const socialLinks: SocialLink[] = [
  { text: 'instagram', Icon: InstagramSvg, className: 'row-start-1 col-start-1' },
  { text: 'spotify', Icon: Spotify, className: 'row-start-2 col-start-3 col-span-2' },
  { text: 'tiktok', Icon: TikokSvg, className: 'row-start-3 col-start-2' },
  { text: 'detritoe@gmail.com', Icon: EmailSvg, className: 'row-start-5 col-start-2 col-span-2' },
]

interface NavLink {
  label: string
  target: string
  className: string
}

const navLinks: NavLink[] = [
  { label: 'nossa música', target: '#musicas', className: 'row-start-1 col-start-6 col-span-2' },
  { label: 'próximos shows', target: '#shows', className: 'row-start-2 col-start-5 col-span-2' },
  { label: 'links relevantes', target: '#members', className: 'row-start-3 col-start-4 col-span-2' },
]

const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);

  useGSAP((_context, contextSafe) => {
    if (!containerRef.current) return
    const safe = contextSafe!

    const items = containerRef.current.querySelectorAll<HTMLElement>('[data-social]')
    const splits: SplitText[] = []

    items.forEach((item) => {
      const container = item.querySelector<HTMLElement>('[data-container]')
      const textEl = item.querySelector<HTMLElement>('[data-text]')
      const arrowEl = item.querySelector<HTMLElement>('[data-arrow]')
      const iconEl = item.querySelector<HTMLElement>('[data-icon]')
      if (!container || !textEl || !arrowEl || !iconEl) return

      const split = SplitText.create(textEl, { type: 'chars' })
      splits.push(split)
      const chars = split.chars as HTMLElement[]

      const tl = gsap.timeline({ paused: true })

      tl.to(chars, {
        x: (_i, el) => {
          const r = container.getBoundingClientRect()
          const cr = el.getBoundingClientRect()
          return (r.width / 2) - (cr.left - r.left + cr.width / 2)
        },
        y: (_i, el) => {
          const r = container.getBoundingClientRect()
          const cr = el.getBoundingClientRect()
          return (r.height / 2) - (cr.top - r.top + cr.height / 2)
        },
        scale: 0.2,
        filter: 'blur(8px)',
        autoAlpha: 0,
        duration: 0.35,
        stagger: 0.025,
        ease: 'power3.in',
      }, 0)

      tl.to(arrowEl, {
        rotation: 90,
        autoAlpha: 0,
        duration: 0.25,
        ease: 'power2.in',
      }, 0)

      tl.fromTo(iconEl, {
        scale: 0.3,
        filter: 'blur(8px)',
        autoAlpha: 0,
      }, {
        scale: 1,
        filter: 'blur(0px)',
        autoAlpha: 1,
        duration: 0.4,
        ease: 'power3.out',
      }, 0.1)

      
      const onEnter = safe(() => tl.play())
      const onLeave = safe(() => tl.reverse())
      
      item.addEventListener('mouseenter', onEnter)
      item.addEventListener('mouseleave', onLeave)
    })
    
    gsap.to(logoRef.current!.querySelectorAll('path'), {
      strokeDashoffset: 0,
      ease: 'power3.out',
      duration: 5,
      scrollTrigger: {
        trigger: containerRef.current,
        start: '30% bottom',
        toggleActions: 'play none play none'
      }
    })

    return () => {
      splits.forEach((s) => {
        try { s.revert() } catch {}
      })
    }
  }, { scope: containerRef })

  useGSAP((_context, contextSafe) => {
    if (!containerRef.current) return
    const safe = contextSafe!

    const items = containerRef.current.querySelectorAll<HTMLElement>('[data-nav]')

    items.forEach((item) => {
      const star = item.querySelector<HTMLElement>('[data-star]')
      const text = item.querySelector<HTMLElement>('[data-navtext]')
      if (!star || !text) return

      const tl = gsap.timeline({ paused: true })

      tl.to(star, {
        scale: 1.5,
        rotation: 360,
        duration: 0.5,
        ease: 'back.out(2)',
      }, 0)

      tl.to(text, {
        y: -2,
        duration: 0.3,
        ease: 'power2.out',
      }, 0)

      const onEnter = safe(() => tl.play())
      const onLeave = safe(() => tl.reverse())

      item.addEventListener('mouseenter', onEnter)
      item.addEventListener('mouseleave', onLeave)

      const onClick = safe((e: Event) => {
        e.preventDefault()
        const target = item.getAttribute('data-nav')
        if (!target) return
        const smoother = ScrollSmoother.get()
        if (smoother) {
          smoother.scrollTo(target, true, 'top top')
        }
      })

      item.addEventListener('click', onClick)
    })
  }, { scope: containerRef })

  const handleCuscuzClick = () => {
    window.open('https://cuscuzrecords.com', '_blank', 'noopener')
  }

  return (
    <footer className="absolute inset-0 h-screen translate-y-full bg-(--red-color) grid grid-cols-12 grid-rows-1">
      <div ref={containerRef} className="col-start-4 col-span-6 h-full flex flex-col">
        <SvgLogo ref={logoRef} className='svg-logo mt-14' />
        <div className="w-full flex-1 min-h-0 grid grid-cols-6 grid-rows-6">
          <ul className="col-start-1 grid grid-cols-subgrid grid-rows-subgrid col-span-6 row-span-12 gap-6 body-text">
            {socialLinks.map(({ text, Icon, className }) => (
              <li
                key={text}
                data-social
                className={`cursor-pointer ${className} flex items-center justify-center`}
              >
                <div data-container className="relative flex items-center space-x-2">
                  <Star data-arrow className='w-4 h-4' />
                  <span data-text className="inline-block">{text}</span>
                  <div data-icon className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none z-10 text-(--white-color)">
                    <Icon className="w-12 h-12" />
                  </div>
                </div>
              </li>
            ))}

            <li className="cursor-pointer row-start-4 col-start-3 col-span-2 flex items-center justify-center space-x-2" onClick={handleCuscuzClick}>
              <Star className='w-4 h-4' />
              <span>cuscuz records</span>
            </li>

            {navLinks.map(({ label, target, className }) => (
              <li
                key={label}
                data-nav={target}
                className={`cursor-pointer ${className} flex items-center justify-center space-x-2`}
              >
                <Star data-star />
                <span data-navtext className="leading-none">{label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className='border-t border-(--white-color) py-3 sm-text flex justify-between'>
          <p>&copy; 2026 Detrito Espacial. Todos os direitos reservados.</p>
          <p>&copy; Desenvolvidor por Elementare Studio</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
