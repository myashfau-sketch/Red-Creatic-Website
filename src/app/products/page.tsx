import { createSupabaseServerClient } from '../../lib/supabase/server';
import { isSitePageEnabled, isSitePagePopupEnabled, type SitePageSearchParams } from '../../lib/site-page-settings';
import { fallbackProducts, type Product } from '../../data/products';
import type { ProductRecord } from '../../types/database';
import ProductsPageClient from './ProductsPageClient';
import { notFound } from 'next/navigation';

function createProductPlaceholder(name: string) {
  const label = encodeURIComponent(name.trim() || 'Product');

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f8fafc" />
          <stop offset="100%" stop-color="#e5e7eb" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bg)" rx="36" />
      <rect x="46" y="46" width="708" height="508" rx="28" fill="#ffffff" stroke="#fecaca" />
      <text x="400" y="290" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#111827">${decodeURIComponent(label)}</text>
      <text x="400" y="345" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#dc2626">Red Creatic Product</text>
    </svg>`
  )}`;
}

function mapProductRecord(record: ProductRecord, index: number): Product | null {
  if (!record.name) return null;

  const galleryImages = (record.gallery_images ?? []).filter((image) => image?.src);
  const fallbackImage = galleryImages[0]?.src ?? null;
  const mainImageUrl = record.main_image_url || fallbackImage || createProductPlaceholder(record.name);
  const mainImageAlt = record.main_image_alt || galleryImages[0]?.alt || record.name;

  return {
    id: index + 1,
    name: record.name,
    description: record.description || '',
    category: record.category || undefined,
    mainImage: mainImageUrl,
    mainImageAlt,
    images: galleryImages.length > 0
      ? galleryImages
      : [{ src: mainImageUrl, alt: mainImageAlt }],
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
