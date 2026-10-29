import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  Fuel,
  Luggage,
  MapPin,
  Phone,
  Search,
  Snowflake,
  Users,
  Wallet,
} from 'lucide-react';
import Container from '@/components/common/Container';
import CarImage from '@/components/fleet/CarImage';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';
import { categories } from '@/data/tours';
import { CONTACT_INFO, HERO_IMAGES } from '@/constants';
import { formatCarRate } from '@/utils/format';
import { carMessage, GENERAL_MESSAGE, waLink } from '@/utils/whatsapp';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectAllCars } from '@/features/fleet/fleetSlice';
import { setCategory, setMaxPrice, setSearch } from '@/features/tours/toursSlice';

// How long each car stays on screen before the hero swaps to the next one
const ROTATE_MS = 4200;
// Photo slide hone me kitna time lage (ms). Zyada = aur dheema aur smooth
const SLIDE_MS = 1600;

const budgets = [
  { label: 'Any budget', value: 100000 },
  { label: 'Under ₹25,000', value: 25000 },
  { label: 'Under ₹40,000', value: 40000 },
  { label: 'Under ₹65,000', value: 65000 },
];

const stats = [
  { value: '10K+', label: 'Happy travellers' },
  { value: '150+', label: 'Destinations' },
  { value: '12+', label: 'Years of experience' },
  { value: '4.8/5', label: 'Average rating' },
];

// One field of the search bar (defined outside Hero so inputs never lose focus)
function Field({ icon: Icon, label, children }) {
  return (
    <label className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-50">
      <Icon className="h-5 w-5 shrink-0 text-brand-600" />
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
        {children}
      </span>
    </label>
  );
}

export default function Hero() {
  const [query, setQuery] = useState('');
  const [category, setCategoryValue] = useState('All');
  const [budget, setBudget] = useState(100000);

  const cars = useAppSelector(selectAllCars);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const activeCar = cars[index];

  // Background photos: jo photo load na ho (broken link) use loop se hata dete hain
  const [brokenBg, setBrokenBg] = useState([]);
  const bgSlides = HERO_IMAGES.filter((h) => !brokenBg.includes(h.image));
  const bgIndex = bgSlides.length ? index % bgSlides.length : 0;
  const [bgPair, setBgPair] = useState({ cur: bgIndex, prev: -1 });
  if (bgPair.cur !== bgIndex) setBgPair({ cur: bgIndex, prev: bgPair.cur });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Saari background photos pehle se load kar lo, taaki fade ke time khali na dikhe
  useEffect(() => {
    HERO_IMAGES.forEach((h) => {
      const img = new Image();
      img.src = h.image;
      img.decode?.().catch(() => {});
    });
  }, []);

  // Auto-swap to the next car. Restarts whenever the car changes (also on manual click),
  // and stops while the visitor hovers / focuses the car card.
  useEffect(() => {
    if (paused || reducedMotion || cars.length < 2) return undefined;
    const t = setTimeout(() => setIndex((i) => (i + 1) % cars.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [index, paused, reducedMotion, cars.length]);

  const go = (dir) => setIndex((i) => (i + dir + cars.length) % cars.length);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearch(query));
    dispatch(setCategory(category));
    dispatch(setMaxPrice(budget));
    navigate('/tours');
  };

  const specs = [
    { Icon: Users, label: `${activeCar.seats} comfortable seats` },
    ...(activeCar.ac ? [{ Icon: Snowflake, label: 'Air conditioned' }] : []),
    { Icon: Luggage, label: `Space for ${activeCar.bags} bags` },
    { Icon: Fuel, label: activeCar.fuel },
  ];

  return (
    <section className="relative">
      {/* ================= Full-bleed photo hero ================= */}
      <div className="relative isolate flex min-h-[520px] items-center overflow-hidden pb-24 pt-12 md:min-h-[680px] md:pt-16 lg:min-h-[740px] lg:pb-32 lg:pt-20">
        {/* Background photos: naya photo right se slide hoke aata hai, purana left me chala jata hai.
            Koi zoom ya fade nahi, bas smooth swipe */}
        {bgSlides.map((h, i) => {
          const isActive = i === bgIndex;
          const isPrev = i === bgPair.prev && !isActive;
          const x = isActive ? 0 : isPrev ? -35 : 100; // purana photo dheere (35%) jata hai, naya upar se aata hai: parallax jaisa smooth look // baaki photos right side me ready khadi rehti hain
          const animate = (isActive || isPrev) && !reducedMotion;
          return (
            <img
              key={h.image}
              src={h.image}
              alt=""
              aria-hidden="true"
              onError={() => setBrokenBg((b) => [...b, h.image])}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
              style={{
                objectPosition: h.position,
                zIndex: isActive ? -19 : -20,
                backfaceVisibility: 'hidden',
                transform: `translate3d(${x}%, 0, 0)`,
                transition: animate ? `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` : 'none',
              }}
            />
          );
        })}
        {/* Saari photos fail ho jayein to bhi hero khali na dikhe */}
        <div className="absolute inset-0 -z-30 bg-gradient-to-br from-brand-900 to-slate-950" />
        {/* Overlays keep the text readable while the photo stays visible */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/35 via-slate-950/10 to-slate-950/45 md:bg-gradient-to-r md:from-slate-950/90 md:via-slate-950/60 md:to-slate-950/20 lg:via-slate-950/50 lg:to-slate-950/5" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-slate-950/70 to-transparent" />

        <Container className="relative">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-950/65 px-4 py-1.5 text-sm font-semibold text-white ring-1 ring-white/30">
              <span className="h-2 w-2 animate-blink rounded-full bg-[#fbbf24]" />
              Premium tours &amp; private cab service
            </span>

            <h1
              className="mt-6 font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl"
              style={{ textShadow: '0 3px 18px rgba(0,0,0,0.55)' }}
            >
              Travel in <span className="text-[#fbbf24]">comfort</span>,
              <br className="hidden sm:block" /> explore with confidence
            </h1>

            <p
              className="mt-5 max-w-lg text-lg text-white/95"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.65)' }}
            >
              Private cars with verified drivers, curated itineraries and 24x7 support - from airport pickup to
              the last day of your trip.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 rounded-xl bg-[#f59e0b] px-7 py-3.5 font-semibold text-slate-950 shadow-lg transition hover:bg-[#fbbf24] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fcd34d] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Explore tours <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Blinking WhatsApp CTA */}
              <a
                href={waLink(GENERAL_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="animate-wa-glow relative inline-flex items-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-[#128C7E] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Chat on WhatsApp
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-red-500" />
                </span>
              </a>

              <a
                href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950/65 px-6 py-3.5 font-semibold text-white ring-1 ring-white/35 transition hover:bg-white/20"
              >
                <Phone className="h-4 w-4" /> {CONTACT_INFO.phone}
              </a>
            </div>

            {/* Car switcher */}
            <div className="mt-8">
              <p
                className="text-xs font-bold uppercase tracking-[0.2em] text-white"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
              >
                Choose your ride
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {cars.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-pressed={i === index}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fcd34d] ${
                      i === index
                        ? 'bg-white text-slate-900 shadow-lg ring-2 ring-[#fbbf24]'
                        : 'bg-slate-950/65 text-white ring-1 ring-white/40 hover:bg-white/20'
                    }`}
                  >
                    {c.shortName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSubmit}
            className="mt-10 grid max-w-4xl gap-2 rounded-2xl bg-white p-2 shadow-2xl md:grid-cols-[1fr_1fr_1fr_auto] md:items-center"
          >
            <Field icon={MapPin} label="Destination">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Where to?"
                className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
              />
            </Field>

            <Field icon={Compass} label="Trip type">
              <select
                value={category}
                onChange={(e) => setCategoryValue(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'Any type' : c}
                  </option>
                ))}
              </select>
            </Field>

            <Field icon={Wallet} label="Budget">
              <select
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none"
              >
                {budgets.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </Field>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-8 py-4 font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              <Search className="h-5 w-5" />
              Search
            </button>
          </form>

          {/* Car card: sits under the search bar on small screens, floats on the right on large screens */}
          <div
            className="mt-8 hidden w-full max-w-sm overflow-hidden rounded-2xl md:block bg-slate-950/65 text-white shadow-xl ring-1 ring-white/25 xl:absolute xl:right-0 xl:top-0 xl:mt-0 xl:w-80"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div className="relative h-40 overflow-hidden bg-brand-50">
              {cars.map((c, i) => (
                <div
                  key={c.id}
                  aria-hidden={i !== index}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    i === index ? 'scale-100 opacity-100' : 'pointer-events-none scale-105 opacity-0'
                  }`}
                >
                  <CarImage car={c} eager className="h-full w-full" />
                </div>
              ))}
              <span className="absolute right-3 top-3 rounded-full bg-slate-950/80 px-2.5 py-0.5 text-xs font-semibold text-white">
                {index + 1} / {cars.length}
              </span>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous car"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-950/70 p-1.5 text-white transition hover:bg-slate-950"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next car"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-950/70 p-1.5 text-white transition hover:bg-slate-950"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Auto-swap progress */}
            <div className="h-1 bg-white/15">
              <div
                key={`${index}-${paused}`}
                className={`h-full origin-left bg-[#fbbf24] ${paused || reducedMotion ? 'scale-x-0' : 'animate-progress'}`}
                style={{ '--rotate-ms': `${ROTATE_MS}ms` }}
              />
            </div>

            <div key={activeCar.id} className="animate-fade-up p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-[#fbbf24]">{activeCar.segment}</p>
              <p className="mt-1 text-xl font-bold text-white">{activeCar.name}</p>
              <ul className="mt-3 space-y-2 text-sm text-white/95">
                {specs.map(({ Icon, label }) => (
                  <li key={label} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#fbbf24]" /> {label}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-4">
                <span className="text-sm font-semibold">{formatCarRate(activeCar)}</span>
              </div>
              <p className="mt-2 text-xs text-white/75">Toll, parking &amp; driver fooding extra</p>
              <a
                href={waLink(carMessage(activeCar))}
                target="_blank"
                rel="noopener noreferrer"
                className="animate-wa-glow mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#128C7E]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Book {activeCar.shortName} on WhatsApp
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* ================= Stats strip overlapping the hero ================= */}
      <Container className="relative z-10 -mt-14">
        <dl className="grid grid-cols-2 divide-slate-100 rounded-2xl bg-white py-6 shadow-card ring-1 ring-slate-100 md:grid-cols-4 md:divide-x">
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-2 text-center">
              <dt className="font-display text-3xl font-bold text-brand-700">{s.value}</dt>
              <dd className="mt-1 text-sm text-slate-500">{s.label}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}