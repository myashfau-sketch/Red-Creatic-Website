import { createSupabaseServerClient } from './supabase/server';

export type SitePageSearchParamsRecord = Record<
  string,
  string | string[] | undefined
>;

export type SitePageSearchParams = Promise<SitePageSearchParamsRecord> | undefined;

export interface SitePageConfig {
  slug: string;
  title: string;
  path: string;
}

export const sitePageConfigs: SitePageConfig[] = [
  { slug: 'our-story', title: 'Our Story', path: '/our-story' },
  { slug: 'what-we-offer', title: 'What We Offer', path: '/what-we-offer' },
  { slug: 'products', title: 'Products', path: '/products' },
  { slug: 'gallery', title: 'Gallery', path: '/gallery' },
  { slug: 'projects', title: 'Projects', path: '/projects' },
  { slug: 'partnerships', title: 'Partnerships', path: '/partnerships' },
  { slug: 'clients', title: 'Clients', path: '/clients' },
  { slug: 'say-hello', title: 'Say Hello', path: '/say-hello' },
];

const PREVIEW_QUERY_KEY = 'admin-preview';

export function getSitePagePreviewHref(path: string) {
  return `${path}?${PREVIEW_QUERY_KEY}=1`;
}

async function resolveSearchParams(searchParams?: SitePageSearchParams) {
  return (await (searchParams ?? Promise.resolve({}))) as SitePageSearchParamsRecord;
}

export async function isAdminPreviewRequest(searchParams?: SitePageSearchParams) {
  const resolved = await resolveSearchParams(searchParams);
  const previewValue = resolved[PREVIEW_QUERY_KEY];

  if (Array.isArray(previewValue)) {
    return previewValue.includes('1') || previewValue.includes('true');
  }

  return previewValue === '1' || previewValue === 'true';
}

export async function isSitePageEnabled(
  slug: string,
  searchParams?: SitePageSearchParams
) {
  try {
    const supabase = await createSupabaseServerClient();

    if (await isAdminPreviewRequest(searchParams)) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        return true;
      }
    }

    const { data, error } = await supabase
      .from('site_page_settings')
      .select('is_enabled')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      return true;
    }

    return data?.is_enabled ?? true;
  } catch {
    return true;
  }
}

export async function isSitePagePopupEnabled(slug: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('site_page_settings')
      .select('is_popup_enabled')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      return true;
    }

    return data?.is_popup_enabled ?? true;
  } catch {
    return true;
  }
}
