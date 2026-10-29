import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import { formatPrice } from '@/utils/format';
import { useAppDispatch } from '@/app/hooks';
import { addBooking } from '@/features/booking/bookingSlice';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';
import { openWhatsApp, tourBookingMessage } from '@/utils/whatsapp';

const initialForm = { name: '', email: '', phone: '', date: '', travellers: 2 };

export default function BookingForm({ tour }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const total = tour.price * Number(form.travellers || 0);
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number';
    if (!form.date) e.date = 'Choose a travel date';
    if (Number(form.travellers) < 1 || Number(form.travellers) > tour.maxGroup)
      e.travellers = `Travellers must be between 1 and ${tour.maxGroup}`;
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    const action = dispatch(
      addBooking({
        tourId: tour.id,
        tourTitle: tour.title,
        ...form,
        travellers: Number(form.travellers),
        total,
      })
    );
    // Send the complete booking details to our WhatsApp, then show the booking in "My Bookings"
    openWhatsApp(tourBookingMessage(action.payload));
    navigate('/bookings');
  };

  const Field = ({ name, label, type = 'text', ...rest }) => (
    <div>
      <label htmlFor={name} className="label">
        {label}
      </label>
      <input id={name} name={name} type={type} value={form[name]} onChange={handleChange} className="input" {...rest} />
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-100">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">Book this tour</h3>
        <p className="text-sm text-slate-500">
          <span className="text-xl font-bold text-slate-900">{formatPrice(tour.price)}</span> / person
        </p>
      </div>

      {Field({ name: 'name', label: 'Full name', placeholder: 'Your name' })}
      {Field({ name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' })}
      {Field({ name: 'phone', label: 'Mobile number', type: 'tel', placeholder: '98XXXXXXXX', maxLength: 10 })}
      <div className="grid grid-cols-2 gap-4">
        {Field({ name: 'date', label: 'Travel date', type: 'date', min: today })}
        {Field({ name: 'travellers', label: 'Travellers', type: 'number', min: 1, max: tour.maxGroup })}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-sm text-slate-600">Total</span>
        <span className="text-2xl font-bold text-brand-700">{formatPrice(total)}</span>
      </div>

      <Button type="submit" size="lg" className="w-full">
        <WhatsAppIcon className="h-5 w-5" /> Confirm &amp; send on WhatsApp
      </Button>
    </form>
  );
}