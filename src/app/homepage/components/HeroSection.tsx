'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Icon from '../../../components/ui/AppIcon';
import type { Testimonial } from '../../clients/testimonials-data';
import type { Service } from '../../../data/services';
import type { Product } from '../../../data/products';

interface HeroProject {
  id: string;
  title: string;
  description: string;
  image: string;
  images: { src: string; alt: string }[];
  client: string;
  year: string;
}

interface HeroSectionProps {
  testimonials: Testimonial[];
  services: Service[];
  products: Product[];
  projects: HeroProject[];
}

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

type ShowcaseSlide =
  | {
      id: string;
      type: 'testimonial';
      label: string;
      title: string;
      body: string;
      meta: string;
    }
  | {
      id: string;
      type: 'service';
      label: string;
      title: string;
      body: string;
      meta: string;
      icon: string;
    }
  | {
      id: string;
      type: 'project';
      label: string;
      title: string;
      body: string;
      meta: string;
      image: string;
      alt: string;
      images: { src: string; alt: string }[];
    }
  | {
      id: string;
      type: 'product';
      label: string;
      title: string;
      body: string;
      meta: string;
      image: string;
      alt: string;
    };

function shuffleItems<T>(items: T[]) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

const HeroSection = ({ testimonials, services, products, projects }: HeroSectionProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState<StatItem[]>([
    { value: 0, suffix: '+', label: 'Projects Delivered' },
    { value: 0, suffix: '+', label: 'Happy Clients' },
    { value: 0, suffix: '%', label: 'Satisfaction Rate' },
    { value: 0, suffix: '+', label: 'Years Experience' },
  ]);
  const hasAnimated = useRef(false);
  const pauseUntilRef = useRef(0);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const showcaseSlides = useMemo<ShowcaseSlide[]>(() => {
    const selectedTestimonial = shuffleItems(testimonials)[0];
    const selectedService = shuffleItems(services)[0];
    const selectedProject = shuffleItems(projects)[0];
    const selectedProduct = shuffleItems(products)[0];

    return [
      {
        id: `testimonial-${selectedTestimonial.id}`,
        type: 'testimonial',
        label: 'Client Feedback',
        title: selectedTestimonial.company,
        body: selectedTestimonial.testimonial,
        meta: `${selectedTestimonial.name}${selectedTestimonial.position ? ` • ${selectedTestimonial.position}` : ''}`,
      },
      {
        id: `service-${selectedService.id}`,
        type: 'service',
        label: 'Featured Service',
        title: selectedService.title,
        body: selectedService.description,
        meta: selectedService.category,
        icon: selectedService.icon,
      },
      {
        id: `project-${selectedProject.id}`,
        type: 'project',
        label: 'Featured Project',
        title: selectedProject.title,
        body: selectedProject.description,
        meta: `${selectedProject.client} • ${selectedProject.year}`,
        image: selectedProject.image,
        alt: selectedProject.title,
        images: selectedProject.images,
      },
      {
        id: `product-${selectedProduct.id}`,
        type: 'product',
        label: 'Product Highlight',
        title: selectedProduct.name,
        body: selectedProduct.description,
        meta: 'Made for real brand applications',
        image: selectedProduct.mainImage,
        alt: selectedProduct.mainImageAlt,
      },
    ];
  }, [products, projects, services, testimonials]);

  useEffect(() => {
    if (!isHydrated || hasAnimated.current) return;

    hasAnimated.current = true;
    const targetValues = [5000, 200, 97, 11];
    const duration = 3000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setStats([
        { value: Math.floor(targetValues[0] * progress), suffix: '+', label: 'Projects Delivered' },
        { value: Math.floor(targetValues[1] * progress), suffix: '+', label: 'Happy Clients' },
        { value: Math.floor(targetValues[2] * progress), suffix: '%', label: 'Satisfaction Rate' },
        { value: Math.floor(targetValues[3] * progress), suffix: '+', label: 'Years Experience' },
      ]);

      if (currentStep >= steps) {
        clearInterval(timer);
        setStats([
          { value: targetValues[0], suffix: '+', label: 'Projects Delivered' },
          { value: targetValues[1], suffix: '+', label: 'Happy Clients' },
          { value: targetValues[2], suffix: '%', label: 'Satisfaction Rate' },
          { value: targetValues[3], suffix: '+', label: 'Years Experience' },
        ]);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isHydrated]);

  const handlePrevSlide = () => {
    if (!isHydrated) return;
    pauseUntilRef.current = Date.now() + 10000;
    setCurrentSlide((prev) => (prev === 0 ? showcaseSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    if (!isHydrated) return;
    pauseUntilRef.current = Date.now() + 10000;
    setCurrentSlide((prev) => (prev === showcaseSlides.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    if (!isHydrated) return;
    pauseUntilRef.current = Date.now() + 10000;
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!isHydrated) return;

    const interval = setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      setCurrentSlide((prev) => (prev === showcaseSlides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isHydrated, showcaseSlides.length]);

  return (
    <section className="relative bg-gradient-to-br from-primary/5 to-accent/5 pt-16">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-semibold text-success">
                <Icon name="CheckBadgeIcon" size={16} variant="solid" />
                Made In Maldives For Maldivian Businesses
              </div>
              <h1 className="text-4xl font-bold leading-tight text-foreground lg:text-5xl xl:text-6xl">
                Made in Maldives, <span className="text-primary">Built for Your Brand</span>
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground lg:text-xl">
                We produce signage, printing, branding, and visual solutions in our own workshop here
                in Maldives. Nothing is simply imported and resold. Every project is made with local
                care, practical know-how, and quality you can stand behind.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="/say-hello"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-opacity duration-200 hover:opacity-90">
                <Icon name="ChatBubbleLeftRightIcon" size={20} />
                Get a Free Quote
              </a>
              <a
                href="/projects"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary px-8 py-4 text-base font-semibold text-primary transition-colors duration-200 hover:bg-primary/5">
                <Icon name="EyeIcon" size={20} />
                See Our Work
              </a>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              {[
                { icon: 'WrenchScrewdriverIcon', label: 'Produced Locally' },
                { icon: 'ShieldCheckIcon', label: 'Workshop-Controlled Quality' },
                { icon: 'ClockIcon', label: 'Reliable Delivery' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 text-sm text-foreground/70">
                  <Icon name={badge.icon as any} size={16} className="text-success" variant="solid" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-border pt-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-3xl font-bold text-primary lg:text-4xl">
                    {stat.value}
                    {stat.suffix}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-interactive">
              {showcaseSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}>
                  {slide.type === 'testimonial' && (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/8 via-background to-primary/6 p-6 lg:p-8">
                      <div className="flex h-full w-full flex-col items-center justify-center rounded-[1.7rem] border border-border/70 bg-background/80 p-8 text-center backdrop-blur">
                        <div className="mb-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                          {slide.label}
                        </div>
                        <div className="mb-4 flex justify-center gap-1 text-amber-500">
                          {Array.from({ length: 5 }).map((_, starIndex) => (
                            <Icon
                              key={starIndex}
                              name="StarIcon"
                              size={18}
                              className="text-amber-500"
                              variant="solid"
                            />
                          ))}
                        </div>
                        <p className="max-w-[28rem] text-lg font-medium leading-8 text-foreground">
                          "{slide.body}"
                        </p>
                        <div className="mt-6">
                          <p className="text-xl font-bold text-foreground">{slide.title}</p>
                          <p className="mt-1 text-sm font-medium text-muted-foreground">{slide.meta}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {slide.type === 'service' && (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-red-700 p-6 text-white lg:p-8">
                      <div className="flex h-full w-full flex-col items-center justify-center text-center">
                        <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/12 backdrop-blur">
                          <Icon name={slide.icon} size={44} className="text-white" />
                        </div>
                        <div className="mb-3 inline-flex rounded-full bg-white/14 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur">
                          {slide.label}
                        </div>
                        <h3 className="text-3xl font-bold lg:text-4xl">{slide.title}</h3>
                        <p className="mt-4 max-w-[28rem] text-base leading-7 text-white/86">
                          {slide.body}
                        </p>
                        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-white/72">
                          {slide.meta}
                        </p>
                      </div>
                    </div>
                  )}

                  {slide.type === 'project' && (
                    <div className="flex h-full flex-col bg-card">
                      <div className="relative aspect-[4/2.18] overflow-hidden">
                        <Image
                          src={slide.images[0].src}
                          alt={slide.images[0].alt}
                          fill
                          className="object-contain transition-all duration-500"
                        />
                      </div>

                      <div className="p-4 pt-3">
                        <div className="mb-2 inline-flex rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {slide.label}
                        </div>
                        <h3 className="mb-1 text-lg font-bold text-foreground">{slide.title}</h3>
                        <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                          {slide.meta}
                        </p>
                      </div>
                    </div>
                  )}

                  {slide.type === 'product' && (
                    <div className="flex h-full flex-col bg-card">
                      <div className="relative aspect-[4/2.18] overflow-hidden">
                        <Image
                          src={slide.image}
                          alt={slide.alt}
                          fill
                          className="object-cover transition-all duration-500"
                        />
                      </div>

                      <div className="p-4 pt-3">
                        <div className="mb-2 inline-flex rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {slide.label}
                        </div>
                        <h3 className="mb-1 text-lg font-bold text-foreground">{slide.title}</h3>
                        <p className="text-sm leading-relaxed text-foreground/70">{slide.body}</p>
                        <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                          {slide.meta}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={handlePrevSlide}
                disabled={!isHydrated}
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-card transition-all duration-300 hover:scale-110 hover:bg-white disabled:opacity-50"
                aria-label="Previous slide">
                <Icon name="ChevronLeftIcon" size={24} className="text-foreground" />
              </button>
              <button
                onClick={handleNextSlide}
                disabled={!isHydrated}
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-card transition-all duration-300 hover:scale-110 hover:bg-white disabled:opacity-50"
                aria-label="Next slide">
                <Icon name="ChevronRightIcon" size={24} className="text-foreground" />
              </button>

              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {showcaseSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    disabled={!isHydrated}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="absolute -right-8 top-8 -z-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 -z-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
