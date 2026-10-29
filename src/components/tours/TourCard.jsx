import { Link } from 'react-router-dom';
import { Clock, Heart, MapPin } from 'lucide-react';
import Rating from '@/components/common/Rating';
import { formatPrice } from '@/utils/format';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectIsWishlisted, toggleWishlist } from '@/features/wishlist/wishlistSlice';

export default function TourCard({ tour }) {
  const dispatch = useAppDispatch();
  const wishlisted = useAppSelector(selectIsWishlisted(tour.id));

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-100 transition hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={tour.image}
          alt={tour.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700">
          {tour.category}
        </span>
        <button
          onClick={() => dispatch(toggleWishlist(tour.id))}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 transition hover:bg-white"
        >
          <Heart className={`h-4 w-4 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-slate-700'}`} />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-4 w-4" /> {tour.location}
          </span>
          <Rating value={tour.rating} count={tour.reviews} />
        </div>

        <h3 className="mt-2 text-lg font-semibold">
          <Link to={`/tours/${tour.id}`} className="hover:text-brand-600">
            {tour.title}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{tour.summary}</p>

        <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">From</p>
            <p className="text-xl font-bold text-slate-900">{formatPrice(tour.price)}</p>
          </div>
          <span className="flex items-center gap-1 text-sm text-slate-600">
            <Clock className="h-4 w-4" /> {tour.duration} days
          </span>
        </div>
      </div>
    </article>
  );
}
