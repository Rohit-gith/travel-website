import { useState } from 'react';
import { Fuel, Luggage, Snowflake, Users, ZoomIn } from 'lucide-react';
import CarImage from './CarImage';
import CarLightbox from './CarLightbox';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';
import { carMessage, waLink } from '@/utils/whatsapp';
import { formatCarRate } from '@/utils/format';

export default function CarCard({ car }) {
  const [viewing, setViewing] = useState(false);
  const specs = [
    { Icon: Users, label: `${car.seats} seats` },
    { Icon: Luggage, label: `${car.bags} bags` },
    { Icon: Fuel, label: car.fuel },
    ...(car.ac ? [{ Icon: Snowflake, label: 'AC' }] : []),
  ];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-100 transition hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Photo par click karne se badi photo khulti hai */}
        <button
          type="button"
          onClick={() => setViewing(true)}
          aria-label={`View ${car.name} photo`}
          className="block h-full w-full cursor-zoom-in"
        >
          <CarImage car={car} className="h-full w-full transition duration-500 group-hover:scale-105" />
        </button>
        <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-slate-900/70 px-2.5 py-1 text-xs font-medium text-white opacity-90 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
          <ZoomIn className="h-3.5 w-3.5" /> View photo
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700">
          {car.segment}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold">{car.name}</h3>
        <p className="mt-1 text-sm text-slate-600">{car.description}</p>

        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-600">
          {specs.map(({ Icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-brand-600" /> {label}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">Rate</p>
            <p className="font-bold text-slate-900">{formatCarRate(car)}</p>
          </div>
          <a
            href={waLink(carMessage(car))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#128C7E]"
          >
            <WhatsAppIcon className="h-4 w-4" /> Book this car
          </a>
        </div>
      </div>

      {viewing && <CarLightbox car={car} onClose={() => setViewing(false)} />}
    </article>
  );
}