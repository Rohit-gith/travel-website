import { createSlice, createSelector } from '@reduxjs/toolkit';
import { carsData } from '@/data/cars';

const initialState = {
  items: carsData,
  filters: {
    type: 'All', // All | Sedan | SUV | MPV
    minSeats: 0, // 0 = any
  },
};

const fleetSlice = createSlice({
  name: 'fleet',
  initialState,
  reducers: {
    setCarType(state, action) {
      state.filters.type = action.payload;
    },
    setMinSeats(state, action) {
      state.filters.minSeats = Number(action.payload);
    },
    resetFleetFilters(state) {
      state.filters = initialState.filters;
    },
  },
});

export const { setCarType, setMinSeats, resetFleetFilters } = fleetSlice.actions;

// ---------- Selectors ----------
export const selectAllCars = (state) => state.fleet.items;
export const selectFleetFilters = (state) => state.fleet.filters;
export const selectPopularCars = createSelector([selectAllCars], (cars) => cars.filter((c) => c.popular));

export const selectFilteredCars = createSelector([selectAllCars, selectFleetFilters], (cars, f) =>
  cars.filter((c) => (f.type === 'All' || c.type === f.type) && c.seats >= f.minSeats)
);

export default fleetSlice.reducer;