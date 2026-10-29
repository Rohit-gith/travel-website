import { Languages } from 'lucide-react';
import { isOdia, toggleLanguage } from '@/utils/translate';

// English <-> Odia button.
//   light   = navbar transparent hai (white text chahiye)
//   iconOnly = mobile header ke liye sirf icon
//   full    = mobile menu me poori chaudai ka button
export default function LanguageToggle({ light = false, iconOnly = false, full = false }) {
  const odia = isOdia();
  // Abhi English hai to button "ଓଡ଼ିଆ" dikhata hai, Odia hai to "English"
  const label = odia ? 'English' : 'ଓଡ଼ିଆ';
  const title = odia ? 'Switch to English' : 'ଓଡ଼ିଆରେ ଦେଖନ୍ତୁ (View in Odia)';

  const color = full
    ? 'bg-brand-50 text-brand-700 hover:bg-brand-100'
    : light
      ? 'text-white ring-1 ring-white/40 hover:bg-white/15'
      : 'text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100';

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title={title}
      aria-label={title}
      translate="no"
      className={`notranslate inline-flex items-center justify-center gap-1.5 rounded-full text-sm font-semibold transition ${color} ${
        iconOnly ? 'h-10 w-10' : full ? 'w-full rounded-lg px-3 py-2.5' : 'px-3 py-1.5'
      }`}
    >
      <Languages className="h-4 w-4 shrink-0" />
      {!iconOnly && <span>{label}</span>}
    </button>
  );
}