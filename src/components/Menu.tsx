import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import Star from '../assets/icons/star.svg?react'
import SvgLogo from '../assets/media/LOGO_DETRITO.svg?react'

interface MenuProps {
  isOpen: boolean
  onClose: () => void
}

const navLinks = [
  { label: 'HOME', target: 'home' },
  { label: 'NOSSA MÚSICA', target: '#musicas' },
  { label: 'PRÓXIMOS SHOWS', target: '#shows' },
  { label: 'MEMBROS', target: '#members' },
]

const Menu = ({ isOpen, onClose }: MenuProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const logoTlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Combine all animations into a single useGSAP hook
  useGSAP(
    (_context, contextSafe) => {
      if (!mounted) return
      const safe = contextSafe!

      const tl = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          if (logoTlRef.current) {
            logoTlRef.current.pause().progress(0)
          }
        }
      })
      tlRef.current = tl

      // Select elements
      const backgrounds = gsap.utils.toArray('.menu-bg')
      const links = gsap.utils.toArray('.menu-link-wrapper')
      const headerElements = gsap.utils.toArray('.menu-header-el')
      const logoPaths = containerRef.current?.querySelectorAll('.svg-logo path')

      // Set initial state for backgrounds (off-screen right)
      gsap.set(backgrounds, { xPercent: 100 })

      if (logoPaths && logoPaths.length > 0) {
        logoPaths.forEach((path) => {
          const len = (path as SVGPathElement).getTotalLength()
          // Set initial fill to transparent so we can animate it smoothly later
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, fill: 'rgba(204, 204, 204, 0)' })
        })
      }

      // Background stagger animation
      tl.to(backgrounds, {
        xPercent: 0,
        duration: 0.8,
        ease: 'power4.inOut',
        stagger: 0.1,
      })

      // Header elements fade in
      tl.fromTo(headerElements,
        { autoAlpha: 0, y: -20 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.1 },
        "-=0.4"
      )

      tl.addLabel('startDrawing', "-=0.3")

      // Links blur reveal and stagger (animates .menu-link-wrapper)
      tl.fromTo(
        links,
        { filter: 'blur(10px)', autoAlpha: 0, x: 50 },
        {
          filter: 'blur(0px)',
          autoAlpha: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        },
        'startDrawing+=0.2'
      )

      // Create a separate timeline for the logo so it doesn't block tl.reverse()
      if (logoPaths && logoPaths.length > 0) {
        const logoTl = gsap.timeline({ paused: true })
        logoTlRef.current = logoTl

        // Draw the logo with ease in/out
        logoTl.to(logoPaths, {
          strokeDashoffset: 0,
          duration: 3,
          ease: 'power3.inOut',
        })
          // Fill it with color at the end
          .to(logoPaths, {
            fill: '#CCCCCC',
            duration: 0.8,
            ease: 'power2.out',
          }, "-=1")
      }

      // Hover effects for links
      const linkElements = gsap.utils.toArray('.menu-link-wrapper') as HTMLElement[]
      linkElements.forEach((item) => {
        const star = item.querySelector('.menu-star')
        const text = item.querySelector('.menu-text')
        const inner = item.querySelector('.menu-link-inner')
        if (!star || !text || !inner) return

        const tlHover = gsap.timeline({ paused: true })

        tlHover.to(star, {
          scale: 1.5,
          rotation: 360,
          duration: 0.5,
          ease: 'back.out(2)',
        }).to(
          text,
          {
            y: -2,
            duration: 0.3,
            ease: 'power2.out',
          },
          0
        ).to(
          inner,
          {
            x: 10,
            duration: 0.3,
            ease: 'power2.out',
          },
          0
        )

        const onEnter = safe(() => tlHover.play())
        const onLeave = safe(() => tlHover.reverse())

        item.addEventListener('mouseenter', onEnter)
        item.addEventListener('mouseleave', onLeave)

        // No need for explicit cleanup of event listeners because useGSAP reverts and cleans up on unmount
      })

      // Close button hover
      const closeBtn = containerRef.current?.querySelector('.menu-close-btn')
      if (closeBtn) {
        const tlCloseHover = gsap.timeline({ paused: true })
        tlCloseHover.to(closeBtn, {
          rotation: 180,
          scale: 1.2,
          duration: 0.5,
          ease: 'back.out(2)',
        })

        const onEnterClose = safe(() => tlCloseHover.play())
        const onLeaveClose = safe(() => tlCloseHover.reverse())

        closeBtn.addEventListener('mouseenter', onEnterClose)
        closeBtn.addEventListener('mouseleave', onLeaveClose)
      }

      // Cleanup timeline
      return () => {
        tl.kill()
      }
    },
    { dependencies: [mounted], scope: containerRef }
  )

  useEffect(() => {
    if (!tlRef.current) return
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      tlRef.current.play()
      if (logoTlRef.current) {
        logoTlRef.current.play(0)
      }
    } else {
      document.body.style.overflow = ''
      tlRef.current.reverse()
    }
  }, [isOpen])

  const handleNavigate = (target: string) => {
    onClose()

    setTimeout(() => {
      if (target === 'home') {
        if (location.pathname === '/') {
          const smoother = ScrollSmoother.get()
          if (smoother) smoother.scrollTo(0, true)
          else window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          navigate('/')
        }
      } else {
        if (location.pathname === '/') {
          const smoother = ScrollSmoother.get()
          if (smoother) smoother.scrollTo(target, true, 'top top')
        } else {
          navigate(`/${target}`)
        }
      }
    }, 800) // Wait for menu close animation
  }

  if (!mounted) return null

  const menuContent = (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Semi-transparent backdrop for the remaining 3/4 of the screen */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-500 cursor-pointer ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Background Layers */}
      <div className="menu-bg fixed inset-y-0 right-0 w-full lg:w-1/3 bg-(--green-color) z-[50]" />
      <div className="menu-bg fixed inset-y-0 right-0 w-full lg:w-1/3 bg-(--dark-color) z-[51]" />
      <div className="menu-bg fixed inset-y-0 right-0 w-full lg:w-1/3 bg-(--red-color) z-[52] flex flex-col items-center px-8 lg:px-[3vw] py-12">

        <button
          onClick={onClose}
          className="menu-close-btn absolute top-6 right-6 lg:top-8 lg:right-8 flex flex-col justify-center items-center w-8 h-8 cursor-pointer group"
          aria-label="Fechar Menu"
        >
          <div className="w-8 h-0.5 bg-(--white-color) absolute rotate-45"></div>
          <div className="w-8 h-0.5 bg-(--white-color) absolute -rotate-45"></div>
        </button>

        {/* Header inside Menu */}
        <div className="menu-header-el flex flex-col items-center w-full mt-6 lg:mt-10">
          <SvgLogo className="svg-logo h-28 lg:h-44 w-auto text-(--white-color) mb-10" />
          <div className="w-[90%] h-px bg-(--white-color)/40 mb-12"></div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col justify-start items-start w-full gap-8 lg:gap-16 pl-2 lg:pl-6">
          {navLinks.map((link) => (
            <div
              key={link.label}
              onClick={() => handleNavigate(link.target)}
              className="menu-link-wrapper cursor-pointer text-(--white-color) transition-colors"
            >
              <div className="menu-link-inner flex items-center gap-4">
                <Star className="menu-star w-5 h-5 lg:w-6 lg:h-6 shrink-0" />
                <span className="menu-text font-uglyqua text-[1.5rem] lg:text-[2rem] leading-none uppercase tracking-wider">
                  {link.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return createPortal(menuContent, document.body)
}

export default Menu
