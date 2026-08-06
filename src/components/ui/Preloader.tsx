import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SvgLogo from '../../assets/media/LOGO_DETRITO.svg?react'

// Import das imagens críticas que devem carregar antes do scroll
import heroImg from '../../assets/media/desktop/HERO.webp'
import lancamentoImg from '../../assets/media/desktop/LANCAMENTO.webp'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const greenRef = useRef<HTMLDivElement>(null)
  const redRef = useRef<HTMLDivElement>(null)
  
  const percentRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Bloqueia o scroll enquanto o preloader está ativo
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useGSAP(() => {
    if (!mounted) return

    const tl = gsap.timeline({
      onComplete: () => {
        // Garantia de que as imagens da Hero Section e Lancamento estão em cache E decodificadas
        const imagesToLoad = [heroImg, lancamentoImg]
        const imagePromises = imagesToLoad.map((src) => {
          return new Promise((resolve) => {
            const img = new Image()
            img.onload = () => {
              // decode() previne o flash na hora de renderizar a imagem como background
              if (img.decode) {
                img.decode().then(resolve).catch(resolve)
              } else {
                resolve()
              }
            }
            img.onerror = resolve // Resolvemos de qualquer forma para não travar
            img.src = src
          })
        })

        const checkLoadAndSlideUp = () => {
          Promise.all(imagePromises).then(() => {
            // Adicionalmente, verifica se a página toda já fez o parse básico
            if (document.readyState === 'complete') {
              slideUp()
            } else {
              window.addEventListener('load', slideUp, { once: true })
            }
          })
        }
        checkLoadAndSlideUp()
      }
    })

    // Prepara o SVG para o efeito de desenhar (DrawSVG)
    const logoPaths = document.querySelectorAll('.svg-logo-preloader path, .svg-logo-preloader circle')
    if (logoPaths && logoPaths.length > 0) {
      logoPaths.forEach((path) => {
        const p = path as SVGPathElement | SVGCircleElement
        const len = p.getTotalLength ? p.getTotalLength() : 800
        gsap.set(p, {
          strokeDasharray: len + 10,
          strokeDashoffset: len + 10,
          fill: 'rgba(204, 204, 204, 0)',
          stroke: '#CCCCCC',
          strokeWidth: 1
        })
      })
    }

    // Animação da barra e porcentagem (0 a 100%) em 2.5 segundos
    const progress = { val: 0 }
    tl.to(progress, {
      val: 100,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (percentRef.current) {
          percentRef.current.innerText = `${Math.round(progress.val)}%`
        }
        if (barRef.current) {
          barRef.current.style.width = `${progress.val}%`
        }
      }
    }, 0)

    // Animação de desenho do logo (stroke)
    if (logoPaths && logoPaths.length > 0) {
      tl.to(logoPaths, {
        strokeDashoffset: 0,
        duration: 2.0,
        ease: 'power2.inOut',
      }, 0)

      // Preenche o logo após desenhar a linha
      tl.to(logoPaths, {
        fill: '#CCCCCC',
        duration: 0.5,
        ease: 'power2.inOut',
      }, 2.0)
    }

    const slideUp = () => {
      // Passando as refs explicitamente garante que o GSAP as encontre e anima na ordem certa.
      // Ordem do array dita o stagger: Container(dark) -> Red -> Green.
      const layers = [containerRef.current, redRef.current, greenRef.current]
      
      gsap.to(layers, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
        stagger: 0.1,
        delay: 0.2, // Pausa dramática no 100%
        onComplete: () => {
          onComplete()
        }
      })
    }

  }, { dependencies: [mounted] })

  if (!mounted) return null

  return createPortal(
    <>
      <div ref={greenRef} className="fixed inset-0 z-[100] bg-(--green-color) pointer-events-none" />
      <div ref={redRef} className="fixed inset-0 z-[101] bg-(--red-color) pointer-events-none" />
      
      <div
        ref={containerRef}
        className="fixed inset-0 z-[102] bg-(--dark-color) flex flex-col items-center justify-center pointer-events-auto"
      >
        <div className="w-[80vw] max-w-[400px] flex flex-col items-center">
          <SvgLogo className="svg-logo-preloader w-full h-auto mb-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
          
          {/* Barra de Loading Horizontal */}
          <div className="w-full h-px bg-(--white-color)/20 mb-6 relative overflow-hidden">
            <div 
              ref={barRef}
              className="absolute top-0 left-0 h-full bg-(--white-color) w-0" 
            />
          </div>
          
          {/* Contador de Porcentagem */}
          <span 
            ref={percentRef}
            className="font-uglyqua text-[2rem] text-(--white-color) tracking-widest leading-none"
          >
            0%
          </span>
        </div>
      </div>
    </>,
    document.body
  )
}
