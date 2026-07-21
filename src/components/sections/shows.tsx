import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Arrow90Deg from '../../assets/icons/arrowDeg.svg?react'
import shows from '../../data/shows.json'

gsap.registerPlugin(ScrollTrigger)

const Shows = () => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const contentRef = useRef<HTMLDivElement | null>(null)
    const titleRef = useRef<HTMLHeadingElement | null>(null)
    const rowsRef = useRef<HTMLDivElement | null>(null)
    const flyerRef = useRef<HTMLDivElement | null>(null)
    const flyerImgRef = useRef<HTMLImageElement | null>(null)
    const xToRef = useRef<((v: number) => void) | null>(null)
    const yToRef = useRef<((v: number) => void) | null>(null)
    const isVisibleRef = useRef(false)

    useGSAP(() => {
        if (!containerRef.current || !titleRef.current || !rowsRef.current) return

        gsap.set(flyerRef.current, { scale: 0, autoAlpha: 0, rotation: -6 })

        const mm = gsap.matchMedia()

        // ScrollTrigger.create({
        //     trigger: containerRef.current,
        //     start: 'top top',
        //     pin: true,
        // })

        mm.add({ isDesktop: '(min-width: 1024px)' }, () => {
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

            const rows = gsap.utils.toArray(rowsRef.current!.children) as HTMLElement[]
            tl.fromTo(rows,
                { filter: 'blur(6px)', autoAlpha: 0, yPercent: 15 },
                { filter: 'blur(0px)', autoAlpha: 1, yPercent: 0, duration: 0.6, ease: 'power3.inOut', stagger: 0.12 },
                '-=0.2'
            )

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
            <div ref={contentRef} className="col-start-2 lg:col-start-3 col-span-2 lg:col-span-8 h-full flex flex-col justify-center gap-y-38 will-change-transform">
                <h1
                    ref={titleRef}
                    className="giant-text text-center leading-none"
                >
                    Shows
                </h1>

                <div ref={rowsRef} className="flex flex-col">
                    {shows.map((show, i) => (
                        <div
                            key={i}
                            onMouseEnter={() => handleMouseEnter(i)}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            className={`grid grid-cols-4 items-center pt-5 pb-3 border-b-2 border-(--white-color)/80 cursor-pointer`}
                        >
                            <div className='flex items-center text-center gap-5 col-span-1'>
                                <span className="col-span-1 body-text">{show.title}</span>
                                <span className="col-span-1 body-text text-center">
                                    <Arrow90Deg className='rotate-45' />
                                </span>
                            </div>
                            <span className="col-span-1 body-text text-center text-(--white-color)/50">{show.date}</span>
                            <span className="col-span-1 body-text text-center text-(--white-color)/50">{show.time}</span>
                            <span className="col-span-1 body-text text-(--white-color)/50 text-right">{show.city}, {show.state}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div
                ref={flyerRef}
                className="fixed top-0 left-0 w-50 h-auto pointer-events-none z-50 opacity-0"
            >
                <div className="relative w-full">
                    <img
                        ref={flyerImgRef}
                        alt="Show flyer"
                        className="w-full h-full object-cover aspect-[3/4]"
                    />
                    <div className="absolute inset-0 border border-(--white-color)/30"></div>
                </div>
            </div>
        </section>
    )
}

export default Shows
