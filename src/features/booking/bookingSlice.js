import { createSlice, nanoid } from '@reduxjs/toolkit';
import { loadState } from '@/utils/storage';

const initialState = {
  bookings: loadState('bookings', []),
  lastBooking: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    addBooking: {
      reducer(state, action) {
        state.bookings.unshift(action.payload);
        state.lastBooking = action.payload;
      },
      // prepare() lets us generate impure values (id, timestamp) outside the reducer
      prepare(data) {
        return {
          payload: {
            id: `BK-${nanoid(8).toUpperCase()}`,
            createdAt: new Date().toISOString(),
            status: 'confirmed',
            ...data,
          },
        };
      },
    },
    clearLastBooking(state) {
      state.lastBooking = null;
    },
  },
});

export const { addBooking, clearLastBooking } = bookingSlice.actions;

export const selectBookings = (state) => state.booking.bookings;
export const selectLastBooking = (state) => state.booking.lastBooking;

export default bookingSlice.reducer;
