'use client';

import { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../homepage/components/Footer';
import Icon from '../../components/ui/AppIcon';
import { PageHero, AnimatedSection, CountUpStat } from '../../components/common/AnimatedSection';
import type { Client } from './clients-data';
import type { Testimonial } from './testimonials-data';

const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function ClientsPageClient({
  initialClients,
  initialTestimonials,
}: {
  initialClients: Client[];
  initialTestimonials: Testimonial[];
}) {
  const TESTIMONIALS_PER_PAGE = 6;
  const allCategories = ['All', ...Array.from(new Set(initialClients.map((client) => client.industry)))];
  const [activeCategory, setActiveCategory] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [shuffledClients, setShuffledClients] = useState<Client[]>([]);
  const [visibleClients, setVisibleClients] = useState(15);
  const [shuffledTestimonials, setShuffledTestimonials] = useState(initialTestimonials);
  const [testimonialPage, setTestimonialPage] = useState(0);

  useEffect(() => {
    setShuffledTestimonials(shuffleArray(initialTestimonials));
    setTestimonialPage(0);
  }, [initialTestimonials]);

  const testimonialPageCount = Math.max(1, Math.ceil(shuffledTestimonials.length / TESTIMONIALS_PER_PAGE));
  const visibleTestimonials = shuffledTestimonials.slice(
    testimonialPage * TESTIMONIALS_PER_PAGE,
    (testimonialPage + 1) * TESTIMONIALS_PER_PAGE
  );

  const filteredClients =
    activeCategory === 'All'
      ? initialClients
      : initialClients.filter((client) => client.industry === activeCategory);

  useEffect(() => {
    setShuffledClients(shuffleArray(filteredClients));
    setVisibleClients(15);
  }, [activeCategory, initialClients]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <PageHero
          badge="Trusted by 50+ Businesses Across the Maldives"
          title="Our Clients"
          subtitle="We are proud to have worked with amazing businesses across the Maldives. Here are some of the brands we have had the pleasure of partnering with."
        />

        <section className="bg-card border-b border-border py-8 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {[
                { value: 100, suffix: '+', label: 'Happy Clients', icon: 'UserGroupIcon' },
                { value: 5000, suffix: '+', label: 'Projects Completed', icon: 'CheckBadgeIcon' },
                { value: 12, suffix: '+', label: 'Industries Served', icon: 'BuildingOfficeIcon' },
                { value: 10, suffix: '+', label: 'Years of Experience', icon: 'StarIcon' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-2">
                  <Icon name={stat.icon as any} size={28} className="text-primary" variant="solid" />
                  <CountUpStat
                    value={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                    valueClassName="text-3xl font-bold font-headline text-foreground"
                    labelClassName="text-sm font-body text-foreground/60"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <AnimatedSection animation="fade-up">
            <h2 className="text-2xl font-bold font-headline text-foreground mb-8 text-center">
              Businesses We Have Worked With
            </h2>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={100}>
            <div className="flex justify-center mb-10 relative">
              <div className="relative w-full max-w-5xl">
                <button
                  type="button"
                  onClick={() => setShowFilter((prev) => !prev)}
                  className="group flex h-12 w-full items-center justify-between rounded-full border border-border/60 bg-white/70 px-5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-primary/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] dark:border-white/10 dark:bg-black dark:text-white dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      <Icon name="FunnelIcon" size={16} />
                    </span>
                    <span className="text-sm font-semibold text-foreground tracking-[0.01em]">
                      {activeCategory === 'All' ? 'Filter Clients' : activeCategory}
                    </span>
                  </span>

                  <span className={`text-foreground/50 transition-transform duration-300 ${showFilter ? 'rotate-180' : ''}`}>
                    <Icon name="ChevronDownIcon" size={16} />
                  </span>
                </button>

                {showFilter && (
                  <div className="absolute left-0 top-14 z-30 w-full rounded-[28px] border border-white/60 bg-white/80 p-5 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.14)] dark:border-white/10 dark:bg-black dark:text-white dark:shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
                    <div className="mb-4 flex items-center justify-between px-1">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Choose Category</p>
                        <p className="text-xs text-foreground/50 dark:text-muted-foreground">Browse clients by industry</p>
                      </div>

                      {activeCategory !== 'All' && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCategory('All');
                            setShowFilter(false);
                          }}
                          className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/15"
                        >
                          Clear Filter
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {allCategories.map((category) => (
                        <button
                          type="button"
                          key={category}
                          onClick={() => {
                            setActiveCategory(category);
                            setShowFilter(false);
                          }}
                          className={`text-left px-4 py-3 rounded-2xl text-sm transition-all duration-200 border ${
                            activeCategory === category
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                              : 'bg-white/70 border-border/50 text-foreground/70 hover:bg-primary/5 hover:text-primary hover:border-primary/20 dark:bg-neutral-950 dark:border-white/10 dark:text-white dark:hover:bg-red-500/10 dark:hover:text-red-400 dark:hover:border-red-500/30'
                          }`}
                        >
                          <span className="block font-medium leading-snug">{category}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {shuffledClients.slice(0, visibleClients).map((client, idx) => (
              <AnimatedSection key={client.id} animation="fade-up" delay={idx * 30}>
                <div
                  className="group relative min-h-[170px] rounded-2xl border border-red-500/45 bg-white text-center shadow-[0_0_0_1px_rgba(239,68,68,0.22),0_0_18px_rgba(239,68,68,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(239,68,68,0.32),0_0_24px_rgba(239,68,68,0.16),0_16px_36px_rgba(0,0,0,0.12)]"
                >
                  <div className="absolute inset-[10px] flex items-center justify-center rounded-[0.85rem] bg-white">
                    {client.logo ? (
                      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[0.85rem] bg-white p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={client.logo}
                          alt={client.logoAlt}
                          className="h-full w-full object-contain p-0 transition-all duration-300 group-hover:scale-[1.02] group-hover:blur-[2px] group-hover:opacity-25"
                          style={{
                            transform: `translate(${client.logoOffsetX ?? 0}px, ${client.logoOffsetY ?? 0}px) scale(${client.logoScale ?? 1})`,
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-white/88 px-4 text-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <span className="text-base font-bold leading-tight text-black drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]">
                            {client.name}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <h3 className="px-4 text-base font-semibold leading-tight text-black transition-colors group-hover:text-primary">
                        {client.name}
                      </h3>
                    )}
                  </div>
                  {client.logo ? <h3 className="sr-only">{client.name}</h3> : null}
                  {activeCategory === 'All' && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <span className="rounded-full bg-surface px-3 py-1 text-[11px] text-foreground/60">
                        {client.industry}
                      </span>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>

          {shuffledClients.length > 15 && visibleClients < shuffledClients.length && (
            <div className="flex justify-center mt-10">
              <button
                type="button"
                onClick={() => setVisibleClients((prev) => prev + 15)}
                className="px-5 py-2.5 rounded-full bg-surface text-sm font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 shadow-sm"
              >
                Load More
              </button>
            </div>
          )}
        </section>

        <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16 px-4">
          <div className="container mx-auto">
            <AnimatedSection animation="fade-up" className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-success/10 rounded-full text-success font-semibold font-headline text-sm mb-4">
                What Our Clients Say
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold font-headline text-foreground mb-4">
                Real Words from Real Clients
              </h2>
              <p className="text-lg text-foreground/60 font-body max-w-2xl mx-auto">
                Don&apos;t just take our word for it. Hear directly from the businesses we have helped grow and succeed.
              </p>
            </AnimatedSection>

            <div className="relative">
              <div className="-mx-3 -my-4 overflow-hidden px-3 py-4">
                <div
                  className="flex transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${testimonialPage * 100}%)` }}
                >
                  {Array.from({ length: testimonialPageCount }).map((_, pageIndex) => {
                    const pageTestimonials = shuffledTestimonials.slice(
                      pageIndex * TESTIMONIALS_PER_PAGE,
                      (pageIndex + 1) * TESTIMONIALS_PER_PAGE
                    );

                    return (
                      <div key={pageIndex} className="w-full flex-shrink-0">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                          {pageTestimonials.map((testimonial, idx) => (
                            <AnimatedSection key={testimonial.id} animation="fade-up" delay={idx * 60}>
                              <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-interactive hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
                                <div className="flex gap-1 mb-4 justify-center">
                                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                                    <Icon key={`${testimonial.id}-${starIndex}`} name="StarIcon" size={16} className="text-accent" variant="solid" />
                                  ))}
                                </div>
                                <blockquote className="text-sm font-body text-foreground/70 leading-relaxed italic flex-1 mb-6 text-center">
                                  &quot;{testimonial.testimonial}&quot;
                                </blockquote>
                                <div className="pt-4 border-t border-border w-full text-center">
                                  <div className="font-bold font-headline text-sm text-foreground">{testimonial.name}</div>
                                  <div className="text-xs text-foreground/50 font-body">{testimonial.position}</div>
                                  <div className="text-xs font-semibold text-primary font-headline">{testimonial.company}</div>
                                </div>
                              </div>
                            </AnimatedSection>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {testimonialPageCount > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setTestimonialPage((prev) => Math.max(0, prev - 1))}
                    disabled={testimonialPage === 0}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all duration-200 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous testimonials"
                  >
                    <Icon name="ChevronLeftIcon" size={18} />
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: testimonialPageCount }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setTestimonialPage(index)}
                        className={`h-2.5 rounded-full transition-all duration-200 ${
                          testimonialPage === index
                            ? 'w-8 bg-primary'
                            : 'w-2.5 bg-border hover:bg-primary/45'
                        }`}
                        aria-label={`Go to testimonial page ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setTestimonialPage((prev) => Math.min(testimonialPageCount - 1, prev + 1))}
                    disabled={testimonialPage === testimonialPageCount - 1}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all duration-200 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next testimonials"
                  >
                    <Icon name="ChevronRightIcon" size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-card border-y border-border py-8 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: 'ShieldCheckIcon', label: 'Quality Guaranteed', sub: 'Every order backed by our quality promise' },
                { icon: 'ClockIcon', label: 'On-Time Delivery', sub: 'We respect your deadlines, always' },
                { icon: 'ChatBubbleLeftRightIcon', label: 'Dedicated Support', sub: 'We are with you from start to finish' },
                { icon: 'CurrencyDollarIcon', label: 'Fair Pricing', sub: 'Transparent quotes, no hidden fees' },
              ].map((item, idx) => (
                <AnimatedSection key={item.label} animation="zoom-in" delay={idx * 80}>
                  <div className="flex flex-col items-center gap-2 px-2">
                    <Icon name={item.icon as any} size={28} className="text-primary" variant="solid" />
                    <span className="text-sm font-bold font-headline text-foreground">{item.label}</span>
                    <span className="text-xs font-body text-foreground/50 leading-snug">{item.sub}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary py-16 px-4">
          <div className="container mx-auto text-center">
            <AnimatedSection animation="fade-up">
              <h2 className="text-2xl lg:text-3xl font-bold font-headline text-primary-foreground mb-4">
                Ready to Join Our Happy Clients?
              </h2>
              <p className="text-primary-foreground/80 font-body mb-8 max-w-xl mx-auto">
                Over 50 businesses across the Maldives trust Red Creatic for their printing and signage needs. Let us bring your brand to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/say-hello" className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-semibold font-body hover:bg-primary-foreground transition-colors duration-200 shadow-lg">
                  <Icon name="ChatBubbleLeftRightIcon" size={18} />
                  Get a Free Quote
                </a>
                <a href="/what-we-offer" className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded-full font-semibold font-body hover:bg-white/10 transition-colors duration-200">
                  <Icon name="EyeIcon" size={18} />
                  View Our Services
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
