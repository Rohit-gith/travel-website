import { TERMS, WHATSAPP_NUMBER } from '@/constants';
import { formatCarRate, formatDate, formatPrice } from '@/utils/format';

// Builds a wa.me link that opens WhatsApp with the message already typed in.
export const waLink = (text = '') =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

// Opens WhatsApp in a new tab (call this directly from a click/submit handler so popup blockers allow it).
export const openWhatsApp = (text) => window.open(waLink(text), '_blank', 'noopener,noreferrer');

export const GENERAL_MESSAGE = 'Hello! I would like to know more about your tours and cab service.';

// Message sent when someone books a car - includes all the car details.
export const carMessage = (car) =>
  [
    '*New Car Booking Enquiry*',
    '',
    `Car: ${car.name}`,
    `Type: ${car.segment} (${car.type})`,
    `Seats: ${car.seats}`,
    `Luggage: ${car.bags} bags`,
    `Fuel: ${car.fuel}`,
    `Air conditioned: ${car.ac ? 'Yes' : 'No'}`,
    `Rate: ${formatCarRate(car)}`,
    `Terms: ${TERMS.map((t) => t.text).join(' | ')}`,
    '',
    'Please share availability and the best price. Pickup / drop / date:',
  ].join('\n');

// Message sent for a service (Airport pickup, Wedding & Events ...).
export const serviceMessage = (service) =>
  `Hello! I am interested in your *${service.title}* service. Please share details and the best price.`;

// Message sent after a tour booking form is submitted.
export const tourBookingMessage = (booking) =>
  [
    '*New Tour Booking*',
    '',
    `Booking ID: ${booking.id}`,
    `Tour: ${booking.tourTitle}`,
    `Travel date: ${formatDate(booking.date)}`,
    `Travellers: ${booking.travellers}`,
    `Total: ${formatPrice(booking.total)}`,
    '',
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.email}`,
  ].join('\n');

export const contactMessage = ({ name, email, message }) =>
  [`*Website enquiry*`, '', `Name: ${name}`, `Email: ${email}`, '', message].join('\n');