import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import TourCard from '@/components/tours/TourCard';
import TourFilters from '@/components/tours/TourFilters';
import { useAppSelector } from '@/app/hooks';
import { selectFilteredTours } from '@/features/tours/toursSlice';

export default function Tours() {
  const tours = useAppSelector(selectFilteredTours);

  return (
    <>
      <PageHeader title="All Tours" subtitle="Find the perfect trip using filters for category, budget and more." />
      <Container className="grid gap-8 py-12 lg:grid-cols-[280px_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <TourFilters />
        </div>

        <div>
          <p className="mb-5 text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{tours.length}</span> tour(s)
          </p>
          {tours.length ? (
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {tours.map((t) => (
                <TourCard key={t.id} tour={t} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No tours found"
              message="Try changing your search or filters to see more results."
            />
          )}
        </div>
      </Container>
    </>
  );
}
