'use client';

import { AnimatedSection } from '../../../components/common/AnimatedSection';

interface CompanyIntroProps {
  className?: string;
}

const CompanyIntro = ({ className = '' }: CompanyIntroProps) => {
  return (
    <section className={`bg-background py-8 md:py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-3 gap-3 md:mt-4 md:gap-8">
            {[
              {
                color: 'bg-primary',
                icon: (
                  <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Precision',
                desc: 'Every project executed with meticulous attention to detail and technical excellence',
              },
              {
                color: 'bg-accent',
                icon: (
                  <svg className="w-8 h-8 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: 'Creativity',
                desc: 'Innovative solutions that make your brand stand out in the Maldivian market',
              },
              {
                color: 'bg-success',
                icon: (
                  <svg className="w-8 h-8 text-success-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: 'Reliability',
                desc: 'Trusted partner delivering consistent quality and meeting every deadline',
              },
            ].map((item, idx) => (
              <AnimatedSection key={item.title} animation="fade-up" delay={idx * 120}>
                <div className="rounded-lg bg-surface p-3 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-interactive sm:p-6">
                  <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${item.color} sm:mb-4 sm:h-16 sm:w-16`}>
                    {item.icon}
                  </div>
                  <h3 className="mb-1 text-[13px] font-semibold font-headline text-foreground sm:mb-2 sm:text-xl">{item.title}</h3>
                  <p className="text-[10px] leading-5 text-muted-foreground font-body sm:text-base">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyIntro;
