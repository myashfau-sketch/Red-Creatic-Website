'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'zoom-in';
  delay?: number;
}

export const AnimatedSection = ({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
}: AnimatedSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const baseStyle: React.CSSProperties = {
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    opacity: visible ? 1 : 0,
    transform: visible
      ? 'none'
      : animation === 'fade-up' ?'translateY(32px)'
      : animation === 'slide-left' ?'translateX(-32px)'
      : animation === 'slide-right' ?'translateX(32px)'
      : animation === 'zoom-in' ?'scale(0.92)' :'none',
  };

  return (
    <div ref={ref} className={className} style={baseStyle}>
      {children}
    </div>
  );
};

interface UseCountUpOptions {
  target: number;
  duration?: number;
  start?: boolean;
}

export function useCountUp({ target, duration = 2000, start }: UseCountUpOptions) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!start || hasRun.current) return;
    hasRun.current = true;
    const steps = 60;
    const stepDuration = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(target * eased));
      if (step >= steps) {
        clearInterval(timer);
        setCount(target);
      }
    }, stepDuration);
    return () => clearInterval(timer);
  }, [start, target, duration]);

  return count;
}

interface CountUpStatProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
}

export const CountUpStat = ({
  value,
  suffix = '',
  prefix = '',
  label,
  className = '',
  valueClassName = 'text-3xl font-bold font-headline text-primary',
  labelClassName = 'text-sm font-body text-foreground/60',
}: CountUpStatProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const count = useCountUp({ target: value, start: started });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`flex flex-col items-center gap-1 ${className}`}>
      <span className={valueClassName}>
        {prefix}{count}{suffix}
      </span>
      <span className={labelClassName}>{label}</span>
    </div>
  );
};

interface PageHeroProps {
  badge?: string;
  title: string;
  subtitle: string;
  badgeIcon?: ReactNode;
}

export const PageHero = ({ badge, title, subtitle, badgeIcon }: PageHeroProps) => {
  return (
    <section className="relative overflow-hidden py-10 md:py-14 bg-gradient-to-br from-primary to-secondary text-primary-foreground dark:bg-none dark:bg-card dark:text-primary">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none dark:bg-primary/6" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none dark:bg-primary/6" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none dark:bg-primary/5" />
      <div className="absolute inset-0 border-b border-white/10 pointer-events-none dark:border-border/60" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-sm font-semibold font-headline mb-4 animate-pulse-slow dark:bg-primary/8 dark:text-primary">
              {badgeIcon}
              {badge}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-base md:text-lg font-body opacity-90 leading-relaxed dark:text-primary/85">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};
