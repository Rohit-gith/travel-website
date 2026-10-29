import { Quote, Star } from 'lucide-react';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import { testimonials } from '@/data/testimonials';

export default function Testimonials() {
  return (
    <section className="bg-slate-50 py-20">
      <Container>
        <SectionHeading eyebrow="Testimonials" title="Loved by travellers" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.id} className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-100">
              <Quote className="h-8 w-8 text-brand-200" />
              <blockquote className="mt-3 text-slate-700">{t.text}</blockquote>
              <div className="mt-4 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-sand-500 text-sand-500" />
                ))}
              </div>
              <figcaption className="mt-3 text-sm">
                <span className="font-semibold text-slate-900">{t.name}</span>
                <span className="text-slate-500"> - {t.city}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
