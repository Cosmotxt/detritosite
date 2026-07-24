import lancamentoImgDesktop from '../../assets/media/desktop/LANCAMENTO.webp'
// import lancamentoImgMobile from '../../assets/media/mobile/LANCAMENTO.webp'
import capaSangueVisceral from '../../assets/media/desktop/COVERS/capa-sangue-visceral.webp'
import ArrowDeg from '../../assets/icons/arrowDeg.svg?react'
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import gsap from 'gsap';
import scrollTrigger from 'gsap/ScrollTrigger';
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
                    start: isDesktop ? '20% bottom' : '30% bottom',
                    toggleActions: 'play none play none',
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
        <section ref={containerRef} id="lancamento" className="relative h-screen bg-cover bg-center z-20" style={{ backgroundImage: `url(${lancamentoImgDesktop})` }}>
            <div className="absolute inset-0 bg-black/50 -z-10"></div>
            <div className="relative grid grid-cols-4 lg:grid-cols-12 justify-center items-center h-full w-full -translate-y-1/11 lg:translate-x-none">
                <div className="group flex flex-col gap-1 col-start-2 lg:col-start-6 col-span-2 cursor-pointer">
                    <p ref={ctaRef} className='w-full body-text text-right hidden lg:block'>
                        <span 
                            className='group-hover:tracking-[8px] transition-all duration-500 origin-right'
                        >
                            quero ouvir
                        </span>
                        <ArrowDeg className='inline ml-1 transform rotate-35 group-hover:rotate-45 group-hover:scale-120 transition-transform duration-500' />
                    </p>
                    <img 
                        src={capaSangueVisceral} 
                        alt="Capa - Sangue Visceral"
                        className="border border-(--white-color)/60 scale-140 lg:scale-none" 
                    />
                </div>

                <div ref={sangueVisceralRef} className="pointer-events-none absolute flex flex-col lg:flex-row justify-center w-full h-full items-center giant-text pb-[7vh]">
                    <span className="-translate-y-5/8 leading-none">Sangue</span>
                    <span className="translate-y-5/8 leading-none">visceral</span>
                </div>

                <p ref={ctaRef} className='cursor-pointer absolute mx-auto origin-center bg-(--red-color) py-2 px-5 items-center -translate-x-1/2 left-1/2 top-7/8 body-text text-center flex lg:hidden'>
                    <span className=''>
                        quero ouvir
                    </span>
                    <ArrowDeg className='ml-1 mt-1.5 rotate-45' />
                </p>
            </div>
        </section>
    )
}

export default Lancamento;