import Header from '../../components/common/Header';
import CompanyIntro from './components/CompanyIntro';
import Timeline, { fallbackTimelineData, type TimelineItem } from './components/Timeline';
import Principles from './components/Principles';
import MarketExpertise from './components/MarketExpertise';
import Commitment from './components/Commitment';
import ContactMap from './components/ContactMap';
import LocalProduction from './components/LocalProduction';
import Footer from '../homepage/components/Footer';
import { PageHero } from '../../components/common/AnimatedSection';
import ScrollToTopOnMount from '../../components/common/ScrollToTopOnMount';
import { createSupabaseServerClient } from '../../lib/supabase/server';
import { isSitePageEnabled, type SitePageSearchParams } from '../../lib/site-page-settings';
import type { TimelineEntryRecord } from '../../types/database';
import { notFound } from 'next/navigation';

function mapTimelineRecord(record: TimelineEntryRecord): TimelineItem | null {
  if (!record.year || !record.title || !record.description) return null;

  return {
    year: record.year,
    title: record.title,
    description: record.description,
    milestones: record.milestones ?? [],
  };
}

export default async function OurStoryPage({
  searchParams,
}: {
  searchParams?: SitePageSearchParams;
}) {
  if (!(await isSitePageEnabled('our-story', searchParams))) {
    notFound();
  }

  let timelineItems = fallbackTimelineData;

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('timeline_entries')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const mappedItems = (data as TimelineEntryRecord[])
        .map(mapTimelineRecord)
        .filter((item): item is TimelineItem => item !== null);

      if (mappedItems.length > 0) {
        timelineItems = mappedItems;
      }
    }
  } catch {
    // Fall back to the existing in-file timeline if Supabase is unavailable.
  }

  return (
    <>
      <ScrollToTopOnMount />
      <Header />
      <main className="overflow-x-hidden pt-16">
        <PageHero
          title="Our Story"
          subtitle="Red Creatic embodies precision, creativity, and reliability in the printing and signage industry - the perfect fusion of modern technology with local Maldivian business understanding."
        />
        <LocalProduction />
        <CompanyIntro />
        <Timeline items={timelineItems} />
        <Principles />
        <MarketExpertise />
        <Commitment />
        <ContactMap />
      </main>
      <Footer />
    </>
  );
}
