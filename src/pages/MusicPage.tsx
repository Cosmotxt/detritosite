import { useRef } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import musicasData from '../data/musicas.json'
import SpotifyIcon from '../assets/icons/spotify.svg?react'
import Header from '../components/Header'
import ArrowDeg from '../assets/icons/arrowDeg.svg?react'
import { useRumble } from '../hooks/useRumble'
import Star from '../assets/icons/star.svg?react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface Musica {
  id: number
  index: string
  title: string
  duration: string
  year: string
  album: string
  link_video: string
  cover: string
  featured: boolean
  lyrics: string[]
}

const SPOTIFY_ARTIST_URL =
  'https://open.spotify.com/intl-pt/artist/3mxopIe9nts1L5O5SzFgBu?si=Cik-fbYOTfa2_T_cVIAntQ'

const MusicPage = () => {
  const { id } = useParams<{ id: string }>()
  const rumbleRef = useRumble()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const lyricsWrapperRef = useRef<HTMLDivElement | null>(null)
  const lyricsContentRef = useRef<HTMLDivElement | null>(null)

  const song = (musicasData as Musica[]).find((m) => m.id === Number(id))

  useGSAP(
    () => {
      if (!rootRef.current) return

      let lenis: Lenis | null = null

      if (lyricsWrapperRef.current && lyricsContentRef.current) {
        lenis = new Lenis({
          wrapper: lyricsWrapperRef.current,
          content: lyricsContentRef.current,
          lerp: 0.07,
          smoothWheel: true,
          syncTouch: true,
        })

        const update = (time: number) => {
          lenis?.raf(time * 1000)
        }

        gsap.ticker.add(update)

          // Store ticker reference for cleanup
          ; (lenis as any)._tickerUpdate = update
      }

      const mm = gsap.matchMedia()

      mm.add(
        {
          isDesktop: '(min-width: 1024px)',
          isMobile: '(max-width: 1023px)',
        },
        () => {
          const titleEl = rootRef.current!.querySelector<HTMLElement>('[data-title]')
          const metaEl = rootRef.current!.querySelector<HTMLElement>('[data-meta]')
          const videoEl = rootRef.current!.querySelector<HTMLElement>('[data-video]')
          const lyricLines = gsap.utils.toArray<HTMLElement>(
            rootRef.current!.querySelectorAll('[data-lyric-line]')
          )
          const ctaEl = rootRef.current!.querySelector<HTMLElement>('[data-cta]')

          if (titleEl) {
            gsap.fromTo(
              titleEl,
              { filter: 'blur(10px)', autoAlpha: 0, y: 30 },
              {
                filter: 'blur(0px)',
                autoAlpha: 1,
                y: 0,
                ease: 'power3.out',
                duration: 1,
              }
            )
          }

          const blurReveal = (el: HTMLElement, trigger: HTMLElement) =>
            gsap.fromTo(
              el,
              { filter: 'blur(10px)', autoAlpha: 0, y: 30 },
              {
                filter: 'blur(0px)',
                autoAlpha: 1,
                y: 0,
                ease: 'power3.out',
                duration: 1,
                scrollTrigger: {
                  trigger,
                  start: 'top 85%',
                  toggleActions: 'play none none reverse',
                },
              }
            )

          if (metaEl) blurReveal(metaEl, metaEl)
          if (videoEl) blurReveal(videoEl, videoEl)

          if (lyricLines.length > 0) {
            gsap.fromTo(
              lyricLines,
              { filter: 'blur(8px)', autoAlpha: 0, y: 12 },
              {
                filter: 'blur(0px)',
                autoAlpha: 1,
                y: 0,
                ease: 'power3.out',
                duration: 0.7,
                stagger: 0.06,
                scrollTrigger: {
                  trigger: lyricLines[0],
                  start: 'top 80%',
                  toggleActions: 'play none none reverse',
                },
              }
            )
          }

          if (ctaEl) blurReveal(ctaEl, ctaEl)
        }
      )

      return () => {
        if (lenis) {
          if ((lenis as any)._tickerUpdate) {
            gsap.ticker.remove((lenis as any)._tickerUpdate)
          }
          lenis.destroy()
        }
        mm.revert()
      }
    },
    { scope: rootRef, dependencies: [id] }
  )

  if (!song) return <Navigate to="/" replace />

  const hasLyrics = song.lyrics && song.lyrics.length > 0

  const currentSongIndex = (musicasData as Musica[]).findIndex(m => m.id === Number(id))
  const nextSong = currentSongIndex !== -1 && currentSongIndex < musicasData.length - 1
    ? musicasData[currentSongIndex + 1]
    : musicasData[0]

  return (
    <>
      <div ref={rumbleRef} className="rumble-overlay" />
      <main
        ref={rootRef}
        className="relative h-screen bg-(--dark-color) px-[5vw] py-6 grid grid-cols-4 lg:grid-cols-12 content-start overflow-hidden"
      >
        <Header />

        <div className="col-start-1 col-span-4 flex justify-end lg:hidden z-20 relative pt-2 pb-2">
          {nextSong && (
            <Link
              to={`/musica/${nextSong.id}`}
              className="flex items-center gap-2 uppercase transition-all duration-500 xs-text text-(--white-color)"
            >
              próxima música
              <ArrowDeg className="size-4 rotate-45" />
            </Link>
          )}
        </div>

        <h1
          data-title
          className="mt-[2vh] leading-[0.85] pb-[0.25em] overflow-visible col-start-1 col-span-4 lg:col-start-1 lg:col-span-12 text-(length:--headline-text) lg:text-(length:--giant-text) font-uglyqua lowercase text-left text-(--white-color)"
        >
          {song.title}
        </h1>

        <div
          data-meta
          className="col-start-1 col-span-4 lg:col-start-1 lg:col-span-12 mt-2 flex flex-wrap items-center justify-between gap-y-4 w-full"
        >
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {[
              { value: song.duration },
              { value: song.year },
              { value: song.album || 'single' },
            ].map(({ value }, i) => (
              <div key={i} className="flex items-center gap-3 capitalize">
                <Star className="text-(--white-color) size-3" />
                <span className="sm-text text-(--white-color)">{value}</span>
              </div>
            ))}
            <a
              data-cta
              href={SPOTIFY_ARTIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 items-center uppercase hover:tracking-[0.3em] transition-all duration-500 sm-text text-(--white-color)"
            >
              <SpotifyIcon className="size-(--sm-text)" />
              ouvir no spotify
            </a>
          </div>

          {nextSong && (
            <Link
              to={`/musica/${nextSong.id}`}
              className="hidden lg:flex items-center gap-3 uppercase hover:tracking-[0.3em] transition-all duration-500 sm-text text-(--white-color) hover:text-(--green-color)"
            >
              próxima música
              <ArrowDeg className="size-5 rotate-90" />
            </Link>
          )}
        </div>

        {song.link_video && (
          <div
            data-video
            className="col-start-1 col-span-4 lg:col-start-1 lg:col-span-8 w-full lg:w-[90%] h-fit mt-[1vh]"
          >
            <div className="relative w-full aspect-video overflow-hidden">
              <video
                controls
                preload="none"
                poster={song.cover}
                className="w-full h-full object-cover"
              >
                <source src={song.link_video} />
              </video>
            </div>
          </div>
        )}

        <div
          ref={lyricsWrapperRef}
          className="relative h-[65vh] overflow-y-auto no-scrollbar col-start-1 col-span-4 lg:col-start-9 lg:col-span-3 mask-image-[linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]"
        >
          <div ref={lyricsContentRef} className="flex flex-col gap-y-1 py-6">
            {hasLyrics &&
              song.lyrics.map((line, i) =>
                line === '' ? (
                  <div key={i} className="h-4" aria-hidden />
                ) : (
                  <p
                    key={i}
                    data-lyric-line
                    className="body-text text-(--white-color) opacity-80 leading-tight z-10"
                  >
                    {line}
                  </p>
                )
              )}
          </div>
        </div>
      </main>
    </>
  )
}

export default MusicPage
