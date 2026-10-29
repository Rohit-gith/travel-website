import WhatsAppIcon from './WhatsAppIcon';
import { GENERAL_MESSAGE, waLink } from '@/utils/whatsapp';

// Floating chat button shown on every page (bottom-right). Pulses so visitors notice it.
export default function WhatsAppFloat() {
  return (
    <a
      href={waLink(GENERAL_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-3"
    >
      <span className="pointer-events-none hidden translate-x-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 opacity-0 shadow-card ring-1 ring-slate-100 transition group-hover:translate-x-0 group-hover:opacity-100 sm:block">
        Chat with us
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl animate-wa-glow transition group-hover:scale-110">
        <WhatsAppIcon className="h-7 w-7" />
        <span className="absolute right-0.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-red-500 animate-blink" />
      </span>
    </a>
  );
}