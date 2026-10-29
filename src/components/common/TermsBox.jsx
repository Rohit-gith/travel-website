import { ClipboardList, ParkingCircle, Ticket, Utensils } from 'lucide-react';
import { TERMS } from '@/constants';

const icons = { Toll: Ticket, Parking: ParkingCircle, Food: Utensils, Rates: ClipboardList };

// "Terms & Conditions" card (toll, parking, driver fooding, rate note). Edit the list in src/constants/index.js
export default function TermsBox({ className = '' }) {
  return (
    <aside className={`mx-auto max-w-xl overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-200 ${className}`}>
      <h3 className="bg-gradient-to-r from-brand-800 to-brand-600 py-2.5 text-center text-sm font-bold uppercase tracking-[0.2em] text-white">
        Terms &amp; Conditions
      </h3>
      <ul className="divide-y divide-slate-100">
        {TERMS.map(({ icon, text }) => {
          const Icon = icons[icon] ?? ClipboardList;
          return (
            <li key={text} className="flex items-center gap-4 px-5 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-slate-800">{text}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}