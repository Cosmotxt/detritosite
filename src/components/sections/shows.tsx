import { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import ArrowDeg from '../../assets/icons/arrowDeg.svg?react'
import Star from '../../assets/icons/star.svg?react'
import shows from '../../data/shows.json'

gsap.registerPlugin(ScrollTrigger)

const Shows = () => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const contentRef = useRef<HTMLDivElement | null>(null)
    const titleRef = useRef<HTMLHeadingElement | null>(null)
    const mobileRowsRef = useRef<HTMLDivElement | null>(null)
    const desktopRowsRef = useRef<HTMLDivElement | null>(null)
    const flyerRef = useRef<HTMLDivElement | null>(null)
    const flyerImgRef = useRef<HTMLImageElement | null>(null)
    const xToRef = useRef<((v: number) => void) | null>(null)
    const yToRef = useRef<((v: number) => void) | null>(null)
    const isVisibleRef = useRef(false)

    useEffect(() => {
        if (!flyerRef.current) return
        gsap.set(flyerRef.current, { scale: 0, autoAlpha: 0, rotation: -6 })
    }, [])

    useGSAP(() => {
        if (!containerRef.current || !titleRef.current) return
        if (!desktopRowsRef.current && !mobileRowsRef.current) return

        const mm = gsap.matchMedia()

        mm.add({
            isDesktop: '(min-width: 1024px)',
            isMobile: '(max-width: 1023px)',
        }, (ctx) => {
            const { isDesktop } = ctx.conditions!
            const rowsContainer = isDesktop ? desktopRowsRef.current : mobileRowsRef.current
            if (!rowsContainer) return

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                    end: 'top 30%',
                    toggleActions: 'play none play reverse',
                }
            })

            tl.fromTo(titleRef.current,
                { filter: 'blur(10px)', autoAlpha: 0 },
                { filter: 'blur(0px)', autoAlpha: 1, duration: 0.8, ease: 'power3.inOut' }
            )

            const rows = gsap.utils.toArray(rowsContainer.children) as HTMLElement[]
            tl.fromTo(rows,
                { filter: 'blur(6px)', autoAlpha: 0, yPercent: 15 },
                { filter: 'blur(0px)', autoAlpha: 1, yPercent: 0, duration: 0.6, ease: 'power3.inOut', stagger: 0.12 },
                '-=0.2'
            )

            if (isDesktop) {
                console.log('oi kkkk')
                gsap.to(contentRef.current, {
                    filter: 'blur(6px)',
                    scale: .80,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        pin: true,
                        scrub: true,
                    }
                })
            }
        })
    }, { scope: containerRef })

    const handleMouseEnter = (index: number) => {
        if (!flyerRef.current || !flyerImgRef.current) return

        const show = shows[index]
        if (!show.flyer) return

        flyerImgRef.current.src = show.flyer

        if (!xToRef.current) {
            xToRef.current = gsap.quickTo(flyerRef.current, 'x', { duration: 0.45, ease: 'power3' })
            yToRef.current = gsap.quickTo(flyerRef.current, 'y', { duration: 0.45, ease: 'power3' })
        }

        gsap.set(flyerRef.current, { rotation: -6 })

        gsap.to(flyerRef.current, {
            scale: 1,
            autoAlpha: 1,
            rotation: 0,
            duration: 0.5,
            ease: 'back.out(1.7)',
            overwrite: 'auto',
        })

        isVisibleRef.current = true
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isVisibleRef.current || !xToRef.current || !yToRef.current) return

        xToRef.current(e.clientX - 60)
        yToRef.current(e.clientY - 180)
    }

    const handleMouseLeave = () => {
        if (!flyerRef.current || !isVisibleRef.current) return

        isVisibleRef.current = false

        gsap.to(flyerRef.current, {
            scale: 0.6,
            autoAlpha: 0,
            rotation: 6,
            duration: 0.35,
            ease: 'power2.in',
            overwrite: 'auto',
        })
    }

    return (
        <section
            ref={containerRef} id="shows"
            className="relative h-screen bg-(--dark-color) grid grid-cols-4 lg:grid-cols-12 items-center"
        >
            <div ref={contentRef} className="col-span-4 lg:col-start-3 lg:col-span-8 h-full px-6 lg:px-0 flex flex-col justify-center gap-y-38 will-change-transform">
                <h1
                    ref={titleRef}
                    className="giant-text text-center leading-none"
                >
                    Shows
                </h1>

                <div ref={mobileRowsRef} className="lg:hidden flex flex-col">
                    {shows.map((show, i) => (
                        <div
                            key={`mobile-${i}`}
                            onMouseEnter={() => handleMouseEnter(i)}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            className="group border-b border-(--white-color)/80 cursor-pointer py-5 flex items-center justify-between gap-3"
                        >
                            <div className="flex flex-col gap-1 min-w-0">
                                <span className="body-text truncate">{show.title}</span>
                                <span className="sm-text text-(--white-color)/60 flex items-center gap-2 whitespace-nowrap">
                                    {show.date}
                                    <Star className="size-(--sm-text) opacity-80 shrink-0" />
                                    {show.city}, {show.state}
                                </span>
                                <span className="sr-only">{show.time}</span>
                            </div>
                            <ArrowDeg className='rotate-35 shrink-0 transition-transform duration-500 fill-(--white-color) size-8' />
                        </div>
                    ))}
                </div>

                {/* DESKTOP */}
                <div ref={desktopRowsRef} className="hidden lg:flex flex-col">
                    {shows.map((show, i) => (
                        <div
                            key={`desktop-${i}`}
                            onMouseEnter={() => handleMouseEnter(i)}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            className="group border-b border-(--white-color)/80 cursor-pointer pt-5 pb-3 hover:py-8 transition-all duration-500 grid grid-cols-4 items-center"
                        >
                            <div className='flex items-center text-center gap-5 col-span-1'>
                                <span className="body-text">{show.title}</span>
                                <span className="body-text text-center">
                                    <ArrowDeg className='rotate-35 group-hover:rotate-45 group-hover:scale-120 transition-transform duration-500' />
                                </span>
                            </div>
                            <span className="col-span-1 body-text text-center text-(--white-color)/50">{show.date}</span>
                            <span className="col-span-1 body-text text-center text-(--white-color)/50">{show.time}</span>
                            <span className="col-span-1 body-text text-(--white-color)/50 text-right">{show.city}, {show.state}</span>
                        </div>
                    ))}
                </div>
            </div>

            {createPortal(
                <div
                    ref={flyerRef}
                    className="fixed top-0 left-0 w-50 h-auto pointer-events-none z-50 opacity-0"
                >
                    <div className="relative w-full">
                        <img
                            ref={flyerImgRef}
                            alt="Show flyer"
                            className="w-full h-full object-cover aspect-3/4"
                        />
                        <div className="absolute inset-0 border border-(--white-color)/30"></div>
                    </div>
                </div>,
                document.body
            )}
        </section>
    )
}

export default Shows
