import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import TourCard from '@/components/tours/TourCard';
import { useAppSelector } from '@/app/hooks';
import { selectAllTours } from '@/features/tours/toursSlice';
import { selectWishlistIds } from '@/features/wishlist/wishlistSlice';

export default function Wishlist() {
  const tours = useAppSelector(selectAllTours);
  const ids = useAppSelector(selectWishlistIds);
  const saved = tours.filter((t) => ids.includes(t.id));

  return (
    <>
      <PageHeader title="Your Wishlist" subtitle="Tours you have saved for later." />
      <Container className="py-12">
        {saved.length ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Your wishlist is empty"
            message="Tap the heart on any tour to save it here."
            actionLabel="Explore tours"
            actionTo="/tours"
          />
        )}
      </Container>
    </>
  );
}
