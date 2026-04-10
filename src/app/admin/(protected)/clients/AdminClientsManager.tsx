'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ClientRecord } from '../../../../types/database';
import { createSupabaseBrowserClient } from '../../../../lib/supabase/client';

const CLIENT_LOGO_BUCKET = 'client-logos';

interface AdminClientsManagerProps {
  items: ClientRecord[];
  upsertAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}

function ClientEditor({ item, upsertAction, deleteAction, onDirtyChange, onSaved }: { item?: ClientRecord; upsertAction: (formData: FormData) => Promise<void>; deleteAction: (formData: FormData) => Promise<void>; onDirtyChange: (dirty: boolean) => void; onSaved: () => void; }) {
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState(item?.logo_url ?? '');
  const [logoScale, setLogoScale] = useState(item?.logo_scale ?? 1);
  const [logoOffsetX, setLogoOffsetX] = useState(item?.logo_offset_x ?? 0);
  const [logoOffsetY, setLogoOffsetY] = useState(item?.logo_offset_y ?? 0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const isNew = !item;
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    setLogoUrl(item?.logo_url ?? '');
    setLogoScale(item?.logo_scale ?? 1);
    setLogoOffsetX(item?.logo_offset_x ?? 0);
    setLogoOffsetY(item?.logo_offset_y ?? 0);
    setSelectedFile(null);
    setError(null);
    onDirtyChange(false);
  }, [item, onDirtyChange]);

  const uploadSelectedFile = async () => {
    if (!selectedFile) return null;

    setIsUploading(true);
    setError(null);

    const safeName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
    const filePath = `logos/${Date.now()}-${safeName || 'logo.png'}`;

    const { error: uploadError } = await supabase.storage
      .from(CLIENT_LOGO_BUCKET)
      .upload(filePath, selectedFile, {
        cacheControl: '31536000',
        upsert: false,
      });

    if (uploadError) {
      setError(uploadError.message);
      setIsUploading(false);
      return null;
    }

    const { data } = supabase.storage.from(CLIENT_LOGO_BUCKET).getPublicUrl(filePath);
    setLogoUrl(data.publicUrl);
    setSelectedFile(null);
    setIsUploading(false);
    return data.publicUrl;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(null); setIsSaving(true); const formElement = event.currentTarget;
    try {
      let finalLogoUrl = logoUrl;

      if (selectedFile) {
        const uploadedUrl = await uploadSelectedFile();
        if (!uploadedUrl) {
          throw new Error('Logo upload failed before the client could be saved.');
        }
        finalLogoUrl = uploadedUrl;
      }

      const formData = new FormData(formElement);
      formData.set('logo_url', finalLogoUrl);
      formData.set('logo_scale', String(logoScale));
      formData.set('logo_offset_x', String(logoOffsetX));
      formData.set('logo_offset_y', String(logoOffsetY));

      await upsertAction(formData);
      router.refresh();
      onDirtyChange(false);
      onSaved();
      if (isNew) {
        formElement.reset();
        setLogoUrl('');
        setLogoScale(1);
        setLogoOffsetX(0);
        setLogoOffsetY(0);
        setSelectedFile(null);
      }
    }
    catch (submitError) { setError(submitError instanceof Error ? submitError.message : 'Failed to save client.'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    if (!item?.id) return;
    setError(null);
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.set('id', item.id);
      await deleteAction(formData);
      router.refresh();
      onDirtyChange(false);
      onSaved();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to delete client.');
    } finally {
      setIsDeleting(false);
    }
  };

  const previewCard = (showCategory: boolean) => (
    <div
      className="mx-auto w-full"
      style={{ maxWidth: '257.6px', width: '100%', transition: 'opacity 0.7s, transform 0.7s', opacity: 1, transform: 'none' }}
    >
      <div className="group relative min-h-[170px] rounded-2xl border border-red-500/45 bg-white text-center shadow-[0_0_0_1px_rgba(239,68,68,0.22),0_0_18px_rgba(239,68,68,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(239,68,68,0.32),0_0_24px_rgba(239,68,68,0.16),0_16px_36px_rgba(0,0,0,0.12)]">
        <div className="absolute inset-[10px] flex items-center justify-center rounded-[0.85rem] bg-white">
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[0.85rem] bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={item?.name ?? 'Client logo preview'}
              className="h-full w-full object-contain"
              style={{
                transform: `translate(${logoOffsetX}px, ${logoOffsetY}px) scale(${logoScale})`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-white/88 px-4 text-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <span className="text-base font-bold leading-tight text-black">
                {item?.name || 'Client name'}
              </span>
            </div>
          </div>
        </div>
        {showCategory && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
            <span className="rounded-full bg-surface px-3 py-1 text-[11px] text-foreground/60">
              {item?.category || 'Category'}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-11rem)] rounded-[1.35rem] border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="mb-5 border-b border-border/70 pb-5"><p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary/75">{isNew ? 'New Client' : 'Client Details'}</p><h2 className="text-[1.7rem] font-semibold text-foreground">{item?.name || 'Create a new client'}</h2></div>
      <form onSubmit={handleSubmit} onChangeCapture={() => onDirtyChange(true)} className="space-y-5">
        {item?.id && <input type="hidden" name="id" value={item.id} />}
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
          <div className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Name</span><input type="text" name="name" defaultValue={item?.name ?? ''} className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary" /></label>
              <label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Category</span><input type="text" name="category" defaultValue={item?.category ?? ''} className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary" /></label>
            </div>
            <label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Website URL</span><input type="url" name="website_url" defaultValue={item?.website_url ?? ''} className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary" /></label>
            <label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Logo URL</span><input type="url" name="logo_url" value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary" placeholder="Auto-filled after upload, or paste a logo URL" /></label>
            <label className="block">
              <div className="mb-2 flex items-center justify-between">
                <span className="block text-sm font-medium text-foreground">Logo Zoom</span>
                <span className="text-xs text-muted-foreground">{Math.round(logoScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                value={logoScale}
                onChange={(event) => setLogoScale(Number(event.target.value))}
                className="w-full accent-primary"
              />
              <input type="hidden" name="logo_scale" value={logoScale} />
              <p className="mt-2 text-xs text-muted-foreground">
                Reduce large logos or enlarge smaller ones for a more balanced client grid.
              </p>
            </label>
            <label className="block">
              <div className="mb-2 flex items-center justify-between">
                <span className="block text-sm font-medium text-foreground">Horizontal Position</span>
                <span className="text-xs text-muted-foreground">{logoOffsetX}px</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                step="1"
                value={logoOffsetX}
                onChange={(event) => setLogoOffsetX(Number(event.target.value))}
                className="w-full accent-primary"
              />
              <input type="hidden" name="logo_offset_x" value={logoOffsetX} />
            </label>
            <label className="block">
              <div className="mb-2 flex items-center justify-between">
                <span className="block text-sm font-medium text-foreground">Vertical Position</span>
                <span className="text-xs text-muted-foreground">{logoOffsetY}px</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                step="1"
                value={logoOffsetY}
                onChange={(event) => setLogoOffsetY(Number(event.target.value))}
                className="w-full accent-primary"
              />
              <input type="hidden" name="logo_offset_y" value={logoOffsetY} />
            </label>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.1rem] border border-border bg-background/70 p-4">
              <div className="flex flex-col gap-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">Upload Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      setSelectedFile(event.target.files?.[0] ?? null);
                      onDirtyChange(true);
                    }}
                    className="block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary"
                  />
                </label>
                <button
                  type="button"
                  onClick={uploadSelectedFile}
                  disabled={!selectedFile || isUploading || isSaving}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploading ? 'Uploading...' : 'Upload Logo'}
                </button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Uploads use the Supabase bucket <code>{CLIENT_LOGO_BUCKET}</code>. After upload, the public logo URL is filled in automatically.
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.1rem] border border-border bg-card">
              {logoUrl ? (
                <div className="rounded-[1.1rem] bg-muted/20 p-4">
                  <div className="grid gap-4 xl:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        With Category
                      </p>
                      {previewCard(true)}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Without Category
                      </p>
                      {previewCard(false)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-[220px] items-center justify-center bg-surface text-sm text-muted-foreground">
                  Logo preview will appear here
                </div>
              )}
            </div>
          </div>
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-300">{error}</p>}
        <div className="flex justify-end border-t border-border/70 pt-4"><div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-3 rounded-xl border border-border px-4 py-2 text-sm text-foreground"><input type="checkbox" name="is_featured" defaultChecked={item?.is_featured ?? false} /><span>Featured</span></label>
          <label className="inline-flex items-center gap-3 rounded-xl border border-border px-4 py-2 text-sm text-foreground"><input type="checkbox" name="is_published" defaultChecked={item?.is_published ?? true} /><span>Published</span></label>
          {!isNew && item && <button type="button" onClick={handleDelete} disabled={isDeleting || isSaving || isUploading} className="rounded-xl border border-red-300 px-5 py-2 text-sm font-medium text-red-700 disabled:cursor-not-allowed disabled:opacity-60">{isDeleting ? 'Deleting...' : 'Delete'}</button>}
          <button type="submit" disabled={isSaving || isDeleting} className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">{isSaving ? 'Saving...' : isNew ? 'Create Client' : 'Save Changes'}</button>
        </div></div>
      </form>
    </div>
  );
}

export default function AdminClientsManager({ items, upsertAction, deleteAction }: AdminClientsManagerProps) {
  const [activeId, setActiveId] = useState<string>('new');
  const [isDirty, setIsDirty] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [logoFilter, setLogoFilter] = useState<'all' | 'with-logo' | 'without-logo'>('all');
  useEffect(() => { if (activeId !== 'new' && !items.some((item) => item.id === activeId)) setActiveId(items[0]?.id ?? 'new'); }, [activeId, items]);

  const categoryOptions = useMemo(
    () => ['All', ...Array.from(new Set(items.map((item) => item.category).filter(Boolean) as string[])).sort()],
    [items]
  );

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch = !normalizedSearch
        || item.name?.toLowerCase().includes(normalizedSearch)
        || item.category?.toLowerCase().includes(normalizedSearch);
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const hasLogo = Boolean(item.logo_url);
      const matchesLogo = logoFilter === 'all'
        || (logoFilter === 'with-logo' && hasLogo)
        || (logoFilter === 'without-logo' && !hasLogo);

      return matchesSearch && matchesCategory && matchesLogo;
    });
  }, [items, searchTerm, categoryFilter, logoFilter]);

  const activeItem = activeId === 'new' ? undefined : items.find((item) => item.id === activeId);
  const selectItem = (id: string) => { if (id === activeId) return; if (isDirty) return setPendingId(id); setActiveId(id); };
  return (
    <>
      <div className="grid min-h-[calc(100vh-9rem)] gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[1.35rem] border border-border bg-card shadow-sm lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:overflow-hidden">
          <div className="border-b border-border/70 p-5">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary/75">Clients Navigation</p>
            <h2 className="text-xl font-semibold text-foreground">Clients</h2>
            <button type="button" onClick={() => selectItem('new')} className={`mt-4 w-full rounded-xl border px-4 py-2.5 text-sm font-medium ${activeId === 'new' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-foreground hover:border-primary hover:text-primary'}`}>+ New Client</button>

            <div className="mt-4 space-y-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search clients..."
                className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
              />

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'All', value: 'all' as const },
                  { label: 'With Logo', value: 'with-logo' as const },
                  { label: 'No Logo', value: 'without-logo' as const },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLogoFilter(option.value)}
                    className={`rounded-xl border px-2 py-2 text-xs font-medium transition-colors ${
                      logoFilter === option.value
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-foreground hover:border-primary hover:text-primary'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="max-h-[420px] overflow-y-auto p-3 lg:max-h-[calc(100vh-18rem)]">
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <button key={item.id} type="button" onClick={() => selectItem(item.id)} className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left ${item.id === activeId ? 'border-primary bg-primary/8 shadow-sm' : 'border-transparent hover:border-border hover:bg-background'}`}>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{item.name || 'Untitled client'}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                      <span className={`inline-flex h-2.5 w-2.5 rounded-full ${item.is_published ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="truncate text-muted-foreground">{item.is_published ? 'Published' : 'Draft'}</span>
                      <span className={`inline-flex rounded-full px-2 py-0.5 ${item.logo_url ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'}`}>
                        {item.logo_url ? 'Logo' : 'No Logo'}
                      </span>
                    </div>
                    {item.category && (
                      <div className="mt-1 truncate text-[11px] text-muted-foreground">
                        {item.category}
                      </div>
                    )}
                  </div>
                </button>
              ))}

              {filteredItems.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                  No clients match the current filters.
                </div>
              )}
            </div>
          </div>
        </aside>
        <div className="lg:sticky lg:top-24"><ClientEditor key={activeItem?.id ?? 'new'} item={activeItem} upsertAction={upsertAction} deleteAction={deleteAction} onDirtyChange={setIsDirty} onSaved={() => {}} /></div>
      </div>
      {pendingId !== null && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-[1.35rem] border border-border bg-card p-6 shadow-xl"><p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary/75">Unsaved Changes</p><h3 className="text-xl font-semibold text-foreground">Leave without saving?</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">You have unsaved changes in this client. If you continue, those edits will be lost.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setPendingId(null)} className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground">Stay Here</button><button type="button" onClick={() => { setActiveId(pendingId); setPendingId(null); setIsDirty(false); }} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Discard Changes</button></div></div></div>}
    </>
  );
}
