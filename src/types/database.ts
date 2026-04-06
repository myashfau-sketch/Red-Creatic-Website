export interface GalleryItemRecord {
  id: string;
  created_at: string;
  title: string | null;
  image_url: string | null;
  alt_text: string | null;
  service_tags: string[] | null;
  product_tags: string[] | null;
  is_published: boolean | null;
  sort_order: number | null;
}

export interface TimelineEntryRecord {
  id: string;
  created_at: string;
  year: string | null;
  title: string | null;
  description: string | null;
  milestones: string[] | null;
  is_published: boolean | null;
  sort_order: number | null;
}

export interface ServiceRecord {
  id: string;
  created_at: string;
  title: string | null;
  description: string | null;
  icon: string | null;
  category: string | null;
  industries: string[] | null;
  features: string[] | null;
  materials: string[] | null;
  quality_standards: string[] | null;
  is_published: boolean | null;
  sort_order: number | null;
}

export interface ProductRecord {
  id: string;
  created_at: string;
  name: string | null;
  description: string | null;
  main_image_url: string | null;
  main_image_alt: string | null;
  gallery_images: { src: string; alt: string }[] | null;
  is_published: boolean | null;
  sort_order: number | null;
}

export interface ProjectRecord {
  id: string;
  created_at: string;
  title: string | null;
  client_name: string | null;
  location: string | null;
  description: string | null;
  image_url: string | null;
  detail_html_url: string | null;
  gallery_images: string[] | null;
  service_tags: string[] | null;
  product_tags: string[] | null;
  completion_year: string | null;
  is_featured: boolean | null;
  is_published: boolean | null;
  sort_order: number | null;
}

export interface PartnershipRecord {
  id: string;
  created_at: string;
  title: string | null;
  client_name: string | null;
  location: string | null;
  description: string | null;
  image_url: string | null;
  detail_html_url: string | null;
  gallery_images: string[] | null;
  service_tags: string[] | null;
  product_tags: string[] | null;
  completion_year: string | null;
  is_featured: boolean | null;
  is_published: boolean | null;
  sort_order: number | null;
}

export interface ClientRecord {
  id: string;
  created_at: string;
  name: string | null;
  logo_url: string | null;
  logo_scale: number | null;
  logo_offset_x: number | null;
  logo_offset_y: number | null;
  website_url: string | null;
  category: string | null;
  is_featured: boolean | null;
  is_published: boolean | null;
  sort_order: number | null;
}

export interface TestimonialRecord {
  id: string;
  created_at: string;
  client_name: string | null;
  company_name: string | null;
  role: string | null;
  quote: string | null;
  rating: number | null;
  avatar_url: string | null;
  is_featured: boolean | null;
  is_published: boolean | null;
  sort_order: number | null;
}

export interface SitePageSettingRecord {
  id: string;
  created_at: string;
  slug: string;
  title: string | null;
  is_enabled: boolean | null;
}
