export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Wanderly';

export const HERO_IMAGE = {
  image: 'https://images.unsplash.com/photo-1735896951413-cb764374f75a?auto=format&fit=crop&w=2400&q=80',
  position: 'center',
};

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Tours', to: '/tours' },
  { label: 'Cars', to: '/cars' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export const CONTACT_INFO = {
  email: 'rohitprasadsahoo@gmail.com',
  phone: '+91 6372569846',
  address: 'Park Street, Kolkata, West Bengal, India',
};

// WhatsApp number in international format, digits only (country code + number, no "+" or spaces).
// Every "Book now" / "Chat on WhatsApp" button on the site opens a chat with this number.
export const WHATSAPP_NUMBER = '916372569846';

// Owner details shown in the "Meet the owner" card (Services + About pages).
// Put the owner's photo at public/images/owner.jpg (square or portrait, min 600x600).
// If the file is missing, a neat monogram is shown instead.
export const OWNER = {
  name: 'Rohit Prasad Sahoo',
  role: 'Founder & Lead Travel Expert',
  photo: '/images/owner.jpeg',
  bio: 'Every trip we run is personally planned and monitored by our founder - from choosing the right car and a verified driver to being one call away while you travel. Your comfort and safety are not a promise on a brochure, they are how we do business.',
  points: ['Verified & experienced drivers', 'Clean, well-maintained cars', '24x7 personal support'],
};

// Shown in the "Terms & Conditions" box (Cars page, home fleet section) and in WhatsApp car enquiries.
export const TERMS = [
  { icon: 'Toll', text: 'Toll charges extra' },
  { icon: 'Parking', text: 'Parking extra' },
  { icon: 'Food', text: 'Driver fooding extra' },
  { icon: 'Rates', text: 'Rates may vary depending on vehicle and trip requirements' },
];