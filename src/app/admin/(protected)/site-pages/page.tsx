import Link from 'next/link';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';
import {
  getSitePagePreviewHref,
  sitePageConfigs,
} from '../../../../lib/site-page-settings';
import type { SitePageSettingRecord } from '../../../../types/database';
import { upsertSitePageSetting } from './actions';

export default async function AdminSitePagesPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('site_page_settings')
    .select('*')
    .order('title', { ascending: true });
  const settingsError = error?.message ?? null;

  const settings = new Map(
    ((data ?? []) as SitePageSettingRecord[]).map((item) => [item.slug, item])
  );

  return (
    <main className="min-h-screen w-full bg-background px-4 py-4 lg:px-5 lg:py-5">
      <div className="w-full space-y-5">
        <div className="rounded-[1.5rem] border border-border bg-card px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/80">
                Admin Panel
              </p>
              <h1 className="text-[1.75rem] font-semibold text-foreground">
                Page Visibility
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Turn public pages on or off before launch. Hidden pages stay available
                through their admin preview links, so you can keep working on them safely.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary">
                Back to Dashboard
              </Link>
              <div className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                {sitePageConfigs.length} public pages
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-card p-4 shadow-sm">
          {settingsError && (
            <div className="mb-4 rounded-[1.1rem] border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
              Page visibility settings table is not available yet. Run the latest
              `site_page_settings` SQL in Supabase, then refresh this page.
            </div>
          )}
          <div className="space-y-3">
            {sitePageConfigs.map((page) => {
              const setting = settings.get(page.slug);
              const isEnabled = setting?.is_enabled ?? true;

              return (
                <form
                  key={page.slug}
                  action={upsertSitePageSetting}
                  className="grid gap-4 rounded-[1.25rem] border border-border bg-background px-4 py-4 lg:grid-cols-[minmax(0,1.2fr)_auto_auto] lg:items-center">
                  <input type="hidden" name="slug" value={page.slug} />
                  <input type="hidden" name="title" value={page.title} />

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-base font-semibold text-foreground">
                        {page.title}
                      </h2>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                          isEnabled
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}>
                        {isEnabled ? 'Live' : 'Hidden'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{page.path}</p>
                    <p className="mt-1 text-xs text-muted-foreground/80">
                      Preview URL: {getSitePagePreviewHref(page.path)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                    <Link
                      href={page.path}
                      target="_blank"
                      className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary">
                      Open Public
                    </Link>
                    <Link
                      href={getSitePagePreviewHref(page.path)}
                      target="_blank"
                      className="rounded-xl border border-primary/25 bg-primary/8 px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary/12">
                      Open Preview
                    </Link>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                    <label className="inline-flex items-center gap-3 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                      <input
                        type="checkbox"
                        name="is_enabled"
                        defaultChecked={isEnabled}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      Page enabled
                    </label>
                    <button
                      type="submit"
                      className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                      Save
                    </button>
                  </div>
                </form>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
