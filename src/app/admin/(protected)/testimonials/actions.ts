'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';

function getTrimmedValue(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function upsertTestimonial(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = getTrimmedValue(formData.get('id'));
  const clientName = getTrimmedValue(formData.get('client_name'));
  const companyName = getTrimmedValue(formData.get('company_name'));
  const role = getTrimmedValue(formData.get('role'));
  const quote = getTrimmedValue(formData.get('quote'));
  const avatarUrl = getTrimmedValue(formData.get('avatar_url'));
  const ratingValue = getTrimmedValue(formData.get('rating'));
  const isFeatured = formData.get('is_featured') === 'on';
  const isPublished = formData.get('is_published') === 'on';

  const payload = {
    client_name: clientName || null,
    company_name: companyName || null,
    role: role || null,
    quote: quote || null,
    avatar_url: avatarUrl || null,
    rating: ratingValue ? Number(ratingValue) : 5,
    is_featured: isFeatured,
    is_published: isPublished,
  };

  if (id) {
    const { error } = await supabase.from('testimonials').update(payload).eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('testimonials').insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/testimonials');
  revalidatePath('/clients');
}

export async function deleteTestimonial(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = getTrimmedValue(formData.get('id'));

  if (!id) throw new Error('Missing testimonial id.');

  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/testimonials');
  revalidatePath('/clients');
}
