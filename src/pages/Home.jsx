import Seo from '../components/Seo';
import Hero from '../components/home/Hero';
import CraftMarquee from '../components/home/CraftMarquee';
import CategoryShowcase from '../components/home/CategoryShowcase';
import FeaturedScroll from '../components/home/FeaturedScroll';
import StorySection from '../components/home/StorySection';
import StatsBand from '../components/home/StatsBand';
import ProcessSection from '../components/home/ProcessSection';
import WhyUs from '../components/home/WhyUs';
import Testimonials from '../components/home/Testimonials';
import GalleryTeaser from '../components/home/GalleryTeaser';
import CareCTA from '../components/home/CareCTA';
import TeaSection from '../components/home/TeaSection';

export default function Home() {
  return (
    <>
      <Seo />
      <Hero />
      <CraftMarquee />
      <CategoryShowcase />
      <FeaturedScroll />
      <TeaSection />
      <StorySection />
      <StatsBand />
      <ProcessSection />
      <WhyUs />
      <Testimonials />
      <GalleryTeaser />
      <CareCTA />
    </>
  );
}
