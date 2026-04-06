import Link from 'next/link';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';
import type { ServiceRecord } from '../../../../types/database';
import AdminServicesManager from './AdminServicesManager';
import { deleteService, upsertService } from './actions';

export default async function AdminServicesPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const items = (data ?? []) as ServiceRecord[];

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
                <h1 className="text-[1.75rem] font-semibold text-foreground">What We Offer</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Manage services with the same backend workspace pattern used across the admin.</p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/admin" className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary">Back to Dashboard</Link>
                <div className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-medium text-primary">{items.length} services</div>
              </div>
            </div>
          </div>
        </div>

        <AdminServicesManager items={items} upsertAction={upsertService} deleteAction={deleteService} />
      </div>
    </main>
  );
}
