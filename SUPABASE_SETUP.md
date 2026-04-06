# Supabase Admin Setup

## 1. Create the Supabase project

1. Create a new project in Supabase.
2. Copy the project URL and anon key.
3. Create a local env file named `.env.local`.
4. Paste the values from `.env.local.example`.

## 2. Create the first admin user

1. Open Supabase Dashboard.
2. Go to `Authentication`.
3. Create a user with email and password.
4. Use that account on `/admin/login`.

## 3. Current scaffold included

- Supabase browser/server helpers
- Middleware session refresh for `/admin`
- `/admin/login`
- protected `/admin` dashboard
- sign-out action

## 4. Recommended next implementation

1. Create tables:
   - `gallery_items`
   - `products`
   - `services`
   - `site_sections`
2. Build `/admin/gallery` first.
3. Move current hardcoded gallery data into Supabase.
4. Update public gallery page to read from database content.

## 5. Create the gallery storage bucket

1. Open `Storage` in Supabase.
2. Create a bucket named `gallery-images`.
3. Make it public if you want direct public image URLs.
4. Add a storage policy that allows authenticated users to upload files.

## 6. Create the client logo storage bucket

1. Open `Storage` in Supabase.
2. Create a bucket named `client-logos`.
3. Make it public if you want direct public image URLs.
4. Add a storage policy that allows authenticated users to upload files.

## 7. Create the project HTML storage bucket

1. Open `Storage` in Supabase.
2. Create a bucket named `project-pages`.
3. Make it public so project detail pages can open in the public modal.
4. Add a storage policy that allows authenticated users to upload files.
