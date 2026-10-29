import { Star } from 'lucide-react';

export default function Rating({ value, count }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <Star className="h-4 w-4 fill-sand-500 text-sand-500" />
      <span className="font-semibold text-slate-900">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-slate-500">({count})</span>}
    </span>
  );
}
