import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Tours from '@/pages/Tours';
import TourDetails from '@/pages/TourDetails';
import Cars from '@/pages/Cars';
import Services from '@/pages/Services';
import Wishlist from '@/pages/Wishlist';
import MyBookings from '@/pages/MyBookings';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tours" element={<Tours />} />
        <Route path="tours/:id" element={<TourDetails />} />
        <Route path="cars" element={<Cars />} />
        <Route path="services" element={<Services />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}