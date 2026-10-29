import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import Container from '@/components/common/Container';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import { CONTACT_INFO } from '@/constants';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';
import { contactMessage, openWhatsApp } from '@/utils/whatsapp';

const initialForm = { name: '', email: '', message: '' };

export default function Contact() {
  // "Book this car" links open this page as /contact?car=Toyota%20Innova
  const [searchParams] = useSearchParams();
  const car = searchParams.get('car');

  const [form, setForm] = useState({
    ...initialForm,
    message: car ? `Hi, I would like to book the ${car}. Please share availability and rates.` : '',
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Opens WhatsApp with the enquiry already typed in
    openWhatsApp(contactMessage(form));
    setSent(true);
    setForm(initialForm);
  };

  return (
    <>
      <PageHeader title="Contact Us" subtitle="Questions or a custom trip in mind? We would love to hear from you." />
      <Container className="grid gap-10 py-16 md:grid-cols-2">
        <div className="space-y-6">
          {[
            { Icon: MapPin, label: 'Address', value: CONTACT_INFO.address },
            { Icon: Phone, label: 'Phone', value: CONTACT_INFO.phone },
            { Icon: Mail, label: 'Email', value: CONTACT_INFO.email },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <p className="font-semibold text-slate-900">{label}</p>
                <p className="text-slate-600">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-100">
          {sent && (
            <p className="flex items-center gap-2 rounded-lg bg-brand-50 p-3 text-sm text-brand-800">
              <CheckCircle2 className="h-4 w-4" /> Opening WhatsApp - just press send and we will reply shortly.
            </p>
          )}
          <div>
            <label htmlFor="name" className="label">
              Name
            </label>
            <input id="name" name="name" required value={form.name} onChange={handleChange} className="input" />
          </div>
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="message" className="label">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              value={form.message}
              onChange={handleChange}
              className="input"
            />
          </div>
          <Button type="submit" className="w-full">
            <WhatsAppIcon className="h-5 w-5" /> Send on WhatsApp
          </Button>
        </form>
      </Container>
    </>
  );
}