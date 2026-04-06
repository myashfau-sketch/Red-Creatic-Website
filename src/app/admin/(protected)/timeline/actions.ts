'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';

function getTrimmedValue(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function upsertTimelineEntry(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const id = getTrimmedValue(formData.get('id'));
  const year = getTrimmedValue(formData.get('year'));
  const title = getTrimmedValue(formData.get('title'));
  const description = getTrimmedValue(formData.get('description'));
  const isPublished = formData.get('is_published') === 'on';
  const milestones = getTrimmedValue(formData.get('milestones'))
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);

  const payload = {
    year: year || null,
    title: title || null,
    description: description || null,
    milestones,
    is_published: isPublished,
  };

  if (id) {
    const { error } = await supabase.from('timeline_entries').update(payload).eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabase.from('timeline_entries').insert(payload);
    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath('/admin/timeline');
}

export async function deleteTimelineEntry(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = getTrimmedValue(formData.get('id'));

  if (!id) {
    throw new Error('Missing timeline entry id.');
  }

  const { error } = await supabase.from('timeline_entries').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/timeline');
}
