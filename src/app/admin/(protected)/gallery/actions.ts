'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';

function getTrimmedValue(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function upsertGalleryItem(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const id = getTrimmedValue(formData.get('id'));
  const title = getTrimmedValue(formData.get('title'));
  const imageUrl = getTrimmedValue(formData.get('image_url'));
  const altText = getTrimmedValue(formData.get('alt_text'));
  const searchAttributes = getTrimmedValue(formData.get('search_attributes'))
    .split(/\r?\n|,/)
    .map((value) => value.trim())
    .filter(Boolean);
  const isPublished = formData.get('is_published') === 'on';
  const serviceTags = formData
    .getAll('service_tags')
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
  const productTags = formData
    .getAll('product_tags')
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);

  const payload = {
    title: title || null,
    image_url: imageUrl || null,
    alt_text: altText || null,
    search_attributes: searchAttributes,
    is_published: isPublished,
    service_tags: serviceTags,
    product_tags: productTags,
  };

  if (id) {
    const { error } = await supabase.from('gallery_items').update(payload).eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabase.from('gallery_items').insert(payload);
    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath('/admin/gallery');
}

export async function deleteGalleryItem(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = getTrimmedValue(formData.get('id'));

  if (!id) {
    throw new Error('Missing gallery item id.');
  }

  const { error } = await supabase.from('gallery_items').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/gallery');
}
