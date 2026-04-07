import { createSupabaseServerClient } from '../../lib/supabase/server';
import { isSitePageEnabled, isSitePagePopupEnabled, type SitePageSearchParams } from '../../lib/site-page-settings';
import type { PartnershipRecord, ProductRecord, ServiceRecord } from '../../types/database';
import { fallbackProducts } from '../../data/products';
import { fallbackServices } from '../../data/services';
import PartnershipsPageClient, { type ProjectCardItem } from './PartnershipsPageClient';
import { notFound } from 'next/navigation';

const fallbackPartnerships: ProjectCardItem[] = [
  {
    id: 'fallback-1',
    title: 'Hulhumale Retail Branding',
    description:
      'Complete branding collaboration for a retail clothing store in Hulhumale. The partnership included storefront signage, interior wall graphics, window decals, and branded shopping bags.',
    detailHtmlUrl: null,
    customer: {
      name: 'Ahmed Rasheed',
      business: '2024',
      location: 'Hulhumale, Maldives',
    },
    works: ['Storefront Signage', 'Interior Wall Graphics', 'Window Decals', 'Branded Packaging'],
    products: ['Custom Signage', 'Brand Identity Design'],
    images: [
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1688fa644-1764655135320.png', alt: 'StyleHub storefront with new illuminated signage and brand colors' },
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1050295a6-1774849138440.png', alt: 'Interior wall graphics with brand patterns and lifestyle imagery' },
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_14a264d74-1767934746963.png', alt: 'Branded shopping bags and packaging with StyleHub logo design' },
    ],
  },
  {
    id: 'fallback-2',
    title: 'Resort Fleet Vehicle Wraps',
    description:
      'Partnership project for a luxury resort transportation fleet using premium vinyl suitable for tropical and saltwater exposure.',
    detailHtmlUrl: null,
    customer: {
      name: 'Fathimath Nisha',
      business: '2025',
      location: 'North Male Atoll, Maldives',
    },
    works: ['Full Vehicle Wraps', 'UV-Resistant Vinyl', 'Custom Graphic Design', 'Installation & Finishing'],
    products: ['Vehicle Wrap'],
    images: [
      { src: 'https://images.unsplash.com/photo-1579003542201-5178070803c1', alt: 'Resort shuttle van with full teal and gold wrap featuring ocean imagery' },
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_11ef4ba2c-1774849138403.png', alt: 'Close-up of vehicle wrap installation showing smooth vinyl application' },
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1a6ecf592-1774849138885.png', alt: 'Complete fleet of wrapped resort vehicles parked at entrance' },
    ],
  },
  {
    id: 'fallback-3',
    title: 'Corporate Office Rebrand',
    description:
      'A long-term partnership covering office signage and branding for a financial services company relocating to a new headquarters.',
    detailHtmlUrl: null,
    customer: {
      name: 'Mariyam Shifa',
      business: '2025',
      location: "Hulhumale', Maldives",
    },
    works: ['3D Reception Lettering', 'Wayfinding System', 'Meeting Room Signage', 'Branded Wall Graphics'],
    products: ['Custom Signage', '3D Signage & Displays'],
    images: [
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_16718b16f-1767858375389.png', alt: 'Pacific Finance Group 3D metal letters in reception area with ambient lighting' },
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_14ac9ef5c-1768540885715.png', alt: 'Office corridor with wayfinding signage and branded wall graphics' },
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1c30e6e10-1774849137449.png', alt: 'Meeting room glass door with frosted vinyl company logo and room number' },
    ],
  },
];

function mapPartnershipRecord(record: PartnershipRecord): ProjectCardItem | null {
  if (!record.title) return null;

  const imageSources = [record.image_url, ...(record.gallery_images ?? [])].filter(
    (src): src is string => Boolean(src)
  );

  const extraImages = imageSources.slice(1).map((src, index) => ({
    src,
    alt: `${record.title} gallery image ${index + 1}`,
  }));

  const mainImage = imageSources[0] || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee';

  return {
    id: record.id,
    title: record.title,
    description: record.description || 'Open the partnership to view the full detail.',
    detailHtmlUrl: record.detail_html_url || null,
    customer: {
      name: record.client_name || 'Client',
      business: record.completion_year || 'Partnership',
      location: record.location || 'Maldives',
    },
    works: record.service_tags ?? [],
    products: record.product_tags ?? [],
    images: [{ src: mainImage, alt: record.title }, ...extraImages].filter(
      (image, index, array) =>
        image.src && array.findIndex((entry) => entry.src === image.src) === index
    ),
  };
}

export default async function PartnershipsPage({
  searchParams,
}: {
  searchParams?: SitePageSearchParams;
}) {
  if (!(await isSitePageEnabled('partnerships', searchParams))) {
    notFound();
  }

  let partnerships = fallbackPartnerships;
  let popupEnabled = true;
  let serviceOptions = Array.from(new Set(fallbackPartnerships.flatMap((item) => item.works))).sort();
  let productOptions = Array.from(new Set(fallbackPartnerships.flatMap((item) => item.products))).sort();
  let yearOptions = Array.from(
    new Set(
      fallbackPartnerships
        .map((item) => item.customer.business)
        .filter((value) => /^\d{4}$/.test(value))
    )
  ).sort((a, b) => b.localeCompare(a));

  try {
    popupEnabled = await isSitePagePopupEnabled('partnerships');
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('partnerships')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    const [{ data: servicesData, error: servicesError }, { data: productsData, error: productsError }] =
      await Promise.all([
        supabase
          .from('services')
          .select('title')
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
        supabase
          .from('products')
          .select('name')
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
      ]);

    if (!error && data && data.length > 0) {
      const mappedPartnerships = (data as PartnershipRecord[])
        .map(mapPartnershipRecord)
        .filter((item): item is ProjectCardItem => item !== null);

      if (mappedPartnerships.length > 0) {
        partnerships = mappedPartnerships;

        const derivedServices = Array.from(
          new Set(mappedPartnerships.flatMap((item) => item.works).filter(Boolean))
        ).sort();
        const derivedProducts = Array.from(
          new Set(mappedPartnerships.flatMap((item) => item.products).filter(Boolean))
        ).sort();
        const derivedYears = Array.from(
          new Set(
            mappedPartnerships
              .map((item) => item.customer.business)
              .filter((value) => /^\d{4}$/.test(value))
          )
        ).sort((a, b) => b.localeCompare(a));

        if (derivedServices.length > 0) {
          serviceOptions = derivedServices;
        }

        if (derivedProducts.length > 0) {
          productOptions = derivedProducts;
        }

        if (derivedYears.length > 0) {
          yearOptions = derivedYears;
        }
      }
    }

    if (!servicesError && servicesData && servicesData.length > 0) {
      const names = (servicesData as Pick<ServiceRecord, 'title'>[])
        .map((service) => service.title)
        .filter((title): title is string => Boolean(title));

      if (names.length > 0) {
        serviceOptions = Array.from(new Set(names)).sort();
      }
    }

    if (!productsError && productsData && productsData.length > 0) {
      const names = (productsData as Pick<ProductRecord, 'name'>[])
        .map((product) => product.name)
        .filter((name): name is string => Boolean(name));

      if (names.length > 0) {
        productOptions = Array.from(new Set(names)).sort();
      }
    }
  } catch {
    // Fall back to existing partnership data if Supabase is unavailable.
  }

  return (
    <PartnershipsPageClient
      initialProjects={partnerships}
      productOptions={productOptions.length > 0 ? productOptions : fallbackProducts.map((product) => product.name)}
      serviceOptions={serviceOptions}
      yearOptions={yearOptions}
      popupEnabled={popupEnabled}
    />
  );
}
