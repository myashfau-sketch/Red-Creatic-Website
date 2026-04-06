'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '../../../lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const message = searchParams.get('message');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.replace('/admin');
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-md rounded-[2rem] border border-border bg-card p-8 shadow-xl">
        <div className="mb-8">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/80">
            Red Creatic Admin
          </p>
          <h1 className="text-3xl font-semibold text-foreground">Sign in</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Use your admin email and password to access the content panel.
          </p>
        </div>

        {message && (
          <div className="mb-4 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
              placeholder="admin@redcreatic.com"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
              placeholder="Your password"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting ? 'Signing in...' : 'Enter Admin'}
          </button>
        </form>
      </div>
    </main>
  );
}
