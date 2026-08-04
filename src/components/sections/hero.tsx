import Header from '../Header'
import { useGSAP } from '@gsap/react'
import heroImg from '../../assets/media/desktop/HERO.webp'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import SvgLogo from '../ui/SvgLogo.svg?react'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const phrasesRef = useRef<HTMLDivElement | null>(null);

    useGSAP(() => {
        if (!containerRef.current) return;
        const mm = gsap.matchMedia();

        mm.add({
            isDesktop: '(min-width: 1024px)',
            isMobile: '(max-width: 1023px)'
        }, () => {
            // Animation removed for future preloader integration

            ScrollTrigger.create({
                trigger: containerRef.current,
                start: 'top top',
                end: '+=100%',
                pin: true,
                pinSpacing: false,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            })
        })
    })

    return (
        <section ref={containerRef} id="hero" className="relative h-screen bg-cover bg-center z-10 flex flex-col px-[5vw] py-6" style={{ backgroundImage: `url(${heroImg})` }}>
            <Header className="z-30 w-full" />

            <div ref={phrasesRef} className="flex-1 w-full flex lg:mt-[-10vh] flex-col items-center justify-center font-uglyqua text-(--white-color) z-20">
                <SvgLogo className="w-full h-auto stroke-(--white-color)/40 stroke-[0.5px] fill-none [&_path]:fill-none" />
                {/* <p className='w-full text-right pr-2 lg:pr-8 text-(length:--sm-text) lg:text-(length:--body-text) relative z-30'>A gravidade simplesmente não existe</p> */}
            </div>

            <div className="h-full w-full absolute inset-0 bg-black/40 z-0"></div>
        </section>
    )
}

export default Hero;