import Link from 'next/link';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';
import { services } from '../../../../data/services';
import { allProducts } from '../../../../data/products';
import type { GalleryItemRecord, ProductRecord, ServiceRecord } from '../../../../types/database';
import AdminGalleryManager from './AdminGalleryManager';
import { deleteGalleryItem, upsertGalleryItem } from './actions';

export default async function AdminGalleryPage() {
  const supabase = await createSupabaseServerClient();
  const [
    { data, error },
    { data: serviceData, error: serviceError },
    { data: productData, error: productError },
  ] = await Promise.all([
    supabase
      .from('gallery_items')
      .select('*')
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

  if (error) {
    throw new Error(error.message);
  }

  const items = (data ?? []) as GalleryItemRecord[];
  let serviceOptions = services.map((service) => service.title);
  let productOptions = allProducts.map((product) => product.name);

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

  return (
    <main className="min-h-screen w-full bg-background px-4 py-4 lg:px-5 lg:py-5">
      <div className="w-full space-y-5">
        <div className="rounded-[1.5rem] border border-border bg-card px-5 py-4 shadow-sm">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/80">
              Admin Panel
            </p>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-[1.75rem] font-semibold text-foreground">Gallery Manager</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Manage gallery content from one workspace. Use the left navigation rail to move between items, then edit details in the main panel on the right.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/admin"
                  className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary">
                  Back to Dashboard
                </Link>
                <div className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  {items.length} items
                </div>
              </div>
            </div>
          </div>
        </div>

        <AdminGalleryManager
          items={items}
          serviceOptions={serviceOptions}
          productOptions={productOptions}
          upsertAction={upsertGalleryItem}
          deleteAction={deleteGalleryItem}
        />
      </div>
    </main>
  );
}
