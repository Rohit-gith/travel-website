import { createSlice } from '@reduxjs/toolkit';
import { loadState } from '@/utils/storage';

// Wishlist stores only tour ids; full tour data lives in the tours slice.
const initialState = {
  ids: loadState('wishlist', []),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(state, action) {
      const id = action.payload;
      state.ids = state.ids.includes(id) ? state.ids.filter((x) => x !== id) : [...state.ids, id];
    },
    clearWishlist(state) {
      state.ids = [];
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;

export const selectWishlistIds = (state) => state.wishlist.ids;
export const selectIsWishlisted = (id) => (state) => state.wishlist.ids.includes(id);

export default wishlistSlice.reducer;
