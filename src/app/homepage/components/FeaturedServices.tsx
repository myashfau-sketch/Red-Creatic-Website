'use client';

import { useEffect, useState } from 'react';
import Icon from '../../../components/ui/AppIcon';
import { AnimatedSection } from '../../../components/common/AnimatedSection';
import type { Service } from '../../../data/services';

const shuffleServices = (items: Service[]) => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
};

const FeaturedServices = ({ initialServices }: { initialServices: Service[] }) => {
  const [services, setServices] = useState<Service[]>(initialServices.slice(0, 4));

  useEffect(() => {
    setServices(shuffleServices(initialServices).slice(0, 4));
  }, [initialServices]);

  return (
    <section className="bg-surface py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <AnimatedSection
          animation="fade-up"
          className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
          <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Our Expertise
          </div>
          <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl xl:text-5xl">
            Crafted Locally For Everyday Business Needs
          </h2>
          <p className="text-lg text-muted-foreground">
            A featured selection of in-house services shaped by local experience, careful
            production, and practical business use.
          </p>
        </AnimatedSection>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {services.map((service, idx) => (
            <AnimatedSection key={service.id} animation="fade-up" delay={idx * 100}>
              <div className="group h-full rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-interactive lg:p-8">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary">
                    <Icon
                      name={service.icon as any}
                      size={28}
                      className="text-primary transition-colors duration-300 group-hover:text-white"
                    />
                  </div>
                </div>

                <h3 className="mb-3 text-center text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                  {service.title}
                </h3>
                <p className="mb-4 text-justify text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>

                <ul className="space-y-2">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Icon
                        name="CheckCircleIcon"
                        size={16}
                        className="mt-0.5 flex-shrink-0 text-success"
                        variant="solid"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-up" delay={200} className="mt-12 text-center lg:mt-16">
          <a
            href="/what-we-offer"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-hover hover:shadow-interactive">
            View All Services
            <Icon name="ArrowRightIcon" size={20} className="ml-2" />
          </a>
          <p className="mt-4 text-sm text-muted-foreground">
            Not sure what you need?{' '}
            <a href="/say-hello" className="font-semibold text-primary hover:underline">
              Talk to us - it&apos;s free
            </a>
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FeaturedServices;
