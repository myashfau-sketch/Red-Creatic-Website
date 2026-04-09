import type { Metadata } from 'next';
import { createSupabaseServerClient } from '../../lib/supabase/server';
import { fallbackTimelineData, type TimelineItem } from '../our-story/components/Timeline';
import { fallbackServices, type Service } from '../../data/services';
import { fallbackProducts, type Product } from '../../data/products';
import { allTestimonials as fallbackTestimonials, type Testimonial } from '../clients/testimonials-data';
import type {
  ClientRecord,
  PartnershipRecord,
  ProductRecord,
  ProjectRecord,
  ServiceRecord,
  TestimonialRecord,
  TimelineEntryRecord,
} from '../../types/database';
import CompanyProfileClient from './CompanyProfileClient';

export const metadata: Metadata = {
  title: 'Company Profile - Red Creatic Maldives',
  description:
    'Interactive company profile for Red Creatic Maldives. Explore our story, services, products, completed work, partnerships, and contact details in one downloadable profile page.',
};

function mapTimelineRecord(record: TimelineEntryRecord): TimelineItem | null {
  if (!record.year || !record.title || !record.description) return null;

  return {
    year: record.year,
    title: record.title,
    description: record.description,
    milestones: record.milestones ?? [],
  };
}

function mapServiceRecord(record: ServiceRecord): {
  id: string;
  title: string;
  description: string;
  icon: string;
  customIconSvg: string | undefined;
  category: string;
  features: string[];
  productIdeas: string[];
} | null {
  if (!record.title || !record.description) return null;

  return {
    id: record.id,
    title: record.title,
    description: record.description,
    icon: record.icon || 'WrenchScrewdriverIcon',
    customIconSvg: record.custom_icon_svg || undefined,
    category: record.category || 'Service',
    features: record.features ?? [],
    productIdeas: record.product_ideas ?? [],
  };
}

function mapFallbackService(service: Service): {
  id: string;
  title: string;
  description: string;
  icon: string;
  customIconSvg: string | undefined;
  category: string;
  features: string[];
  productIdeas: string[];
} {
  return {
    id: String(service.id),
    title: service.title,
    description: service.description,
    icon: service.icon,
    customIconSvg: service.customIconSvg || undefined,
    category: service.category,
    features: service.features,
    productIdeas: service.productIdeas ?? [],
  };
}

function mapProductRecord(record: ProductRecord): {
  id: string;
  name: string;
  description: string;
  category: string | undefined;
  image: string;
} | null {
  if (!record.name || !record.description || !record.main_image_url) return null;

  return {
    id: record.id,
    name: record.name,
    description: record.description,
    category: record.category || undefined,
    image: record.main_image_url,
  };
}

function mapFallbackProduct(product: Product): {
  id: string;
  name: string;
  description: string;
  category: string | undefined;
  image: string;
} {
  return {
    id: String(product.id),
    name: product.name,
    description: product.description,
    category: product.category || undefined,
    image: product.mainImage,
  };
}

function mapShowcaseRecord(
  record: ProjectRecord | PartnershipRecord,
  prefix: string
): {
  id: string;
  title: string;
  client: string;
  year: string;
  location: string;
  description: string;
  image: string;
} | null {
  if (!record.title || !record.image_url) return null;

  return {
    id: `${prefix}-${record.id}`,
    title: record.title,
    client: record.client_name || 'Red Creatic Client',
    year: record.completion_year || 'Recent',
    location: record.location || 'Maldives',
    description: record.description || 'Completed by Red Creatic for practical business use.',
    image: record.image_url,
  };
}

function mapClientRecord(record: ClientRecord) {
  if (!record.name || !record.logo_url) return null;

  return {
    id: record.id,
    name: record.name,
    logoUrl: record.logo_url,
  };
}

function mapTestimonialRecord(record: TestimonialRecord): {
  id: string;
  name: string;
  company: string;
  role: string;
  quote: string;
} | null {
  if (!record.client_name || !record.quote) return null;

  return {
    id: record.id,
    name: record.client_name,
    company: record.company_name || 'Client',
    role: record.role || '',
    quote: record.quote,
  };
}

function mapFallbackTestimonial(testimonial: Testimonial) {
  return {
    id: String(testimonial.id),
    name: testimonial.name,
    company: testimonial.company,
    role: testimonial.position,
    quote: testimonial.testimonial,
  };
}

export default async function CompanyProfilePage() {
  let timeline = fallbackTimelineData;
  let services = fallbackServices.map(mapFallbackService);
  let products = fallbackProducts.map(mapFallbackProduct);
  let projects: ReturnType<typeof mapShowcaseRecord>[] = [];
  let partnerships: ReturnType<typeof mapShowcaseRecord>[] = [];
  let clients: ReturnType<typeof mapClientRecord>[] = [];
  let testimonials = fallbackTestimonials.map(mapFallbackTestimonial);

  try {
    const supabase = await createSupabaseServerClient();
    const [
      { data: timelineData },
      { data: serviceData },
      { data: productData },
      { data: projectData },
      { data: partnershipData },
      { data: clientData },
      { data: testimonialData },
    ] = await Promise.all([
      supabase.from('timeline_entries').select('*').eq('is_published', true).order('sort_order', { ascending: true }).order('created_at', { ascending: false }),
      supabase.from('services').select('*').eq('is_published', true).order('sort_order', { ascending: true }).order('created_at', { ascending: false }),
      supabase.from('products').select('*').eq('is_published', true).order('sort_order', { ascending: true }).order('created_at', { ascending: false }),
      supabase.from('projects').select('*').eq('is_published', true).order('sort_order', { ascending: true }).order('created_at', { ascending: false }),
      supabase.from('partnerships').select('*').eq('is_published', true).order('sort_order', { ascending: true }).order('created_at', { ascending: false }),
      supabase.from('clients').select('*').eq('is_published', true).order('sort_order', { ascending: true }).order('created_at', { ascending: false }),
      supabase.from('testimonials').select('*').eq('is_published', true).order('sort_order', { ascending: true }).order('created_at', { ascending: false }),
    ]);

    if (timelineData && timelineData.length > 0) {
      const mapped = (timelineData as TimelineEntryRecord[]).map(mapTimelineRecord).filter((item): item is TimelineItem => item !== null);
      if (mapped.length > 0) timeline = mapped;
    }

    if (serviceData && serviceData.length > 0) {
      const mapped = (serviceData as ServiceRecord[]).map(mapServiceRecord).filter((item): item is NonNullable<ReturnType<typeof mapServiceRecord>> => item !== null);
      if (mapped.length > 0) services = mapped;
    }

    if (productData && productData.length > 0) {
      const mapped = (productData as ProductRecord[]).map(mapProductRecord).filter((item): item is NonNullable<ReturnType<typeof mapProductRecord>> => item !== null);
      if (mapped.length > 0) products = mapped;
    }

    if (projectData && projectData.length > 0) {
      const mapped = (projectData as ProjectRecord[]).map((record) => mapShowcaseRecord(record, 'project')).filter((item): item is NonNullable<ReturnType<typeof mapShowcaseRecord>> => item !== null);
      if (mapped.length > 0) projects = mapped;
    }

    if (partnershipData && partnershipData.length > 0) {
      const mapped = (partnershipData as PartnershipRecord[]).map((record) => mapShowcaseRecord(record, 'partnership')).filter((item): item is NonNullable<ReturnType<typeof mapShowcaseRecord>> => item !== null);
      if (mapped.length > 0) partnerships = mapped;
    }

    if (clientData && clientData.length > 0) {
      const mapped = (clientData as ClientRecord[]).map(mapClientRecord).filter((item): item is NonNullable<ReturnType<typeof mapClientRecord>> => item !== null);
      if (mapped.length > 0) clients = mapped;
    }

    if (testimonialData && testimonialData.length > 0) {
      const mapped = (testimonialData as TestimonialRecord[]).map(mapTestimonialRecord).filter((item): item is NonNullable<ReturnType<typeof mapTestimonialRecord>> => item !== null);
      if (mapped.length > 0) testimonials = mapped;
    }
  } catch {
    // Keep using curated fallback data when live content is unavailable.
  }

  return (
    <main className="min-h-screen">
      <CompanyProfileClient
        timeline={timeline}
        services={services}
        products={products}
        projects={projects.filter(Boolean) as NonNullable<ReturnType<typeof mapShowcaseRecord>>[]}
        partnerships={partnerships.filter(Boolean) as NonNullable<ReturnType<typeof mapShowcaseRecord>>[]}
        clients={clients.filter(Boolean) as NonNullable<ReturnType<typeof mapClientRecord>>[]}
        testimonials={testimonials}
      />
    </main>
  );
}
