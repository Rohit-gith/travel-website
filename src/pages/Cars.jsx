import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import CarCard from '@/components/fleet/CarCard';
import TermsMarquee from '@/components/common/TermsMarquee';
import CarFilters from '@/components/fleet/CarFilters';
import CallToAction from '@/components/home/CallToAction';
import { useAppSelector } from '@/app/hooks';
import { selectFilteredCars } from '@/features/fleet/fleetSlice';

export default function Cars() {
  const cars = useAppSelector(selectFilteredCars);

  return (
    <>
      <PageHeader
        title="Our Fleet"
        subtitle="Sedans, SUVs and family MPVs - all with verified drivers and 24x7 support."
      />
      <TermsMarquee />
      <Container className="space-y-8 py-12">
        <CarFilters />
        {cars.length ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <EmptyState title="No cars found" message="Try a different car type or seat count." />
        )}
      </Container>
      <CallToAction />
    </>
  );
}