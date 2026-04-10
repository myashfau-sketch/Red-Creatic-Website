'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { GalleryItemRecord } from '../../../../types/database';
import { createSupabaseBrowserClient } from '../../../../lib/supabase/client';

const GALLERY_BUCKET = 'gallery-images';

interface AdminGalleryManagerProps {
  items: GalleryItemRecord[];
  serviceOptions: string[];
  productOptions: string[];
  upsertAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}

interface GalleryEditorProps {
  item?: GalleryItemRecord;
  serviceOptions: string[];
  productOptions: string[];
  upsertAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  onSaved: () => void;
  onDirtyChange: (isDirty: boolean) => void;
}

function TagSelector({
  legend,
  name,
  options,
  selectedValues,
  onAdd,
  onRemove,
}: {
  legend: string;
  name: string;
  options: string[];
  selectedValues: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const availableOptions = options.filter((option) => !selectedValues.includes(option));
  const filteredOptions = availableOptions.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase().trim())
  );

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-foreground">{legend}</legend>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-left text-sm text-foreground transition-colors hover:border-primary"
        >
          <span>{selectedValues.length === 0 ? `Select ${legend.toLowerCase()}` : `${selectedValues.length} selected`}</span>
          <span className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
        </button>

        {isOpen && (
          <div className="space-y-3 rounded-xl border border-border bg-card p-3">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
              placeholder={`Search ${legend.toLowerCase()}`}
            />
            <div className="max-h-56 overflow-y-auto space-y-2">
              {filteredOptions.length === 0 ? (
                <p className="px-1 text-xs text-muted-foreground">No matching options found.</p>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onAdd(option);
                      setQuery('');
                    }}
                    className="flex w-full items-center justify-between rounded-lg border border-border/70 bg-background px-3 py-2 text-left text-sm text-foreground transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    <span className="min-w-0 flex-1">{option}</span>
                    <span className="text-primary">Add</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {selectedValues.length === 0 ? (
            <p className="text-xs text-muted-foreground">No {legend.toLowerCase()} selected yet.</p>
          ) : (
            selectedValues.map((value) => (
              <div
                key={value}
                className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-3 py-2 text-xs text-foreground"
              >
                <input type="hidden" name={name} value={value} />
                <span>{value}</span>
                <button
                  type="button"
                  onClick={() => onRemove(value)}
                  className="text-primary transition-colors hover:text-primary/70"
                  aria-label={`Remove ${value}`}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </fieldset>
  );
}

function GalleryEditor({
  item,
  serviceOptions,
  productOptions,
  upsertAction,
  deleteAction,
  onSaved,
  onDirtyChange,
}: GalleryEditorProps) {
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedServiceTags, setSelectedServiceTags] = useState<string[]>(item?.service_tags ?? []);
  const [selectedProductTags, setSelectedProductTags] = useState<string[]>(item?.product_tags ?? []);
  const isNew = !item;
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();

  useEffect(() => {
    setImageUrl(item?.image_url ?? '');
    setSelectedFile(null);
    setUploadError(null);
    setSelectedServiceTags(item?.service_tags ?? []);
    setSelectedProductTags(item?.product_tags ?? []);
  }, [item]);

  useEffect(() => {
    onDirtyChange(false);
  }, [item, onDirtyChange]);

  const addTag = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    onDirtyChange(true);
    setter((current) =>
      current.includes(value) ? current : [...current, value]
    );
  };

  const removeTag = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    onDirtyChange(true);
    setter((current) => current.filter((entry) => entry !== value));
  };

  const uploadSelectedFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    const fileExt = selectedFile.name.split('.').pop();
    const safeName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
    const filePath = `gallery/${Date.now()}-${safeName || `image.${fileExt || 'jpg'}`}`;

    const { error } = await supabase.storage
      .from(GALLERY_BUCKET)
      .upload(filePath, selectedFile, {
        cacheControl: '31536000',
        upsert: false,
      });

    if (error) {
      setUploadError(error.message);
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(filePath);
    setImageUrl(data.publicUrl);
    setSelectedFile(null);
    setIsUploading(false);
    return data.publicUrl;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploadError(null);
    setIsSaving(true);
    const formElement = event.currentTarget;

    try {
      let finalImageUrl = imageUrl;

      if (selectedFile) {
        const uploadedUrl = await uploadSelectedFile();
        if (!uploadedUrl) {
          throw new Error('Image upload failed before the gallery item could be saved.');
        }
        finalImageUrl = uploadedUrl;
      }

      if (!finalImageUrl) {
        throw new Error('Please upload an image or paste an image URL before saving.');
      }

      const formData = new FormData(formElement);
      formData.set('image_url', finalImageUrl);

      await upsertAction(formData);
      router.refresh();
      onDirtyChange(false);
      onSaved();

      if (isNew) {
        formElement.reset();
        setImageUrl('');
        setSelectedFile(null);
        setSelectedServiceTags([]);
        setSelectedProductTags([]);
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to save gallery item.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item?.id) return;
    setUploadError(null);
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.set('id', item.id);
      await deleteAction(formData);
      router.refresh();
      onDirtyChange(false);
      onSaved();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to delete gallery item.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-11rem)] rounded-[1.35rem] border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="mb-5 flex flex-col gap-2 border-b border-border/70 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary/75">
            {isNew ? 'New Gallery Item' : 'Gallery Details'}
          </p>
          <h2 className="text-[1.7rem] font-semibold text-foreground">
            {item?.title || item?.alt_text || 'Create a new gallery item'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Update the item details here while using the left panel to move through your existing gallery entries.
          </p>
        </div>

        {!isNew && item?.created_at && (
          <div className="rounded-full bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
            {new Date(item.created_at).toLocaleDateString()}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {item?.id && <input type="hidden" name="id" value={item.id} />}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Title</span>
              <input
                type="text"
                name="title"
                defaultValue={item?.title ?? ''}
                onChange={() => onDirtyChange(true)}
                className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Image URL</span>
              <input
                type="url"
                name="image_url"
                value={imageUrl}
                onChange={(event) => {
                  setImageUrl(event.target.value);
                  onDirtyChange(true);
                }}
                className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
                placeholder="Auto-filled after upload, or paste an image URL"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Alt Text</span>
              <textarea
                name="alt_text"
                defaultValue={item?.alt_text ?? ''}
                rows={4}
                onChange={() => onDirtyChange(true)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Search Attributes</span>
              <textarea
                name="search_attributes"
                defaultValue={(item?.search_attributes ?? []).join('\n')}
                rows={4}
                onChange={() => onDirtyChange(true)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                placeholder={'One attribute per line, for example:\nwood award\nred acrylic\ncorporate gifting'}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                These internal keywords are for future AI-style matching and search. They do not need to be shown publicly.
              </p>
            </label>

            <div className="grid gap-5 xl:grid-cols-2">
              <TagSelector
                legend="Service Tags"
                name="service_tags"
                options={serviceOptions}
                selectedValues={selectedServiceTags}
                onAdd={(value) => addTag(value, setSelectedServiceTags)}
                onRemove={(value) => removeTag(value, setSelectedServiceTags)}
              />
              <TagSelector
                legend="Product Tags"
                name="product_tags"
                options={productOptions}
                selectedValues={selectedProductTags}
                onAdd={(value) => addTag(value, setSelectedProductTags)}
                onRemove={(value) => removeTag(value, setSelectedProductTags)}
              />
            </div>

          </div>

          <div className="space-y-4">
            <div className="rounded-[1.1rem] border border-border bg-background/70 p-4">
              <div className="flex flex-col gap-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">Upload Image</span>
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
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Uploads use the Supabase bucket <code>{GALLERY_BUCKET}</code>. After upload,
                the public image URL is filled in automatically.
              </p>
              {uploadError && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-300">{uploadError}</p>
              )}
            </div>

            <div className="overflow-hidden rounded-[1.1rem] border border-border bg-card">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={item?.alt_text ?? 'Gallery upload preview'} className="h-[300px] w-full bg-surface object-contain" />
              ) : (
                <div className="flex h-[300px] items-center justify-center bg-surface text-sm text-muted-foreground">
                  Image preview will appear here
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-border/70 pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-3 rounded-xl border border-border px-4 py-2 text-sm text-foreground">
              <input
                type="checkbox"
                name="is_published"
                defaultChecked={item?.is_published ?? true}
                onChange={() => onDirtyChange(true)}
              />
              <span>Published</span>
            </label>

            {!isNew && item && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || isSaving || isUploading}
                className="rounded-xl border border-red-300 px-5 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-950/40"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            )}

            <button
              type="submit"
              disabled={isSaving || isUploading || isDeleting}
              className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? 'Saving...' : isNew ? 'Create Item' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function AdminGalleryManager({
  items,
  serviceOptions,
  productOptions,
  upsertAction,
  deleteAction,
}: AdminGalleryManagerProps) {
  const [activeId, setActiveId] = useState<string>('new');
  const [isDirty, setIsDirty] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    if (activeId === 'new') return;
    const stillExists = items.some((item) => item.id === activeId);
    if (!stillExists) {
      setActiveId(items[0]?.id ?? 'new');
    }
  }, [activeId, items]);

  const activeItem = activeId === 'new'
    ? undefined
    : items.find((item) => item.id === activeId);

  const handleSelectItem = (nextId: string) => {
    if (nextId === activeId) return;

    if (isDirty) {
      setPendingId(nextId);
      return;
    }

    setActiveId(nextId);
  };

  return (
    <>
      <div className="grid min-h-[calc(100vh-9rem)] gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[1.35rem] border border-border bg-card shadow-sm lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:overflow-hidden">
          <div className="border-b border-border/70 p-5">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary/75">
              Gallery Navigation
            </p>
            <h2 className="text-xl font-semibold text-foreground">Items</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Select an item to edit, or create a fresh one.
            </p>

            <button
              type="button"
              onClick={() => handleSelectItem('new')}
              className={`mt-4 w-full rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                activeId === 'new'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-foreground hover:border-primary hover:text-primary'
              }`}
            >
              + New Gallery Item
            </button>
          </div>

          <div className="max-h-[420px] overflow-y-auto p-3 lg:max-h-[calc(100vh-18rem)]">
            <div className="space-y-2">
              {items.map((item) => {
                const isActive = item.id === activeId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectItem(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-all ${
                      isActive
                        ? 'border-primary bg-primary/8 shadow-sm'
                        : 'border-transparent hover:border-border hover:bg-background'
                    }`}
                  >
                    <div className="h-12 w-12 overflow-hidden rounded-xl bg-surface shrink-0">
                      {item.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image_url} alt={item.alt_text ?? item.title ?? 'Gallery thumbnail'} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {item.title || item.alt_text || 'Untitled item'}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs">
                        <span
                          className={`inline-flex h-2.5 w-2.5 rounded-full ${
                            item.is_published ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span className="truncate text-muted-foreground">
                          {item.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="lg:sticky lg:top-24">
          <GalleryEditor
            key={activeItem?.id ?? 'new'}
            item={activeItem}
            serviceOptions={serviceOptions}
            productOptions={productOptions}
            upsertAction={upsertAction}
            deleteAction={deleteAction}
            onSaved={() => {
              if (!activeItem) {
                setActiveId('new');
              }
            }}
            onDirtyChange={setIsDirty}
          />
        </div>
      </div>

      {pendingId !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[1.35rem] border border-border bg-card p-6 shadow-xl">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary/75">
              Unsaved Changes
            </p>
            <h3 className="text-xl font-semibold text-foreground">
              Leave without saving?
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              You have unsaved changes in this gallery item. If you continue, those edits will be lost.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingId(null)}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Stay Here
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveId(pendingId);
                  setPendingId(null);
                  setIsDirty(false);
                }}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
