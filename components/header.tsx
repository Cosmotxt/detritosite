'use client'
import Home from "@/app/page";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu } from 'lucide-react';

export default function Header() {
    const [ toggle, setToggle ] = useState(false);

    function menuToggle() {
        if(!toggle) {
            setToggle(true);
        } else {
            setToggle(false)
        }
    }

    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-4 py-3 bg-black/80 backdrop-blur-sm border-b border-red-600/30">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex gap-4 justify-center items-center">
                    <Link
                        href='/'
                    >
                        <div className="flex items-center gap-2 ">
                                <Image
                                    src="https://res.cloudinary.com/dw5b1yiwd/image/upload/v1753643557/icon_transparente_ai1snw.png"
                                    alt="Detrito Espacial Logo"
                                    width={40}
                                    height={40}
                                    className="animate-pulse-slow"
                                />
                            <span className="hidden sm:inline-block text-red-500 font-pixelify text-lg">DETRITO ESPACIAL</span>
                        </div>
                    </Link>
                    <Menu onClick={ menuToggle } className="cursor-pointer lg:hidden" />
                </div>
                
                <ul className="hidden lg:flex gap-6 items-center">
                    {[["inicio", "#inicio"], ["nossas musicas", "musicas"], ["sobre a gente", "#sobre"], ["vamo trocar ideia", "#contato"]].map((item) => (
                    <li key={item[0]}>
                        <Link
                        href={`/${item[1]}`}
                        className={"font-pixel uppercase text-sm hover:text-red-500 transition-colors"}
                        >
                        {item[0]}
                        </Link>
                    </li>
                    ))}
                </ul>


                <div className="flex gap-3">
                {[
                    ['instagram', 'https://www.instagram.com/detritoespacial/'],
                    ['tiktok', 'https://www.tiktok.com/@detrito.espacial'],
                    ['youtube', 'https://www.youtube.com/@DetritoEspacial'], 
                    ['spotify', 'https://open.spotify.com/intl-pt/artist/3mxopIe9nts1L5O5SzFgBu?si=AIQWbuWrTveHczfV-AtB-Q'], 
                ].map((platform) => (
                    <Link
                    key={platform[0]}
                    href={platform[1]}
                    target="_blank"
                    className="text-white/70 hover:text-red-500 transition-colors"
                    aria-label={platform[0]}
                    >
                    <div className="w-5 h-5 pixel-icon" data-icon={platform[0]}></div>
                    </Link>
                ))}
                </div>
            </div>

            { toggle ? (
                <div className="h-auto bg-black/80 mt-3 border-t border-red-600/30">
                    <ul className="flex flex-col lg:hidden gap-4 my-5 items-center">
                        {[["inicio", "#inicio"], ["nossas musicas", "musicas"], ["sobre a gente", "#sobre"], ["vamo trocar ideia", "#contato"]].map((item) => (
                            <li key={item[0]}>
                                <Link
                                    href={`/${item[1]}`}
                                    className={"font-pixel uppercase text-sm hover:text-red-500 transition-colors"}
                                    onClick={ menuToggle }
                                >
                                    {item[0]}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div></div>
            )}
        </nav>
    )
        

}