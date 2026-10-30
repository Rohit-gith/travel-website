import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Heart, Menu, Plane, X } from 'lucide-react';
import Container from '@/components/common/Container';
import LanguageToggle from '@/components/common/LanguageToggle';
import ServiceIcon from '@/components/common/ServiceIcon';
import { APP_NAME, APP_TAGLINE, LOGO_SRC, NAV_LINKS } from '@/constants';
import { servicesData } from '@/data/services';
import { useAppSelector } from '@/app/hooks';
import { selectWishlistIds } from '@/features/wishlist/wishlistSlice';

// light = navbar transparent hai (hero photo ke upar), isliye text white dikhana hai
const linkClass =
  (light) =>
  ({ isActive }) =>
    `text-sm font-medium transition ${
      light
        ? `hover:text-amber-300 ${isActive ? 'text-amber-300' : 'text-white'}`
        : `hover:text-brand-600 ${isActive ? 'text-brand-600' : 'text-slate-700'}`
    }`;

// Custom logo + do-line wordmark. Image load na ho to purana Plane icon fallback me dikhega
function Logo({ light }) {
  const [failed, setFailed] = useState(false);

  return (
    <Link to="/" className="group flex items-center gap-3" aria-label={APP_NAME}>
      {failed ? (
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Plane className="h-5 w-5" />
        </span>
      ) : (
        <img
          src={LOGO_SRC}
          alt={`${APP_NAME} logo`}
          onError={() => setFailed(true)}
          className={`h-14 w-14 rounded-xl object-cover shadow-md ring-1 transition group-hover:shadow-lg ${
            light ? 'ring-white/30' : 'ring-slate-900/10'
          }`}
        />
      )}

      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[1.35rem] font-bold tracking-tight transition-colors sm:text-2xl ${
            light ? 'text-white' : 'text-slate-900'
          }`}
          style={light ? { textShadow: '0 2px 10px rgba(0,0,0,0.45)' } : undefined}
        >
          <span translate="no" className="notranslate">{APP_NAME}</span>
        </span>
        {APP_TAGLINE && (
          <span
            className={`mt-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] transition-colors sm:text-[10px] sm:tracking-[0.28em] ${
              light ? 'text-amber-300' : 'text-amber-600'
            }`}
          >
            {APP_TAGLINE}
          </span>
        )}
      </span>
    </Link>
  );
}

// "Services" with a hover / keyboard-focus dropdown listing every service
function ServicesMenu({ link, light }) {
  const { pathname } = useLocation();
  const active = pathname.startsWith('/services');
  const color = light
    ? `hover:text-amber-300 ${active ? 'text-amber-300' : 'text-white'}`
    : `hover:text-brand-600 ${active ? 'text-brand-600' : 'text-slate-700'}`;

  return (
    <div className="group relative">
      <NavLink to={link.to} className={`flex items-center gap-1 text-sm font-medium transition ${color}`}>
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
              onClick={(e) => e.currentTarget.blur()}
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
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const wishlistCount = useAppSelector(selectWishlistIds).length;

  const isHome = pathname === '/';

  // Scroll karte hi navbar solid ho jaye
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sirf Home page par (jahan hero photo hai) navbar transparent rahega.
  // Baaki pages par hamesha solid. Mobile menu khula ho to bhi solid.
  const transparent = isHome && !scrolled && !open;

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${isHome ? '-mb-20' : ''} ${
        transparent ? 'border-transparent bg-transparent' : 'border-slate-200 bg-white shadow-sm'
      }`}
    >
      {/* Transparent state me halka dark gradient, taaki bright photo par bhi text padhne me aaye */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/55 to-transparent transition-opacity duration-300 ${
          transparent ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <Container className="relative flex h-20 items-center justify-between">
        <Logo light={transparent} />

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) =>
            l.to === '/services' ? (
              <ServicesMenu key={l.to} link={l} light={transparent} />
            ) : (
              <NavLink key={l.to} to={l.to} className={linkClass(transparent)} end={l.to === '/'}>
                {l.label}
              </NavLink>
            )
          )}
          <NavLink to="/bookings" className={linkClass(transparent)}>
            My Bookings
          </NavLink>
          <LanguageToggle light={transparent} />
          <Link
            to="/wishlist"
            className={`relative rounded-full p-2 transition ${
              transparent ? 'text-white hover:bg-white/15' : 'text-slate-700 hover:bg-slate-100'
            }`}
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

        {/* Mobile: language icon + menu button */}
        <div className="flex items-center gap-1 md:hidden">
          <LanguageToggle light={transparent} iconOnly />
          <button
            className={`rounded-lg p-2 transition ${
              transparent ? 'text-white hover:bg-white/15' : 'text-slate-700 hover:bg-slate-100'
            }`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {open && (
        <nav className="relative max-h-[80vh] overflow-y-auto border-t border-slate-200 bg-white md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            <div className="mb-1">
              <LanguageToggle full />
            </div>
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