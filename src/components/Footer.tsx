import Link from 'next/link'
import Image from 'next/image'

const INSTAGRAM_URL = 'https://www.instagram.com/salasartgalleryoaxaca'
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61586724924822'
const WHATSAPP_URL = 'https://wa.me/529515471306'
const EMAIL = 'salasartgallery.casadearte@gmail.com'
const PHONE_DISPLAY = '+52 951 547 1306'
const PHONE_TEL = '+529515471306'

const linkClass = 'text-violet-200/70 hover:text-white transition-colors'
const headingClass = 'text-white font-medium mb-4 text-xs uppercase tracking-[0.2em] text-violet-300'

export default function Footer() {
  return (
    <footer className="bg-violet-950 text-violet-100 border-t border-violet-800">
      {/* Espacio extra en móvil: navbar flotante (Navegación + carrito) + safe-area iPhone */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-[calc(7.5rem+env(safe-area-inset-bottom,0px))] lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8">
          {/* Marca */}
          <div className="sm:col-span-2 lg:col-span-5">
            <div className="mb-6">
              <Image
                src="/logo.png"
                alt="Salas Art Gallery"
                width={200}
                height={70}
                className="h-16 w-auto object-contain"
                quality={100}
                unoptimized
              />
            </div>
            <p className="font-display text-2xl sm:text-3xl font-light leading-tight text-white max-w-md">
              Un espacio para descubrir, dialogar y convivir con el arte contemporáneo.
            </p>
            <Link
              href="/galeria"
              className="inline-flex mt-7 items-center gap-2 border-b border-violet-300 pb-1 text-sm font-medium text-white hover:text-violet-200 hover:border-violet-200 transition-colors"
            >
              Programa una visita <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Explora */}
          <div className="hidden md:block lg:col-span-2">
            <h4 className={headingClass}>Explora</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/artistas" className={linkClass}>
                  Artistas
                </Link>
              </li>
              <li>
                <Link href="/exposiciones" className={linkClass}>
                  Exposiciones
                </Link>
              </li>
              <li>
                <Link href="/galeria" className={linkClass}>
                  Visita la galería
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className={linkClass}>
                  Sobre nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Explorar */}
          <div className="lg:col-span-2">
            <h4 className={headingClass}>Explorar</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['Todas las obras', '/productos'],
                ['Promociones', '/promociones'],
                ['Artistas', '/artistas'],
                ['Exposiciones', '/exposiciones'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="lg:col-span-3">
            <h4 className={headingClass}>Contacto</h4>
            <ul className="space-y-3 text-sm text-violet-100/80">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-violet-300 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${EMAIL}`} className="hover:text-white transition-colors break-all">
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-violet-300 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${PHONE_TEL}`} className="hover:text-white transition-colors">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-violet-300 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors font-medium text-white"
                >
                  Escríbenos por WhatsApp
                </a>
              </li>
            </ul>

            <h4 className={`${headingClass} mt-8`}>Síguenos</h4>
            <div className="flex flex-wrap gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-[22%] shadow-md ring-1 ring-white/15 transition-all hover:scale-105 hover:brightness-110 hover:ring-white/25"
                aria-label="Instagram @salasartgalleryoaxaca"
              >
                <svg className="w-11 h-11" viewBox="0 0 24 24" aria-hidden>
                  <defs>
                    <linearGradient id="footerInstagramGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFDC80" />
                      <stop offset="25%" stopColor="#F77737" />
                      <stop offset="50%" stopColor="#E1306C" />
                      <stop offset="75%" stopColor="#C13584" />
                      <stop offset="100%" stopColor="#833AB4" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#footerInstagramGrad)"
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                  />
                </svg>
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[22%] bg-[#1877F2] text-white shadow-md transition-all hover:scale-105 hover:brightness-110"
                aria-label="Facebook de Salas Art Gallery"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M13.6 21v-8.2h2.75l.41-3.2H13.6V7.56c0-.93.26-1.56 1.59-1.56h1.7V3.14c-.29-.04-1.3-.14-2.48-.14-2.45 0-4.13 1.49-4.13 4.23V9.6H7.5v3.2h2.78V21h3.32Z" />
                </svg>
              </a>
            </div>
            <p className="text-xs text-violet-200/60 mt-3">@salasartgalleryoaxaca</p>
          </div>
        </div>

        {/* Métodos de pago */}
        <div className="hidden sm:block border-t border-violet-800/80 mt-12 pt-9">
          <div className="text-center md:text-left">
            <h5 className="text-white font-medium mb-1 text-xs uppercase tracking-[0.18em] text-violet-300">Métodos de pago</h5>
            <p className="text-violet-200/55 text-xs mb-4 max-w-xl">
              Mismos medios disponibles en el checkout con Mercado Pago (México).
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              {/* Visa */}
              <div className="bg-white rounded-lg border border-gray-100 h-10 w-[4.5rem] flex items-center justify-center shadow-sm px-2">
                <svg className="h-9 w-auto max-w-full" viewBox="0 -11 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Visa">
                  <rect x="0.5" y="0.5" width="69" height="47" rx="5.5" fill="white" stroke="#D9D9D9" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M21.2505 32.5165H17.0099L13.8299 20.3847C13.679 19.8267 13.3585 19.3333 12.8871 19.1008C11.7106 18.5165 10.4142 18.0514 9 17.8169V17.3498H15.8313C16.7742 17.3498 17.4813 18.0514 17.5991 18.8663L19.2491 27.6173L23.4877 17.3498H27.6104L21.2505 32.5165ZM29.9675 32.5165H25.9626L29.2604 17.3498H33.2653L29.9675 32.5165ZM38.4467 21.5514C38.5646 20.7346 39.2717 20.2675 40.0967 20.2675C41.3931 20.1502 42.8052 20.3848 43.9838 20.9671L44.6909 17.7016C43.5123 17.2345 42.216 17 41.0395 17C37.1524 17 34.3239 19.1008 34.3239 22.0165C34.3239 24.2346 36.3274 25.3992 37.7417 26.1008C39.2717 26.8004 39.861 27.2675 39.7431 27.9671C39.7431 29.0165 38.5646 29.4836 37.3881 29.4836C35.9739 29.4836 34.5596 29.1338 33.2653 28.5494L32.5582 31.8169C33.9724 32.3992 35.5025 32.6338 36.9167 32.6338C41.2752 32.749 43.9838 30.6502 43.9838 27.5C43.9838 23.5329 38.4467 23.3004 38.4467 21.5514ZM58 32.5165L54.82 17.3498H51.4044C50.6972 17.3498 49.9901 17.8169 49.7544 18.5165L43.8659 32.5165H47.9887L48.8116 30.3004H53.8772L54.3486 32.5165H58ZM51.9936 21.4342L53.1701 27.1502H49.8723L51.9936 21.4342Z" fill="#172B85" />
                </svg>
              </div>
              {/* Mastercard */}
              <div className="bg-white rounded-lg border border-gray-100 h-10 w-[4.5rem] flex items-center justify-center shadow-sm px-2">
                <svg className="h-9 w-auto max-w-full" viewBox="0 -9 58 58" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard">
                  <rect x="0.5" y="0.5" width="57" height="39" rx="3.5" fill="white" stroke="#F3F3F3" />
                  <path d="M34.3102 28.9765H23.9591V10.5122H34.3102V28.9765Z" fill="#FF5F00" />
                  <path d="M24.6223 19.7429C24.6223 15.9973 26.3891 12.6608 29.1406 10.5107C27.1285 8.93843 24.5892 7.99998 21.8294 7.99998C15.2961 7.99998 10 13.2574 10 19.7429C10 26.2283 15.2961 31.4857 21.8294 31.4857C24.5892 31.4857 27.1285 30.5473 29.1406 28.975C26.3891 26.8249 24.6223 23.4884 24.6223 19.7429" fill="#EB001B" />
                  <path d="M48.2706 19.7429C48.2706 26.2283 42.9745 31.4857 36.4412 31.4857C33.6814 31.4857 31.1421 30.5473 29.1293 28.975C31.8815 26.8249 33.6483 23.4884 33.6483 19.7429C33.6483 15.9973 31.8815 12.6608 29.1293 10.5107C31.1421 8.93843 33.6814 7.99998 36.4412 7.99998C42.9745 7.99998 48.2706 13.2574 48.2706 19.7429" fill="#F79E1B" />
                </svg>
              </div>
              {/* American Express */}
              <div className="bg-white rounded-lg border border-gray-100 h-10 w-[4.5rem] flex items-center justify-center shadow-sm px-2">
                <svg className="h-9 w-auto max-w-full" viewBox="0 -9 58 58" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="American Express">
                  <rect x="0.5" y="0.5" width="57" height="39" rx="3.5" fill="#006FCF" stroke="#F3F3F3" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.8632 28.8937V20.6592H21.1869L22.1872 21.8787L23.2206 20.6592H57.0632V28.3258C57.0632 28.3258 56.1782 28.8855 55.1546 28.8937H36.4152L35.2874 27.5957V28.8937H31.5916V26.6779C31.5916 26.6779 31.0867 26.9872 29.9953 26.9872H28.7373V28.8937H23.1415L22.1426 27.6481L21.1284 28.8937H11.8632ZM1 14.4529L3.09775 9.86914H6.7256L7.9161 12.4368V9.86914H12.4258L13.1346 11.7249L13.8216 9.86914H34.0657V10.8021C34.0657 10.8021 35.1299 9.86914 36.8789 9.86914L43.4474 9.89066L44.6173 12.4247V9.86914H48.3913L49.43 11.3247V9.86914H53.2386V18.1037H49.43L48.4346 16.6434V18.1037H42.8898L42.3321 16.8056H40.8415L40.293 18.1037H36.5327C35.0277 18.1037 34.0657 17.1897 34.0657 17.1897V18.1037H28.3961L27.2708 16.8056V18.1037H6.18816L5.63093 16.8056H4.14505L3.59176 18.1037H1V14.4529ZM1.01082 17.05L3.84023 10.8843H5.98528L8.81199 17.05H6.92932L6.40997 15.8154H3.37498L2.85291 17.05H1.01082ZM5.81217 14.4768L4.88706 12.3192L3.95925 14.4768H5.81217ZM9.00675 17.049V10.8832L11.6245 10.8924L13.147 14.8676L14.6331 10.8832H17.2299V17.049H15.5853V12.5058L13.8419 17.049H12.3996L10.6514 12.5058V17.049H9.00675ZM18.3552 17.049V10.8832H23.7219V12.2624H20.0171V13.3171H23.6353V14.6151H20.0171V15.7104H23.7219V17.049H18.3552ZM24.674 17.05V10.8843H28.3339C29.5465 10.8843 30.6331 11.5871 30.6331 12.8846C30.6331 13.9938 29.717 14.7082 28.8289 14.7784L30.9929 17.05H28.9831L27.0111 14.8596H26.3186V17.05H24.674ZM28.1986 12.2635H26.3186V13.5615H28.223C28.5526 13.5615 28.9776 13.3221 28.9776 12.9125C28.9776 12.5941 28.6496 12.2635 28.1986 12.2635ZM32.9837 17.049H31.3045V10.8832H32.9837V17.049ZM36.9655 17.049H36.603C34.8492 17.049 33.7844 15.754 33.7844 13.9915C33.7844 12.1854 34.8373 10.8832 37.052 10.8832H38.8698V12.3436H36.9856C36.0865 12.3436 35.4507 13.0012 35.4507 14.0067C35.4507 15.2008 36.1777 15.7023 37.2251 15.7023H37.6579L36.9655 17.049ZM37.7147 17.05L40.5441 10.8843H42.6892L45.5159 17.05H43.6332L43.1139 15.8154H40.0789L39.5568 17.05H37.7147ZM42.5161 14.4768L41.591 12.3192L40.6632 14.4768H42.5161ZM45.708 17.049V10.8832H47.7989L50.4687 14.7571V10.8832H52.1134V17.049H50.09L47.3526 13.0737V17.049H45.708ZM12.9885 27.8391V21.6733H18.3552V23.0525H14.6504V24.1072H18.2686V25.4052H14.6504V26.5005H18.3552V27.8391H12.9885ZM39.2853 27.8391V21.6733H44.6519V23.0525H40.9472V24.1072H44.5481V25.4052H40.9472V26.5005H44.6519V27.8391H39.2853ZM18.5635 27.8391L21.1765 24.7942L18.5012 21.6733H20.5733L22.1665 23.6026L23.7651 21.6733H25.756L23.1159 24.7562L25.7338 27.8391H23.6621L22.1151 25.9402L20.6057 27.8391H18.5635ZM25.9291 27.8401V21.6744H29.5619C31.0525 21.6744 31.9234 22.5748 31.9234 23.7482C31.9234 25.1647 30.8131 25.893 29.3482 25.893H27.617V27.8401H25.9291ZM29.4402 23.0687H27.617V24.4885H29.4348C29.9151 24.4885 30.2517 24.1901 30.2517 23.7786C30.2517 23.3406 29.9134 23.0687 29.4402 23.0687ZM32.6375 27.8391V21.6733H36.2973C37.51 21.6733 38.5966 22.3761 38.5966 23.6736C38.5966 24.7828 37.6805 25.4972 36.7923 25.5675L38.9563 27.8391H36.9465L34.9746 25.6486H34.2821V27.8391H32.6375ZM36.1621 23.0525H34.2821V24.3505H36.1864C36.5161 24.3505 36.9411 24.1112 36.9411 23.7015C36.9411 23.3831 36.6131 23.0525 36.1621 23.0525ZM45.4137 27.8391V26.5005H48.7051C49.1921 26.5005 49.403 26.2538 49.403 25.9833C49.403 25.7241 49.1928 25.462 48.7051 25.462H47.2177C45.9249 25.462 45.2048 24.7237 45.2048 23.6153C45.2048 22.6267 45.8642 21.6733 47.7854 21.6733H50.9881L50.2956 23.0606H47.5257C46.9962 23.0606 46.8332 23.321 46.8332 23.5697C46.8332 23.8253 47.0347 24.1072 47.4392 24.1072H48.9972C50.4384 24.1072 51.0638 24.8734 51.0638 25.8768C51.0638 26.9555 50.367 27.8391 48.9188 27.8391H45.4137ZM51.2088 27.8391V26.5005H54.5002C54.9873 26.5005 55.1981 26.2538 55.1981 25.9833C55.1981 25.7241 54.9879 25.462 54.5002 25.462H53.0129C51.72 25.462 51 24.7237 51 23.6153C51 22.6267 51.6594 21.6733 53.5806 21.6733H56.7833L56.0908 23.0606H53.3209C52.7914 23.0606 52.6284 23.321 52.6284 23.5697C52.6284 23.8253 52.8298 24.1072 53.2343 24.1072H54.7924C56.2336 24.1072 56.859 24.8734 56.859 25.8768C56.859 26.9555 56.1621 27.8391 54.7139 27.8391H51.2088Z" fill="white" />
                </svg>
              </div>
              {/* OXXO */}
              <div className="bg-white rounded-lg border border-gray-100 h-10 w-[4.5rem] flex items-center justify-center shadow-sm px-2">
                <svg className="h-6 w-auto max-w-full" viewBox="35.433 35.451 885.827 448.901" xmlns="http://www.w3.org/2000/svg" aria-label="OXXO">
                  <path d="m35.433 90.172c0-29.6 23.773-53.618 53.129-53.618h779.447c29.33 0 53.128 24.018 53.128 53.618v339.166c0 29.6-23.797 53.593-53.128 53.593h-779.447c-29.356 0-53.129-23.993-53.129-53.593z" fill="#fff"/>
                  <path d="m36.045 84.761c0-27.225 21.888-49.31 48.869-49.31h787.502c26.98 0 48.844 22.085 48.844 49.31v1.567h-885.215zm885.215 349.057v1.224c0 27.225-21.864 49.31-48.844 49.31h-787.502c-26.98 0-48.869-22.085-48.869-49.31v-1.224z" fill="#fbb110"/>
                  <path d="m648.688 259.375c0 68.92 55.357 124.791 123.665 124.791 68.284 0 123.665-55.87 123.665-124.79 0-68.946-55.381-124.816-123.665-124.816-68.308 0-123.665 55.87-123.665 124.815zm-589.604 0c0 68.92 55.38 124.791 123.689 124.791 68.284 0 123.665-55.87 123.665-124.79 0-68.946-55.381-124.816-123.665-124.816-68.308 0-123.69 55.87-123.69 124.815zm862.176 150.817h-609.754c10.993-7.786 21.227-18.436 32.39-32.808l62.115-79.986 27.127 34.594 30.188-40.52-26.393-33.909 63.216-81.43c20.076-25.83-18.314-56.19-38.39-30.36l-55.87 71.98-56.802-72.935c-20.1-25.756-58.417 4.677-38.316 30.457l64.195 82.313-69.459 89.437c-24.679 31.78-49.309 60.914-98.202 63.167h-171.26v-300.238h606.547c-10.43 7.688-20.272 17.995-30.947 31.755l-62.09 79.962-27.151-34.57-30.163 40.52 26.393 33.884-63.24 81.431c-20.052 25.83 18.337 56.19 38.39 30.36l55.894-71.957 56.801 72.911c20.101 25.781 58.417-4.651 38.316-30.432l-64.194-82.337 69.458-89.413c22.672-29.233 45.319-56.213 86.793-62.114h184.408zm-222.944-150.817c0-41.278 33.15-74.723 74.037-74.723s74.013 33.445 74.013 74.723c0 41.254-33.126 74.698-74.013 74.698s-74.037-33.444-74.037-74.698zm-589.58 0c0-41.278 33.15-74.723 74.037-74.723 40.862 0 74.013 33.445 74.013 74.723 0 41.254-33.15 74.698-74.013 74.698-40.887 0-74.037-33.444-74.037-74.698" fill="#e70020"/>
                </svg>
              </div>
              {/* SPEI */}
              <div className="bg-white rounded-lg border border-gray-100 h-10 w-[4.5rem] flex items-center justify-center shadow-sm px-2">
                <svg className="h-6 w-auto max-w-full" viewBox="111.84 48.85 7874.03 2659.55" xmlns="http://www.w3.org/2000/svg" aria-label="SPEI">
                  <path d="m1590.45 853.28c239.8-12.21 467.61-30.53 703.82-41.04-67.9-498.98-308.88-763.39-1037.63-763.39-715.59 0-1026.31 367.85-1067.35 705.82-46.18 380.33 240.11 623.95 697.83 757.04 395.35 115.84 726.67 196.34 736.99 390.5 11.11 208.81-227.43 326.15-345.59 326.15-211.18 0-440.92-233.93-468.41-448.34-229.84 18.24-468.43 19.22-698.27 37.46 0 582.44 473.37 890.92 1101.01 890.92 585.3 0 1160.13-246.13 1160.13-875.57 0-764.21-826.87-763.98-1368.08-952.19-189.25-104.48-90.56-333.08 87.56-353.16 359.61-43.65 421.35 160.93 497.98 325.8zm2253.12-742.54c469.01 0 801.11 258.43 801.11 782.31 0 480.12-330.42 786.61-810.05 786.61h-599.03v919.38c0 63.16 0 63.16-55.78 63.16h-624.98c-78.25 0-78.25 0-78.25-58.77v-2383.54c0-109.15 0-109.15 109.83-109.15zm-547.73 1083.1c-44.31 0-60.24-18.19-60.24-45.69v-493.89c0-36.22 29.56-56.57 56.57-56.57h262.58c226.01 33.35 308.74 155.81 308.74 315.48 0 228.46-203.65 280.67-380.54 280.67h-187.12z" fill="#343084"/>
                  <path d="m4815.26 181.3c0-32 22.97-56.49 48.29-56.49h1992.19c43.96-1.99 48.75 16.09 48.75 33.2v455.26c2.05 21.13-15.34 30.79-30.79 30.79h-1261.47c-26.36 0-35.08 27.02-35.08 56.54v307.39c0 33.15 23.64 63.46 63.46 63.46h1116.16l25.47 25.47v426.87c-12.76 18.31-25.52 36.61-38.28 54.93h-1124.75c-26.02 0-42.07 16.06-42.07 42.07v409.49c0 22.58 26.91 47.72 58.37 47.72h1243.51c16.44 0 25.46 15.65 25.46 25.46v497.34c0 11.7-13.23 24.48-24.48 24.48h-2044.4c-10.84 0-20.34-10.7-20.34-20.34v-2423.63z" fill="#ff9400"/>
                  <path d="m7985.86 1535.24v1090.04h-709.39c-10.84 0-20.34-10.7-20.34-20.34v-973.8c0-26.08 18.02-41.09 31.48-41.09h203.66c20.41 0 25.57 17.46 25.57 32.87v455.08c0 57.49 48.2 32.72 73.98 0 131.69-180.92 263.37-361.84 395.05-542.76z" fill="#343084"/>
                  <path d="m7225.12 181.3c0-32 22.97-56.49 48.29-56.49h651.17c45.11 0 61.28 27.62 61.28 49.42v930.78l-398.7-557.94c-8.61-12.07-28.31-11.29-28.31 13.7v401.85c0 22.38-11.06 64.84-42.93 64.84h-259.82c-14.16 0-31.01-31.95-31.01-50.23v-795.93z" fill="#ff9400"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Legal + copyright */}
        <div className="border-t border-violet-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 text-xs text-violet-200/55">
            <Link href="/aviso-de-privacidad" className="hover:text-white transition-colors">
              Aviso de privacidad
            </Link>
            <span className="hidden sm:inline text-violet-700" aria-hidden>|</span>
            <Link href="/terminos" className="hover:text-white transition-colors">
              Términos y condiciones
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-sm text-violet-200/55">
              &copy; {new Date().getFullYear()} Salas Art Gallery. Todos los derechos reservados.
            </p>
            <span className="hidden sm:inline text-violet-700 text-xs" aria-hidden>·</span>
            <p className="text-xs text-violet-200/45">
              Desarrollado por{' '}
              <a
                href="https://argaweb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-200/70 hover:text-white transition-colors duration-200 underline underline-offset-2 decoration-violet-700 hover:decoration-white"
              >
                argaweb.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
