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
      customIconSvg?: string;
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
  const pauseUntilRef = useRef(0);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const showcaseSlides = useMemo<ShowcaseSlide[]>(() => {
    const selectedTestimonial = testimonials[0];
    const selectedService = services[0];
    const selectedProject = projects[0];
    const selectedProduct = products[0];

    if (!selectedTestimonial || !selectedService || !selectedProject || !selectedProduct) {
      return [];
    }

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
        customIconSvg: selectedService.customIconSvg,
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
    if (!isHydrated) return;

    const shuffledTestimonials = shuffleItems(testimonials);
    const shuffledServices = shuffleItems(services);
    const shuffledProjects = shuffleItems(projects);
    const shuffledProducts = shuffleItems(products);

    const selectedTestimonial = shuffledTestimonials[0];
    const selectedService = shuffledServices[0];
    const selectedProject = shuffledProjects[0];
    const selectedProduct = shuffledProducts[0];

    if (!selectedTestimonial || !selectedService || !selectedProject || !selectedProduct) {
      return;
    }

    setCurrentSlide(0);
  }, [isHydrated, products, projects, services, testimonials]);

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
      <div className="container mx-auto px-4 py-12 sm:py-14 lg:py-24">
        <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4 lg:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-semibold text-success">
                <Icon name="CheckBadgeIcon" size={16} variant="solid" />
                Made In Maldives For Maldivian Businesses
              </div>
              <h1 className="text-[1.75rem] font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl">
                Made in Maldives, <span className="text-primary">Built for Your Brand</span>
              </h1>
              <p className="text-[15px] leading-7 text-muted-foreground sm:text-lg lg:text-xl">
                We produce signage, printing, branding, and visual solutions in our own workshop here
                in Maldives. Nothing is simply imported and resold. Every project is made with local
                care, practical know-how, and quality you can stand behind.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-4">
              <a
                href="/say-hello"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-opacity duration-200 hover:opacity-90 sm:w-auto sm:px-8 sm:py-4 sm:text-base">
                <Icon name="ChatBubbleLeftRightIcon" size={20} />
                Get a Free Quote
              </a>
              <a
                href="/projects"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-primary px-4 py-3 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-primary/5 sm:w-auto sm:px-8 sm:py-4 sm:text-base">
                <Icon name="EyeIcon" size={20} />
                See Our Work
              </a>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center lg:flex lg:flex-wrap lg:justify-start lg:gap-4">
              {[
                { icon: 'WrenchScrewdriverIcon', label: 'Produced Locally' },
                { icon: 'ShieldCheckIcon', label: 'Workshop-Controlled Quality' },
                { icon: 'ClockIcon', label: 'Reliable Delivery' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center gap-1 text-[10px] leading-4 text-foreground/70 sm:text-xs lg:flex-row lg:gap-2 lg:text-sm">
                  <Icon name={badge.icon as any} size={14} className="text-success lg:h-4 lg:w-4" variant="solid" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>

          </div>

          <div className="relative hidden md:block">
            <div className="relative aspect-[5/6] overflow-hidden rounded-xl shadow-interactive sm:aspect-[4/3]">
              {showcaseSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}>
                  {slide.type === 'testimonial' && (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/8 via-background to-primary/6 p-4 sm:p-6 lg:p-8">
                      <div className="flex h-full w-full flex-col items-center justify-center rounded-[1.4rem] border border-border/70 bg-background/80 p-5 text-center backdrop-blur sm:rounded-[1.7rem] sm:p-8">
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
                        <p className="max-w-[28rem] text-sm font-medium leading-6 text-foreground sm:text-lg sm:leading-8">
                          "{slide.body}"
                        </p>
                        <div className="mt-6">
                          <p className="text-base font-bold text-foreground sm:text-xl">{slide.title}</p>
                          <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">{slide.meta}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {slide.type === 'service' && (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-red-700 p-4 text-white sm:p-6 lg:p-8">
                      <div className="flex h-full w-full flex-col items-center justify-center text-center">
                        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/12 backdrop-blur sm:h-24 sm:w-24">
                          <Icon name={slide.icon} svgCode={slide.customIconSvg} size={38} className="text-white sm:text-[44px]" />
                        </div>
                        <div className="mb-3 inline-flex rounded-full bg-white/14 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur">
                          {slide.label}
                        </div>
                        <h3 className="text-2xl font-bold sm:text-3xl lg:text-4xl">{slide.title}</h3>
                        <p className="mt-4 max-w-[28rem] text-sm leading-6 text-white/86 sm:text-base sm:leading-7">
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
                className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-card transition-all duration-300 hover:scale-110 hover:bg-white disabled:opacity-50 sm:left-4 sm:h-10 sm:w-10"
                aria-label="Previous slide">
                <Icon name="ChevronLeftIcon" size={24} className="text-foreground" />
              </button>
              <button
                onClick={handleNextSlide}
                disabled={!isHydrated}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-card transition-all duration-300 hover:scale-110 hover:bg-white disabled:opacity-50 sm:right-4 sm:h-10 sm:w-10"
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
