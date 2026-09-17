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
import SphooraIntro from '../components/home/SphooraIntro';
import { SITE } from '../config/site';

const TEA_WORDS = [...SITE.tea.regions, ...SITE.tea.ranges.find((r) => r.slug === 'signature-blends').items.map((b) => b.name)];
const CRAFT_WORDS = SITE.crafts.filter((c) => !SITE.tea.regions.includes(c));

// Tea leads the page; the story bridges into the heritage crafts below.
export default function Home() {
  return (
    <>
      <Seo />
      <Hero />
      <SphooraIntro />
      <CraftMarquee items={TEA_WORDS} label="SPHOORA teas" />
      <TeaSection />
      <StorySection />
      <CraftMarquee items={CRAFT_WORDS} />
      <CategoryShowcase />
      <FeaturedScroll />
      <ProcessSection />
      <StatsBand />
      <WhyUs />
      <Testimonials />
      <GalleryTeaser />
      <CareCTA />
    </>
  );
}
