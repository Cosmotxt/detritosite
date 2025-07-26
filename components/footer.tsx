import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <>
            <footer className="py-8 border-t border-red-500/30 relative">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <Image src="/images/icon_transparente.png" alt="Detrito Espacial Logo" width={30} height={30} />
                            <span className="text-red-500 font-pixel text-sm">DETRITO ESPACIAL</span>
                        </div>

                        <div className="text-white/50 text-sm text-center md:text-right">
                            <p>&copy; {new Date().getFullYear()} Detrito Espacial. Todos os direitos reservados.</p>
                            <p className="mt-1">
                                <Link href="/links" className="text-white/70 hover:text-red-500 transition-colors">
                                    Links Úteis
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}