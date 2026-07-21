import { useGSAP } from '@gsap/react'
import heroImg from '../../assets/media/desktop/HERO.webp'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const phrasesRef = useRef<HTMLDivElement | null>(null);

    useGSAP(() => {
        if (!containerRef.current) return;
        const mm = gsap.matchMedia();
    
        mm.add({ isDesktop: '(min-width: 1023px)' }, () => {
            
            const phrases = gsap.utils.toArray(phrasesRef.current!.children) as HTMLDivElement[] | [];

            gsap.fromTo(phrases, 
                {
                    filter: 'blur(10px)',
                    autoAlpha: 0,
                },
                {
                    filter: 'blur(0px)',
                    autoAlpha: 1,
                    ease: 'power3.inOut',
                    duration: 1.1,
                    stagger: .7
                }
            )

            ScrollTrigger.create({
                trigger: containerRef.current,
                start: 'top top',
                end: '+=100%',
                pin: true,
                pinSpacing: false,
            })
        })
    })

    return (
        <section ref={containerRef} id="hero" className="relative h-screen bg-cover bg-center z-10" style={{ backgroundImage: `url(${heroImg})` }}>
            <div ref={phrasesRef} className="absolute inset-0 h-full w-full grid grid-cols-4 lg:grid-cols-12 px-6 body-text z-20 grid-rows-6">
                <p className='col-start-1 lg:col-start-3 col-span-5 row-start-3'>Fazemos isso pelas memórias</p>
                <p className='col-start-2 lg:col-start-6 col-span-5 row-start-4 lg:row-start-6'>Até agora tem valido a pena.</p>
                <p className='col-start-3 lg:col-start-10 col-span-3 lg:col-span-2 row-start-5 lg:row-start-2'>Isso não vai mudar </p>
            </div>

            <div className="h-full w-full absolute inset-0 bg-black/40 z-0"></div>
        </section>
    )
}

export default Hero;