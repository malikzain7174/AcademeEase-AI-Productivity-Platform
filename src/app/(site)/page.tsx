import NavigationBar from '@/components/site/navigation-bar';
import HeroSection from '@/components/site/hero';
import FeaturesShowcase from '@/components/site/features-showcase';
import TestimonialsSection from '@/components/site/testimonials';
import PricingSection from '@/components/site/pricing';
import FAQSection from '@/components/site/faq-section';
import CTASection from '@/components/site/cta';
import Footer from '@/components/site/footer';
import { ScrollProgress } from '@/components/site/scroll-progress';
import ProductScreens from '@/components/site/product-screens';
import ToolsSection from '@/components/site/tools-section';
import WorkflowSection from '@/components/site/workflow-section';

export default function Home() {
  return (
    <main className='relative overflow-hidden bg-black text-white'>
      <ScrollProgress />
      <NavigationBar />
      <HeroSection />
      <ProductScreens />
      <FeaturesShowcase />
      <WorkflowSection />
      <ToolsSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
