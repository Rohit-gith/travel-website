import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Fuel, Luggage, RotateCcw, Snowflake, Users, X, ZoomIn, ZoomOut } from 'lucide-react';
import CarImage from './CarImage';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';
import { carsData } from '@/data/cars';
import { carMessage, waLink } from '@/utils/whatsapp';
import { formatCarRate } from '@/utils/format';

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const BUTTON_STEP = 1.5; // + / - button se kitna zoom ho
const RESET = { s: 1, x: 0, y: 0 };

// Image ko area ke bahar na jaane do (zoom ke baad drag karte waqt)
const clampPan = (value, scale, size) => {
  const max = ((scale - 1) * size) / 2;
  return Math.max(-max, Math.min(max, value));
};

// Buttons par pointerdown ko area ke gesture tak jaane nahi dete, warna click kaam nahi karta
const stop = (e) => e.stopPropagation();

// Car ki photo bade size me dekhne ke liye popup.
//  - Zoom: + / - buttons, mouse wheel, double click / double tap, ya do ungli se pinch
//  - Zoom hone par drag karke photo ghumao
//  - Zoom na ho to left-right swipe / arrow se dusri car
//  - Esc / bahar click / X se band hota hai
export default function CarLightbox({ car, onClose }) {
  const [index, setIndex] = useState(() => Math.max(0, carsData.findIndex((c) => c.id === car.id)));
  const [view, setView] = useState(RESET); // s = scale, x/y = pan
  const [gesturing, setGesturing] = useState(false);

  const current = carsData[index];
  const closeRef = useRef(null);
  const areaRef = useRef(null);
  const viewRef = useRef(view);
  viewRef.current = view;

  const pointers = useRef(new Map()); // abhi screen par kaun kaun si ungliyan hain
  const pinch = useRef(null);
  const drag = useRef(null);
  const swipe = useRef(null);
  const lastTap = useRef({ time: 0, x: 0, y: 0 });

  // Zoom karo; (cx, cy) wo point hai jis par zoom hona chahiye (mouse / ungli ki jagah)
  const zoomTo = useCallback((getScale, cx, cy) => {
    const area = areaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    setView((prev) => {
      const s = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, getScale(prev.s)));
      if (s === MIN_ZOOM) return RESET;
      const px = (cx ?? rect.left + rect.width / 2) - (rect.left + rect.width / 2);
      const py = (cy ?? rect.top + rect.height / 2) - (rect.top + rect.height / 2);
      const ratio = s / prev.s;
      return {
        s,
        x: clampPan(px - (px - prev.x) * ratio, s, rect.width),
        y: clampPan(py - (py - prev.y) * ratio, s, rect.height),
      };
    });
  }, []);

  const zoomIn = () => zoomTo((s) => s * BUTTON_STEP);
  const zoomOut = () => zoomTo((s) => s / BUTTON_STEP);
  const resetZoom = () => setView(RESET);

  const go = useCallback((step) => {
    setIndex((i) => (i + step + carsData.length) % carsData.length);
    setView(RESET);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === '+' || e.key === '=') zoomTo((s) => s * BUTTON_STEP);
      else if (e.key === '-' || e.key === '_') zoomTo((s) => s / BUTTON_STEP);
      else if (e.key === '0') setView(RESET);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; // popup khula ho to peeche ka page scroll na ho
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, go, zoomTo]);

  // ---------- touch / mouse gestures ----------
  const onPointerDown = (e) => {
    areaRef.current.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setGesturing(true);

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, s: viewRef.current.s };
      drag.current = null;
      swipe.current = null;
    } else {
      const v = viewRef.current;
      drag.current = { sx: e.clientX, sy: e.clientY, ox: v.x, oy: v.y };
      swipe.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    }
  };

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const target = pinch.current.s * (dist / pinch.current.dist);
      zoomTo(() => target, (a.x + b.x) / 2, (a.y + b.y) / 2);
    } else if (pointers.current.size === 1 && drag.current && viewRef.current.s > 1) {
      const rect = areaRef.current.getBoundingClientRect();
      const { sx, sy, ox, oy } = drag.current;
      setView((v) => ({
        s: v.s,
        x: clampPan(ox + (e.clientX - sx), v.s, rect.width),
        y: clampPan(oy + (e.clientY - sy), v.s, rect.height),
      }));
    }
  };

  const endPointer = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    const wasSingle = pointers.current.size === 1;
    pointers.current.delete(e.pointerId);

    if (wasSingle && swipe.current && e.type === 'pointerup') {
      const dx = e.clientX - swipe.current.x;
      const dy = e.clientY - swipe.current.y;
      const moved = Math.hypot(dx, dy);

      if (viewRef.current.s === 1 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        go(dx < 0 ? 1 : -1); // swipe: dusri car
      } else if (moved < 10) {
        // Double tap / double click: zoom in ya wapas normal
        const now = Date.now();
        const last = lastTap.current;
        if (now - last.time < 300 && Math.hypot(e.clientX - last.x, e.clientY - last.y) < 30) {
          zoomTo((s) => (s > 1 ? 1 : 2.5), e.clientX, e.clientY);
          lastTap.current = { time: 0, x: 0, y: 0 };
        } else {
          lastTap.current = { time: now, x: e.clientX, y: e.clientY };
        }
      }
    }

    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 1) {
      // Pinch ke baad ek ungli bachi ho to wahin se drag jaari rakho
      const [rest] = [...pointers.current.values()];
      const v = viewRef.current;
      drag.current = { sx: rest.x, sy: rest.y, ox: v.x, oy: v.y };
      swipe.current = null;
    }
    if (pointers.current.size === 0) {
      drag.current = null;
      swipe.current = null;
      setGesturing(false);
    }
  };

  const onWheel = (e) => zoomTo((s) => s * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX, e.clientY);

  const zoomed = view.s > 1;
  const specs = [
    { Icon: Users, label: `${current.seats} seats` },
    { Icon: Luggage, label: `${current.bags} bags` },
    { Icon: Fuel, label: current.fuel },
    ...(current.ac ? [{ Icon: Snowflake, label: 'AC' }] : []),
  ];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${current.name} photo`}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center overscroll-contain bg-slate-950/90 p-3 sm:p-6"
      style={{
        paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-full w-full max-w-4xl animate-fade-up flex-col overflow-y-auto overscroll-contain rounded-2xl bg-white shadow-2xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/70 text-white transition hover:bg-slate-900"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Badi photo: yahan zoom, pinch, drag aur swipe hota hai */}
        <div
          ref={areaRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onWheel={onWheel}
          className={`relative flex shrink-0 touch-none select-none items-center justify-center overflow-hidden bg-slate-100 ${
            zoomed ? (gesturing ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
          }`}
        >
          <div
            className="flex w-full items-center justify-center will-change-transform"
            style={{
              transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.s})`,
              transition: gesturing ? 'none' : 'transform 180ms ease-out',
            }}
          >
            <CarImage
              key={current.id}
              car={current}
              eager
              fit="contain"
              className="pointer-events-none max-h-[46dvh] min-h-[200px] w-full sm:max-h-[62dvh]"
            />
          </div>

          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700">
            {current.segment}
          </span>
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold text-white">
            {zoomed ? `${Math.round(view.s * 100)}%` : `${index + 1} / ${carsData.length}`}
          </span>

          {/* Zoom buttons */}
          <div className="absolute bottom-3 left-3 flex gap-1.5" onPointerDown={stop}>
            <button
              type="button"
              onClick={zoomOut}
              disabled={view.s <= MIN_ZOOM}
              aria-label="Zoom out"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/70 text-white transition hover:bg-slate-900 disabled:opacity-40"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={zoomIn}
              disabled={view.s >= MAX_ZOOM}
              aria-label="Zoom in"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/70 text-white transition hover:bg-slate-900 disabled:opacity-40"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            {zoomed && (
              <button
                type="button"
                onClick={resetZoom}
                aria-label="Reset zoom"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/70 text-white transition hover:bg-slate-900"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Prev / next car (zoom ke time chhupe rehte hain, taaki drag me na aayein) */}
          {!zoomed && (
            <>
              <button
                type="button"
                onPointerDown={stop}
                onClick={() => go(-1)}
                aria-label="Previous car"
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow transition hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onPointerDown={stop}
                onClick={() => go(1)}
                aria-label="Next car"
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow transition hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Car ki jaankari + booking */}
        <div className="flex shrink-0 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{current.name}</h3>
            <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              {specs.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-brand-600" /> {label}
                </li>
              ))}
            </ul>
            <p className="mt-1.5 text-xs text-slate-400">
              Zoom: double tap, pinch ya + / - buttons. Zoom me photo ko drag karke ghumao.
            </p>
          </div>
          <div className="flex items-center gap-4 sm:justify-end">
            <div>
              <p className="text-xs text-slate-500">Rate</p>
              <p className="font-bold text-slate-900">{formatCarRate(current)}</p>
            </div>
            <a
              href={waLink(carMessage(current))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#128C7E] sm:flex-none sm:py-2.5"
            >
              <WhatsAppIcon className="h-4 w-4" /> Book this car
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}