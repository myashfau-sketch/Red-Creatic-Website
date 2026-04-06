create extension if not exists pgcrypto;

create table if not exists public.timeline_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  year text,
  title text,
  description text,
  milestones text[] not null default '{}',
  is_published boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text,
  description text,
  icon text,
  category text,
  industries text[] not null default '{}',
  features text[] not null default '{}',
  materials text[] not null default '{}',
  quality_standards text[] not null default '{}',
  is_published boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  description text,
  main_image_url text,
  main_image_alt text,
  gallery_images jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text,
  client_name text,
  location text,
  description text,
  image_url text,
  detail_html_url text,
  gallery_images text[] not null default '{}',
  service_tags text[] not null default '{}',
  product_tags text[] not null default '{}',
  completion_year text,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  logo_url text,
  website_url text,
  category text,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_name text,
  company_name text,
  role text,
  quote text,
  rating integer,
  avatar_url text,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.site_page_settings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  title text,
  is_enabled boolean not null default true
);

alter table public.timeline_entries enable row level security;
alter table public.services enable row level security;
alter table public.products enable row level security;
alter table public.projects enable row level security;
alter table public.clients enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_page_settings enable row level security;

drop policy if exists "Allow public read published timeline_entries" on public.timeline_entries;
drop policy if exists "Allow public read published services" on public.services;
drop policy if exists "Allow public read published products" on public.products;
drop policy if exists "Allow public read published projects" on public.projects;
drop policy if exists "Allow public read published clients" on public.clients;
drop policy if exists "Allow public read published testimonials" on public.testimonials;
drop policy if exists "Allow public read site_page_settings" on public.site_page_settings;

drop policy if exists "Allow authenticated read timeline_entries" on public.timeline_entries;
drop policy if exists "Allow authenticated read services" on public.services;
drop policy if exists "Allow authenticated read products" on public.products;
drop policy if exists "Allow authenticated read projects" on public.projects;
drop policy if exists "Allow authenticated read clients" on public.clients;
drop policy if exists "Allow authenticated read testimonials" on public.testimonials;
drop policy if exists "Allow authenticated read site_page_settings" on public.site_page_settings;

drop policy if exists "Allow authenticated insert timeline_entries" on public.timeline_entries;
drop policy if exists "Allow authenticated insert services" on public.services;
drop policy if exists "Allow authenticated insert products" on public.products;
drop policy if exists "Allow authenticated insert projects" on public.projects;
drop policy if exists "Allow authenticated insert clients" on public.clients;
drop policy if exists "Allow authenticated insert testimonials" on public.testimonials;
drop policy if exists "Allow authenticated insert site_page_settings" on public.site_page_settings;

drop policy if exists "Allow authenticated update timeline_entries" on public.timeline_entries;
drop policy if exists "Allow authenticated update services" on public.services;
drop policy if exists "Allow authenticated update products" on public.products;
drop policy if exists "Allow authenticated update projects" on public.projects;
drop policy if exists "Allow authenticated update clients" on public.clients;
drop policy if exists "Allow authenticated update testimonials" on public.testimonials;
drop policy if exists "Allow authenticated update site_page_settings" on public.site_page_settings;

drop policy if exists "Allow authenticated delete timeline_entries" on public.timeline_entries;
drop policy if exists "Allow authenticated delete services" on public.services;
drop policy if exists "Allow authenticated delete products" on public.products;
drop policy if exists "Allow authenticated delete projects" on public.projects;
drop policy if exists "Allow authenticated delete clients" on public.clients;
drop policy if exists "Allow authenticated delete testimonials" on public.testimonials;
drop policy if exists "Allow authenticated delete site_page_settings" on public.site_page_settings;

create policy "Allow public read published timeline_entries"
on public.timeline_entries for select to anon using (is_published = true);
create policy "Allow public read published services"
on public.services for select to anon using (is_published = true);
create policy "Allow public read published products"
on public.products for select to anon using (is_published = true);
create policy "Allow public read published projects"
on public.projects for select to anon using (is_published = true);
create policy "Allow public read published clients"
on public.clients for select to anon using (is_published = true);
create policy "Allow public read published testimonials"
on public.testimonials for select to anon using (is_published = true);
create policy "Allow public read site_page_settings"
on public.site_page_settings for select to anon using (true);

create policy "Allow authenticated read timeline_entries"
on public.timeline_entries for select to authenticated using (true);
create policy "Allow authenticated read services"
on public.services for select to authenticated using (true);
create policy "Allow authenticated read products"
on public.products for select to authenticated using (true);
create policy "Allow authenticated read projects"
on public.projects for select to authenticated using (true);
create policy "Allow authenticated read clients"
on public.clients for select to authenticated using (true);
create policy "Allow authenticated read testimonials"
on public.testimonials for select to authenticated using (true);
create policy "Allow authenticated read site_page_settings"
on public.site_page_settings for select to authenticated using (true);

create policy "Allow authenticated insert timeline_entries"
on public.timeline_entries for insert to authenticated with check (true);
create policy "Allow authenticated insert services"
on public.services for insert to authenticated with check (true);
create policy "Allow authenticated insert products"
on public.products for insert to authenticated with check (true);
create policy "Allow authenticated insert projects"
on public.projects for insert to authenticated with check (true);
create policy "Allow authenticated insert clients"
on public.clients for insert to authenticated with check (true);
create policy "Allow authenticated insert testimonials"
on public.testimonials for insert to authenticated with check (true);
create policy "Allow authenticated insert site_page_settings"
on public.site_page_settings for insert to authenticated with check (true);

create policy "Allow authenticated update timeline_entries"
on public.timeline_entries for update to authenticated using (true) with check (true);
create policy "Allow authenticated update services"
on public.services for update to authenticated using (true) with check (true);
create policy "Allow authenticated update products"
on public.products for update to authenticated using (true) with check (true);
create policy "Allow authenticated update projects"
on public.projects for update to authenticated using (true) with check (true);
create policy "Allow authenticated update clients"
on public.clients for update to authenticated using (true) with check (true);
create policy "Allow authenticated update testimonials"
on public.testimonials for update to authenticated using (true) with check (true);
create policy "Allow authenticated update site_page_settings"
on public.site_page_settings for update to authenticated using (true) with check (true);

create policy "Allow authenticated delete timeline_entries"
on public.timeline_entries for delete to authenticated using (true);
create policy "Allow authenticated delete services"
on public.services for delete to authenticated using (true);
create policy "Allow authenticated delete products"
on public.products for delete to authenticated using (true);
create policy "Allow authenticated delete projects"
on public.projects for delete to authenticated using (true);
create policy "Allow authenticated delete clients"
on public.clients for delete to authenticated using (true);
create policy "Allow authenticated delete testimonials"
on public.testimonials for delete to authenticated using (true);
create policy "Allow authenticated delete site_page_settings"
on public.site_page_settings for delete to authenticated using (true);
