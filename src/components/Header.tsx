import { useState } from 'react'
import { Link } from 'react-router-dom'
import SvgLogo from '../assets/media/LOGO_DETRITO.svg?react'
import Menu from './Menu'

interface HeaderProps {
  className?: string
}

const Header = ({ className = '' }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header
        className={`relative z-30 col-span-4 lg:col-span-12 flex items-center justify-between border-b border-(--white-color)/30 pt-0 pb-3 ${className}`}
      >
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <SvgLogo className="h-10 w-auto text-(--white-color)" />
          </Link>
        </div>
        <div className="flex items-center gap-12">
          <button onClick={() => setIsMenuOpen(true)} className="flex flex-col gap-1.5 cursor-pointer group" aria-label="Menu">
            <div className="w-8 h-0.5 bg-(--white-color) transition-transform duration-300 ease-out group-hover:translate-x-1.5"></div>
            <div className="w-8 h-0.5 bg-(--white-color) transition-transform duration-300 ease-out group-hover:-translate-x-1.5"></div>
          </button>
        </div>
      </header>

      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}

export default Header
