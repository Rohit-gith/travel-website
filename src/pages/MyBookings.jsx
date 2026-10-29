import { Link } from 'react-router-dom';
import { CalendarDays, CheckCircle2, Users } from 'lucide-react';
import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { clearLastBooking, selectBookings, selectLastBooking } from '@/features/booking/bookingSlice';
import { formatDate, formatPrice } from '@/utils/format';

export default function MyBookings() {
  const dispatch = useAppDispatch();
  const bookings = useAppSelector(selectBookings);
  const last = useAppSelector(selectLastBooking);

  return (
    <>
      <PageHeader title="My Bookings" subtitle="All your confirmed trips in one place." />
      <Container className="py-12">
        {last && (
          <div className="mb-8 flex items-start justify-between gap-4 rounded-xl border border-brand-200 bg-brand-50 p-4">
            <p className="flex items-start gap-2 text-brand-800">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              Booking <strong>{last.id}</strong> confirmed for {last.tourTitle}. Your booking details were sent to us on WhatsApp - we will confirm with you shortly.
            </p>
            <button onClick={() => dispatch(clearLastBooking())} className="text-sm font-medium text-brand-700">
              Dismiss
            </button>
          </div>
        )}

        {bookings.length ? (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-100 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{b.id}</p>
                  <Link to={`/tours/${b.tourId}`} className="text-lg font-semibold hover:text-brand-600">
                    {b.tourTitle}
                  </Link>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" /> {formatDate(b.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" /> {b.travellers} traveller(s)
                    </span>
                    <span>Booked by {b.name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-slate-900">{formatPrice(b.total)}</p>
                  <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold capitalize text-brand-700">
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No bookings yet"
            message="Once you book a tour, it will show up here."
            actionLabel="Find a tour"
            actionTo="/tours"
          />
        )}
      </Container>
    </>
  );
}