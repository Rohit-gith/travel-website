import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Clock, Heart, MapPin, Users } from 'lucide-react';
import Container from '@/components/common/Container';
import Rating from '@/components/common/Rating';
import EmptyState from '@/components/common/EmptyState';
import BookingForm from '@/components/booking/BookingForm';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectTourById } from '@/features/tours/toursSlice';
import { selectIsWishlisted, toggleWishlist } from '@/features/wishlist/wishlistSlice';

export default function TourDetails() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const tour = useAppSelector(selectTourById(id));
  const wishlisted = useAppSelector(selectIsWishlisted(id));

  if (!tour) {
    return (
      <Container className="py-20">
        <EmptyState
          title="Tour not found"
          message="The tour you are looking for does not exist or was removed."
          actionLabel="Browse tours"
          actionTo="/tours"
        />
      </Container>
    );
  }

  return (
    <>
      <section className="relative h-72 sm:h-96">
        <img src={tour.image} alt={tour.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        <Container className="absolute inset-x-0 bottom-0 pb-8">
          <Link to="/tours" className="text-sm text-slate-200 hover:text-white">
            &larr; Back to tours
          </Link>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-5xl">{tour.title}</h1>
        </Container>
      </section>

      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {tour.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {tour.duration} days
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" /> Max {tour.maxGroup} people
            </span>
            <Rating value={tour.rating} count={tour.reviews} />
            <button
              onClick={() => dispatch(toggleWishlist(tour.id))}
              className="ml-auto flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 font-medium hover:bg-slate-50"
            >
              <Heart className={`h-4 w-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              {wishlisted ? 'Saved' : 'Save'}
            </button>
          </div>

          <p className="mt-6 text-lg text-slate-700">{tour.summary}</p>

          <h2 className="mt-10 text-2xl font-bold">Highlights</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {tour.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                {h}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-2xl font-bold">Itinerary</h2>
          <ol className="mt-6 space-y-6 border-l-2 border-brand-100 pl-6">
            {tour.itinerary.map((step) => (
              <li key={step.day} className="relative">
                <span className="absolute -left-[38px] flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {step.day}
                </span>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookingForm tour={tour} />
        </div>
      </Container>
    </>
  );
}
