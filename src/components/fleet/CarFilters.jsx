import { carTypes } from '@/data/cars';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { resetFleetFilters, selectFleetFilters, setCarType, setMinSeats } from '@/features/fleet/fleetSlice';

export default function CarFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFleetFilters);

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {carTypes.map((t) => (
          <button
            key={t}
            onClick={() => dispatch(setCarType(t))}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filters.type === t ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t === 'All' ? 'All cars' : t}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="seats" className="text-sm font-medium text-slate-700">
          Seats
        </label>
        <select
          id="seats"
          value={filters.minSeats}
          onChange={(e) => dispatch(setMinSeats(e.target.value))}
          className="input w-auto"
        >
          <option value={0}>Any</option>
          <option value={4}>4+</option>
          <option value={6}>6+</option>
        </select>
        <button
          onClick={() => dispatch(resetFleetFilters())}
          className="text-sm font-medium text-brand-700 hover:underline"
        >
          Reset
        </button>
      </div>
    </div>
  );
}