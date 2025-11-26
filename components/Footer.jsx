import Link from "next/link";
import { LuFacebook, LuInstagram, LuTwitter } from "react-icons/lu"; 

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white p-8 md:p-12 lg:p-16 h-auto min-h-[30dvh]">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">

        <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-700 pb-8">
          
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <p className="text-3xl font-bold text-[#9e972d]">Card Emporium</p>
            <p className="text-sm text-gray-400 mt-1">Tu portal de juegos de cartas coleccionables.</p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-gray-300">
            <FooterLink href="/privacy">Política de Privacidad</FooterLink>
            <FooterLink href="/terms">Términos de Uso</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
          </nav>
          
          <div className="flex justify-center md:justify-end gap-4 mt-6 md:mt-0">
            <SocialIcon href="https://facebook.com/cardemporium" icon={LuFacebook} />
            <SocialIcon href="https://instagram.com/cardemporium" icon={LuInstagram} />
            <SocialIcon href="https://twitter.com/cardemporium" icon={LuTwitter} />
          </div>

        </div>

        <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center">
          
          <p className="mt-4 md:mt-0 text-center text-xs text-gray-500 order-2 md:order-1">
            © {currentYear} Card Emporium. Todos los derechos reservados.
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm order-1 md:order-2">
            <FooterLink href="/">Inicio</FooterLink>
            <FooterLink href="/mtg-page">Magic</FooterLink>
            <FooterLink href="/pokemon-page">Pokemon</FooterLink>
            <FooterLink href="/lorcana-page">Lorcana</FooterLink>
            <FooterLink href="/yugioh-page">Yu-Gi-Oh!</FooterLink>
          </nav>
        </div>

      </div>
    </footer>
  );
}


function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-gray-400 transition-colors hover:text-[#9e972d] focus:ring-2 focus:ring-[#9e972d] focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
    >
      {children}
    </Link>
  );
}

function SocialIcon({ href, icon: Icon }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 transition-colors hover:text-[#9e972d] focus:ring-2 focus:ring-[#9e972d] focus:ring-offset-2 focus:ring-offset-black focus:outline-none rounded-full p-2"
      aria-label={`Link to Card Emporium on ${Icon.name.replace('Lu', '')}`}
    >
      <Icon className="h-6 w-6" />
    </Link>
  );
}