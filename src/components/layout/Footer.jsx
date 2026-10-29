import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Plane } from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';
import { GENERAL_MESSAGE, waLink } from '@/utils/whatsapp';
import Container from '@/components/common/Container';
import { APP_NAME, APP_TAGLINE, CONTACT_INFO, DEVELOPER, LOGO_SRC, NAV_LINKS } from '@/constants';

// Footer ka logo + naam (click karne par Home page khulega)
function FooterLogo() {
  const [failed, setFailed] = useState(false);

  return (
    <Link to="/" className="inline-flex items-center gap-3" aria-label={`${APP_NAME} home`}>
      {failed ? (
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Plane className="h-6 w-6" />
        </span>
      ) : (
        <img
          src={LOGO_SRC}
          alt={`${APP_NAME} logo`}
          onError={() => setFailed(true)}
          className="h-12 w-12 rounded-xl object-cover shadow-lg ring-1 ring-white/20"
        />
      )}
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl font-bold tracking-tight text-white"><span translate="no" className="notranslate">{APP_NAME}</span></span>
        {APP_TAGLINE && (
          <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#fbbf24]">
            {APP_TAGLINE}
          </span>
        )}
      </span>
    </Link>
  );
}

export default function Footer() {
  const phoneHref = `tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_INFO.address)}`;

  return (
    <footer className="bg-slate-900 text-slate-300">
      <Container className="grid gap-10 py-14 md:grid-cols-3">
        <div>
          <FooterLogo />
          <p className="mt-4 max-w-xs text-sm text-slate-400">
            Curated tours across India and the world. Travel better with people who care about your journey.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 transition hover:text-white"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {CONTACT_INFO.address}
              </a>
            </li>
            <li>
              <a href={phoneHref} className="flex items-center gap-2 transition hover:text-white">
                <Phone className="h-4 w-4 shrink-0" /> <span translate="no" className="notranslate">{CONTACT_INFO.phone}</span>
              </a>
            </li>
            <li>
              <a
                href={waLink(GENERAL_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition hover:text-white"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0 text-[#25D366]" /> Chat on WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-2 break-all transition hover:text-white">
                <Mail className="h-4 w-4 shrink-0" /> <span translate="no" className="notranslate">{CONTACT_INFO.email}</span>
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-slate-800 py-5 text-xs text-slate-500">
        <Container className="flex flex-col items-center gap-2 text-center">
          <p>
            &copy; {new Date().getFullYear()} <span translate="no" className="notranslate">{APP_NAME}</span>. All rights reserved.
          </p>
          <p>
            Designed &amp; developed by{' '}
            <a
              href={DEVELOPER.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#fbbf24] transition hover:text-[#fcd34d] hover:underline"
            >
              {DEVELOPER.name}
            </a>
          </p>
        </Container>
      </div>
    </footer>
  );
}