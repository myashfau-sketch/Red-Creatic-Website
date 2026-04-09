'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../../components/ui/AppIcon';
import { useTheme } from '../../context/ThemeContext';

type TimelineItem = {
  year: string;
  title: string;
  description: string;
  milestones: string[];
};

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  customIconSvg?: string | undefined;
  category: string;
  features: string[];
  productIdeas: string[];
};

type ProductItem = {
  id: string;
  name: string;
  description: string;
  category?: string | undefined;
  image: string;
};

type ShowcaseItem = {
  id: string;
  title: string;
  client: string;
  year: string;
  location: string;
  description: string;
  image: string;
};

type ClientItem = {
  id: string;
  name: string;
  logoUrl: string;
};

type TestimonialItem = {
  id: string;
  name: string;
  company: string;
  role: string;
  quote: string;
};

interface CompanyProfileClientProps {
  timeline: TimelineItem[];
  services: ServiceItem[];
  products: ProductItem[];
  projects: ShowcaseItem[];
  partnerships: ShowcaseItem[];
  clients: ClientItem[];
  testimonials: TestimonialItem[];
}

const sections = [
  { id: 'overview', label: 'Overview', icon: 'HomeIcon' },
  { id: 'story', label: 'Story', icon: 'ClockIcon' },
  { id: 'services', label: 'Services', icon: 'WrenchScrewdriverIcon' },
  { id: 'products', label: 'Products', icon: 'CubeIcon' },
  { id: 'projects', label: 'Projects', icon: 'RectangleStackIcon' },
  { id: 'partnerships', label: 'Partnerships', icon: 'UsersIcon' },
  { id: 'clients', label: 'Clients', icon: 'BuildingOfficeIcon' },
  { id: 'testimonials', label: 'Testimonials', icon: 'ChatBubbleLeftRightIcon' },
  { id: 'contact', label: 'Contact', icon: 'PhoneIcon' },
];

export default function CompanyProfileClient({
  timeline,
  services,
  products,
  projects,
  partnerships,
  clients,
  testimonials,
}: CompanyProfileClientProps) {
  const { isDark, toggleTheme } = useTheme();
  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [activeYear, setActiveYear] = useState(timeline[0]?.year ?? '');
  const railRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const featuredServices = useMemo(() => services, [services]);
  const featuredProducts = useMemo(() => products.slice(0, 8), [products]);
  const featuredProjects = useMemo(() => projects.slice(0, 6), [projects]);
  const featuredPartnerships = useMemo(() => partnerships.slice(0, 6), [partnerships]);
  const featuredClients = useMemo(() => clients.slice(0, 12), [clients]);
  const featuredTestimonials = useMemo(() => testimonials.slice(0, 4), [testimonials]);
  const activeTimelineIndex = Math.max(0, timeline.findIndex((item) => item.year === activeYear));
  const activeTimelineItem = timeline[activeTimelineIndex] ?? timeline[0];

  useEffect(() => {
    if (!timeline.some((item) => item.year === activeYear)) {
      setActiveYear(timeline[0]?.year ?? '');
    }
  }, [activeYear, timeline]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const activeButton = rail.querySelector<HTMLButtonElement>(`button[data-year="${activeYear}"]`);
    activeButton?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeYear]);

  useEffect(() => {
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((item): item is HTMLElement => Boolean(item));

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.2, 0.35, 0.5, 0.7],
      }
    );

    targets.forEach((target) => observerRef.current?.observe(target));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="bg-background text-foreground">
      <div className="print-hidden fixed left-4 top-4 z-40">
        <a
          href="/homepage"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:opacity-90"
        >
          <Icon name="ArrowLeftIcon" size={16} />
          Website
        </a>
      </div>

      <div className="print-hidden fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
        <div className="rounded-[1.6rem] border border-border/80 bg-card/95 p-2 shadow-[0_18px_46px_rgba(0,0,0,0.12)] backdrop-blur">
          <button
            type="button"
            onClick={() => setIsSectionMenuOpen((current) => !current)}
            className="mb-2 flex h-12 w-full items-center justify-center rounded-2xl border border-border/70 bg-surface text-foreground transition hover:border-primary hover:text-primary"
            aria-label={isSectionMenuOpen ? 'Collapse section menu' : 'Expand section menu'}
          >
            <Icon name={isSectionMenuOpen ? 'ChevronLeftIcon' : 'ChevronRightIcon'} size={18} />
          </button>

          <div className="space-y-2">
            {sections.map((section) => {
              const isActive = activeSection === section.id;

              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition ${
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground shadow-lg'
                      : 'border-transparent bg-transparent text-foreground hover:border-primary/25 hover:bg-primary/5 hover:text-primary'
                  } ${isSectionMenuOpen ? 'justify-start' : 'justify-center px-0'}`}
                  aria-label={section.label}
                >
                  <Icon name={section.icon as never} size={18} className={isActive ? 'text-primary-foreground' : ''} />
                  {isSectionMenuOpen ? <span className="font-medium">{section.label}</span> : null}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="print-hidden fixed right-4 top-4 z-40 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/95 px-4 py-2.5 text-sm font-semibold text-foreground shadow-lg backdrop-blur transition hover:border-primary hover:text-primary"
        >
          <Icon name={isDark ? 'SunIcon' : 'MoonIcon'} size={16} />
          {isDark ? 'Light' : 'Dark'}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/95 px-4 py-2.5 text-sm font-semibold text-foreground shadow-lg backdrop-blur transition hover:border-primary hover:text-primary"
        >
          <Icon name="PrinterIcon" size={16} />
          Print
        </button>
      </div>

      <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.16),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.12),transparent_30%)]">
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#dc2626_1px,transparent_1px),linear-gradient(to_bottom,#dc2626_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute left-[8%] top-20 hidden h-24 w-24 rounded-[2rem] border border-primary/15 bg-primary/10 lg:block" />
        <div className="absolute bottom-16 right-[10%] hidden h-20 w-20 rounded-full border border-primary/20 bg-white/20 lg:block dark:bg-primary/10" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <Icon name="SparklesIcon" size={16} />
                Interactive Company Profile
              </div>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-6xl">
                  Red Creatic Maldives
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8 lg:text-lg">
                  A polished one-page company profile built to help customers feel confident about ordering from us.
                  It combines our story, capability, finished outputs, proof of work, and trust signals into one strong presentation
                  that can also be exported as a landscape A4 PDF.
                </p>
              </div>
              <div className="print-hidden flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  <Icon name="ShieldCheckIcon" size={16} />
                  Built for dependable ordering
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['10+', 'Years of Experience'],
                ['200+', 'Happy Clients'],
                [String(services.length), 'Service Lines'],
                [String(products.length), 'Product Types'],
              ].map(([value, label], index) => (
                <div
                  key={label}
                  className={`rounded-[1.5rem] border border-border/70 bg-card/95 p-5 shadow-card backdrop-blur transition hover:-translate-y-1 hover:border-primary/30 ${
                    index % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]'
                  }`}
                >
                  <div className="text-3xl font-semibold text-primary">{value}</div>
                  <div className="mt-2 text-sm leading-6 text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="company-profile-shell mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="space-y-8">
          <section id="overview" className="company-profile-page-break rounded-[1.75rem] border border-border bg-card p-5 shadow-card sm:p-7 lg:p-8">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Overview</p>
                <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Made in Maldives, built for brands that need to stand out</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Icon name="CheckBadgeIcon" size={16} />
                Produced In-House
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {[
                {
                  title: 'What We Do',
                  text: 'Printing, signage, fabrication, branding support, visual communication, and custom output production for businesses across Maldives.',
                  icon: 'WrenchScrewdriverIcon',
                },
                {
                  title: 'Who We Serve',
                  text: 'Resorts, councils, retailers, travel businesses, institutions, event organizers, and growing brands that need dependable execution.',
                  icon: 'UserGroupIcon',
                },
                {
                  title: 'Why It Works',
                  text: 'Local understanding, workshop-controlled quality, practical timelines, and the flexibility to handle both one-off and repeat work.',
                  icon: 'ShieldCheckIcon',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.4rem] border border-border/70 bg-surface p-5 transition hover:-translate-y-1 hover:border-primary/25 hover:shadow-card">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon name={item.icon as never} size={22} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                'Reliable for repeat orders',
                'Built for local business realities',
                'Fast, practical, premium execution',
              ].map((point) => (
                <div key={point} className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm font-medium text-foreground">
                  {point}
                </div>
              ))}
            </div>
          </section>

          <section id="story" className="company-profile-page-break rounded-[1.75rem] border border-border bg-card p-5 shadow-card sm:p-7 lg:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Story & Growth</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">How Red Creatic grew into a trusted production partner</h2>
            </div>

            <div className="grid gap-5 xl:grid-cols-[230px_minmax(0,1fr)]">
              <div>
                <div
                  ref={railRef}
                  className="timeline-year-rail flex max-w-full gap-2 overflow-x-auto pb-1 xl:block xl:max-h-[460px] xl:space-y-2.5 xl:overflow-y-auto xl:pr-2"
                >
                  {timeline.map((item, index) => {
                    const isActive = item.year === activeYear;

                    return (
                      <button
                        key={item.year}
                        data-year={item.year}
                        type="button"
                        onClick={() => setActiveYear(item.year)}
                        className={`w-[102px] shrink-0 rounded-2xl border px-3 py-2.5 text-left transition-all xl:w-full ${
                          isActive
                            ? 'border-red-500 bg-card text-foreground ring-2 ring-red-500/30 shadow-[0_0_18px_rgba(239,68,68,0.18)]'
                            : 'border-border/70 bg-surface hover:border-primary/30 hover:bg-card'
                        }`}
                      >
                        <div className="text-sm font-semibold">{item.year}</div>
                        <div className={`mt-1 text-[11px] leading-4 ${isActive ? 'text-foreground/80' : 'text-muted-foreground'}`}>
                          {index === timeline.length - 1 ? 'Current phase' : item.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-border/70 bg-surface p-4 md:p-5">
                {activeTimelineItem ? (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">{activeTimelineItem.year}</p>
                        <h3 className="mt-2 text-xl font-semibold md:text-2xl">{activeTimelineItem.title}</h3>
                      </div>
                      <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-medium text-muted-foreground">
                        Step {activeTimelineIndex + 1} of {timeline.length}
                      </div>
                    </div>

                    <div className="rounded-[1.35rem] border border-border/60 bg-card p-4">
                      <p className="text-sm leading-6 text-muted-foreground">{activeTimelineItem.description}</p>
                    </div>

                    <div className="rounded-[1.35rem] border border-primary/15 bg-primary/[0.04] p-4">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">Milestones</p>
                      <div className="grid gap-3 md:grid-cols-2">
                        {activeTimelineItem.milestones.map((point) => (
                          <div key={point} className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm text-foreground">
                            {point}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section id="services" className="company-profile-page-break rounded-[1.75rem] border border-border bg-card p-5 shadow-card sm:p-7 lg:p-8">
            <div className="mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Service Capability</p>
                <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Core services delivered in-house</h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {featuredServices.map((service) => (
                <div key={service.id} className="rounded-[1.5rem] border border-border/70 bg-surface p-5 transition hover:-translate-y-1 hover:border-primary/25 hover:shadow-card">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon name={service.icon as never} svgCode={service.customIconSvg} size={26} className="text-primary" />
                  </div>
                  <div className="mt-4 inline-flex rounded-full bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    {service.category}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{service.description}</p>
                  <div className="mt-4 space-y-2">
                    {service.features.slice(0, 2).map((feature) => (
                      <div key={feature} className="flex items-start gap-3 text-sm text-foreground">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="products" className="company-profile-page-break rounded-[1.75rem] border border-border bg-card p-5 shadow-card sm:p-7 lg:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Finished Outputs</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Sample products and deliverables</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-surface transition hover:-translate-y-1 hover:border-primary/25 hover:shadow-card">
                  <div className="relative aspect-[4/3] overflow-hidden bg-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4">
                    {product.category ? (
                      <div className="mb-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                        {product.category}
                      </div>
                    ) : null}
                    <h3 className="text-base font-semibold">{product.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="projects" className="company-profile-page-break rounded-[1.75rem] border border-border bg-card p-5 shadow-card sm:p-7 lg:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Projects</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Selected project highlights</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredProjects.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-surface transition hover:-translate-y-1 hover:border-primary/25 hover:shadow-card">
                  <div className="relative aspect-[16/10] overflow-hidden bg-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold">{item.title}</h3>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {item.client} · {item.location} · {item.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="partnerships" className="company-profile-page-break rounded-[1.75rem] border border-border bg-card p-5 shadow-card sm:p-7 lg:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Partnerships</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Long-term collaborations and event support</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredPartnerships.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-surface transition hover:-translate-y-1 hover:border-primary/25 hover:shadow-card">
                  <div className="relative aspect-[16/10] overflow-hidden bg-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold">{item.title}</h3>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {item.client} · {item.location} · {item.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="clients" className="company-profile-page-break rounded-[1.75rem] border border-border bg-card p-5 shadow-card sm:p-7 lg:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Clients</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Trusted by businesses across Maldives</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {featuredClients.map((client) => (
                <div key={client.id} className="flex h-24 items-center justify-center rounded-2xl border border-border/70 bg-surface p-4 transition hover:-translate-y-1 hover:border-primary/25 hover:shadow-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={client.logoUrl} alt={client.name} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </section>

          <section id="testimonials" className="company-profile-page-break rounded-[1.75rem] border border-border bg-card p-5 shadow-card sm:p-7 lg:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Testimonials</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">What clients say about working with us</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {featuredTestimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`rounded-[1.5rem] border border-border/70 bg-surface p-5 transition hover:-translate-y-1 hover:border-primary/25 hover:shadow-card ${
                    index % 2 === 0 ? 'rotate-[-0.7deg]' : 'rotate-[0.7deg]'
                  }`}
                >
                  <p className="text-sm leading-7 text-foreground/85">“{testimonial.quote}”</p>
                  <div className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    {testimonial.name} · {testimonial.company}{testimonial.role ? ` · ${testimonial.role}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="contact" className="company-profile-page-break rounded-[1.75rem] border border-border bg-card p-5 shadow-card sm:p-7 lg:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Contact</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Ready to share, pitch, or print</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {[
                { icon: 'PhoneIcon', label: 'Phone', value: '+960 759-2222', href: 'tel:+9607592222' },
                { icon: 'EnvelopeIcon', label: 'Email', value: 'creatic@red.mv', href: 'mailto:creatic@red.mv' },
                { icon: 'MapPinIcon', label: 'Location', value: "Hulhumale', Maldives", href: '/say-hello' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-[1.5rem] border border-border/70 bg-surface p-5 transition hover:-translate-y-1 hover:border-primary/25 hover:shadow-card"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon name={item.icon as never} size={22} />
                  </div>
                  <div className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-primary/80">{item.label}</div>
                  <div className="mt-2 text-base font-medium text-foreground">{item.value}</div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>

      <style jsx global>{`
        .timeline-year-rail {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .timeline-year-rail::-webkit-scrollbar {
          display: none;
        }

        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm;
          }

          .print-hidden {
            display: none !important;
          }

          .company-profile-shell {
            max-width: none !important;
            padding: 0 !important;
          }

          .company-profile-page-break {
            break-inside: avoid;
            page-break-inside: avoid;
            box-shadow: none !important;
          }

          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
