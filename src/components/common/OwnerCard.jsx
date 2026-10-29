import { useState } from 'react';
import { Phone } from 'lucide-react';
import Container from '@/components/common/Container';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';
import { CONTACT_INFO, OWNER } from '@/constants';
import { GENERAL_MESSAGE, waLink } from '@/utils/whatsapp';

function OwnerPhoto() {
  const [failed, setFailed] = useState(false);
  const initials = OWNER.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  return (
    <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[280px]">
      <div className="absolute -bottom-3 -right-3 h-full w-full rounded-3xl border border-[#fbbf24]/60" />
      {failed ? (
        <div className="relative flex aspect-[4/5] w-full items-center justify-center rounded-3xl bg-gradient-to-br from-[#047857] to-[#064e3b] shadow-2xl">
          <span className="font-display text-7xl font-bold text-white/90">{initials}</span>
        </div>
      ) : (
        <img
          src={OWNER.photo}
          alt={`${OWNER.name}, ${OWNER.role}`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="relative block aspect-[4/5] w-full rounded-3xl object-cover object-top shadow-2xl ring-1 ring-white/20"
        />
      )}
    </div>
  );
}

export default function OwnerCard() {
  return (
    <section className="bg-gradient-to-br from-[#064e3b] via-[#065f46] to-slate-950 py-12 lg:py-16">
      <Container>
        <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-[280px_1fr] lg:gap-14">
          <OwnerPhoto />

          <div className="text-white">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#fbbf24]">Meet the owner</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              The person behind every journey
            </h2>

            <p className="mt-5 border-l-2 border-[#fbbf24] pl-5 text-lg leading-relaxed text-white/90">{OWNER.bio}</p>

            <div className="mt-6">
              <p className="font-display text-2xl font-bold text-white">{OWNER.name}</p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-[#fcd34d]">{OWNER.role}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={waLink(GENERAL_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-[#128C7E]"
              >
                <WhatsAppIcon className="h-5 w-5" /> Message on WhatsApp
              </a>
              <a
                href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3.5 font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/20"
              >
                <Phone className="h-4 w-4" /> <span translate="no" className="notranslate">{CONTACT_INFO.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}