import { BadgeIndianRupee, CalendarCheck, MapPin, ShieldCheck } from 'lucide-react';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import { features } from '@/data/testimonials';

const icons = { MapPin, BadgeIndianRupee, ShieldCheck, CalendarCheck };

export default function Features() {
  return (
    <section className="bg-sand-50 py-20">
      <Container>
        <SectionHeading
          eyebrow="Why choose us"
          title="Travel made simple"
          subtitle="We handle the details so you can focus on the experience."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = icons[f.icon];
            return (
              <div key={f.id} className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-100">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
