import Link from 'next/link';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';
import type { PartnershipRecord, ProductRecord, ServiceRecord } from '../../../../types/database';
import { fallbackProducts } from '../../../../data/products';
import { fallbackServices } from '../../../../data/services';
import AdminPartnershipsManager from './AdminPartnershipsManager';
import { deletePartnership, upsertPartnership } from './actions';

export default async function AdminPartnershipsPage() {
  const supabase = await createSupabaseServerClient();
  const [
    { data: partnershipsData, error: partnershipsError },
    { data: servicesData, error: servicesError },
    { data: productsData, error: productsError },
  ] = await Promise.all([
    supabase
      .from('partnerships')
      .select('*')
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

  if (partnershipsError) {
    throw new Error(partnershipsError.message);
  }

  const items = (partnershipsData ?? []) as PartnershipRecord[];

  const serviceOptions =
    !servicesError && servicesData && servicesData.length > 0
      ? (servicesData as Pick<ServiceRecord, 'title'>[])
          .map((service) => service.title)
          .filter((title): title is string => Boolean(title))
      : fallbackServices.map((service) => service.title);

  const productOptions =
    !productsError && productsData && productsData.length > 0
      ? (productsData as Pick<ProductRecord, 'name'>[])
          .map((product) => product.name)
          .filter((name): name is string => Boolean(name))
      : fallbackProducts.map((product) => product.name);

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
                <h1 className="text-[1.75rem] font-semibold text-foreground">Partnerships</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Manage partnership showcases from the same structured backend workspace used throughout the admin.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/admin" className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary">Back to Dashboard</Link>
                <div className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-medium text-primary">{items.length} partnerships</div>
              </div>
            </div>
          </div>
        </div>

        <AdminPartnershipsManager
          items={items}
          serviceOptions={Array.from(new Set(serviceOptions)).sort()}
          productOptions={Array.from(new Set(productOptions)).sort()}
          upsertAction={upsertPartnership}
          deleteAction={deletePartnership}
        />
      </div>
    </main>
  );
}
