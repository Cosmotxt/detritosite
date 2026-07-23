import { useRef, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// @ts-ignore
import vinceDesktop from '../../assets/media/desktop/VINCE.webp'
import gabsDesktop from '../../assets/media/desktop/GABS.webp'
import tilasDesktop from '../../assets/media/desktop/TILAS.webp'
import reniDesktop from '../../assets/media/desktop/RENI.webp'
import indDesktop from '../../assets/media/desktop/IND.webp'
import gabsMobile from '../../assets/media/mobile/GABS.webp'
import tilasMobile from '../../assets/media/mobile/TILAS.webp'
import reniMobile from '../../assets/media/mobile/RENI.webp'
import vinceMobile from '../../assets/media/mobile/VINCE.webp'

import { useMediaQuery } from '../../hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const membersConfig = [
    {
        name: 'Ind',
        imageDesktop: indDesktop,
        imageMobile: reniMobile,
    },
    {
        name: 'Reni',
        imageDesktop: reniDesktop,
        imageMobile: reniMobile,
    },
    {
        name: 'Vince',
        imageDesktop: vinceDesktop,
        imageMobile: vinceMobile,
    },
    {
        name: 'Gabs',
        imageDesktop: gabsDesktop,
        imageMobile: gabsMobile,
    },
    {
        name: 'Tilas',
        imageDesktop: tilasDesktop,
        imageMobile: tilasMobile,
    },
]


const Members = () => {
    const container = useRef<HTMLDivElement | null>(null);
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const membersData = useMemo(
        () => membersConfig.map((member) => ({
            name: member.name,
            image: isDesktop ? member.imageDesktop : member.imageMobile,
        })),
        [isDesktop]
    );

    useGSAP(() => {
        if (!container.current) return;
        if (membersData.length === 0) return;

        const mm = gsap.matchMedia();
        mm.add({
            isDesktop: '(min-width: 1024px)',
            isMobile: '(max-width: 1023px)',
        }, (ctx) => {
            const { isDesktop } = ctx.conditions || {};
            const containerElements = gsap.utils.toArray(container.current!.children) as HTMLElement[];

            if (containerElements.length === 0) return;

            const endDistance = isDesktop
                ? membersData.length * 100
                : membersData.length * 80;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container.current,
                    start: 'top top',
                    end: `+=${endDistance}%`,
                    pin: true,
                    scrub: 2,
                }
            });

            containerElements.forEach((el, index) => {
                if (index > 0) {
                    tl.fromTo(el,
                        { clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)' },
                        { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', ease: 'power2.inOut' }
                    );
                }
            });
        });

        return () => {
            mm.revert();
        };
    }, { scope: container, dependencies: [membersData], revertOnUpdate: true });

    return (
        <div ref={container} id="members" className="relative h-screen overflow-hidden bg-(--dark-color)">
            {membersData.map((member, key) => (
                <div
                    className="absolute h-full w-full top-0 left-0 grid grid-cols-4 lg:grid-cols-12"
                    key={key}
                    style={{
                        zIndex: 10 + key,
                        clipPath: key === 0 ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' : 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
                        backgroundImage: `url(${member.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: `${member.name === 'Gabs' ? 'left' : 'center'}`,
                    }}
                >
                    <span className="col-start-3 row-start-2 giant-text text-(--headline-font)">
                        {member.name}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default Members;
