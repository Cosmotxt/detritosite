"use client"

import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type ProductItem = {
  imageSrc: string,
  productTitle: string,
  price: string,
  productUrl: string,  
}

type ProductItemProps = {
    item: ProductItem
}

export default function StoreItem({ item }: ProductItemProps) {
  return (
    <motion.div className="group relative" whileHover={{ y: -5 }}>
        <div className="font-syneMono p-1 border border-red-800 bg-transparent">
            <div className="flex flex-col">
                <div className="overflow-hidden relative w-full h-64">
                    <Image
                        src={item.imageSrc || "/placeholder.svg"}
                        alt={item.productTitle}
                        width={200}
                        height={500}
                        className="w-full h-full object-cover group-hover:grayscale-0 transition-all duration-300"
                    />
                    <div className="absolute inset-0 lg:bg-gradient-to-t opacity-1 hover:opacity-0 from-black/80 via-black/30 to-transparent transition-opacity duration-700 ease-in-out" />
                </div>

                <div className="bg-black/70 p-3">
                    <h3 className="font-pixel-alt text-red-500 text-lg">{item.productTitle}</h3>
                    <s className="text-white/80 text-sm">{item.price.split("| ")[0]}</s> <span> | {item.price.split("| ")[1]}</span>
                </div>

                <Link 
                    href={item.productUrl} 
                    className="w-full h-10 uppercase bg-red-800 text-white flex items-center justify-center hover:bg-red-950 transition-colors duration-500 cursor-pointer"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    <span className="font-pixel text-md">Comprar</span>
                </Link >
            </div>
        </div>

        {/* <div className="absolute inset-0 -z-10 translate-x-2 translate-y-2 bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
    </motion.div>
  )
}