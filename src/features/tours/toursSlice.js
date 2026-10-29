import { createSlice, createSelector } from '@reduxjs/toolkit';
import { toursData } from '@/data/tours';

const initialState = {
  items: toursData,
  filters: {
    search: '',
    category: 'All',
    maxPrice: 100000,
    sortBy: 'popular', // popular | priceLow | priceHigh | rating
  },
};

const toursSlice = createSlice({
  name: 'tours',
  initialState,
  reducers: {
    setSearch(state, action) {
      state.filters.search = action.payload;
    },
    setCategory(state, action) {
      state.filters.category = action.payload;
    },
    setMaxPrice(state, action) {
      state.filters.maxPrice = Number(action.payload);
    },
    setSortBy(state, action) {
      state.filters.sortBy = action.payload;
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
  },
});

export const { setSearch, setCategory, setMaxPrice, setSortBy, resetFilters } = toursSlice.actions;

// ---------- Selectors ----------
export const selectAllTours = (state) => state.tours.items;
export const selectFilters = (state) => state.tours.filters;
export const selectTourById = (id) => (state) => state.tours.items.find((t) => t.id === id);

export const selectFilteredTours = createSelector([selectAllTours, selectFilters], (items, f) => {
  const query = f.search.trim().toLowerCase();

  const result = items.filter((t) => {
    const matchSearch =
      !query || t.title.toLowerCase().includes(query) || t.location.toLowerCase().includes(query);
    const matchCategory = f.category === 'All' || t.category === f.category;
    const matchPrice = t.price <= f.maxPrice;
    return matchSearch && matchCategory && matchPrice;
  });

  const sorters = {
    popular: (a, b) => b.reviews - a.reviews,
    priceLow: (a, b) => a.price - b.price,
    priceHigh: (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
  };

  return [...result].sort(sorters[f.sortBy] ?? sorters.popular);
});

export default toursSlice.reducer;
