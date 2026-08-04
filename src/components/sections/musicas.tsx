import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import musicasData from '../../data/musicas.json';
import { Badge } from '../ui/Badge';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import unreleasedImage from '../../assets/media/desktop/UNRELEASED.webp'
import { Button } from '../ui/Button';
import Star from '../../assets/icons/star.svg?react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Lenis from 'lenis';

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
  const songsListRef = useRef<HTMLDivElement>(null);
  const songsContentRef = useRef<HTMLUListElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const coverRef = useRef<HTMLImageElement>(null);
  const nextCoverRef = useRef<HTMLImageElement>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const prevCoverUrlRef = useRef<string | undefined>(currentSong?.cover);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    if (!songsListRef.current || !songsContentRef.current) return;

    const lenis = new Lenis({
      wrapper: songsListRef.current,
      content: songsContentRef.current,
      lerp: 0.07,
      smoothWheel: true,
      syncTouch: true,
    });
    lenisRef.current = lenis;

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useGSAP(() => {
    if (!coverRef.current || !nextCoverRef.current || !currentSong) return;

    const coverEl = coverRef.current;
    const nextCoverEl = nextCoverRef.current;
    const songCover = currentSong.cover!;
    const prevCover = prevCoverUrlRef.current || songCover;

    const tl = gsap.timeline({
      paused: true,
      onStart: () => {
        isAnimatingRef.current = true;
        coverEl.src = prevCover;
        nextCoverEl.src = songCover;
      },
      onComplete: () => {
        isAnimatingRef.current = false;
        coverEl.src = songCover;
        gsap.set([coverEl, nextCoverEl], { xPercent: 0 });
      }
    })

    if (direction === 'right') {
      gsap.set(nextCoverEl, { xPercent: 100 })
      tl.to(coverEl, { xPercent: -100, ease: 'power3.inOut', duration: 0.35 }, 0)
        .to(nextCoverEl, { xPercent: 0, ease: 'power3.inOut', duration: 0.35 }, 0)
    } else {
      gsap.set(nextCoverEl, { xPercent: -100 })
      tl.to(coverEl, { xPercent: 100, ease: 'power3.inOut', duration: 0.35 }, 0)
        .to(nextCoverEl, { xPercent: 0, ease: 'power3.inOut', duration: 0.35 }, 0)
    }

    tl.restart()
  }, { dependencies: [currentSong], scope: containerRef })

  useGSAP(() => {
    if (!coverRef.current || !nextCoverRef.current || !currentSong) return
    coverRef.current.src = currentSong.cover!
    nextCoverRef.current.src = currentSong.cover!
  }, { scope: containerRef })

  useEffect(() => {
    if (!songsListRef.current || !currentSong) return;

    const item = songsListRef.current.querySelector(
      `[data-song-id="${currentSong.id}"]`
    ) as HTMLElement | null;
    if (!item) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(item, { offset: -20, duration: 0.8 });
    } else {
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentSong]);

  const nextSong = () => {
    if (!currentSong || isAnimatingRef.current) return;
    prevCoverUrlRef.current = currentSong.cover;
    let index = currentSong.id === TOTAL_MUSICAS ? 0 : ((currentSong.id + 1) - 1)
    setDirection('right')
    setCurrentSong(musicasData[index])
  }

  const prevSong = () => {
    if (!currentSong || isAnimatingRef.current) return;
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

      <div className="col-start-1 col-span-4 lg:col-start-2 lg:col-span-10 flex flex-col justify-center h-full gap-15 lg:gap-10 z-10">
        <h1 className='w-full text-center lg:text-left giant-text leading-none'>Unreleased</h1>

        <div className="flex flex-col lg:flex-row gap-x-40 items-center justify-center h-[60vh] lg:h-[60vh] origin-center">
          {/* CAPA & NAVEGAÇÃO */}
          <div className="relative aspect-square h-full">
            <div className="relative overflow-hidden h-full bg-(--red-color) will-change-transform select-none">
              <img
                ref={coverRef}
                className='absolute top-0 left-0 object-cover object-center h-full w-full'
              />
              <img
                ref={nextCoverRef}
                className='absolute top-0 left-0 object-cover object-center h-full w-full'
              />
            </div>

            <FaArrowLeft onClick={prevSong} className='absolute -translate-y-1/2 translate-x-[-150%] lg:translate-x-[-200%] top-1/2 left-0 body-text cursor-pointer' />
            <FaArrowRight onClick={nextSong} className='absolute -translate-y-1/2 translate-x-[150%] lg:translate-x-[200%] top-1/2 right-0 body-text cursor-pointer' />

            <div className="sm-text lg:body-text absolute bottom-4 lg:bottom-0 left-1/2 translate-y-[180%] lg:translate-y-[150%] -translate-x-1/2 select-none">{`${currentSong?.id}/${TOTAL_MUSICAS}`}</div>
          </div>

          {/* INFORMAÇÕES & CTA */}
          <div className="flex flex-col gap-10 h-full w-[85%] lg:w-full mt-14">

            <div className="flex flex-col gap-5 mx-auto lg:mx-0">
              <div>
                <Badge>{currentSong?.album || 'não lançado'}</Badge>
                <h2 className='h2-text w-full leading-none mt-2 text-center lg:text-left'>{currentSong?.title}</h2>
              </div>

              <div className="flex gap-x-3 mx-auto lg:mx-0">
                <Link to={`/musica/${currentSong?.id}`}>
                  <Button icon={<FaArrowLeft className="rotate-135" />}>
                    OUVIR
                  </Button>
                </Link>
                <ul className='hidden lg:flex flex-col justify-center items-start opacity-50'>
                  <li className='sm-text flex items-center gap-1'><Star className='size-(--sm-text)' />{currentSong?.year}</li>
                  <li className='sm-text flex items-center gap-1'><Star className='size-(--sm-text)' />{currentSong?.duration}</li>
                </ul>
              </div>
            </div>


            <div ref={songsListRef} className="hidden lg:flex flex-col flex-1 overflow-y-auto no-scrollbar py-10 mask-image-[linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
              <ul ref={songsContentRef} className="flex flex-col w-full">
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
      </div>

    </section>
  );
};

export default Musicas;
