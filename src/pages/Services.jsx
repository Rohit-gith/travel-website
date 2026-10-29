import { CheckCircle2 } from 'lucide-react';
import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import ServiceIcon from '@/components/common/ServiceIcon';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';
import CallToAction from '@/components/home/CallToAction';
import { servicesData } from '@/data/services';
import { serviceMessage, waLink } from '@/utils/whatsapp';

export default function Services() {
  return (
    <>
      <PageHeader
        title="Our Services"
        subtitle="From airport transfers to wedding fleets - one trusted team for every kind of journey."
      />

      <Container className="space-y-8 py-16">
        {servicesData.map((s, i) => (
          <article
            key={s.id}
            id={s.id}
            className={`scroll-mt-24 grid overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-slate-100 ${
              i % 2 ? 'md:grid-cols-[1fr_280px]' : 'md:grid-cols-[280px_1fr]'
            }`}
          >
            <div
              className={`flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-brand-700 to-brand-900 p-8 text-center text-white ${
                i % 2 ? 'md:order-2' : ''
              }`}
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30">
                <ServiceIcon name={s.icon} className="h-10 w-10 text-[#fcd34d]" />
              </span>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#fcd34d]">{s.tagline}</p>
            </div>

            <div className="p-8 md:p-10">
              <h2 className="font-display text-2xl font-bold sm:text-3xl">{s.title}</h2>
              <p className="mt-3 text-slate-600">{s.description}</p>

              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {p}
                  </li>
                ))}
              </ul>

              <a
                href={waLink(serviceMessage(s))}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#128C7E]"
              >
                <WhatsAppIcon className="h-5 w-5" /> Book on WhatsApp
              </a>
            </div>
          </article>
        ))}
      </Container>

      <CallToAction />
    </>
  );
}