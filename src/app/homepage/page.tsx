import type { Metadata } from 'next';
import Header from '../../components/common/Header';
import { createSupabaseServerClient } from '../../lib/supabase/server';
import type { ProjectRecord, ServiceRecord, TestimonialRecord, ProductRecord } from '../../types/database';
import { allTestimonials as fallbackTestimonials, type Testimonial } from '../clients/testimonials-data';
import { fallbackServices, type Service } from '../../data/services';
import { fallbackProducts, type Product } from '../../data/products';
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

export interface HeroProject {
  id: string;
  title: string;
  description: string;
  image: string;
  images: { src: string; alt: string }[];
  client: string;
  year: string;
}

function mapServiceRecord(record: ServiceRecord, index: number): Service | null {
  if (!record.title || !record.description) return null;

  return {
    id: index + 1,
    title: record.title,
    description: record.description,
    icon: record.icon || 'WrenchScrewdriverIcon',
    category: record.category || 'Service',
    industries: record.industries ?? [],
    features: record.features ?? [],
    technicalSpecs: {
      materials: record.materials ?? [],
      qualityStandards: record.quality_standards ?? [],
    },
  };
}

function mapProductRecord(record: ProductRecord, index: number): Product | null {
  if (!record.name || !record.description || !record.main_image_url) return null;

  const galleryImages = (record.gallery_images ?? []).filter((image) => image?.src);
  const mainImageAlt = record.main_image_alt || record.name;

  return {
    id: index + 1,
    name: record.name,
    description: record.description,
    mainImage: record.main_image_url,
    mainImageAlt,
    images:
      galleryImages.length > 0
        ? galleryImages
        : [{ src: record.main_image_url, alt: mainImageAlt }],
  };
}

function mapHeroProjectRecord(record: ProjectRecord): HeroProject | null {
  if (!record.title) return null;

  const images = [record.image_url, ...(record.gallery_images ?? [])].filter(
    (src): src is string => Boolean(src)
  );

  return {
    id: record.id,
    title: record.title,
    description: record.description || 'A completed Red Creatic project built for real-world use.',
    image:
      images[0] || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    images: images.length > 0
      ? images.map((src, index) => ({
          src,
          alt: `${record.title} image ${index + 1}`,
        }))
      : [
          {
            src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
            alt: record.title,
          },
        ],
    client: record.client_name || 'Red Creatic Client',
    year: record.completion_year || 'Recent Project',
  };
}

export default async function HomePage() {
  let testimonials = fallbackTestimonials;
  let services = fallbackServices;
  let products = fallbackProducts;
  let projects: HeroProject[] = [
    {
      id: 'fallback-project-1',
      title: 'Hulhumale Retail Branding',
      description:
        'Complete storefront and interior branding delivered for a local retail environment.',
      image:
        'https://img.rocket.new/generatedImages/rocket_gen_img_1688fa644-1764655135320.png',
      images: [
        {
          src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1688fa644-1764655135320.png',
          alt: 'Hulhumale Retail Branding main image',
        },
      ],
      client: 'Ahmed Rasheed',
      year: '2024',
    },
  ];

  try {
    const supabase = await createSupabaseServerClient();
    const [
      { data: testimonialData, error: testimonialError },
      { data: servicesData, error: servicesError },
      { data: productsData, error: productsError },
      { data: projectsData, error: projectsError },
    ] = await Promise.all([
      supabase
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false }),
      supabase
        .from('services')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false }),
      supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false }),
      supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false }),
    ]);

    if (!testimonialError && testimonialData && testimonialData.length > 0) {
      const mappedTestimonials = (testimonialData as TestimonialRecord[])
        .map(mapTestimonialRecord)
        .filter((item): item is Testimonial => item !== null);

      if (mappedTestimonials.length > 0) {
        testimonials = mappedTestimonials;
      }
    }

    if (!servicesError && servicesData && servicesData.length > 0) {
      const mappedServices = (servicesData as ServiceRecord[])
        .map(mapServiceRecord)
        .filter((item): item is Service => item !== null);

      if (mappedServices.length > 0) {
        services = mappedServices;
      }
    }

    if (!productsError && productsData && productsData.length > 0) {
      const mappedProducts = (productsData as ProductRecord[])
        .map(mapProductRecord)
        .filter((item): item is Product => item !== null);

      if (mappedProducts.length > 0) {
        products = mappedProducts;
      }
    }

    if (!projectsError && projectsData && projectsData.length > 0) {
      const mappedProjects = (projectsData as ProjectRecord[])
        .map(mapHeroProjectRecord)
        .filter((item): item is HeroProject => item !== null);

      if (mappedProjects.length > 0) {
        projects = mappedProjects;
      }
    }
  } catch {
    // Fall back to existing testimonial data if Supabase is unavailable.
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection
          testimonials={testimonials}
          services={services}
          products={products}
          projects={projects}
        />
        <FeaturedServices initialServices={services} />
        <FeaturedProducts />
        <ClientTestimonials initialTestimonials={testimonials} />
      </main>
      <Footer />
    </>
  );
}
