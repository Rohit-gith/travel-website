import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import ServiceIcon from '@/components/common/ServiceIcon';
import Button from '@/components/common/Button';
import { servicesData } from '@/data/services';

export default function ServicesPreview() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Our services"
          title="A ride for every occasion"
          subtitle="Airport transfers, outstation trips, family holidays, city tours and weddings - all handled by one reliable team."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicesData.map((s) => (
            <Link
              key={s.id}
              to={`/services#${s.id}`}
              className="group rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-100 transition hover:-translate-y-1 hover:ring-brand-200"
            >
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <ServiceIcon name={s.icon} />
              </span>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                Learn more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button to="/services" variant="secondary" size="lg">
            View all services <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Container>
    </section>
  );
}