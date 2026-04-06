'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProductRecord } from '../../../../types/database';

interface AdminProductsManagerProps {
  items: ProductRecord[];
  upsertAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}

function galleryImagesToText(images: ProductRecord['gallery_images']) {
  return (images ?? []).map((image) => `${image.src} | ${image.alt}`).join('\n');
}

function ProductEditor({ item, upsertAction, deleteAction, onDirtyChange, onSaved }: { item?: ProductRecord; upsertAction: (formData: FormData) => Promise<void>; deleteAction: (formData: FormData) => Promise<void>; onDirtyChange: (dirty: boolean) => void; onSaved: () => void; }) {
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const isNew = !item;

  useEffect(() => { onDirtyChange(false); }, [item, onDirtyChange]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);
    const formElement = event.currentTarget;
    try {
      await upsertAction(new FormData(formElement));
      router.refresh();
      onDirtyChange(false);
      onSaved();
      if (isNew) formElement.reset();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save product.');
    } finally { setIsSaving(false); }
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
      setError(submitError instanceof Error ? submitError.message : 'Failed to delete product.');
    } finally { setIsDeleting(false); }
  };

  return (
    <div className="min-h-[calc(100vh-11rem)] rounded-[1.35rem] border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="mb-5 border-b border-border/70 pb-5"><p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary/75">{isNew ? 'New Product' : 'Product Details'}</p><h2 className="text-[1.7rem] font-semibold text-foreground">{item?.name || 'Create a new product'}</h2></div>
      <form onSubmit={handleSubmit} onChangeCapture={() => onDirtyChange(true)} className="space-y-5">
        {item?.id && <input type="hidden" name="id" value={item.id} />}
        <label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Name</span><input type="text" name="name" defaultValue={item?.name ?? ''} className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary" /></label>
        <label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Description</span><textarea name="description" defaultValue={item?.description ?? ''} rows={5} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" /></label>
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Main Image URL</span><input type="url" name="main_image_url" defaultValue={item?.main_image_url ?? ''} className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary" /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Main Image Alt</span><input type="text" name="main_image_alt" defaultValue={item?.main_image_alt ?? ''} className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary" /></label>
        </div>
        <label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Gallery Images</span><textarea name="gallery_images" defaultValue={galleryImagesToText(item?.gallery_images ?? null)} rows={8} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" placeholder="One image per line: https://... | Alt text" /></label>
        {error && <p className="text-sm text-red-600 dark:text-red-300">{error}</p>}
        <div className="flex justify-end border-t border-border/70 pt-4"><div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-3 rounded-xl border border-border px-4 py-2 text-sm text-foreground"><input type="checkbox" name="is_published" defaultChecked={item?.is_published ?? true} /><span>Published</span></label>
          {!isNew && item && <button type="button" onClick={handleDelete} disabled={isDeleting || isSaving} className="rounded-xl border border-red-300 px-5 py-2 text-sm font-medium text-red-700 disabled:cursor-not-allowed disabled:opacity-60">{isDeleting ? 'Deleting...' : 'Delete'}</button>}
          <button type="submit" disabled={isSaving || isDeleting} className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">{isSaving ? 'Saving...' : isNew ? 'Create Product' : 'Save Changes'}</button>
        </div></div>
      </form>
    </div>
  );
}

export default function AdminProductsManager({ items, upsertAction, deleteAction }: AdminProductsManagerProps) {
  const [activeId, setActiveId] = useState<string>('new');
  const [isDirty, setIsDirty] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  useEffect(() => { if (activeId !== 'new' && !items.some((item) => item.id === activeId)) setActiveId(items[0]?.id ?? 'new'); }, [activeId, items]);
  const activeItem = activeId === 'new' ? undefined : items.find((item) => item.id === activeId);
  const selectItem = (id: string) => { if (id === activeId) return; if (isDirty) return setPendingId(id); setActiveId(id); };

  return (
    <>
      <div className="grid min-h-[calc(100vh-9rem)] gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[1.35rem] border border-border bg-card shadow-sm lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:overflow-hidden">
          <div className="border-b border-border/70 p-5"><p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary/75">Products Navigation</p><h2 className="text-xl font-semibold text-foreground">Products</h2><button type="button" onClick={() => selectItem('new')} className={`mt-4 w-full rounded-xl border px-4 py-2.5 text-sm font-medium ${activeId === 'new' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-foreground hover:border-primary hover:text-primary'}`}>+ New Product</button></div>
          <div className="max-h-[420px] overflow-y-auto p-3 lg:max-h-[calc(100vh-18rem)]"><div className="space-y-2">{items.map((item) => <button key={item.id} type="button" onClick={() => selectItem(item.id)} className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left ${item.id === activeId ? 'border-primary bg-primary/8 shadow-sm' : 'border-transparent hover:border-border hover:bg-background'}`}><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-foreground">{item.name || 'Untitled product'}</p><div className="mt-1 flex items-center gap-2 text-xs"><span className={`inline-flex h-2.5 w-2.5 rounded-full ${item.is_published ? 'bg-emerald-500' : 'bg-amber-500'}`} /><span className="truncate text-muted-foreground">{item.is_published ? 'Published' : 'Draft'}</span></div></div></button>)}</div></div>
        </aside>
        <div className="lg:sticky lg:top-24"><ProductEditor key={activeItem?.id ?? 'new'} item={activeItem} upsertAction={upsertAction} deleteAction={deleteAction} onDirtyChange={setIsDirty} onSaved={() => {}} /></div>
      </div>
      {pendingId !== null && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-[1.35rem] border border-border bg-card p-6 shadow-xl"><p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary/75">Unsaved Changes</p><h3 className="text-xl font-semibold text-foreground">Leave without saving?</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">You have unsaved changes in this product. If you continue, those edits will be lost.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setPendingId(null)} className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground">Stay Here</button><button type="button" onClick={() => { setActiveId(pendingId); setPendingId(null); setIsDirty(false); }} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Discard Changes</button></div></div></div>}
    </>
  );
}
