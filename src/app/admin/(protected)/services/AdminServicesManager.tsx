'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '../../../../lib/supabase/client';
import Icon from '../../../../components/ui/AppIcon';
import type { ServiceRecord } from '../../../../types/database';

const SERVICE_IMAGE_BUCKET = 'gallery-images';
const SERVICE_ICON_OPTIONS = [
  'BoltIcon',
  'PhotoIcon',
  'PrinterIcon',
  'RectangleStackIcon',
  'PencilSquareIcon',
  'CogIcon',
  'CubeIcon',
  'SparklesIcon',
  'TruckIcon',
  'WrenchScrewdriverIcon',
  'WrenchIcon',
  'PaintBrushIcon',
  'LightBulbIcon',
  'BuildingOfficeIcon',
  'BuildingStorefrontIcon',
  'MegaphoneIcon',
  'ShieldCheckIcon',
  'SwatchIcon',
  'PresentationChartBarIcon',
  'RocketLaunchIcon',
  'MapPinIcon',
  'BriefcaseIcon',
  'TagIcon',
  'GiftIcon',
  'HomeModernIcon',
  'TableCellsIcon',
];

interface AdminServicesManagerProps {
  items: ServiceRecord[];
  upsertAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}

function ServiceEditor({
  item,
  categoryOptions,
  upsertAction,
  deleteAction,
  onDirtyChange,
  onSaved,
}: {
  item?: ServiceRecord;
  categoryOptions: string[];
  upsertAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  onDirtyChange: (dirty: boolean) => void;
  onSaved: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(item?.category ?? '');
  const [customCategory, setCustomCategory] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(
    item?.icon && SERVICE_ICON_OPTIONS.includes(item.icon) ? item.icon : item?.icon ? '__custom__' : ''
  );
  const [customIcon, setCustomIcon] = useState(item?.icon && !SERVICE_ICON_OPTIONS.includes(item.icon) ? item.icon : '');
  const [customIconSvg, setCustomIconSvg] = useState(item?.custom_icon_svg ?? '');
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [isSvgEditorOpen, setIsSvgEditorOpen] = useState(false);
  const [mainImageUrl, setMainImageUrl] = useState(item?.main_image_url ?? '');
  const [galleryImages, setGalleryImages] = useState<string[]>(item?.gallery_images ?? []);
  const [pendingGalleryImageUrl, setPendingGalleryImageUrl] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isMainImageEditorOpen, setIsMainImageEditorOpen] = useState(false);
  const [isGalleryEditorOpen, setIsGalleryEditorOpen] = useState(false);
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const isNew = !item;
  const isUsingCustomCategory = selectedCategory === '__custom__';
  const isUsingCustomIcon = selectedIcon === '__custom__';

  useEffect(() => {
    setSelectedCategory(item?.category ?? '');
    setCustomCategory('');
    setSelectedIcon(item?.icon && SERVICE_ICON_OPTIONS.includes(item.icon) ? item.icon : item?.icon ? '__custom__' : '');
    setCustomIcon(item?.icon && !SERVICE_ICON_OPTIONS.includes(item.icon) ? item.icon : '');
    setCustomIconSvg(item?.custom_icon_svg ?? '');
    setIsIconPickerOpen(false);
    setIsSvgEditorOpen(false);
    setMainImageUrl(item?.main_image_url ?? '');
    setGalleryImages(item?.gallery_images ?? []);
    setPendingGalleryImageUrl('');
    setSelectedImageFile(null);
    setError(null);
    onDirtyChange(false);
  }, [item, onDirtyChange]);

  const mainImageOptions = useMemo(
    () => Array.from(new Set([mainImageUrl, ...galleryImages].filter(Boolean))),
    [galleryImages, mainImageUrl]
  );

  const uploadSelectedImage = async () => {
    if (!selectedImageFile) return null;

    setIsUploadingImage(true);
    setError(null);

    const safeName = selectedImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
    const filePath = `services/${Date.now()}-${safeName || 'service-image.jpg'}`;

    const { error: uploadError } = await supabase.storage.from(SERVICE_IMAGE_BUCKET).upload(filePath, selectedImageFile, {
        cacheControl: '31536000',
      upsert: false,
    });

    if (uploadError) {
      setError(uploadError.message);
      setIsUploadingImage(false);
      return null;
    }

    const { data } = supabase.storage.from(SERVICE_IMAGE_BUCKET).getPublicUrl(filePath);

    setGalleryImages((current) => (current.includes(data.publicUrl) ? current : [...current, data.publicUrl]));
    setMainImageUrl((current) => current || data.publicUrl);
    setSelectedImageFile(null);
    setIsUploadingImage(false);
    onDirtyChange(true);

    return data.publicUrl;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);
    const formElement = event.currentTarget;

    try {
      let finalMainImageUrl = mainImageUrl;
      let finalGalleryImages = [...galleryImages];

      if (selectedImageFile) {
        const uploadedImageUrl = await uploadSelectedImage();
        if (!uploadedImageUrl) {
          throw new Error('Service image upload failed before the service could be saved.');
        }

        if (!finalGalleryImages.includes(uploadedImageUrl)) {
          finalGalleryImages = [...finalGalleryImages, uploadedImageUrl];
        }

        finalMainImageUrl = finalMainImageUrl || uploadedImageUrl;
      }

      const formData = new FormData(formElement);
      const finalCategory = isUsingCustomCategory ? customCategory.trim() : selectedCategory.trim();
      const finalIcon = isUsingCustomIcon ? customIcon.trim() : selectedIcon.trim();
      formData.set('category', finalCategory);
      formData.set('icon', finalIcon);
      formData.set('main_image_url', finalMainImageUrl);
      formData.set('gallery_images', finalGalleryImages.join('\n'));

      await upsertAction(formData);
      router.refresh();
      onDirtyChange(false);
      onSaved();

      if (isNew) {
        formElement.reset();
        setSelectedCategory('');
        setCustomCategory('');
        setSelectedIcon('');
        setCustomIcon('');
        setCustomIconSvg('');
        setMainImageUrl('');
        setGalleryImages([]);
        setPendingGalleryImageUrl('');
        setSelectedImageFile(null);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save service.');
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
      setError(submitError instanceof Error ? submitError.message : 'Failed to delete service.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-11rem)] rounded-[1.35rem] border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="mb-5 border-b border-border/70 pb-5">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary/75">{isNew ? 'New Service' : 'Service Details'}</p>
        <h2 className="text-[1.7rem] font-semibold text-foreground">{item?.title || 'Create a new service'}</h2>
      </div>
      <form onSubmit={handleSubmit} onChangeCapture={() => onDirtyChange(true)} className="space-y-5">
        {item?.id && <input type="hidden" name="id" value={item.id} />}
        <input type="hidden" name="category" value={isUsingCustomCategory ? customCategory.trim() : selectedCategory} />
        <input type="hidden" name="icon" value={isUsingCustomIcon ? customIcon.trim() : selectedIcon} />
        <input type="hidden" name="custom_icon_svg" value={customIconSvg} />

        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Title</span>
            <input type="text" name="title" defaultValue={item?.title ?? ''} className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary" />
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

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="block text-sm font-medium text-foreground">Icon</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSvgEditorOpen(true)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                  customIconSvg.trim()
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-foreground hover:border-primary hover:text-primary'
                }`}
              >
                SVG code
              </button>
              <button
                type="button"
                onClick={() => setSelectedIcon('__custom__')}
                className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isUsingCustomIcon
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-foreground hover:border-primary hover:text-primary'
                }`}
              >
                Custom icon name
              </button>
              <button
                type="button"
                onClick={() => setIsIconPickerOpen((current) => !current)}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {customIconSvg.trim() ? (
                  <>
                    <Icon name="QuestionMarkCircleIcon" svgCode={customIconSvg} size={16} className="text-primary" />
                    <span>Custom SVG</span>
                  </>
                ) : selectedIcon && selectedIcon !== '__custom__' ? (
                  <>
                    <Icon name={selectedIcon} size={16} className="text-primary" />
                    <span>{selectedIcon.replace(/Icon$/, '')}</span>
                  </>
                ) : (
                  <span>Select icon</span>
                )}
                <Icon name="ChevronDownIcon" size={14} className={`transition-transform ${isIconPickerOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {isIconPickerOpen && (
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 xl:grid-cols-8">
                {SERVICE_ICON_OPTIONS.map((iconName) => {
                  const isActive = selectedIcon === iconName;

                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => {
                        setSelectedIcon(iconName);
                        setIsIconPickerOpen(false);
                      }}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border px-2 py-3 text-center transition-all ${
                        isActive
                          ? 'border-primary bg-primary/8 shadow-sm'
                          : 'border-border bg-card hover:border-primary/40 hover:bg-surface'
                      }`}
                      title={iconName}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isActive ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                        <Icon name={iconName} size={20} />
                      </div>
                      <span className="line-clamp-2 text-[10px] leading-3 text-foreground">
                        {iconName.replace(/Icon$/, '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isUsingCustomIcon && (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Custom Icon Name</span>
              <input
                type="text"
                value={customIcon}
                onChange={(event) => setCustomIcon(event.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
                placeholder="BoltIcon"
              />
            </label>
          )}
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">Description</span>
          <textarea name="description" defaultValue={item?.description ?? ''} rows={5} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
        </label>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
          <div className="space-y-5">
            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setIsMainImageEditorOpen(true)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-left text-sm transition-colors hover:border-primary hover:text-primary"
              >
                <span className="block text-xs uppercase tracking-[0.18em] text-primary/70">Main Service Photo</span>
                <span className="mt-1 block text-sm text-foreground/75">
                  {mainImageUrl ? 'View or edit the main service photo URL' : 'Add a main service photo URL'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setIsGalleryEditorOpen(true)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-left text-sm transition-colors hover:border-primary hover:text-primary"
              >
                <span className="block text-xs uppercase tracking-[0.18em] text-primary/70">Service Gallery</span>
                <span className="mt-1 block text-sm text-foreground/75">
                  {galleryImages.length > 0 ? `${galleryImages.length} service photo${galleryImages.length === 1 ? '' : 's'} added` : 'Add individual service photos'}
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
                        mainImageUrl === option ? 'border-primary bg-primary/8' : 'border-border bg-card hover:border-primary/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="main_image_choice"
                        checked={mainImageUrl === option}
                        onChange={() => {
                          setMainImageUrl(option);
                          onDirtyChange(true);
                        }}
                        className="mt-1"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="relative h-24 overflow-hidden rounded-lg bg-surface">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={option} alt="Service image option" className="h-full w-full object-cover" />
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Upload or add service photos first, then choose the main image.</p>
              )}
            </fieldset>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.1rem] border border-border bg-background/70 p-4">
              <div className="flex flex-col gap-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">Upload Service Photo</span>
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
                  {isUploadingImage ? 'Uploading...' : 'Upload Photo'}
                </button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Uploads use <code>{SERVICE_IMAGE_BUCKET}</code>.
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.1rem] border border-border bg-card">
              {mainImageUrl ? (
                <div className="space-y-3 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mainImageUrl} alt={item?.title ?? 'Service preview'} className="h-[200px] w-full rounded-xl bg-surface object-cover" />
                  <p className="text-xs text-muted-foreground">This is the main photo that will lead the public service popup.</p>
                </div>
              ) : (
                <div className="flex h-[220px] items-center justify-center bg-surface text-sm text-muted-foreground">
                  Upload or add a service photo to preview it here
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Product Ideas</span>
            <textarea name="product_ideas" defaultValue={(item?.product_ideas ?? []).join('\n')} rows={6} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" placeholder="One product idea per line" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Features</span>
            <textarea name="features" defaultValue={(item?.features ?? []).join('\n')} rows={6} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" placeholder="One feature per line" />
          </label>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Materials</span>
            <textarea name="materials" defaultValue={(item?.materials ?? []).join('\n')} rows={6} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" placeholder="One material per line" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Quality Standards</span>
            <textarea name="quality_standards" defaultValue={(item?.quality_standards ?? []).join('\n')} rows={6} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" placeholder="One standard per line" />
          </label>
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
                className="rounded-xl border border-red-300 px-5 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/50 dark:text-red-300"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
            <button type="submit" disabled={isSaving || isDeleting || isUploadingImage} className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
              {isSaving ? 'Saving...' : isNew ? 'Create Service' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>

        {isMainImageEditorOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[1.35rem] border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary/75">Service Utility</p>
                <h3 className="mt-2 text-xl font-semibold text-foreground">Main Service Photo</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMainImageEditorOpen(false)}
                className="rounded-full border border-border p-2 text-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Close main image URL editor"
              >
                ×
              </button>
            </div>
            <div className="mt-5 space-y-3">
              <input
                type="url"
                value={mainImageUrl}
                onChange={(event) => {
                  setMainImageUrl(event.target.value);
                  onDirtyChange(true);
                }}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
                placeholder="Paste or edit the main service photo URL"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsMainImageEditorOpen(false)}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

      {isSvgEditorOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[1.35rem] border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary/75">Service Utility</p>
                <h3 className="mt-2 text-xl font-semibold text-foreground">Custom SVG Icon</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSvgEditorOpen(false)}
                className="rounded-full border border-border p-2 text-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Close SVG editor"
              >
                ×
              </button>
            </div>
            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div className="space-y-3">
                <textarea
                  value={customIconSvg}
                  onChange={(event) => {
                    setCustomIconSvg(event.target.value);
                    onDirtyChange(true);
                  }}
                  rows={12}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 font-mono text-sm text-foreground outline-none focus:border-primary"
                  placeholder="<svg viewBox='0 0 24 24' ...>...</svg>"
                />
                <p className="text-xs leading-5 text-muted-foreground">
                  Paste full SVG code here. SVG is optional, but when present it will override the Heroicon name for this service everywhere on the site.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomIconSvg('');
                      onDirtyChange(true);
                    }}
                    className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground"
                  >
                    Clear SVG
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSvgEditorOpen(false)}
                    className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    Done
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Preview</p>
                <div className="flex min-h-[220px] items-center justify-center rounded-[1.1rem] border border-border bg-background p-6">
                  {customIconSvg.trim() ? (
                    <Icon name="QuestionMarkCircleIcon" svgCode={customIconSvg} size={120} className="text-primary" />
                  ) : (
                    <p className="text-center text-sm text-muted-foreground">Paste SVG code to preview it here.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isGalleryEditorOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[1.35rem] border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary/75">Service Utility</p>
                <h3 className="mt-2 text-xl font-semibold text-foreground">Service Gallery</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGalleryEditorOpen(false)}
                className="rounded-full border border-border p-2 text-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Close gallery editor"
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
                  placeholder="Paste one service photo URL"
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
                  <p className="text-sm text-muted-foreground">No service photos added yet.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {galleryImages.map((url, index) => (
                      <div key={`${url}-${index}`} className="rounded-xl border border-border/60 bg-card p-3">
                        <div className="relative h-24 overflow-hidden rounded-lg border border-border/60 bg-surface">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Service image ${index + 1}`} className="h-full w-full object-cover" />
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
                                if (mainImageUrl === url) {
                                  const remaining = galleryImages.filter((entry) => entry !== url);
                                  setMainImageUrl(remaining[0] ?? '');
                                }
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
                  onClick={() => setIsGalleryEditorOpen(false)}
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

export default function AdminServicesManager({ items, upsertAction, deleteAction }: AdminServicesManagerProps) {
  const [activeId, setActiveId] = useState<string>('new');
  const [isDirty, setIsDirty] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    if (activeId !== 'new' && !items.some((item) => item.id === activeId)) {
      setActiveId(items[0]?.id ?? 'new');
    }
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
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary/75">Services Navigation</p>
            <h2 className="text-xl font-semibold text-foreground">Services</h2>
            <button
              type="button"
              onClick={() => selectItem('new')}
              className={`mt-4 w-full rounded-xl border px-4 py-2.5 text-sm font-medium ${
                activeId === 'new'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-foreground hover:border-primary hover:text-primary'
              }`}
            >
              + New Service
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
                    item.id === activeId ? 'border-primary bg-primary/8 shadow-sm' : 'border-transparent hover:border-border hover:bg-background'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{item.title || 'Untitled service'}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <span className={`inline-flex h-2.5 w-2.5 rounded-full ${item.is_published ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="truncate text-muted-foreground">{item.is_published ? 'Published' : 'Draft'}</span>
                      <span className={`inline-flex rounded-full px-2 py-0.5 ${item.main_image_url ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {item.main_image_url ? 'Photo Ready' : 'No Photo'}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
        <div className="lg:sticky lg:top-24">
          <ServiceEditor
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
            <p className="mt-3 text-sm leading-6 text-muted-foreground">You have unsaved changes in this service. If you continue, those edits will be lost.</p>
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
