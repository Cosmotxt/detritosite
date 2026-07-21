import lancamentoImgDesktop from '../../assets/media/desktop/LANCAMENTO.webp'
// import lancamentoImgMobile from '../../assets/media/mobile/LANCAMENTO.webp'
    import capaSangueVisceral from '../../assets/media/desktop/COVERS/capa-sangue-visceral.webp'
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import gsap from 'gsap';
import scrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(scrollTrigger);

const Lancamento = () => {
    const sangueVisceralRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

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
                    start: 'top 30%',
                    end: '20% top',
                    toggleActions: 'play none play reverse',
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
                )
            } else if (isMobile) {
                tl.fromTo(sangueVisceralElements[0],
                    {
                        yPercent: -20,
                        autoAlpha: 0,
                        filter: 'blur(10px)',
                    },
                    {
                        yPercent: -10,
                        autoAlpha: 1,
                        filter: 'blur(0px)',
                        duration: 1,
                        ease: 'power3.inOut',
                    }
                )
            }

        })

        return () => {
            mm.revert();
        }
    }, {scope: containerRef});

    return (
        <section ref={containerRef} id="lancamento" className="relative h-screen bg-cover bg-center z-20" style={{ backgroundImage: `url(${lancamentoImgDesktop})` }}>
            <div className="relative grid grid-cols-4 lg:grid-cols-12 justify-center items-center h-full w-full">
                <img 
                    src={capaSangueVisceral} 
                    alt="Capa - Sangue Visceral"
                    className="col-start-2 lg:col-start-6 col-span-2 border border-(--white-color)/60" 
                />

                <div ref={sangueVisceralRef} className="absolute flex flex-col lg:flex-row justify-center w-full h-full items-center leading-0 giant-text pb-[7vh]">
                    <span className="">Sangue</span>
                    <span className="">visceral</span>
                </div>
            </div>
        </section>
    )
}

export default Lancamento;