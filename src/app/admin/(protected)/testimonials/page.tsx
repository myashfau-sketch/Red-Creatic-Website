import Link from 'next/link';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';
import type { TestimonialRecord } from '../../../../types/database';
import AdminTestimonialsManager from './AdminTestimonialsManager';
import { deleteTestimonial, upsertTestimonial } from './actions';

export default async function AdminTestimonialsPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const items = (data ?? []) as TestimonialRecord[];

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
                <h1 className="text-[1.75rem] font-semibold text-foreground">Testimonials</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Manage testimonial content from the same full-page backend layout used across the admin.</p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/admin" className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary">Back to Dashboard</Link>
                <div className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-medium text-primary">{items.length} testimonials</div>
              </div>
            </div>
          </div>
        </div>

        <AdminTestimonialsManager items={items} upsertAction={upsertTestimonial} deleteAction={deleteTestimonial} />
      </div>
    </main>
  );
}
