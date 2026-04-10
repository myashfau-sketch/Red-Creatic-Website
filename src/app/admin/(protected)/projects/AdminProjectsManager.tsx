'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProjectRecord } from '../../../../types/database';
import { createSupabaseBrowserClient } from '../../../../lib/supabase/client';

const PROJECT_HTML_BUCKET = 'project-pages';
const PROJECT_IMAGE_BUCKET = 'gallery-images';

interface AdminProjectsManagerProps {
  items: ProjectRecord[];
  serviceOptions: string[];
  productOptions: string[];
  upsertAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
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
  const [pendingValue, setPendingValue] = useState('');
  const availableOptions = options.filter((option) => !selectedValues.includes(option));

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-foreground">{legend}</legend>
      <div className="flex gap-2">
        <select
          value={pendingValue}
          onChange={(event) => setPendingValue(event.target.value)}
          className="h-10 flex-1 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
        >
          <option value="">Select {legend.toLowerCase()}</option>
          {availableOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            if (!pendingValue) return;
            onAdd(pendingValue);
            setPendingValue('');
          }}
          disabled={!pendingValue}
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add
        </button>
      </div>
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
    </fieldset>
  );
}

function ProjectEditor({
  item,
  serviceOptions,
  productOptions,
  upsertAction,
  deleteAction,
  onDirtyChange,
  onSaved,
}: {
  item?: ProjectRecord;
  serviceOptions: string[];
  productOptions: string[];
  upsertAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  onDirtyChange: (dirty: boolean) => void;
  onSaved: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? '');
  const [galleryImages, setGalleryImages] = useState<string[]>(item?.gallery_images ?? []);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [htmlUrl, setHtmlUrl] = useState(item?.detail_html_url ?? '');
  const [pendingGalleryImageUrl, setPendingGalleryImageUrl] = useState('');
  const [isImageUrlEditorOpen, setIsImageUrlEditorOpen] = useState(false);
  const [isHtmlUrlEditorOpen, setIsHtmlUrlEditorOpen] = useState(false);
  const [isGalleryUrlsEditorOpen, setIsGalleryUrlsEditorOpen] = useState(false);
  const [selectedServiceTags, setSelectedServiceTags] = useState<string[]>(item?.service_tags ?? []);
  const [selectedProductTags, setSelectedProductTags] = useState<string[]>(item?.product_tags ?? []);
  const [selectedHtmlFile, setSelectedHtmlFile] = useState<File | null>(null);
  const [isUploadingHtml, setIsUploadingHtml] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const isNew = !item;
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    setImageUrl(item?.image_url ?? '');
    setGalleryImages(item?.gallery_images ?? []);
    setSelectedImageFile(null);
    setHtmlUrl(item?.detail_html_url ?? '');
    setPendingGalleryImageUrl('');
    setSelectedServiceTags(item?.service_tags ?? []);
    setSelectedProductTags(item?.product_tags ?? []);
    setSelectedHtmlFile(null);
    setError(null);
    onDirtyChange(false);
  }, [item, onDirtyChange]);

  const mainImageOptions = useMemo(
    () => Array.from(new Set([imageUrl, ...galleryImages].filter(Boolean))),
    [galleryImages, imageUrl]
  );

  const addTag = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    onDirtyChange(true);
    setter((current) => (current.includes(value) ? current : [...current, value]));
  };

  const removeTag = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    onDirtyChange(true);
    setter((current) => current.filter((entry) => entry !== value));
  };

  const uploadSelectedHtml = async () => {
    if (!selectedHtmlFile) return null;

    setIsUploadingHtml(true);
    setError(null);

    const safeName = selectedHtmlFile.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
    const filePath = `projects/${Date.now()}-${safeName || 'detail.html'}`;

    const { error: uploadError } = await supabase.storage
      .from(PROJECT_HTML_BUCKET)
      .upload(filePath, selectedHtmlFile, {
        cacheControl: '31536000',
        contentType: 'text/html',
        upsert: false,
      });

    if (uploadError) {
      setError(uploadError.message);
      setIsUploadingHtml(false);
      return null;
    }

    const { data } = supabase.storage.from(PROJECT_HTML_BUCKET).getPublicUrl(filePath);
    setHtmlUrl(data.publicUrl);
    setSelectedHtmlFile(null);
    setIsUploadingHtml(false);
    return data.publicUrl;
  };

  const uploadSelectedImage = async () => {
    if (!selectedImageFile) return null;

    setIsUploadingImage(true);
    setError(null);

    const safeName = selectedImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
    const filePath = `projects/${Date.now()}-${safeName || 'project-image.jpg'}`;

    const { error: uploadError } = await supabase.storage
      .from(PROJECT_IMAGE_BUCKET)
      .upload(filePath, selectedImageFile, {
        cacheControl: '31536000',
        upsert: false,
      });

    if (uploadError) {
      setError(uploadError.message);
      setIsUploadingImage(false);
      return null;
    }

    const { data } = supabase.storage.from(PROJECT_IMAGE_BUCKET).getPublicUrl(filePath);
    setGalleryImages((current) =>
      current.includes(data.publicUrl) ? current : [...current, data.publicUrl]
    );
    setImageUrl((current) => current || data.publicUrl);
    setSelectedImageFile(null);
    setIsUploadingImage(false);
    return data.publicUrl;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);
    const formElement = event.currentTarget;

    try {
      let finalImageUrl = imageUrl;
      let finalGalleryImages = [...galleryImages];
      let finalHtmlUrl = htmlUrl;

      if (selectedImageFile) {
        const uploadedImageUrl = await uploadSelectedImage();
        if (!uploadedImageUrl) {
          throw new Error('Project image upload failed before the project could be saved.');
        }
        if (!finalGalleryImages.includes(uploadedImageUrl)) {
          finalGalleryImages = [...finalGalleryImages, uploadedImageUrl];
        }
        finalImageUrl = uploadedImageUrl;
      }

      if (selectedHtmlFile) {
        const uploadedUrl = await uploadSelectedHtml();
        if (!uploadedUrl) {
          throw new Error('HTML detail page upload failed before the project could be saved.');
        }
        finalHtmlUrl = uploadedUrl;
      }

      const formData = new FormData(formElement);
      formData.set('image_url', finalImageUrl);
      formData.set('gallery_images', finalGalleryImages.join('\n'));
      formData.set('detail_html_url', finalHtmlUrl);

      await upsertAction(formData);
      router.refresh();
      onDirtyChange(false);
      onSaved();

      if (isNew) {
        formElement.reset();
        setImageUrl('');
        setGalleryImages([]);
        setPendingGalleryImageUrl('');
        setSelectedImageFile(null);
        setHtmlUrl('');
        setSelectedHtmlFile(null);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save project.');
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
      setError(submitError instanceof Error ? submitError.message : 'Failed to delete project.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-11rem)] rounded-[1.35rem] border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="mb-5 border-b border-border/70 pb-5">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary/75">
          {isNew ? 'New Project' : 'Project Details'}
        </p>
        <h2 className="text-[1.7rem] font-semibold text-foreground">
          {item?.title || 'Create a new project'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} onChangeCapture={() => onDirtyChange(true)} className="space-y-5">
        {item?.id && <input type="hidden" name="id" value={item.id} />}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
          <div className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">Title</span>
                <input type="text" name="title" defaultValue={item?.title ?? ''} className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">Client Name</span>
                <input type="text" name="client_name" defaultValue={item?.client_name ?? ''} className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary" />
              </label>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">Location</span>
                <input type="text" name="location" defaultValue={item?.location ?? ''} className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">Completion Year</span>
                <input type="text" name="completion_year" defaultValue={item?.completion_year ?? ''} className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary" />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Description</span>
              <textarea name="description" defaultValue={item?.description ?? ''} rows={5} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
            </label>

            <div className="grid gap-3 md:grid-cols-3">
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
                onClick={() => setIsHtmlUrlEditorOpen(true)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-left text-sm transition-colors hover:border-primary hover:text-primary"
              >
                <span className="block text-xs uppercase tracking-[0.18em] text-primary/70">Project HTML Page URL</span>
                <span className="mt-1 block text-sm text-foreground/75">
                  {htmlUrl ? 'View or edit linked HTML page' : 'Add project HTML page URL'}
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
                      key={option}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm transition-colors ${
                        imageUrl === option
                          ? 'border-primary bg-primary/8'
                          : 'border-border bg-card hover:border-primary/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="main_image_choice"
                        checked={imageUrl === option}
                        onChange={() => {
                          setImageUrl(option);
                          onDirtyChange(true);
                        }}
                        className="mt-1"
                      />
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="relative h-24 overflow-hidden rounded-lg bg-surface">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={option} alt="Project image option" className="h-full w-full object-cover" />
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Upload or add gallery images first, then choose one as the main image.
                </p>
              )}
            </fieldset>

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
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-[1.1rem] border border-border bg-background/70 p-4">
                <div className="flex flex-col gap-3">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-foreground">Upload Project Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        setSelectedImageFile(event.target.files?.[0] ?? null);
                        onDirtyChange(true);
                      }}
                      className="block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={uploadSelectedImage}
                    disabled={!selectedImageFile || isUploadingImage || isSaving}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                  </button>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Uploads use <code>{PROJECT_IMAGE_BUCKET}</code>.
                </p>
              </div>

              <div className="rounded-[1.1rem] border border-border bg-background/70 p-4">
                <div className="flex flex-col gap-3">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-foreground">Upload Project HTML</span>
                    <input
                      type="file"
                      accept=".html,.htm,text/html"
                      onChange={(event) => {
                        setSelectedHtmlFile(event.target.files?.[0] ?? null);
                        onDirtyChange(true);
                      }}
                      className="block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={uploadSelectedHtml}
                    disabled={!selectedHtmlFile || isUploadingHtml || isSaving}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isUploadingHtml ? 'Uploading...' : 'Upload HTML Page'}
                  </button>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Uploads use <code>{PROJECT_HTML_BUCKET}</code>.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.1rem] border border-border bg-card">
              {imageUrl || htmlUrl ? (
                <div className="space-y-4 p-4">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={item?.title ?? 'Project preview'}
                      className="h-[200px] w-full rounded-xl bg-surface object-cover"
                    />
                  ) : null}
                  {htmlUrl ? (
                    <>
                      <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground">
                        HTML detail page linked and ready for the popup.
                      </div>
                      <a
                        href={htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        View Uploaded HTML Page
                        <span aria-hidden="true">↗</span>
                      </a>
                    </>
                  ) : null}
                </div>
              ) : (
                <div className="flex h-[220px] items-center justify-center bg-surface text-sm text-muted-foreground">
                  Upload or paste a project image and HTML page to preview them here
                </div>
              )}
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-300">{error}</p>}

        <div className="flex justify-end border-t border-border/70 pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-3 rounded-xl border border-border px-4 py-2 text-sm text-foreground">
              <input type="checkbox" name="is_featured" defaultChecked={item?.is_featured ?? false} />
              <span>Featured</span>
            </label>
            <label className="inline-flex items-center gap-3 rounded-xl border border-border px-4 py-2 text-sm text-foreground">
              <input type="checkbox" name="is_published" defaultChecked={item?.is_published ?? true} />
              <span>Published</span>
            </label>
            {!isNew && item && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || isSaving || isUploadingHtml || isUploadingImage}
                className="rounded-xl border border-red-300 px-5 py-2 text-sm font-medium text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
            <button
              type="submit"
              disabled={isSaving || isDeleting || isUploadingHtml || isUploadingImage}
              className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
            >
              {isSaving ? 'Saving...' : isNew ? 'Create Project' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>

      {isImageUrlEditorOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[1.35rem] border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary/75">Project Utility</p>
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

      {isHtmlUrlEditorOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[1.35rem] border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary/75">Project Utility</p>
                <h3 className="mt-2 text-xl font-semibold text-foreground">Project HTML Page URL</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHtmlUrlEditorOpen(false)}
                className="rounded-full border border-border p-2 text-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Close HTML URL editor"
              >
                ×
              </button>
            </div>
            <div className="mt-5 space-y-3">
              <input
                type="url"
                value={htmlUrl}
                onChange={(event) => {
                  setHtmlUrl(event.target.value);
                  onDirtyChange(true);
                }}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
                placeholder="Paste or edit the project HTML page URL"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsHtmlUrlEditorOpen(false)}
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
                <p className="text-xs uppercase tracking-[0.2em] text-primary/75">Project Utility</p>
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
                      setGalleryImages((current) => (current.includes(nextUrl) ? current : [...current, nextUrl]));
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
                    setGalleryImages((current) => (current.includes(nextUrl) ? current : [...current, nextUrl]));
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
                    {galleryImages.map((url, index) => (
                      <div
                        key={`${url}-${index}`}
                        className="rounded-xl border border-border/60 bg-card p-3"
                      >
                        <div className="relative h-24 overflow-hidden rounded-lg border border-border/60 bg-surface">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Gallery image ${index + 1}`} className="h-full w-full object-cover" />
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-primary">Image {index + 1}</span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(url);
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
                                setGalleryImages((current) => current.filter((entry) => entry !== url));
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

export default function AdminProjectsManager({
  items,
  serviceOptions,
  productOptions,
  upsertAction,
  deleteAction,
}: AdminProjectsManagerProps) {
  const [activeId, setActiveId] = useState<string>('new');
  const [isDirty, setIsDirty] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    if (activeId !== 'new' && !items.some((item) => item.id === activeId)) {
      setActiveId(items[0]?.id ?? 'new');
    }
  }, [activeId, items]);

  const activeItem = activeId === 'new' ? undefined : items.find((item) => item.id === activeId);

  const selectItem = (id: string) => {
    if (id === activeId) return;
    if (isDirty) {
      setPendingId(id);
      return;
    }
    setActiveId(id);
  };

  return (
    <>
      <div className="grid min-h-[calc(100vh-9rem)] gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[1.35rem] border border-border bg-card shadow-sm lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:overflow-hidden">
          <div className="border-b border-border/70 p-5">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary/75">Projects Navigation</p>
            <h2 className="text-xl font-semibold text-foreground">Projects</h2>
            <button
              type="button"
              onClick={() => selectItem('new')}
              className={`mt-4 w-full rounded-xl border px-4 py-2.5 text-sm font-medium ${
                activeId === 'new'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-foreground hover:border-primary hover:text-primary'
              }`}
            >
              + New Project
            </button>
          </div>
          <div className="max-h-[420px] overflow-y-auto p-3 lg:max-h-[calc(100vh-18rem)]">
            <div className="space-y-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectItem(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left ${
                    item.id === activeId
                      ? 'border-primary bg-primary/8 shadow-sm'
                      : 'border-transparent hover:border-border hover:bg-background'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.title || 'Untitled project'}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                      <span className={`inline-flex h-2.5 w-2.5 rounded-full ${item.is_published ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="truncate text-muted-foreground">
                        {item.is_published ? 'Published' : 'Draft'}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 ${
                          item.detail_html_url
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {item.detail_html_url ? 'HTML Detail' : 'Standard Popup'}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="lg:sticky lg:top-24">
          <ProjectEditor
            key={activeItem?.id ?? 'new'}
            item={activeItem}
            serviceOptions={serviceOptions}
            productOptions={productOptions}
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
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              You have unsaved changes in this project. If you continue, those edits will be lost.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingId(null)}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground"
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
