'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext';

const INTRO_SESSION_KEY = 'red-creatic-startup-intro-seen';

const StartupIntro = () => {
  const pathname = usePathname();
  const { isDark } = useTheme();
  const [shouldRender, setShouldRender] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const shouldSkip = useMemo(
    () => pathname?.startsWith('/admin') || pathname === '/admin/login',
    [pathname]
  );

  useEffect(() => {
    if (shouldSkip) return;
    if (typeof window === 'undefined') return;

    const alreadySeen = window.sessionStorage.getItem(INTRO_SESSION_KEY);
    if (alreadySeen) return;

    setShouldRender(true);
    window.sessionStorage.setItem(INTRO_SESSION_KEY, 'true');

    const leaveTimer = window.setTimeout(() => {
      setIsLeaving(true);
    }, 1550);

    const removeTimer = window.setTimeout(() => {
      setShouldRender(false);
    }, 2150);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
    };
  }, [shouldSkip]);

  if (!shouldRender || shouldSkip) return null;

  return (
    <div
      className={`fixed inset-0 z-[120] overflow-hidden ${
        isLeaving ? 'startup-intro-leave' : 'startup-intro-enter'
      }`}
      aria-hidden="true"
    >
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.22),transparent_42%),linear-gradient(180deg,#090909_0%,#050505_100%)]'
            : 'bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.18),transparent_42%),linear-gradient(180deg,#fff8f8_0%,#fff_100%)]'
        }`}
      />

      <div className="absolute inset-0 startup-intro-grid opacity-40" />

      <div className="absolute left-1/2 top-1/2 h-[58vmin] w-[58vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl startup-intro-pulse" />

      <div className="relative flex h-full items-center justify-center px-6">
        <div className="flex flex-col items-center text-center">
          <div className="startup-intro-mark-wrap relative mb-8 flex items-center justify-center">
            <div className="startup-intro-ring absolute inset-[-22px] rounded-full border border-primary/25" />
            <div className="startup-intro-ring-delayed absolute inset-[-42px] rounded-full border border-primary/15" />
            <div className="rounded-[32px] border border-primary/20 bg-card/80 px-7 py-5 shadow-[0_0_0_1px_rgba(220,38,38,0.08),0_20px_80px_rgba(220,38,38,0.12)] backdrop-blur-xl">
              <Image
                src="/assets/images/RED_CREATIC_Landscape-1769080873477.png"
                alt="Red Creatic"
                width={360}
                height={120}
                className="startup-intro-logo h-20 w-auto object-contain md:h-24"
                priority
              />
            </div>
          </div>

          <div className="startup-intro-copy max-w-2xl space-y-4">
            <p className="text-[11px] uppercase tracking-[0.42em] text-primary/80">
              Made In Maldives
            </p>
            <h1 className="font-headline text-2xl font-semibold leading-tight text-foreground md:text-4xl">
              Crafting bold visual work with local precision
            </h1>
            <div className="mx-auto h-px w-28 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupIntro;
