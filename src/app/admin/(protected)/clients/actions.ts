'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';

function getTrimmedValue(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function upsertClient(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = getTrimmedValue(formData.get('id'));
  const name = getTrimmedValue(formData.get('name'));
  const category = getTrimmedValue(formData.get('category'));
  const websiteUrl = getTrimmedValue(formData.get('website_url'));
  const logoUrl = getTrimmedValue(formData.get('logo_url'));
  const logoScaleValue = getTrimmedValue(formData.get('logo_scale'));
  const logoOffsetXValue = getTrimmedValue(formData.get('logo_offset_x'));
  const logoOffsetYValue = getTrimmedValue(formData.get('logo_offset_y'));
  const isFeatured = formData.get('is_featured') === 'on';
  const isPublished = formData.get('is_published') === 'on';
  const parsedLogoScale = Number.parseFloat(logoScaleValue);
  const parsedLogoOffsetX = Number.parseFloat(logoOffsetXValue);
  const parsedLogoOffsetY = Number.parseFloat(logoOffsetYValue);
  const logoScale = Number.isFinite(parsedLogoScale)
    ? Math.min(3, Math.max(0.5, parsedLogoScale))
    : 1;
  const logoOffsetX = Number.isFinite(parsedLogoOffsetX)
    ? Math.min(60, Math.max(-60, parsedLogoOffsetX))
    : 0;
  const logoOffsetY = Number.isFinite(parsedLogoOffsetY)
    ? Math.min(60, Math.max(-60, parsedLogoOffsetY))
    : 0;

  const payload = {
    name: name || null,
    category: category || null,
    website_url: websiteUrl || null,
    logo_url: logoUrl || null,
    logo_scale: logoScale,
    logo_offset_x: logoOffsetX,
    logo_offset_y: logoOffsetY,
    is_featured: isFeatured,
    is_published: isPublished,
  };

  if (id) {
    const { error } = await supabase.from('clients').update(payload).eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('clients').insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/clients');
  revalidatePath('/clients');
}

export async function deleteClient(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = getTrimmedValue(formData.get('id'));

  if (!id) throw new Error('Missing client id.');

  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/clients');
  revalidatePath('/clients');
}
