import Star from '../../assets/icons/star.svg?react'
import InstagramSvg from '../../assets/icons/instagram.svg?react'
import TikokSvg from '../../assets/icons/tiktok.svg?react'
import EmailSvg from '../../assets/icons/email.svg?react'
import CuscuzSvg from '../../assets/icons/cuscuz-2.svg?react'
import Spotify from '../../assets/icons/spotify.svg?react'
import SvgLogo from '../ui/SvgLogo.svg?react'
import Draw from '../../assets/media/mobile/draw-footer.svg?react'
import { useGSAP } from '@gsap/react'
import { SplitText } from 'gsap/SplitText'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'
import { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger, SplitText)

interface SocialLink {
  text: string
  Icon: React.FC<React.SVGProps<SVGSVGElement>>
  link: string,
  className: string
}

const socialLinks: SocialLink[] = [
  {
    text: 'instagram',
    Icon: InstagramSvg,
    link: 'https://www.instagram.com/detritoespacial/',
    className: 'col-start-2 col-span-4 row-start-2 lg:row-start-1 lg:col-start-1 lg:col-span-2'
  },
  {
    text: 'spotify',
    Icon: Spotify,
    link: 'https://open.spotify.com/intl-pt/artist/3mxopIe9nts1L5O5SzFgBu?si=Cik-fbYOTfa2_T_cVIAntQ',
    className: 'col-start-2 col-span-4 row-start-3 lg:row-start-2 lg:col-start-3 lg:col-span-2'
  },
  {
    text: 'tiktok',
    Icon: TikokSvg,
    link: 'https://www.tiktok.com/@detrito.espacial',
    className: 'col-start-2 col-span-4 row-start-4 lg:row-start-3 lg:col-start-2 lg:col-span-2'
  },
  {
    text: 'cuscuz records',
    Icon: CuscuzSvg,
    link: 'https://www.instagram.com/cuscuzrecords/',
    className: 'row-start-5 lg:row-start-4 col-start-2 col-span-4 lg:col-start-3 lg:col-span-2'
  },
  {
    text: 'detritoe@gmail.com',
    Icon: EmailSvg,
    link: 'detritoe@gmail.com',
    className: 'col-start-2 col-span-4 text-center w-full row-start-6 lg:row-start-5 lg:col-start-1 lg:col-span-3'
  },
]

interface NavLink {
  label: string
  target: string
  className: string
}

const navLinks: NavLink[] = [
  { label: 'nossa música', target: '#musicas', className: 'row-start-2 lg:row-start-1 lg:col-start-6 lg:col-span-3 col-span-2' },
  { label: 'próximos shows', target: '#shows', className: 'row-start-2 lg:row-start-2 lg:col-start-5 col-span-2' },
  { label: 'links relevantes', target: '#members', className: 'row-start-2 lg:row-start-3 lg:col-start-4 col-span-2' },
]

const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const drawRef = useRef<SVGSVGElement>(null);

  useGSAP((_context, contextSafe) => {
    if (!containerRef.current) return
    const mm = gsap.matchMedia()
    const items = containerRef.current.querySelectorAll<HTMLElement>('[data-social]')
    const splits: SplitText[] = []

    mm.add({
      isDesktop: '(min-width: 1024px)',
      isMobile: '(max-width: 1023px)'
    }, (context) => {
      const { isDesktop, isMobile } = context.conditions || {}

      const safe = contextSafe!
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

      const svgFooterDesktop = logoRef.current!.querySelectorAll('path')
      const svgFooterMobile = drawRef.current!.querySelectorAll('svg g g path')

      if (isDesktop) {
        console.log('desktop ok.')
        gsap.to(svgFooterDesktop,
          {
            strokeDashoffset: 0,
            ease: 'power3.out',
            duration: 5,
            scrollTrigger: {
              trigger: containerRef.current,
              start: '30% bottom',
              toggleActions: 'play none play none'
            }
          }
        )
      }

      if (isMobile) {
        console.log('mobile ok.')
        svgFooterMobile.forEach((el) => {
          const p = el as SVGPathElement
          const len = p.getTotalLength()
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, autoAlpha: 0 })
        })
        gsap.to(svgFooterMobile,
          {
            strokeDashoffset: 0,
            autoAlpha: 1,
            ease: 'power3.out',
            duration: 3,
            scrollTrigger: {
              trigger: containerRef.current,
              start: '80% bottom',
              toggleActions: 'play none restart none'
            }
          }
        )
      }



    })

    return () => {
      mm.revert();
      splits.forEach(s => { try { s.revert() } catch { } })
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
      }).to(text, {
        y: -2,
        duration: 0.3,
        ease: 'power2.out',
      })

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

  return (
    <footer ref={footerRef} className="absolute bottom-0 w-full h-screen bg-(--red-color) grid grid-cols-4 lg:grid-cols-12 grid-rows-1 will-change-transform z-50">
      <div ref={containerRef} className="col-start-1 col-span-4 lg:col-start-4 lg:col-span-6 h-full flex flex-col">
        <SvgLogo ref={logoRef} className='svg-logo mt-14 hidden lg:flex' />
        <div className="w-full flex-1 min-h-0 grid grid-cols-6 grid-rows-6">
          <ul className="col-start-1 grid grid-cols-subgrid grid-rows-subgrid col-span-6 row-span-12 gap-6 body-text">
            {socialLinks.map(({ text, Icon, link, className }) => (
              <li
                key={text}
                data-social
                className={`cursor-pointer ${className} flex items-center justify-center`}
              >
                <a href={text === "detritoe@gmail.com" ? "mailto:" + link : link} target="_blank" rel="noopener noreferrer">
                  <div data-container className="relative flex items-center justify-center space-x-2">
                    <Star data-arrow className='w-4 h-4' />
                    <span data-text className="lg:inline-block flex text-center">{text}</span>
                    <Star data-arrow className='w-4 h-4 flex lg:hidden' />
                    <div data-icon className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none z-10 text-(--white-color)">
                      <Icon className={`${text === "cuscuz records" ? "w-28 h-28 fill-white" : "w-12 h-12"}`} />
                    </div>
                  </div>
                </a>
              </li>
            ))}

            {navLinks.map(({ label, target, className }) => (
              <li
                key={label}
                data-nav={target}
                className={`cursor-pointer ${className} hidden lg:flex items-center justify-center space-x-2`}
              >
                <Star data-star />
                <span data-navtext className="leading-none">{label}</span>
              </li>
            ))}
          </ul>
        </div>
        <Draw ref={drawRef} className='svg-draw px-5 mt-14 fill-(--white-color) flex mx-auto w-full items-center justify-center self-center lg:hidden' />
        <div className='border-t border-(--white-color) py-3 lg:sm-text flex flex-col lg:flex-row items-center justify-between xs-text'>
          <p className='text-center lg:text-left'>&copy; 2026 Detrito Espacial. Todos os direitos reservados.</p>
          <p className='text-center lg:text-right'>&copy; Desenvolvidor por Elementare Studio</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
