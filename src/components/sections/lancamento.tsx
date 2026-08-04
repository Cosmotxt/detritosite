import lancamentoImgDesktop from '../../assets/media/desktop/LANCAMENTO.webp'
import ArrowDeg from '../../assets/icons/arrowDeg.svg?react'
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import gsap from 'gsap';
import scrollTrigger from 'gsap/ScrollTrigger';
import { Button } from '../ui/Button';
import BurnedEdge from '../ui/BurnedEdge';
gsap.registerPlugin(scrollTrigger);

const Lancamento = () => {
    const sangueVisceralRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const ctaRef = useRef<HTMLParagraphElement | null>(null)

    useGSAP(() => {
        if (!sangueVisceralRef.current) return;
        if (!containerRef.current) return;

        const mm = gsap.matchMedia();

        mm.add({
            isDesktop: '(min-width: 1024px)',
            isMobile: '(max-width: 1023px)',
        }, (context) => {
            const { isDesktop, isMobile } = context.conditions || {};

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'top 20%',
                    scrub: 1,
                    immediateRender: false
                }
            });

            const sangueVisceralElements = gsap.utils.toArray(sangueVisceralRef.current!.children) as HTMLElement[];

            if (isDesktop) {
                tl.fromTo(sangueVisceralElements[0],
                    {
                        xPercent: -120,
                        autoAlpha: 0,
                        filter: 'blur(10px)',
                    },
                    {
                        xPercent: -40,
                        autoAlpha: 1,
                        filter: 'blur(0px)',
                        duration: 1,
                        ease: 'power3.inOut',
                    },
                ).fromTo(sangueVisceralElements[1],
                    {
                        xPercent: 120,
                        autoAlpha: 0,
                        filter: 'blur(10px)',
                    },
                    {
                        xPercent: 40,
                        autoAlpha: 1,
                        filter: 'blur(0px)',
                        duration: 1,
                        ease: 'power3.inOut',
                    }, '<'
                ).from(ctaRef.current, 
                    {
                        autoAlpha: 0,
                    }, '-=.5'
                )
            } else if (isMobile) {
                tl.fromTo(sangueVisceralElements[0],
                    {
                        yPercent: -20,
                        autoAlpha: 0,
                        filter: 'blur(10px)',
                    },
                    {
                        yPercent: 0,
                        autoAlpha: 1,
                        filter: 'blur(0px)',
                        duration: 1,
                        ease: 'power3.inOut',
                    }
                ).fromTo(sangueVisceralElements[1],
                    {
                        yPercent: 20,
                        autoAlpha: 0,
                        filter: 'blur(10px)',
                    },
                    {
                        yPercent: 0,
                        autoAlpha: 1,
                        filter: 'blur(0px)',
                        duration: 1,
                        ease: 'power3.inOut',
                    }, '<'
                )
            }

        })

        return () => {
            mm.revert();
        }
    }, {scope: containerRef});

    return (
        <section 
            ref={containerRef} 
            id="lancamento" 
            className="relative h-screen z-20">
            <BurnedEdge imageUrl={lancamentoImgDesktop} overlayOpacity={0.5} className="-z-20" />
            <div className="relative flex flex-col lg:grid lg:grid-cols-12 justify-center items-center h-full w-full lg:translate-y-0 lg:translate-x-0">
                <a 
                    href='https://open.spotify.com/intl-pt/album/1zk9Os0BWyjKkKR8vVraJH?si=lVQL7XFeSAaF6iioq1NaNQ' 
                    target='_blank' rel='noopener noreferrer' 
                    className="group flex flex-col items-center justify-center gap-[6vh] lg:gap-1 col-start-2 lg:col-start-6 lg:col-span-2 w-[70vw] lg:w-fit cursor-pointer"
                >
                    <p ref={ctaRef} className='w-full body-text text-right hidden lg:block'>
                        <span 
                            className='group-hover:tracking-[8px] transition-all duration-500 origin-right'
                        >
                            quero ouvir
                        </span>
                        <ArrowDeg className='inline ml-1 transform rotate-35 group-hover:rotate-45 group-hover:scale-120 transition-transform duration-500' />
                    </p>
                    <span className="leading-20 giant-text text-center lg:hidden">sangue visceral</span>
                    <img 
                        src="https://res.cloudinary.com/dw5b1yiwd/image/upload/v1785261617/CAPA_j0f6rm.webp" 
                        alt="Capa - Sangue Visceral"
                        className="border border-(--white-color)/60" 
                    />

                    <div className='lg:hidden'>
                        <Button icon={<ArrowDeg className="rotate-45" />}>
                            OUVIR
                        </Button>   
                    </div>
                </a>                       

                <div ref={sangueVisceralRef} className="pointer-events-none absolute flex flex-col lg:flex-row justify-center w-full h-full items-center giant-text pb-[7vh]">
                    <span className="leading-none hidden lg:flex">Sangue</span>
                    <span className="leading-none hidden lg:flex">visceral</span>
                </div>                
            </div>
        </section>
    )
}

export default Lancamento;