import { ArrowRight } from 'lucide-react';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import Button from '@/components/common/Button';
import TourCard from '@/components/tours/TourCard';
import { useAppSelector } from '@/app/hooks';
import { selectAllTours } from '@/features/tours/toursSlice';

export default function PopularTours() {
  const tours = useAppSelector(selectAllTours);
  const popular = [...tours].sort((a, b) => b.reviews - a.reviews).slice(0, 3);

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Top picks"
          title="Popular tours"
          subtitle="Our most loved itineraries, chosen by thousands of happy travellers."
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button to="/tours" variant="secondary" size="lg">
            View all tours <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
