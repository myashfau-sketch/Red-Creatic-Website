import { createSupabaseServerClient } from '../../lib/supabase/server';
import { isSitePageEnabled, isSitePagePopupEnabled, type SitePageSearchParams } from '../../lib/site-page-settings';
import { fallbackProducts, type Product } from '../../data/products';
import type { ProductRecord } from '../../types/database';
import ProductsPageClient from './ProductsPageClient';
import { notFound } from 'next/navigation';

function mapProductRecord(record: ProductRecord, index: number): Product | null {
  if (!record.name || !record.description || !record.main_image_url) return null;

  const galleryImages = (record.gallery_images ?? []).filter((image) => image?.src);
  const mainImageAlt = record.main_image_alt || record.name;

  return {
    id: index + 1,
    name: record.name,
    description: record.description,
    category: record.category || undefined,
    mainImage: record.main_image_url,
    mainImageAlt,
    images: galleryImages.length > 0
      ? galleryImages
      : [{ src: record.main_image_url, alt: mainImageAlt }],
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: SitePageSearchParams;
}) {
  if (!(await isSitePageEnabled('products', searchParams))) {
    notFound();
  }

  let products = fallbackProducts;
  let popupEnabled = true;

  try {
    popupEnabled = await isSitePagePopupEnabled('products');
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const mappedProducts = (data as ProductRecord[])
        .map(mapProductRecord)
        .filter((item): item is Product => item !== null);

      if (mappedProducts.length > 0) {
        products = mappedProducts;
      }
    }
  } catch {
    // Fall back to existing product data if Supabase is unavailable.
  }

  return <ProductsPageClient initialProducts={products} popupEnabled={popupEnabled} />;
}
