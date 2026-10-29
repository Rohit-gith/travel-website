import { ClipboardList, ParkingCircle, Ticket, Utensils } from 'lucide-react';
import { TERMS } from '@/constants';

const icons = { Toll: Ticket, Parking: ParkingCircle, Food: Utensils, Rates: ClipboardList };

// Slim scrolling highlight strip with the Terms & Conditions. Edit the list in src/constants/index.js (TERMS).
// Pauses on hover; on "reduce motion" devices it becomes a static, wrapping row.
export default function TermsMarquee() {
  const items = (suffix) =>
    TERMS.map(({ icon, text }) => {
      const Icon = icons[icon] ?? ClipboardList;
      return (
        <li key={`${suffix}-${text}`} className="flex shrink-0 items-center gap-2 px-6 text-sm font-medium text-white">
          <Icon className="h-4 w-4 text-[#fbbf24]" />
          {text}
          <span className="ml-6 h-1.5 w-1.5 rounded-full bg-[#fbbf24]/60" aria-hidden="true" />
        </li>
      );
    });

  return (
    <div className="terms-marquee relative flex items-stretch bg-slate-900 text-white" role="region" aria-label="Terms and conditions">
      <span className="relative z-10 flex shrink-0 items-center gap-2 bg-[#f59e0b] px-4 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[6px_0_12px_-4px_rgba(0,0,0,0.5)] sm:px-6">
        <span className="h-2 w-2 animate-blink rounded-full bg-slate-950" />
        <span className="hidden sm:inline">Terms &amp; Conditions</span>
        <span className="sm:hidden">T&amp;C</span>
      </span>

      <div className="relative flex-1 overflow-hidden py-2.5">
        <ul className="marquee-track flex w-max">
          {items('a')}
          {/* duplicate list = seamless loop */}
          <li className="contents" aria-hidden="true">
            {items('b')}
          </li>
        </ul>
      </div>
    </div>
  );
}