import Container from '@/components/common/Container';
import Button from '@/components/common/Button';

export default function CallToAction() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-3xl bg-gradient-to-br from-brand-800 to-brand-500 px-8 py-14 text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Ready for your next adventure?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            Talk to our travel experts and get a custom itinerary within 24 hours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/tours" variant="light" size="lg">
              Browse tours
            </Button>
            <Button to="/contact" variant="ghost" size="lg" className="text-white hover:bg-white/10">
              Contact us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
