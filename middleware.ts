import type { NextRequest } from 'next/server';
import { updateSupabaseSession } from './src/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: ['/admin/:path*'],
};
