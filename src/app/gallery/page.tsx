import { createSupabaseServerClient } from '../../lib/supabase/server';
import { isSitePageEnabled, type SitePageSearchParams } from '../../lib/site-page-settings';
import { fallbackServices } from '../../data/services';
import { fallbackProducts } from '../../data/products';
import type { GalleryItemRecord } from '../../types/database';
import type { ProductRecord, ServiceRecord } from '../../types/database';
import GalleryPageClient from './GalleryPageClient';
import { notFound } from 'next/navigation';

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  serviceTags: string[];
  productTags: string[];
}

const fallbackGalleryItems: GalleryItem[] = [
  { id: 'fallback-1', src: 'https://img.rocket.new/generatedImages/rocket_gen_img_199b9d071-1764759264035.png', alt: 'Large outdoor banner installation for retail store grand opening event', serviceTags: ['Vinyl Printing', 'Digital Printing'], productTags: ['Large Format Banner'] },
  { id: 'fallback-2', src: 'https://images.unsplash.com/photo-1661476686884-2a4ab3f8be46', alt: 'Custom illuminated signage for modern office building entrance', serviceTags: ['UV Printing', 'Metal Working'], productTags: ['Custom Signage'] },
  { id: 'fallback-3', src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e27a7a30-1772145175170.png', alt: 'Full vehicle wrap on delivery van with vibrant brand graphics', serviceTags: ['Vehicle Wrapping', 'Vinyl Printing'], productTags: ['Vehicle Wrap'] },
  { id: 'fallback-4', src: 'https://img.rocket.new/generatedImages/rocket_gen_img_14e40510a-1772566919197.png', alt: 'Restaurant menu board with professional food photography layout', serviceTags: ['Digital Printing', 'UV Printing'], productTags: ['Menu Boards'] },
  { id: 'fallback-5', src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1af01d307-1774849143455.png', alt: 'Complete brand identity package with logo and stationery design', serviceTags: ['Digital Printing', 'Laser Cutting & Engraving'], productTags: ['Brand Identity Design'] },
  { id: 'fallback-6', src: 'https://img.rocket.new/generatedImages/rocket_gen_img_14706248c-1772221545492.png', alt: '3D metal lettering mounted on reception wall of corporate office', serviceTags: ['Metal Working', 'CNC Cutting and Routing'], productTags: ['3D Signage & Displays', 'Custom Signage'] },
  { id: 'fallback-7', src: 'https://img.rocket.new/generatedImages/rocket_gen_img_14ac9ef5c-1768540885715.png', alt: 'Office interior with branded wall graphics and frosted glass signage', serviceTags: ['Vinyl Printing', 'UV Printing'], productTags: ['Custom Signage'] },
  { id: 'fallback-8', src: 'https://img.rocket.new/generatedImages/rocket_gen_img_15cf9ba40-1772058341525.png', alt: 'Cafe menu board with handwritten style typography and daily specials', serviceTags: ['Digital Printing', 'Wood Working'], productTags: ['Menu Boards'] },
  { id: 'fallback-9', src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e7990c94-1774466494943.png', alt: 'Brand color palette and typography guide printed on presentation board', serviceTags: ['Digital Printing', 'Canvas Printing'], productTags: ['Brand Identity Design'] },
  { id: 'fallback-10', src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1d5598df5-1769727325198.png', alt: 'Vehicle wrap installation process showing vinyl application technique', serviceTags: ['Vehicle Wrapping', 'Vinyl Printing'], productTags: ['Vehicle Wrap'] },
  { id: 'fallback-11', src: 'https://images.unsplash.com/photo-1583177279691-3e84bf580aa7', alt: 'Backlit menu display panel installed above fast food restaurant counter', serviceTags: ['UV Printing', 'Metal Working'], productTags: ['Menu Boards'] },
  { id: 'fallback-12', src: 'https://img.rocket.new/generatedImages/rocket_gen_img_12f02abff-1765373771915.png', alt: 'Brand guidelines booklet open showing visual identity system elements', serviceTags: ['Digital Printing', 'Canvas Printing'], productTags: ['Brand Identity Design'] },
];

function mapGalleryRecord(record: GalleryItemRecord): GalleryItem | null {
  if (!record.image_url) return null;

  return {
    id: record.id,
    src: record.image_url,
    alt: record.alt_text || record.title || 'Gallery image',
    serviceTags: record.service_tags ?? [],
    productTags: record.product_tags ?? [],
  };
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams?: SitePageSearchParams;
}) {
  if (!(await isSitePageEnabled('gallery', searchParams))) {
    notFound();
  }

  let items = fallbackGalleryItems;
  let serviceOptions = fallbackServices.map((service) => service.title);
  let productOptions = fallbackProducts.map((product) => product.name);

  try {
    const supabase = await createSupabaseServerClient();
    const [
      { data: galleryData, error: galleryError },
      { data: serviceData, error: serviceError },
      { data: productData, error: productError },
    ] = await Promise.all([
      supabase
        .from('gallery_items')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false }),
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

    if (!galleryError && galleryData && galleryData.length > 0) {
      const mappedItems = (galleryData as GalleryItemRecord[])
        .map(mapGalleryRecord)
        .filter((item): item is GalleryItem => item !== null);

      if (mappedItems.length > 0) {
        items = mappedItems;
      }
    }

    if (!serviceError && serviceData && serviceData.length > 0) {
      const names = (serviceData as Pick<ServiceRecord, 'title'>[])
        .map((service) => service.title)
        .filter((title): title is string => Boolean(title));

      if (names.length > 0) {
        serviceOptions = names;
      }
    }

    if (!productError && productData && productData.length > 0) {
      const names = (productData as Pick<ProductRecord, 'name'>[])
        .map((product) => product.name)
        .filter((name): name is string => Boolean(name));

      if (names.length > 0) {
        productOptions = names;
      }
    }
  } catch {
    // Fall back to the existing in-file gallery if Supabase is unavailable.
  }

  return (
    <GalleryPageClient
      initialGalleryItems={items}
      serviceOptions={serviceOptions}
      productOptions={productOptions}
    />
  );
}
