import { useRef, useState, useEffect } from 'react';
import Lenis from 'lenis';
import musicasData from '../../data/musicas.json';
import { Badge } from '../ui/Badge';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import unreleasedImage from '../../assets/media/desktop/UNRELEASED.png'
import { Button } from '../ui/Button';
import Star from '../../assets/icons/star.svg?react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface Musica {
  id: number;
  index: string;
  title: string;
  duration: string;
  year: string;
  album: string | null;
  cover?: string;
  featured: boolean;
}

const TOTAL_MUSICAS = musicasData.length;

const Musicas = () => {
    const [currentSong, setCurrentSong] = useState<Musica | null>(musicasData[0]);
    const songsListRef = useRef<HTMLUListElement>(null);
    const lenisRef = useRef<Lenis | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const coverRef = useRef<HTMLImageElement>(null);
    const nextCoverRef = useRef<HTMLImageElement>(null);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const prevCoverUrlRef = useRef<string | undefined>(currentSong?.cover);
    const isAnimatingRef = useRef(false);
    
    useGSAP(() => {
      if (!coverRef.current || !nextCoverRef.current || !currentSong) return;

      const tl = gsap.timeline({
        paused: true,
        onStart: () => {
          isAnimatingRef.current = true;
          coverRef.current!.src = prevCoverUrlRef.current || currentSong.cover!
          nextCoverRef.current!.src = currentSong.cover!
        },
        onComplete: () => {
          isAnimatingRef.current = false;
          coverRef.current!.src = currentSong.cover!
          gsap.set([coverRef.current, nextCoverRef.current], { xPercent: 0 })
        }
      })

      if (direction === 'right') {
        gsap.set(nextCoverRef.current, { xPercent: 100 })
        tl.to(coverRef.current, { xPercent: -100, ease: 'power3.inOut', duration: 0.35 }, 0)
          .to(nextCoverRef.current, { xPercent: 0, ease: 'power3.inOut', duration: 0.35 }, 0)
      } else {
        gsap.set(nextCoverRef.current, { xPercent: -100 })
        tl.to(coverRef.current, { xPercent: 100, ease: 'power3.inOut', duration: 0.35 }, 0)
          .to(nextCoverRef.current, { xPercent: 0, ease: 'power3.inOut', duration: 0.35 }, 0)
      }

      tl.restart()
    }, { dependencies: [currentSong], scope: containerRef })

    useGSAP(() => {
      if (!coverRef.current || !nextCoverRef.current || !currentSong) return
      coverRef.current.src = currentSong.cover!
      nextCoverRef.current.src = currentSong.cover!
    }, { scope: containerRef })

    useEffect(() => {
      if (!songsListRef.current) return;

      const lenis = new Lenis({
        wrapper: songsListRef.current,
        content: songsListRef.current,
        lerp: 0.08,
        duration: 1.2,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
      });

      lenisRef.current = lenis;

      let rafId: number;
      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
        lenisRef.current = null;
      };
    }, []);

    useEffect(() => {
      if (!songsListRef.current || !currentSong) return;

      const item = songsListRef.current.querySelector(
        `[data-song-id="${currentSong.id}"]`
      ) as HTMLElement | null;
      if (!item) return;

      if (lenisRef.current) {
        lenisRef.current.scrollTo(item, { duration: 0.8 });
      } else {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, [currentSong]);

    const nextSong = () => {
      if(!currentSong || isAnimatingRef.current) return;
      prevCoverUrlRef.current = currentSong.cover;
      let index = currentSong.id === TOTAL_MUSICAS ? 0 : ((currentSong.id + 1) - 1)
      setDirection('right')
      setCurrentSong(musicasData[index])
    }

    const prevSong = () => {
      if(!currentSong || isAnimatingRef.current) return;
      prevCoverUrlRef.current = currentSong.cover;
      let index = currentSong.id <= 1 ? TOTAL_MUSICAS - 1 : ((currentSong.id - 1) - 1)
      setDirection('left')
      setCurrentSong(musicasData[index])
    }

    const selectSong = (music: Musica) => {
      if (!currentSong || isAnimatingRef.current || music.id === currentSong.id) return;
      prevCoverUrlRef.current = currentSong.cover;
      setDirection(music.id > currentSong.id ? 'right' : 'left');
      setCurrentSong(music);
    }

  return (
    <section 
      ref={containerRef} id="musicas"
      className="relative h-screen overflow-hidden grid grid-cols-4 lg:grid-cols-12 items-center justify-center"
      style={{ backgroundImage: `url(${unreleasedImage})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover' }}
    >
      {/* BLACK OVERLAY */}
      <div className="bg-black/80 absolute inset-0 z-0"></div>

      <div className="col-start-2 col-span-10 flex flex-col items-items justify-center h-full gap-10 z-10">
        <h1 className='w-full text-left giant-text leading-none -mt-20'>Unreleased</h1>
        
        <div className="flex gap-x-40 items-center justify-between h-[60vh]">
          {/* CAPA & NAVEGAÇÃO */}
          <div className="relative aspect-square h-full">
            <div className="relative overflow-hidden h-full bg-(--red-color)" style={{ willChange: 'transform' }}>
                <img 
                  ref={coverRef}
                  className='absolute top-0 left-0 object-cover object-center h-full w-full'
                />
                <img 
                  ref={nextCoverRef}
                  className='absolute top-0 left-0 object-cover object-center h-full w-full'
                />
            </div>

            <FaArrowLeft onClick={prevSong} className='absolute -translate-y-1/2 translate-x-[-200%] top-1/2 left-0 body-text cursor-pointer' />
            <FaArrowRight onClick={nextSong} className='absolute -translate-y-1/2 translate-x-[200%] top-1/2 right-0 body-text cursor-pointer' />

            <div className="body-text absolute bottom-0 left-1/2 translate-y-[150%] -translate-x-1/2">{`${currentSong?.id}/${TOTAL_MUSICAS}`}</div>
          </div>

          {/* INFORMAÇÕES & CTA */}
          <div className="flex flex-col gap-10 h-full w-full">

            <div className="flex flex-col gap-5">
              <div>
                <Badge>{currentSong?.album}</Badge>
                <h2 className='h2-text leading-none mt-2'>{currentSong?.title}</h2>
              </div>

              <div className="flex gap-x-3">
                <Button icon={<FaArrowLeft className="rotate-135" />}>
                  OUVIR
                </Button>
                <ul className='flex flex-col justify-center items-start opacity-50'>
                  <li className='sm-text flex items-center gap-1'><Star className='size-(--sm-text)' />{currentSong?.year}</li>
                  <li className='sm-text flex items-center gap-1'><Star className='size-(--sm-text)' />{currentSong?.duration}</li>
                </ul>
              </div>
            </div>


            <ul ref={songsListRef} className="hidden flex-1 min-h-0 overflow-y-auto no-scrollbar lg:flex flex-col">
              {musicasData.map((music, key) => (
                <li 
                  key={key} 
                  data-song-id={music?.id}
                  onClick={() => selectSong(music)}
                  className='px-1 py-3 flex items-center justify-between gap-1 border-y border-(--white-color) w-full cursor-pointer'
                >
                  <span className="body-text flex items-center">
                    <span>
                      <Star 
                        className='mr-3 size-(--sm-text)' 
                        style={{ 
                          color: key === currentSong!.id - 1 ? `var(--red-color)` : `var(--white-color)`
                         }}
                      />
                    </span>
                    {music.title}
                  </span>
                  <span className="sm-text opacity-50">{music.album}</span> 
                </li>
              ))}
            </ul>

          </div>
        </div>
      </div>

    </section>
  );
};

export default Musicas;
