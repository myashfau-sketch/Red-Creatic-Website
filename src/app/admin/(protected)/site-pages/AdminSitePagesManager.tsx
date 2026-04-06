'use client';

import { useTransition } from 'react';

interface SitePageRow {
  slug: string;
  title: string;
  href: string;
  id: string | null;
  isEnabled: boolean;
  storedTitle: string;
}

export default function AdminSitePagesManager({
  items,
  upsertAction,
}: {
  items: SitePageRow[];
  upsertAction: (formData: FormData) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 border-b border-border/70 pb-5">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary/75">Site Visibility</p>
        <h2 className="text-[1.7rem] font-semibold text-foreground">Public page access</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Turn public pages on or off without affecting the admin editors. Hidden pages can still be reviewed through the preview links while signed in.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <form
            key={item.slug}
            action={(formData) =>
              startTransition(async () => {
                await upsertAction(formData);
              })
            }
            className="rounded-[1.25rem] border border-border bg-background p-4"
          >
            <input type="hidden" name="slug" value={item.slug} />
            <input type="hidden" name="title" value={item.storedTitle} />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] ${
                      item.isEnabled
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {item.isEnabled ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Public URL: <span className="text-foreground">{item.href}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Preview URL: <span className="text-foreground">{`${item.href}?admin-preview=1`}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`${item.href}?admin-preview=1`}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  Preview
                </a>
                <label className="inline-flex items-center gap-3 rounded-xl border border-border px-4 py-2 text-sm text-foreground">
                  <input type="checkbox" name="is_enabled" defaultChecked={item.isEnabled} />
                  <span>Page visible</span>
                </label>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
