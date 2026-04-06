'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';

function getTrimmedValue(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

function getListValues(formData: FormData, key: string) {
  const allValues = formData
    .getAll(key)
    .map((value) => getTrimmedValue(value))
    .filter(Boolean);

  if (allValues.length === 0) {
    return [];
  }

  if (allValues.length === 1 && allValues[0].includes('\n')) {
    return allValues[0]
      .split('\n')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return allValues;
}

export async function upsertPartnership(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const id = getTrimmedValue(formData.get('id'));
  const title = getTrimmedValue(formData.get('title'));
  const clientName = getTrimmedValue(formData.get('client_name'));
  const location = getTrimmedValue(formData.get('location'));
  const completionYear = getTrimmedValue(formData.get('completion_year'));
  const description = getTrimmedValue(formData.get('description'));
  const imageUrl = getTrimmedValue(formData.get('image_url'));
  const detailHtmlUrl = getTrimmedValue(formData.get('detail_html_url'));
  const isFeatured = formData.get('is_featured') === 'on';
  const isPublished = formData.get('is_published') === 'on';

  const payload = {
    title: title || null,
    client_name: clientName || null,
    location: location || null,
    completion_year: completionYear || null,
    description: description || null,
    image_url: imageUrl || null,
    detail_html_url: detailHtmlUrl || null,
    gallery_images: getListValues(formData, 'gallery_images'),
    service_tags: getListValues(formData, 'service_tags'),
    product_tags: getListValues(formData, 'product_tags'),
    is_featured: isFeatured,
    is_published: isPublished,
  };

  if (id) {
    const { error } = await supabase.from('partnerships').update(payload).eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('partnerships').insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/partnerships');
  revalidatePath('/partnerships');
}

export async function deletePartnership(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = getTrimmedValue(formData.get('id'));

  if (!id) throw new Error('Missing partnership id.');

  const { error } = await supabase.from('partnerships').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/partnerships');
  revalidatePath('/partnerships');
}
