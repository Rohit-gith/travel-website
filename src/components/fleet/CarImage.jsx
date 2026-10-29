import { useState } from 'react';

// Clean vector car shown when a real photo is not available yet (drop photos in public/images/cars/).
const BODIES = {
  Sedan: {
    body: 'M18 118 C18 104 28 99 50 95 L92 84 C110 64 136 52 170 52 L236 52 C266 52 290 66 308 86 L352 93 C372 97 384 103 384 118 L384 128 L18 128 Z',
    glass: 'M106 84 C120 68 140 60 168 60 L194 60 L194 86 Z M204 60 L234 60 C256 60 274 72 288 86 L204 86 Z',
  },
  SUV: {
    body: 'M20 116 C20 102 30 98 52 94 L82 64 C90 54 104 48 122 48 L288 48 C304 48 316 54 324 64 L352 93 C372 97 382 103 382 116 L382 128 L20 128 Z',
    glass: 'M96 86 L118 62 C122 57 128 56 136 56 L192 56 L192 86 Z M202 56 L282 56 C290 56 296 58 301 64 L322 86 L202 86 Z',
  },
  MPV: {
    body: 'M18 118 C18 104 28 98 48 94 L88 68 C102 54 122 48 148 48 L298 48 C320 48 334 58 344 74 L356 93 C374 97 384 104 384 118 L384 128 L18 128 Z',
    glass: 'M104 86 L128 64 C134 59 142 57 152 57 L200 57 L200 86 Z M210 57 L296 57 C308 57 316 61 322 70 L338 86 L210 86 Z',
  },
};

function CarSilhouette({ type = 'Sedan', label }) {
  const shape = BODIES[type] ?? BODIES.Sedan;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100 px-6">
      <svg viewBox="0 0 400 150" className="w-full max-w-[440px] drop-shadow-[0_18px_20px_rgba(6,78,59,0.25)]" role="img" aria-label={label}>
        <defs>
          <linearGradient id={`body-${type}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#34d399" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
        </defs>
        <ellipse cx="200" cy="138" rx="170" ry="7" fill="#064e3b" opacity="0.18" />
        <path d={shape.body} fill={`url(#body-${type})`} />
        <path d={shape.glass} fill="#d1fae5" opacity="0.9" />
        <rect x="360" y="100" width="16" height="7" rx="3" fill="#fde68a" />
        <rect x="26" y="102" width="12" height="7" rx="3" fill="#fca5a5" />
        {[92, 308].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="126" r="23" fill="#0f172a" />
            <circle cx={cx} cy="126" r="11" fill="#cbd5e1" />
            <circle cx={cx} cy="126" r="4" fill="#475569" />
          </g>
        ))}
      </svg>
      {label && <span className="mt-1 text-sm font-semibold tracking-wide text-brand-800">{label}</span>}
    </div>
  );
}

// Shows the car photo; falls back to a vector car if the file is missing.
export default function CarImage({ car, className = '', eager = false, fit = 'cover' }) {
  const [failedSrc, setFailedSrc] = useState(null);

  if (!car.image || failedSrc === car.image) {
    return (
      <div className={className}>
        <CarSilhouette type={car.type} label={car.shortName} />
      </div>
    );
  }

  return (
    <img
      src={car.image}
      alt={car.name}
      loading={eager ? 'eager' : 'lazy'}
      onError={() => setFailedSrc(car.image)}
      className={`${fit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`}
    />
  );
}