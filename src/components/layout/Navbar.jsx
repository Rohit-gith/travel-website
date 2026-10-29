import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Heart, Menu, Plane, X } from 'lucide-react';
import Container from '@/components/common/Container';
import ServiceIcon from '@/components/common/ServiceIcon';
import { NAV_LINKS } from '@/constants';
import { servicesData } from '@/data/services';
import { useAppSelector } from '@/app/hooks';
import { selectWishlistIds } from '@/features/wishlist/wishlistSlice';

// Logo file: public/logo.png (svg / webp ho to naam yahin badal do)
const LOGO_SRC = '/logo.jpeg';

// Navbar me naam seedha yahin se aayega (constants file par depend nahi)
const BRAND_NAME = 'Sovanshi Travels';

// Naam ke neeche chhoti line. Nahi chahiye to '' kar do
const BRAND_TAGLINE = 'Trusted Travel Partner';

// Agar logo me already company ka naam likha hai to false kar do
const SHOW_NAME_NEXT_TO_LOGO = true;

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition hover:text-brand-600 ${isActive ? 'text-brand-600' : 'text-slate-700'}`;

// Custom logo + do-line wordmark. Image load na ho to purana Plane icon fallback me dikhega
function Logo() {
  const [failed, setFailed] = useState(false);

  return (
    <Link to="/" className="group flex items-center gap-3" aria-label={BRAND_NAME}>
      {failed ? (
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Plane className="h-5 w-5" />
        </span>
      ) : (
        <img
          src={LOGO_SRC}
          alt={`${BRAND_NAME} logo`}
          onError={() => setFailed(true)}
          className="h-14 w-14 rounded-xl object-cover shadow-md ring-1 ring-slate-900/10 transition group-hover:shadow-lg"
        />
      )}

      {(SHOW_NAME_NEXT_TO_LOGO || failed) && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.35rem] font-bold tracking-tight text-slate-900 sm:text-2xl">
            {BRAND_NAME}
          </span>
          {BRAND_TAGLINE && (
            <span className="mt-1.5 hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-600 sm:block">
              {BRAND_TAGLINE}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}

// "Services" with a hover / keyboard-focus dropdown listing every service
function ServicesMenu({ link }) {
  const { pathname } = useLocation();
  const active = pathname.startsWith('/services');

  return (
    <div className="group relative">
      <NavLink
        to={link.to}
        className={`flex items-center gap-1 text-sm font-medium transition hover:text-brand-600 ${
          active ? 'text-brand-600' : 'text-slate-700'
        }`}
      >
        {link.label}
        <ChevronDown className="h-4 w-4 transition group-hover:rotate-180 group-focus-within:rotate-180" />
      </NavLink>

      {/* pt-4 bridges the gap so the menu doesn't close while moving the mouse down */}
      <div className="invisible absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-4 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-slate-200">
          {servicesData.map((s) => (
            <Link
              key={s.id}
              to={`/services#${s.id}`}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-brand-50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <ServiceIcon name={s.icon} className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-900">{s.title}</span>
                <span className="block text-xs text-slate-500">{s.tagline}</span>
              </span>
            </Link>
          ))}
          <Link
            to="/services"
            className="mt-1 block rounded-xl bg-slate-50 px-3 py-2.5 text-center text-sm font-semibold text-brand-700 hover:bg-brand-50"
          >
            View all services
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const wishlistCount = useAppSelector(selectWishlistIds).length;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Logo />

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) =>
            l.to === '/services' ? (
              <ServicesMenu key={l.to} link={l} />
            ) : (
              <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
                {l.label}
              </NavLink>
            )
          )}
          <NavLink to="/bookings" className={linkClass}>
            My Bookings
          </NavLink>
          <Link
            to="/wishlist"
            className="relative rounded-full p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {/* Mobile menu */}
      {open && (
        <nav className="max-h-[80vh] overflow-y-auto border-t border-slate-200 bg-white md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {[...NAV_LINKS, { label: 'My Bookings', to: '/bookings' }, { label: `Wishlist (${wishlistCount})`, to: '/wishlist' }].map(
              (l) => (
                <div key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'}`
                    }
                  >
                    {l.label}
                  </NavLink>
                  {l.to === '/services' && (
                    <div className="mb-1 ml-4 border-l-2 border-brand-100 pl-3">
                      {servicesData.map((s) => (
                        <Link
                          key={s.id}
                          to={`/services#${s.id}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                        >
                          <ServiceIcon name={s.icon} className="h-4 w-4 text-brand-600" /> {s.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </Container>
        </nav>
      )}
    </header>
  );
}