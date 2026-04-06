import type { Metadata } from 'next';
import Header from '../../components/common/Header';
import { createSupabaseServerClient } from '../../lib/supabase/server';
import type { TestimonialRecord } from '../../types/database';
import { allTestimonials as fallbackTestimonials, type Testimonial } from '../clients/testimonials-data';
import HeroSection from './components/HeroSection';
import FeaturedServices from './components/FeaturedServices';
import FeaturedProducts from './components/FeaturedProducts';
import ClientTestimonials from './components/ClientTestimonials';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'Red Creatic - Premium Printing & Signage Solutions in Maldives',
  description: 'Maldives\' premier printing and signage specialists. We transform your brand ideas into stunning visual reality with local expertise and global quality standards. Trusted by 200+ businesses.',
};

function mapTestimonialRecord(record: TestimonialRecord, index: number): Testimonial | null {
  if (!record.client_name || !record.quote) return null;

  return {
    id: index + 1,
    name: record.client_name,
    position: record.role || '',
    company: record.company_name || 'Client',
    image: record.avatar_url || '',
    alt: `${record.client_name} testimonial`,
    rating: Math.min(5, Math.max(1, record.rating ?? 5)),
    testimonial: record.quote,
    project: record.company_name || 'Client Testimonial',
  };
}

export default async function HomePage() {
  let testimonials = fallbackTestimonials;

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const mappedTestimonials = (data as TestimonialRecord[])
        .map(mapTestimonialRecord)
        .filter((item): item is Testimonial => item !== null);

      if (mappedTestimonials.length > 0) {
        testimonials = mappedTestimonials;
      }
    }
  } catch {
    // Fall back to existing testimonial data if Supabase is unavailable.
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <FeaturedServices />
        <FeaturedProducts />
        <ClientTestimonials initialTestimonials={testimonials} />
      </main>
      <Footer />
    </>
  );
}
