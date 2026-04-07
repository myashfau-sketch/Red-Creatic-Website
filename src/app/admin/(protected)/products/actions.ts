'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';

function getTrimmedValue(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseGalleryImages(value: string) {
  return value
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [src, ...altParts] = entry.split('|');
      return {
        src: src?.trim() ?? '',
        alt: altParts.join('|').trim() || 'Product gallery image',
      };
    })
    .filter((entry) => entry.src);
}

export async function upsertProduct(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const id = getTrimmedValue(formData.get('id'));
  const name = getTrimmedValue(formData.get('name'));
  const description = getTrimmedValue(formData.get('description'));
  const category = getTrimmedValue(formData.get('category'));
  const mainImageUrl = getTrimmedValue(formData.get('main_image_url'));
  const mainImageAlt = getTrimmedValue(formData.get('main_image_alt'));
  const isPublished = formData.get('is_published') === 'on';
  const galleryImages = parseGalleryImages(getTrimmedValue(formData.get('gallery_images')));

  const payload = {
    name: name || null,
    description: description || null,
    category: category || null,
    main_image_url: mainImageUrl || null,
    main_image_alt: mainImageAlt || null,
    gallery_images: galleryImages,
    is_published: isPublished,
  };

  if (id) {
    const { error } = await supabase.from('products').update(payload).eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('products').insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
}

export async function deleteProduct(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = getTrimmedValue(formData.get('id'));

  if (!id) throw new Error('Missing product id.');

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/products');
  revalidatePath('/products');
}
