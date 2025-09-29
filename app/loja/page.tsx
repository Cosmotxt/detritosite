"use client"
import PixelText from "@/components/pixel-text"
import StarField from "@/components/star-field"
import StoreItem from "@/components/store-item"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function loja() {
    const [ items, setItems ] = useState([])

    async function fetchStoreItems() {
        const content = await fetch('http://localhost:8080/scrape', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: 'https://www.numetalwear.com.br/numetalwear/collections/detrito-espacial?page=1' })
        });
        if(!content.ok) {
            throw new Error('Failed to fetch data: ' + content.statusText);
        }
        const data = await content.json();
        setItems(data);
        console.log(data);
    }


    useEffect(() => {
        fetchStoreItems();
    }, [])

    return (
        <main className="relative min-h-screen bg-black text-white overflow-hidden">
            <StarField />

            <div id="header" className="relative z-10 pt-20 pb-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/" className="text-white/70 hover:text-red-500 transition-colors flex items-center gap-2">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-pixel text-sm">VOLTAR</span>
                        </Link>
                    </div>

                    <div className="text-center mb-12">
                        <PixelText
                        text="LOJA"
                        className="text-5xl lg:text-7xl text-red-500 font-bold mb-4"
                        glitchEffect={true}
                        />
                        <p className="text-white/80 font-pixel text-sm max-w-2xl mx-auto">
                        Detrito tá fechada com a Numetal wear!
                        </p>
                    </div>
                </div>
            </div>

            <section className="relative z-10 pb-20">
                <div className="container grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6 mx-auto px-4">
                    {items.map((product, index) => (
                        <StoreItem key={index} item={product} />
                    ))
                    }
                </div>
            </section>

        </main>
    )
}