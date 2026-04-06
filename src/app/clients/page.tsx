import { createSupabaseServerClient } from '../../lib/supabase/server';
import { isSitePageEnabled, type SitePageSearchParams } from '../../lib/site-page-settings';
import type { ClientRecord, TestimonialRecord } from '../../types/database';
import ClientsPageClient from './ClientsPageClient';
import { clients as fallbackClients, type Client } from './clients-data';
import { allTestimonials as fallbackTestimonials, type Testimonial } from './testimonials-data';
import { notFound } from 'next/navigation';

function toInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function mapClientRecord(record: ClientRecord, index: number): Client | null {
  if (!record.name || !record.category) return null;

  return {
    id: index + 1,
    name: record.name,
    industry: record.category,
    description: '',
    logo: record.logo_url || '',
    logoAlt: `${record.name} logo`,
    logoScale: record.logo_scale ?? 1,
    logoOffsetX: record.logo_offset_x ?? 0,
    logoOffsetY: record.logo_offset_y ?? 0,
    initials: toInitials(record.name),
    color: 'bg-primary/10 text-primary',
  };
}

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

export default async function ClientsPage({
  searchParams,
}: {
  searchParams?: SitePageSearchParams;
}) {
  if (!(await isSitePageEnabled('clients', searchParams))) {
    notFound();
  }

  let clients = fallbackClients;
  let testimonials = fallbackTestimonials;

  try {
    const supabase = await createSupabaseServerClient();
    const [{ data: clientData, error: clientError }, { data: testimonialData, error: testimonialError }] = await Promise.all([
      supabase.from('clients').select('*').eq('is_published', true).order('sort_order', { ascending: true }).order('created_at', { ascending: false }),
      supabase.from('testimonials').select('*').eq('is_published', true).order('sort_order', { ascending: true }).order('created_at', { ascending: false }),
    ]);

    if (!clientError && clientData && clientData.length > 0) {
      const mappedClients = (clientData as ClientRecord[])
        .map(mapClientRecord)
        .filter((item): item is Client => item !== null);

      if (mappedClients.length > 0) {
        clients = mappedClients;
      }
    }

    if (!testimonialError && testimonialData && testimonialData.length > 0) {
      const mappedTestimonials = (testimonialData as TestimonialRecord[])
        .map(mapTestimonialRecord)
        .filter((item): item is Testimonial => item !== null);

      if (mappedTestimonials.length > 0) {
        testimonials = mappedTestimonials;
      }
    }
  } catch {
    // Fall back to existing client/testimonial data if Supabase is unavailable.
  }

  return <ClientsPageClient initialClients={clients} initialTestimonials={testimonials} />;
}
