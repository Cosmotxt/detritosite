import { useRef } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import ArrowDeg from '../../assets/icons/arrowDeg.svg?react'
import Star from '../../assets/icons/star.svg?react'
import shows from '../../data/shows.json'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Shows = () => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const contentRef = useRef<HTMLDivElement | null>(null)
    const titleRef = useRef<HTMLHeadingElement | null>(null)
    const mobileRowsRef = useRef<HTMLDivElement | null>(null)
    const desktopRowsRef = useRef<HTMLDivElement | null>(null)
    const flyerRef = useRef<HTMLDivElement | null>(null)
    const flyerImgRef = useRef<HTMLImageElement | null>(null)
    const isVisibleRef = useRef(false)

    useGSAP((_context, contextSafe) => {
        if (!containerRef.current || !titleRef.current) return
        if (!desktopRowsRef.current && !mobileRowsRef.current) return
        if (!flyerRef.current) return

        const safe = contextSafe!

        gsap.set(flyerRef.current, { scale: 0, autoAlpha: 0, rotation: -6 })

        const xTo = gsap.quickTo(flyerRef.current, 'x', { duration: 0.45, ease: 'power3' })
        const yTo = gsap.quickTo(flyerRef.current, 'y', { duration: 0.45, ease: 'power3' })

        const onEnter = safe((index: number) => {
            if (!flyerRef.current || !flyerImgRef.current) return

            const show = shows[index]
            if (!show.flyer) return

            flyerImgRef.current.src = show.flyer

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
        })

        const onMove = safe((e: MouseEvent) => {
            if (!isVisibleRef.current) return
            xTo(e.clientX - 60)
            yTo(e.clientY - 180)
        })

        const onLeave = safe(() => {
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
        })

        const cleanups: Array<() => void> = []

        const bindRow = (row: HTMLElement, index: number) => {
            const enterHandler = () => onEnter(index)
            row.addEventListener('mouseenter', enterHandler)
            row.addEventListener('mousemove', onMove)
            row.addEventListener('mouseleave', onLeave)
            cleanups.push(() => {
                row.removeEventListener('mouseenter', enterHandler)
                row.removeEventListener('mousemove', onMove)
                row.removeEventListener('mouseleave', onLeave)
            })
        }

        gsap.set(titleRef.current, { opacity: 0, filter: 'blur(10px)' })
        const allRows = [
            ...gsap.utils.toArray(mobileRowsRef.current?.children ?? []) as HTMLElement[],
            ...gsap.utils.toArray(desktopRowsRef.current?.children ?? []) as HTMLElement[],
        ]
        gsap.set(allRows, { opacity: 0, filter: 'blur(6px)' })

        const mm = gsap.matchMedia()

        mm.add({
            isDesktop: '(min-width: 1024px)',
            isMobile: '(max-width: 1023px)',
        }, (ctx) => {
            const { isDesktop } = ctx.conditions!
            const rowsContainer = isDesktop ? desktopRowsRef.current : mobileRowsRef.current
            if (!rowsContainer) return

            const rows = gsap.utils.toArray(rowsContainer.children) as HTMLElement[]

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: '20% bottom',
                    end: '80% bottom',
                    scrub: 1,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                }
            })

            tl.to(titleRef.current,
                { 
                    filter: 'blur(0px)', 
                    autoAlpha: 1,
                    // duration: 0.3, 
                    // ease: 'power3.in' 
                }
            ).to(rows,
                {   
                    filter: 'blur(0px)', 
                    autoAlpha: 1,
                    // duration: 0.3, 
                    // ease: 'power3.in',
                    stagger: 0.09 
                },
                '-=0.6'
            )

            gsap.to(contentRef.current, { 
                filter: 'blur(6px)', 
                scale: 0.80, 
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    // end: 'bottom bottom',
                    scrub: 1,
                    pin: true,
                }
            })

            rows.forEach((row, index) => bindRow(row, index))
        })

        return () => {
            cleanups.forEach((fn) => fn())
            mm.revert()
        }
    }, { scope: containerRef })

    return (
        <section
            ref={containerRef} 
            id="shows"
            className="relative h-screen bg-(--dark-color) grid grid-cols-4 lg:grid-cols-12 items-center"
        >
            <div ref={contentRef} className="col-span-4 lg:col-start-3 lg:col-span-8 h-full px-6 lg:px-0 flex flex-col justify-center gap-y-38 will-change-transform">
                <h1
                    ref={titleRef}
                    className="giant-text text-center leading-0 lowercase lg:capitalize"
                >
                    Shows
                </h1>

                <div ref={mobileRowsRef} className="lg:hidden flex flex-col">
                    {shows.map((show, i) => (
                        <a
                            key={`mobile-${i}`}
                            href={show.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group border-b border-(--white-color)/80 cursor-pointer py-5 flex items-center justify-between gap-3 no-underline"
                        >
                            <div className="flex flex-col gap-1 min-w-0">
                                <span className="body-text truncate text-left">{show.title}</span>
                            <span className="sm-text text-(--white-color)/60 flex items-center gap-2 whitespace-nowrap">
                                    {show.date}
                                    <Star className="size-(--sm-text) opacity-80 shrink-0" />
                                    {show.city}, {show.state}
                                </span>
                                <span className="sr-only">{show.time}</span>
                            </div>
                            <ArrowDeg className='rotate-35 shrink-0 transition-transform duration-500 fill-(--white-color) size-8' />
                        </a>
                    ))}
                </div>

                {/* DESKTOP */}
                <div ref={desktopRowsRef} className="hidden lg:flex flex-col justify-center">
                    {shows.map((show, i) => (
                        <a
                            key={`desktop-${i}`}
                            href={show.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group border-b border-(--white-color)/80 cursor-pointer pt-5 pb-3 hover:py-8 transition-all duration-500 grid grid-cols-4 items-center no-underline"
                        >
                            <div className='flex items-center gap-2 col-span-1'>
                                <span className="body-text text-left">{show.title}</span>
                                <span className="body-text">
                                    <ArrowDeg className='rotate-35 group-hover:rotate-45 group-hover:scale-120 transition-transform duration-500' />
                                </span>
                            </div>
                            <span className="col-span-1 body-text text-center text-(--white-color)/50">{show.date}</span>
                            <span className="col-span-1 body-text text-center text-(--white-color)/50">{show.time}</span>
                            <span className="col-span-1 body-text text-(--white-color)/50 text-right">{show.city}, {show.state}</span>
                        </a>
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
