import type { Metadata } from 'next';
import Header from '../../components/common/Header';
import WhatWeOfferInteractive from './components/WhatWeOfferInteractive';
import Footer from '../homepage/components/Footer';
import { createSupabaseServerClient } from '../../lib/supabase/server';
import { isSitePageEnabled, isSitePagePopupEnabled, type SitePageSearchParams } from '../../lib/site-page-settings';
import { fallbackServices, type Service } from '../../data/services';
import type { ServiceRecord } from '../../types/database';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'What We Offer - Red Creatic Maldives',
  description: 'Explore our comprehensive range of printing and signage solutions including large format printing, digital signage, vehicle branding, business stationery, and custom packaging tailored for the Maldivian market.',
};

function mapServiceRecord(record: ServiceRecord, index: number): Service | null {
  if (!record.title || !record.description) return null;

  return {
    id: index + 1,
    title: record.title,
    description: record.description,
    icon: record.icon || 'WrenchScrewdriverIcon',
    customIconSvg: record.custom_icon_svg || undefined,
    category: record.category || 'Service',
    mainImageUrl: record.main_image_url || undefined,
    galleryImages: record.gallery_images ?? [],
    industries: record.industries ?? [],
    productIdeas: record.product_ideas ?? [],
    features: record.features ?? [],
    technicalSpecs: {
      materials: record.materials ?? [],
      qualityStandards: record.quality_standards ?? [],
    },
  };
}

export default async function WhatWeOfferPage({
  searchParams,
}: {
  searchParams?: SitePageSearchParams;
}) {
  if (!(await isSitePageEnabled('what-we-offer', searchParams))) {
    notFound();
  }

  let services = fallbackServices;
  let popupEnabled = true;

  try {
    popupEnabled = await isSitePagePopupEnabled('what-we-offer');
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const mappedServices = (data as ServiceRecord[])
        .map(mapServiceRecord)
        .filter((item): item is Service => item !== null);

      if (mappedServices.length > 0) {
        services = mappedServices;
      }
    }
  } catch {
    // Fall back to existing service data if Supabase is unavailable.
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-16">
        <WhatWeOfferInteractive initialServices={services} popupEnabled={popupEnabled} />
      </main>
      <Footer />
    </>
  );
}
