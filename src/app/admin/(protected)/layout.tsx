import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '../../../lib/supabase/server';

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login?message=Please sign in to continue.');
  }

  return <>{children}</>;
}
