'use client';

import { useState, useEffect } from 'react';

import Icon from '../../../components/ui/AppIcon';
import {
  allTestimonials as fallbackTestimonials,
  type Testimonial,
} from '../../clients/testimonials-data';
import { AnimatedSection, CountUpStat } from '../../../components/common/AnimatedSection';

interface ClientTestimonialsProps {
  initialTestimonials?: Testimonial[];
}

const ClientTestimonials = ({ initialTestimonials = fallbackTestimonials }: ClientTestimonialsProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [testimonials, setTestimonials] = useState(() => (initialTestimonials ?? []).slice(0, 3));

  useEffect(() => {
    const shuffled = [...(initialTestimonials ?? [])].sort(() => Math.random() - 0.5);
    setTestimonials(shuffled.slice(0, 3));
    setActiveIndex(0);
    setIsHydrated(true);
  }, [initialTestimonials]);

  const handlePrevious = () => {
    if (!isHydrated) return;
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!isHydrated) return;
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    if (!isHydrated) return;
    setActiveIndex(index);
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-block px-4 py-2 bg-success/10 rounded-full text-success font-semibold font-headline text-sm mb-4">
            Client Success Stories
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-headline text-foreground mb-4">
            Trusted by Maldivian Businesses
          </h2>
          <p className="text-lg text-muted-foreground font-body">
            Hear from our satisfied clients about their experience working with Red Creatic
          </p>
        </AnimatedSection>

        {/* Testimonial Carousel */}
        <AnimatedSection animation="zoom-in" className="max-w-5xl mx-auto">
          <div className="relative bg-card rounded-2xl shadow-interactive p-8 lg:p-12">
            {/* Quote Icon */}
            <div className="absolute top-8 left-8 opacity-10">
              <Icon name="ChatBubbleLeftRightIcon" size={64} className="text-primary" variant="solid" />
            </div>

            {/* Testimonial Content */}
            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`transition-opacity duration-500 ${
                    index === activeIndex ? 'opacity-100' : 'opacity-0 absolute inset-0'
                  }`}
                >
                  {/* Rating */}
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon key={i} name="StarIcon" size={24} className="text-accent" variant="solid" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-center mb-8">
                    <p className="text-lg lg:text-xl text-foreground font-body leading-relaxed italic">
                      "{testimonial.testimonial}"
                    </p>
                  </blockquote>

                  {/* Client Info */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-center">
                      <div className="font-bold font-headline text-lg text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground font-body">
                        {testimonial.position}
                      </div>
                      <div className="text-sm font-semibold text-primary font-headline">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevious}
              disabled={!isHydrated}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-surface hover:bg-primary hover:text-white rounded-full shadow-card flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50"
              aria-label="Previous testimonial"
            >
              <Icon name="ChevronLeftIcon" size={24} />
            </button>
            <button
              onClick={handleNext}
              disabled={!isHydrated}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-surface hover:bg-primary hover:text-white rounded-full shadow-card flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50"
              aria-label="Next testimonial"
            >
              <Icon name="ChevronRightIcon" size={24} />
            </button>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                disabled={!isHydrated}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-primary w-8' : 'bg-border hover:bg-primary/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* See All Testimonials Link */}
          <div className="text-center mt-6">
            <a
              href="/clients"
              className="inline-flex items-center gap-2 text-primary font-semibold font-headline text-sm hover:gap-3 transition-all duration-300"
            >
              Read all client stories
              <Icon name="ArrowRightIcon" size={16} />
            </a>
          </div>
        </AnimatedSection>

        {/* Trust Badges with Count-Up */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mt-16 max-w-4xl mx-auto">
          {[
            { value: 5000, suffix: '+', label: 'Projects Delivered', delay: 0 },
            { value: 200, suffix: '+', label: 'Happy Clients', delay: 100 },
            { value: 97, suffix: '%', label: 'Satisfaction Rate', delay: 200 },
            { value: 10, suffix: '+', label: 'Years Experience', delay: 300 },
          ].map((stat) => (
            <AnimatedSection key={stat.label} animation="zoom-in" delay={stat.delay} className="text-center">
              <CountUpStat
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                valueClassName="text-3xl lg:text-4xl font-bold font-headline text-primary mb-2 block"
                labelClassName="text-sm text-muted-foreground font-body"
              />
            </AnimatedSection>
          ))}
        </div>

        {/* CTA Banner */}
        <AnimatedSection animation="fade-up" delay={200} className="mt-16 bg-primary rounded-2xl p-8 lg:p-12 text-center text-primary-foreground">
          <h3 className="text-2xl lg:text-3xl font-bold font-headline mb-3">
            Ready to Elevate Your Brand?
          </h3>
          <p className="text-primary-foreground/80 font-body mb-6 max-w-xl mx-auto">
            Join 200+ businesses that trust Red Creatic for premium printing and signage. Get your free quote today — no obligation.
          </p>
          <a
            href="/say-hello"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-semibold font-body hover:bg-primary-foreground transition-colors duration-200 shadow-lg"
          >
            <Icon name="ChatBubbleLeftRightIcon" size={18} />
            Get a Free Quote
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ClientTestimonials;
