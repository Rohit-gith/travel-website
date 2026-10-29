import { Search } from 'lucide-react';
import { categories } from '@/data/tours';
import { formatPrice } from '@/utils/format';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  resetFilters,
  selectFilters,
  setCategory,
  setMaxPrice,
  setSearch,
  setSortBy,
} from '@/features/tours/toursSlice';

export default function TourFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);

  return (
    <aside className="space-y-6 rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-100">
      <div>
        <label htmlFor="search" className="label">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="search"
            type="text"
            value={filters.search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            placeholder="Destination or tour"
            className="input pl-9"
          />
        </div>
      </div>

      <div>
        <p className="label">Category</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => dispatch(setCategory(c))}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filters.category === c
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="price" className="label">
          Max price: <span className="font-semibold">{formatPrice(filters.maxPrice)}</span>
        </label>
        <input
          id="price"
          type="range"
          min="10000"
          max="100000"
          step="1000"
          value={filters.maxPrice}
          onChange={(e) => dispatch(setMaxPrice(e.target.value))}
          className="w-full accent-brand-600"
        />
      </div>

      <div>
        <label htmlFor="sort" className="label">
          Sort by
        </label>
        <select
          id="sort"
          value={filters.sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
          className="input"
        >
          <option value="popular">Most popular</option>
          <option value="rating">Top rated</option>
          <option value="priceLow">Price: low to high</option>
          <option value="priceHigh">Price: high to low</option>
        </select>
      </div>

      <button
        onClick={() => dispatch(resetFilters())}
        className="w-full rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Reset filters
      </button>
    </aside>
  );
}
