'use client';

import { AnimatedSection } from '../../../components/common/AnimatedSection';

interface LocalProductionProps {
  className?: string;
}

const LocalProduction = ({ className = '' }: LocalProductionProps) => {
  return (
    <section className={`bg-background py-10 md:py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection animation="fade-up">
            <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
              <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="border-b border-border/70 p-6 lg:border-b-0 lg:border-r lg:p-10">
                  <p className="mb-3 text-sm uppercase tracking-[0.2em] text-primary/80">
                    Made In Maldives
                  </p>
                  <h2 className="max-w-xl text-2xl font-bold font-headline text-foreground md:text-4xl">
                    Everything we deliver is produced in our own workshop
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                    We do not import ready-made products and pass them on to our clients. What we offer is designed, prepared, finished, and produced through our own team and workshop processes here in the Maldives.
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:mt-4 sm:text-base sm:leading-8">
                    That gives us better control over quality, timelines, customization, and finishing. It also means every order carries the care, accountability, and pride of local production.
                  </p>
                </div>

                <div className="bg-primary/5 p-5 sm:p-8 lg:p-10">
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-1">
                    {[
                      {
                        title: 'Produced In-House',
                        description: 'Work is handled through our own workshop instead of relying on imported ready-made stock.',
                      },
                      {
                        title: 'Made In Maldives',
                        description: 'Our production happens locally, with a process built around Maldivian business needs and deadlines.',
                      },
                      {
                        title: 'Proudly Original',
                        description: 'We take pride in delivering work we have actually made, not simply sourced and resold.',
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="rounded-[1rem] border border-primary/15 bg-card/80 p-3 sm:rounded-[1.4rem] sm:p-5"
                      >
                        <h3 className="text-sm font-semibold font-headline text-foreground sm:text-lg">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-[11px] leading-5 text-muted-foreground sm:mt-2 sm:text-sm sm:leading-7">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default LocalProduction;
