import { createSupabaseServerClient } from '../../../lib/supabase/server';
import { signOutAdmin } from './actions';
import Link from 'next/link';

const adminSections = [
  {
    title: 'Page Visibility',
    description: 'Turn public pages on or off while keeping admin editing and preview access.',
    status: 'Live',
    href: '/admin/site-pages',
  },
  {
    title: 'Gallery',
    description: 'Manage gallery images, tags, and future uploads.',
    status: 'Live',
    href: '/admin/gallery',
  },
  {
    title: 'Our Story Timeline',
    description: 'Manage years, descriptions, and milestone bullet points.',
    status: 'Live',
    href: '/admin/timeline',
  },
  {
    title: 'What We Offer',
    description: 'Manage service cards, descriptions, materials, and quality info.',
    status: 'Live',
    href: '/admin/services',
  },
  {
    title: 'Products',
    description: 'Manage product cards, main images, and supporting gallery images.',
    status: 'Live',
    href: '/admin/products',
  },
  {
    title: 'Projects',
    description: 'Manage project showcases with client names, locations, and imagery.',
    status: 'Live',
    href: '/admin/projects',
  },
  {
    title: 'Clients',
    description: 'Manage client names, logos, categories, and feature status.',
    status: 'Live',
    href: '/admin/clients',
  },
  {
    title: 'Testimonials',
    description: 'Manage quotes, names, roles, ratings, and publication status.',
    status: 'Live',
    href: '/admin/testimonials',
  },
];

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen w-full bg-background px-4 py-5 lg:px-5 lg:py-5">
      <div className="w-full space-y-5">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-border bg-card p-6 shadow-lg md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/80">
              Admin Panel
            </p>
            <h1 className="text-3xl font-semibold text-foreground">Content dashboard</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Your main content areas are now wired for database-driven editing. Use
              these sections to update the live website from the admin panel.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-muted-foreground md:items-end">
            <p>{user?.email}</p>
            <form action={signOutAdmin}>
              <button
                type="submit"
                className="rounded-full border border-border px-4 py-2 font-medium text-foreground transition-colors hover:border-primary hover:text-primary">
                Sign out
              </button>
            </form>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {adminSections.map((section) => (
            <div
              key={section.title}
              className="rounded-[1.6rem] border border-border bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
                  {section.status}
                </span>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {section.description}
              </p>
              {section.href && (
                <Link
                  href={section.href}
                  className="mt-4 inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary">
                  Open
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">What to do next</h2>
          <ol className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <li>1. Start entering live content in each section from the admin panel.</li>
            <li>2. Publish only the records you want visible on the website.</li>
            <li>3. Review the public pages after each content update to confirm the final layout.</li>
            <li>4. We can add image uploads to more sections next if you want.</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
