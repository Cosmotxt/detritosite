import { useRef, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import BurnCarousel from '../ui/BurnCarousel'
import type { BurnCarouselRef } from '../ui/BurnCarousel'

// @ts-ignore
import vinceDesktop from '../../assets/media/desktop/VINCE.webp'
import gabsDesktop from '../../assets/media/desktop/GABS.webp'
import tilasDesktop from '../../assets/media/desktop/TILAS.webp'
import reniDesktop from '../../assets/media/desktop/RENI.webp'
import indDesktop from '../../assets/media/desktop/IND.webp'
import gabsMobile from '../../assets/media/mobile/GABS.webp'
import tilasMobile from '../../assets/media/mobile/TILAS.webp'
import reniMobile from '../../assets/media/mobile/RENI.webp'
import indMobile from '../../assets/media/mobile/IND.webp'
import vinceMobile from '../../assets/media/mobile/VINCE.webp'

import { useMediaQuery } from '../../hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const membersConfig = [
    {
        name: 'Ind',
        imageDesktop: indDesktop,
        imageMobile: indMobile,
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
    const burnCarouselRef = useRef<BurnCarouselRef>(null);
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
            
            const endDistance = isDesktop
                ? membersData.length * 100
                : membersData.length * 80;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container.current,
                    start: 'top top',
                    end: `+=${endDistance}%`,
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                }
            });

            const progressObj = { p: 0 };
            const names = gsap.utils.toArray('.member-name', container.current) as HTMLElement[];
            const numTransitions = membersData.length - 1;

            // Animate progressObj from 0 to 4 during the first part of the scroll (duration = numTransitions)
            tl.to(progressObj, {
                p: numTransitions,
                ease: 'none',
                duration: numTransitions,
                onUpdate: () => {
                    if (burnCarouselRef.current) {
                        burnCarouselRef.current.setProgress(progressObj.p);
                    }
                }
            }, 0);

            // Animate the member names fading in and out
            names.forEach((_name, i) => {
                if (i < names.length - 1) {
                    tl.to(names[i], { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, i + 0.3);
                    tl.to(names[i+1], { opacity: 1, duration: 0.4, ease: 'power2.inOut' }, i + 0.3);
                }
            });

            // Hold on the final member (Tilas) while the footer slides up over the section during the last portion of scroll
            tl.to({}, { duration: 1 }, numTransitions);
        });

        return () => {
            mm.revert();
        };
    }, { scope: container, dependencies: [membersData], revertOnUpdate: true });

    const carouselImages = useMemo(() => membersData.map(m => m.image), [membersData]);

    return (
        <div ref={container} id="members" className="relative h-screen overflow-hidden bg-(--dark-color)">
            <BurnCarousel 
                ref={burnCarouselRef} 
                images={carouselImages} 
                className="z-10" 
            />
            {membersData.map((member, key) => (
                <div
                    className="absolute inset-0 grid grid-cols-4 lg:grid-cols-12 pointer-events-none"
                    key={key}
                    style={{ zIndex: 20 }}
                >
                    <span 
                        className="member-name col-start-2 col-span-2 row-start-10 lg:col-start-3 lg:row-start-2 lowercase lg:capitalize text-center giant-text text-(--headline-font)"
                        style={{ opacity: key === 0 ? 1 : 0 }}
                    >
                        {member.name}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default Members;
