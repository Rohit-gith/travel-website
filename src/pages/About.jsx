import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import SectionHeading from '@/components/common/SectionHeading';
import CallToAction from '@/components/home/CallToAction';

const stats = [
  { value: '10K+', label: 'Happy travellers' },
  { value: '150+', label: 'Destinations' },
  { value: '12', label: 'Years of experience' },
  { value: '4.8', label: 'Average rating' },
];

export default function About() {
  return (
    <>
      <PageHeader title="About Us" subtitle="We turn travel dreams into well-planned journeys." />
      <Container className="py-16">
        <SectionHeading
          align="left"
          eyebrow="Our story"
          title="Travel with people who love travel"
          subtitle="Wanderly started with a simple idea: planning a trip should be as enjoyable as taking it. Our team of local experts designs every itinerary with care, so you get authentic experiences without the stress."
        />
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-brand-50 p-6 text-center">
              <p className="font-display text-4xl font-bold text-brand-700">{s.value}</p>
              <p className="mt-1 text-sm text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
      </Container>
      <CallToAction />
    </>
  );
}