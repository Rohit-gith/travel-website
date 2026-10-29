import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Heart, ImageOff, MapPin } from 'lucide-react';
import Rating from '@/components/common/Rating';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';
import { formatPrice } from '@/utils/format';
import { tourEnquiryMessage, waLink } from '@/utils/whatsapp';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectIsWishlisted, toggleWishlist } from '@/features/wishlist/wishlistSlice';

export default function TourCard({ tour }) {
  const dispatch = useAppDispatch();
  const wishlisted = useAppSelector(selectIsWishlisted(tour.id));
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-100 transition hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Photo par click karne se bhi tour details khulti hai */}
        <Link to={`/tours/${tour.id}`} aria-label={`View ${tour.title}`} className="block h-full w-full">
          {imgFailed ? (
            // Photo load na ho to broken image ki jagah ye neat placeholder dikhega
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-700 to-slate-900 px-4 text-center text-white">
              <ImageOff className="h-8 w-8 opacity-70" />
              <span className="font-display text-lg font-semibold">{tour.title}</span>
            </div>
          ) : (
            <img
              src={tour.image}
              alt={tour.title}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          )}
        </Link>
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

      <div className="flex flex-1 flex-col p-5">
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

        {/* Client yahin se tour chun sakta hai: details dekhe ya seedha WhatsApp par book kare */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            to={`/tours/${tour.id}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 transition hover:bg-brand-50"
          >
            View details <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={waLink(tourEnquiryMessage(tour))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#128C7E]"
          >
            <WhatsAppIcon className="h-4 w-4" /> Book now
          </a>
        </div>
      </div>
    </article>
  );
}