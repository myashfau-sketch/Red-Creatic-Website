'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function OurStoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold font-headline text-foreground mb-4">
          Something went wrong
        </h2>
        <p className="text-muted-foreground font-body mb-8">
          We could not load this page. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary text-primary-foreground font-semibold font-headline rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            Try Again
          </button>
          <Link
            href="/homepage"
            className="px-6 py-3 border border-border text-foreground font-semibold font-headline rounded-lg hover:bg-surface transition-colors duration-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
