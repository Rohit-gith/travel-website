import { configureStore } from '@reduxjs/toolkit';
import toursReducer from '@/features/tours/toursSlice';
import fleetReducer from '@/features/fleet/fleetSlice';
import wishlistReducer from '@/features/wishlist/wishlistSlice';
import bookingReducer from '@/features/booking/bookingSlice';
import { saveState } from '@/utils/storage';

export const store = configureStore({
  reducer: {
    tours: toursReducer,
    fleet: fleetReducer,
    wishlist: wishlistReducer,
    booking: bookingReducer,
  },
});

// Persist only the slices that should survive a refresh.
let prev = store.getState();
store.subscribe(() => {
  const next = store.getState();
  if (next.wishlist.ids !== prev.wishlist.ids) saveState('wishlist', next.wishlist.ids);
  if (next.booking.bookings !== prev.booking.bookings) saveState('bookings', next.booking.bookings);
  prev = next;
});