'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProductRecord } from '../../../../types/database';
import { createSupabaseBrowserClient } from '../../../../lib/supabase/client';

const PRODUCT_IMAGE_BUCKET = 'gallery-images';

interface AdminProductsManagerProps {
  items: ProductRecord[];
  upsertAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}

type ProductGalleryImage = {
  src: string;
  alt: string;
};

function buildGalleryAlt(name: string, index?: number) {
  const base = name.trim() || 'Product gallery image';
  return typeof index === 'number' ? `${base} ${index + 1}` : base;
}

function serializeGalleryImages(images: ProductGalleryImage[]) {
  return images.map((image) => `${image.src} | ${image.alt}`).join('\n');
}

function normalizeGalleryImages(images: ProductRecord['gallery_images'], name: string) {
  return (images ?? []).map((image, index) => ({
    src: image.src,
    alt: image.alt?.trim() || buildGalleryAlt(name, index),
  }));
}

function ProductEditor({
  item,
  categoryOptions,
  upsertAction,
  deleteAction,
  onDirtyChange,
  onSaved,
}: {
  item?: ProductRecord;
  categoryOptions: string[];
  upsertAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  onDirtyChange: (dirty: boolean) => void;
  onSaved: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(item?.category ?? '');
  const [customCategory, setCustomCategory] = useState('');
  const [productName, setProductName] = useState(item?.name ?? '');
  const [imageUrl, setImageUrl] = useState(item?.main_image_url ?? '');
  const [galleryImages, setGalleryImages] = useState<ProductGalleryImage[]>(normalizeGalleryImages(item?.gallery_images ?? null, item?.name ?? ''));
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [pendingGalleryImageUrl, setPendingGalleryImageUrl] = useState('');
  const [isImageUrlEditorOpen, setIsImageUrlEditorOpen] = useState(false);
  const [isGalleryUrlsEditorOpen, setIsGalleryUrlsEditorOpen] = useState(false);
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const isNew = !item;
  const isUsingCustomCategory = selectedCategory === '__custom__';

  useEffect(() => {
    const nextName = item?.name ?? '';
    setSelectedCategory(item?.category ?? '');
    setCustomCategory('');
    setProductName(nextName);
    setImageUrl(item?.main_image_url ?? '');
    setGalleryImages(normalizeGalleryImages(item?.gallery_images ?? null, nextName));
    setSelectedImageFiles([]);
    setPendingGalleryImageUrl('');
    setError(null);
    onDirtyChange(false);
  }, [item, onDirtyChange]);

  const mainImageOptions = useMemo(
    () =>
      Array.from(
        new Map(
          [imageUrl ? { src: imageUrl, alt: item?.main_image_alt ?? buildGalleryAlt(productName) } : null, ...galleryImages]
            .filter((entry): entry is ProductGalleryImage => Boolean(entry?.src))
            .map((entry) => [entry.src, entry])
        ).values()
      ),
    [galleryImages, imageUrl, item?.main_image_alt, productName]
  );

  const uploadSelectedImages = async () => {
    if (selectedImageFiles.length === 0) return [];

    setIsUploadingImage(true);
    setError(null);

    const uploadedImages: ProductGalleryImage[] = [];

    for (const [index, selectedImageFile] of selectedImageFiles.entries()) {
      const safeName = selectedImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
      const filePath = `products/${Date.now()}-${index}-${safeName || 'product-image.jpg'}`;

      const { error: uploadError } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).upload(filePath, selectedImageFile, {
        cacheControl: '31536000',
        upsert: false,
      });

      if (uploadError) {
        setError(uploadError.message);
        setIsUploadingImage(false);
        return [];
      }

      const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(filePath);
      uploadedImages.push({
        src: data.publicUrl,
        alt: buildGalleryAlt(productName, galleryImages.length + index),
      });
    }

    setGalleryImages((current) => {
      const nextImages = [...current];
      uploadedImages.forEach((image) => {
        if (!nextImages.some((entry) => entry.src === image.src)) {
          nextImages.push(image);
        }
      });
      return nextImages;
    });
    setImageUrl((current) => current || uploadedImages[0]?.src || current);
    setSelectedImageFiles([]);
    setIsUploadingImage(false);
    return uploadedImages;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);
    const formElement = event.currentTarget;

    try {
      let finalImageUrl = imageUrl;
      let finalGalleryImages = [...galleryImages];

      if (selectedImageFiles.length > 0) {
        const uploadedImages = await uploadSelectedImages();
        if (uploadedImages.length === 0) {
          throw new Error('Product image upload failed before the product could be saved.');
        }
        uploadedImages.forEach((uploadedImage) => {
          if (!finalGalleryImages.some((image) => image.src === uploadedImage.src)) {
            finalGalleryImages.push(uploadedImage);
          }
        });
        finalImageUrl = finalImageUrl || uploadedImages[0]?.src || finalImageUrl;
      }

      const formData = new FormData(formElement);
      const finalCategory = isUsingCustomCategory ? customCategory.trim() : selectedCategory.trim();
      formData.set('category', finalCategory);
      formData.set('main_image_url', finalImageUrl);
      formData.set('main_image_alt', item?.main_image_alt ?? buildGalleryAlt(productName));
      formData.set('gallery_images', serializeGalleryImages(finalGalleryImages));

      await upsertAction(formData);
      router.refresh();
      onDirtyChange(false);
      onSaved();

      if (isNew) {
        formElement.reset();
        setSelectedCategory('');
        setCustomCategory('');
        setProductName('');
        setImageUrl('');
        setGalleryImages([]);
        setPendingGalleryImageUrl('');
        setSelectedImageFiles([]);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save product.');
    } finally {
      setIsSaving(false);
    }
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
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-11rem)] rounded-[1.35rem] border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="mb-5 border-b border-border/70 pb-5">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary/75">{isNew ? 'New Product' : 'Product Details'}</p>
        <h2 className="text-[1.7rem] font-semibold text-foreground">{item?.name || 'Create a new product'}</h2>
      </div>

      <form onSubmit={handleSubmit} onChangeCapture={() => onDirtyChange(true)} className="space-y-5">
        {item?.id && <input type="hidden" name="id" value={item.id} />}
        <input type="hidden" name="category" value={isUsingCustomCategory ? customCategory.trim() : selectedCategory} />
        <input type="hidden" name="gallery_images" value={serializeGalleryImages(galleryImages)} />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <div className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">Name</span>
                <input
                  type="text"
                  name="name"
                  value={productName}
                  onChange={(event) => setProductName(event.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
                />
              </label>

              <div className="space-y-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">Category</span>
                  <select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
                  >
                    <option value="">Select a category</option>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                    <option value="__custom__">Add new category</option>
                  </select>
                </label>

                {isUsingCustomCategory && (
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-foreground">New Category Name</span>
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(event) => setCustomCategory(event.target.value)}
                      className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
                      placeholder="Type a new category name"
                    />
                  </label>
                )}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Description</span>
              <textarea
                name="description"
                defaultValue={item?.description ?? ''}
                rows={5}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </label>

            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setIsImageUrlEditorOpen(true)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-left text-sm transition-colors hover:border-primary hover:text-primary"
              >
                <span className="block text-xs uppercase tracking-[0.18em] text-primary/70">Main Image URL</span>
                <span className="mt-1 block text-sm text-foreground/75">
                  {imageUrl ? 'View or edit linked main image URL' : 'Add main image URL'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setIsGalleryUrlsEditorOpen(true)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-left text-sm transition-colors hover:border-primary hover:text-primary"
              >
                <span className="block text-xs uppercase tracking-[0.18em] text-primary/70">Gallery Image URLs</span>
                <span className="mt-1 block text-sm text-foreground/75">
                  {galleryImages.length > 0 ? `${galleryImages.length} image URL${galleryImages.length === 1 ? '' : 's'} added` : 'Add gallery image URLs'}
                </span>
              </button>
            </div>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-foreground">Main Image Selection</legend>
              {mainImageOptions.length > 0 ? (
                <div className="grid gap-3 rounded-xl border border-border bg-background p-3 sm:grid-cols-2 xl:grid-cols-3">
                  {mainImageOptions.map((option) => (
                    <label
                      key={option.src}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm transition-colors ${
                        imageUrl === option.src ? 'border-primary bg-primary/8' : 'border-border bg-card hover:border-primary/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="main_image_choice"
                        checked={imageUrl === option.src}
                        onChange={() => {
                          setImageUrl(option.src);
                          onDirtyChange(true);
                        }}
                        className="mt-1"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="relative h-24 overflow-hidden rounded-lg bg-surface">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={option.src} alt={option.alt} className="h-full w-full object-cover" />
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Upload or add gallery images first, then choose one as the main image.</p>
              )}
            </fieldset>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.1rem] border border-border bg-background/70 p-4">
              <div className="flex flex-col gap-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">Upload Product Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => {
                      setSelectedImageFiles(Array.from(event.target.files ?? []));
                      onDirtyChange(true);
                    }}
                    className="block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary"
                  />
                </label>
                {selectedImageFiles.length > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    {selectedImageFiles.length} image{selectedImageFiles.length === 1 ? '' : 's'} selected and ready to add to the product gallery.
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={uploadSelectedImages}
                  disabled={selectedImageFiles.length === 0 || isUploadingImage || isSaving}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploadingImage ? 'Uploading...' : selectedImageFiles.length > 1 ? 'Upload Images' : 'Upload Image'}
                </button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Uploads use <code>{PRODUCT_IMAGE_BUCKET}</code>.
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.1rem] border border-border bg-card">
              {imageUrl ? (
                <div className="space-y-4 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={item?.name ?? 'Product preview'}
                    className="h-[220px] w-full rounded-xl bg-surface object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-[220px] items-center justify-center bg-surface text-sm text-muted-foreground">
                  Upload or paste a product image to preview it here
                </div>
              )}
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-300">{error}</p>}

        <div className="flex justify-end border-t border-border/70 pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-3 rounded-xl border border-border px-4 py-2 text-sm text-foreground">
              <input type="checkbox" name="is_published" defaultChecked={item?.is_published ?? true} />
              <span>Published</span>
            </label>
            {!isNew && item && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || isSaving || isUploadingImage}
                className="rounded-xl border border-red-300 px-5 py-2 text-sm font-medium text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
            <button
              type="submit"
              disabled={isSaving || isDeleting || isUploadingImage}
              className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
            >
              {isSaving ? 'Saving...' : isNew ? 'Create Product' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>

      {isImageUrlEditorOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[1.35rem] border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary/75">Product Utility</p>
                <h3 className="mt-2 text-xl font-semibold text-foreground">Main Image URL</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsImageUrlEditorOpen(false)}
                className="rounded-full border border-border p-2 text-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Close main image URL editor"
              >
                ×
              </button>
            </div>
            <div className="mt-5 space-y-3">
              <input
                type="url"
                value={imageUrl}
                onChange={(event) => {
                  setImageUrl(event.target.value);
                  onDirtyChange(true);
                }}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
                placeholder="Paste or edit the main image URL"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsImageUrlEditorOpen(false)}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isGalleryUrlsEditorOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[1.35rem] border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary/75">Product Utility</p>
                <h3 className="mt-2 text-xl font-semibold text-foreground">Gallery Image URLs</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGalleryUrlsEditorOpen(false)}
                className="rounded-full border border-border p-2 text-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Close gallery URLs editor"
              >
                ×
              </button>
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={pendingGalleryImageUrl}
                  onKeyDown={(event) => {
                    event.stopPropagation();
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      const nextUrl = pendingGalleryImageUrl.trim();
                      if (!nextUrl) return;
                      setGalleryImages((current) =>
                        current.some((image) => image.src === nextUrl)
                          ? current
                          : [...current, { src: nextUrl, alt: buildGalleryAlt(productName, current.length) }]
                      );
                      setPendingGalleryImageUrl('');
                      onDirtyChange(true);
                    }
                  }}
                  onChange={(event) => setPendingGalleryImageUrl(event.target.value)}
                  className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
                  placeholder="Paste one image URL"
                />
                <button
                  type="button"
                  onClick={() => {
                    const nextUrl = pendingGalleryImageUrl.trim();
                    if (!nextUrl) return;
                    setGalleryImages((current) =>
                      current.some((image) => image.src === nextUrl)
                        ? current
                        : [...current, { src: nextUrl, alt: buildGalleryAlt(productName, current.length) }]
                    );
                    setPendingGalleryImageUrl('');
                    onDirtyChange(true);
                  }}
                  disabled={!pendingGalleryImageUrl.trim()}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add URL
                </button>
              </div>
              <div className="max-h-[28rem] overflow-y-auto rounded-xl border border-border bg-background p-3">
                {galleryImages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No gallery image URLs added yet.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {galleryImages.map((image, index) => (
                      <div key={`${image.src}-${index}`} className="rounded-xl border border-border/60 bg-card p-3">
                        <div className="relative h-24 overflow-hidden rounded-lg border border-border/60 bg-surface">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-primary">Image {index + 1}</span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(image.src);
                                } catch {
                                  // Ignore clipboard errors.
                                }
                              }}
                              className="text-xs font-medium text-foreground transition-colors hover:text-primary"
                            >
                              Copy URL
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setGalleryImages((current) => current.filter((entry) => entry.src !== image.src));
                                onDirtyChange(true);
                              }}
                              className="text-xs font-medium text-primary transition-colors hover:text-primary/70"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsGalleryUrlsEditorOpen(false)}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsManager({ items, upsertAction, deleteAction }: AdminProductsManagerProps) {
  const [activeId, setActiveId] = useState<string>('new');
  const [isDirty, setIsDirty] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (activeId !== 'new' && !items.some((item) => item.id === activeId)) setActiveId(items[0]?.id ?? 'new');
  }, [activeId, items]);

  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Set(
          items
            .map((item) => item.category)
            .filter((category): category is string => Boolean(category))
        )
      ).sort(),
    [items]
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) return items;

    return items.filter((item) => {
      const name = item.name?.toLowerCase() ?? '';
      const category = item.category?.toLowerCase() ?? '';

      return name.includes(normalizedQuery) || category.includes(normalizedQuery);
    });
  }, [items, searchQuery]);

  const activeItem = activeId === 'new' ? undefined : items.find((item) => item.id === activeId);
  const selectItem = (id: string) => {
    if (id === activeId) return;
    if (isDirty) return setPendingId(id);
    setActiveId(id);
  };

  return (
    <>
      <div className="grid min-h-[calc(100vh-9rem)] gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[1.35rem] border border-border bg-card shadow-sm lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:overflow-hidden">
          <div className="border-b border-border/70 p-5">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary/75">Products Navigation</p>
            <h2 className="text-xl font-semibold text-foreground">Products</h2>
            <label className="mt-4 block">
              <span className="sr-only">Search products</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search products..."
                className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </label>
            <button
              type="button"
              onClick={() => selectItem('new')}
              className={`mt-4 w-full rounded-xl border px-4 py-2.5 text-sm font-medium ${
                activeId === 'new'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-foreground hover:border-primary hover:text-primary'
              }`}
            >
              + New Product
            </button>
          </div>
          <div className="max-h-[420px] overflow-y-auto p-3 lg:max-h-[calc(100vh-18rem)]">
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectItem(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left ${
                    item.id === activeId ? 'border-primary bg-primary/8 shadow-sm' : 'border-transparent hover:border-border hover:bg-background'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{item.name || 'Untitled product'}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <span className={`inline-flex h-2.5 w-2.5 rounded-full ${item.is_published ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="truncate text-muted-foreground">{item.is_published ? 'Published' : 'Draft'}</span>
                      {item.category ? <span className="truncate rounded-full bg-primary/10 px-2 py-0.5 text-primary">{item.category}</span> : null}
                    </div>
                  </div>
                </button>
              ))}
              {filteredItems.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                  No products match your search.
                </div>
              ) : null}
            </div>
          </div>
        </aside>

        <div className="lg:sticky lg:top-24">
          <ProductEditor
            key={activeItem?.id ?? 'new'}
            item={activeItem}
            categoryOptions={categoryOptions}
            upsertAction={upsertAction}
            deleteAction={deleteAction}
            onDirtyChange={setIsDirty}
            onSaved={() => {}}
          />
        </div>
      </div>

      {pendingId !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[1.35rem] border border-border bg-card p-6 shadow-xl">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary/75">Unsaved Changes</p>
            <h3 className="text-xl font-semibold text-foreground">Leave without saving?</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">You have unsaved changes in this product. If you continue, those edits will be lost.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setPendingId(null)} className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground">
                Stay Here
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveId(pendingId);
                  setPendingId(null);
                  setIsDirty(false);
                }}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
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
