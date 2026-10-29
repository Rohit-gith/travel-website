import Hero from '@/components/home/Hero';
import PopularTours from '@/components/home/PopularTours';
import ServicesPreview from '@/components/home/ServicesPreview';
import Features from '@/components/home/Features';
import OwnerCard from '@/components/common/OwnerCard';
import Fleet from '@/components/home/Fleet';
import Testimonials from '@/components/home/Testimonials';
import CallToAction from '@/components/home/CallToAction';

export default function Home() {
  return (
    <>
      <Hero />
      <PopularTours />
      <ServicesPreview />
      <Features />
      <OwnerCard />
      <Fleet />
      <Testimonials />
      <CallToAction />
    </>
  );
}