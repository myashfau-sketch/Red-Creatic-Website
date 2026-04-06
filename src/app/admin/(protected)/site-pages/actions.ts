'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';
import { sitePageConfigs } from '../../../../lib/site-page-settings';

function getTrimmedValue(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function upsertSitePageSetting(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const slug = getTrimmedValue(formData.get('slug'));
  const title = getTrimmedValue(formData.get('title'));
  const isEnabled = formData.get('is_enabled') === 'on';

  if (!slug) {
    throw new Error('Missing page slug.');
  }

  const payload = {
    slug,
    title: title || slug,
    is_enabled: isEnabled,
  };

  const { error } = await supabase.from('site_page_settings').upsert(payload, {
    onConflict: 'slug',
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/site-pages');

  const matchingPage = sitePageConfigs.find((page) => page.slug === slug);
  if (matchingPage) {
    revalidatePath(matchingPage.path);
  }

  revalidatePath('/homepage');
}

