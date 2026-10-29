import { ArrowRight } from 'lucide-react';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import Button from '@/components/common/Button';
import CarCard from '@/components/fleet/CarCard';
import { useAppSelector } from '@/app/hooks';
import { selectAllCars, selectPopularCars } from '@/features/fleet/fleetSlice';

export default function Fleet() {
  const popular = useAppSelector(selectPopularCars);
  const total = useAppSelector(selectAllCars).length;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Our fleet"
          title="Ride in comfort, arrive in style"
          subtitle="Clean, well-maintained cars with experienced drivers for every kind of journey."
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button to="/cars" variant="secondary" size="lg">
            View all {total} cars <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Container>
    </section>
  );
}