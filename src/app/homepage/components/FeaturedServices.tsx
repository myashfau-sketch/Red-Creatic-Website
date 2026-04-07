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
    <section className="bg-surface py-12 md:py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <AnimatedSection
          animation="fade-up"
          className="mx-auto mb-10 max-w-3xl text-center lg:mb-16">
          <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Our Expertise
          </div>
          <h2 className="mb-2 text-[1.65rem] font-bold text-foreground md:text-3xl lg:text-4xl xl:text-5xl">
            Crafted Locally For Everyday Business Needs
          </h2>
          <p className="text-xs leading-6 text-muted-foreground md:text-base lg:text-lg">
            A featured selection of in-house services shaped by local experience, careful
            production, and practical business use.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {services.map((service, idx) => (
            <AnimatedSection key={service.id} animation="fade-up" delay={idx * 100}>
              <div className="group h-full rounded-xl border border-border bg-card p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-interactive sm:p-6 lg:p-8">
                <div className="mb-4 flex justify-center sm:mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary sm:h-14 sm:w-14">
                    <Icon
                      name={service.icon as any}
                      svgCode={service.customIconSvg}
                      size={28}
                      className="text-primary transition-colors duration-300 group-hover:text-black dark:group-hover:text-white"
                    />
                  </div>
                </div>

                <h3 className="mb-2 text-center text-[15px] font-bold text-foreground transition-colors duration-300 group-hover:text-primary sm:text-xl">
                  {service.title}
                </h3>
                <p className="mb-3 text-justify text-xs leading-5 text-muted-foreground sm:mb-4 sm:text-sm sm:leading-6">
                  {service.description}
                </p>

                <ul className="space-y-1.5 sm:space-y-2">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-xs text-muted-foreground sm:text-sm">
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
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-hover hover:shadow-interactive sm:w-auto">
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
