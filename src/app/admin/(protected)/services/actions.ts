'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';

function getTrimmedValue(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

function getListValues(formData: FormData, key: string) {
  return getTrimmedValue(formData.get(key))
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export async function upsertService(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const id = getTrimmedValue(formData.get('id'));
  const title = getTrimmedValue(formData.get('title'));
  const description = getTrimmedValue(formData.get('description'));
  const icon = getTrimmedValue(formData.get('icon'));
  const category = getTrimmedValue(formData.get('category'));
  const isPublished = formData.get('is_published') === 'on';

  const payload = {
    title: title || null,
    description: description || null,
    icon: icon || null,
    custom_icon_svg: getTrimmedValue(formData.get('custom_icon_svg')) || null,
    category: category || null,
    main_image_url: getTrimmedValue(formData.get('main_image_url')) || null,
    gallery_images: getListValues(formData, 'gallery_images'),
    industries: [],
    product_ideas: getListValues(formData, 'product_ideas'),
    features: getListValues(formData, 'features'),
    materials: getListValues(formData, 'materials'),
    quality_standards: getListValues(formData, 'quality_standards'),
    is_published: isPublished,
  };

  if (id) {
    const { error } = await supabase.from('services').update(payload).eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('services').insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/services');
  revalidatePath('/what-we-offer');
}

export async function deleteService(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = getTrimmedValue(formData.get('id'));

  if (!id) throw new Error('Missing service id.');

  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/services');
  revalidatePath('/what-we-offer');
}
