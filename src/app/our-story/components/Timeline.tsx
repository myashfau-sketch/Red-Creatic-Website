'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatedSection } from '../../../components/common/AnimatedSection';

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  milestones: string[];
}

interface TimelineProps {
  className?: string;
  items?: TimelineItem[];
}

export const fallbackTimelineData: TimelineItem[] = [
  {
    year: '2017',
    title: 'Early Beginnings',
    description:
      'The journey of Red Creatic began with a simple but powerful idea — to elevate the standard of printing and signage services in the Maldives. With limited resources but a strong vision, the focus was on learning the craft, understanding materials, and experimenting with different production methods. This was a year of groundwork, where every small project contributed to building confidence, skill, and direction. Early client interactions helped shape the company’s customer-first approach, while hands-on experience laid the foundation for quality, reliability, and long-term growth.',
    milestones: [
      'Initial concept and groundwork for a creative printing business',
      'Started with small-scale projects and limited equipment',
      'Built first client relationships through word-of-mouth'
    ]
  },
  {
    year: '2018',
    title: 'Foundation',
    description:
      'In 2018, Red Creatic officially stepped into the market with a clear commitment to delivering high-quality printing and signage solutions. Operating with a small but dedicated team, the company focused on building trust through consistency, attention to detail, and timely delivery. Each project was treated as an opportunity to prove reliability and professionalism. This year was crucial in establishing the company’s identity, building a loyal customer base, and setting the standards that would guide its future operations and reputation.',
    milestones: [
      'Started operations with a small team and basic machines',
      'Delivered first major signage and print jobs',
      'Built a reputation for timely delivery and clean finishing'
    ]
  },
  {
    year: '2019',
    title: 'Growth & Expansion',
    description:
      'As demand steadily increased, Red Creatic began expanding its services and capabilities. The company took on more complex and larger-scale projects, working with resorts, businesses, and councils across multiple islands. This expansion required improvements in workflow, coordination, and production processes. It marked a shift from a small startup to a growing service provider with broader reach and stronger technical confidence. The year was defined by learning through scale and building the capacity to handle diverse client requirements effectively.',
    milestones: [
      'Expanded service offerings to include custom signage solutions',
      'Worked with resorts, businesses, and councils across islands',
      'Improved production processes and workflow efficiency'
    ]
  },
  {
    year: '2020',
    title: 'Resilience During COVID',
    description:
      'The global COVID-19 pandemic created unprecedented challenges, especially in the Maldives where tourism plays a central role in the economy. Despite the slowdown in demand, Red Creatic remained operational by adapting quickly and focusing on essential and local projects. This period required careful decision-making, financial discipline, and operational flexibility. While growth slowed, the company strengthened its internal systems, built resilience, and learned to navigate uncertainty. This year became a defining moment that reinforced stability and long-term sustainability.',
    milestones: [
      'Sustained operations during COVID with reduced demand',
      'Focused on essential and local projects to maintain stability',
      'Strengthened internal systems and cost control'
    ]
  },
  {
    year: '2021',
    title: 'Recovery & Stability',
    description:
      'With the gradual reopening of borders and recovery of the tourism sector, Red Creatic began regaining momentum. Client confidence returned, and project volumes increased steadily. The focus during this year was on stabilizing operations, improving team coordination, and maintaining consistent service quality. Strong relationships with returning clients played a key role in rebuilding the business. This period was less about rapid expansion and more about strengthening the foundation to ensure sustainable growth in the years ahead.',
    milestones: [
      'Regained client confidence and increased project volume',
      'Strengthened relationships with resorts and corporate clients',
      'Improved team coordination and service delivery speed'
    ]
  },
  {
    year: '2022',
    title: 'Strengthening Operations',
    description:
      'In 2022, Red Creatic focused on refining its internal operations and improving efficiency across all departments. The company handled larger and more complex orders while ensuring consistent quality. Workflows between sales, design, and production became more structured, allowing smoother project execution and better communication. This year emphasized discipline, process improvement, and operational clarity, enabling the company to manage higher volumes without compromising standards or delivery timelines.',
    milestones: [
      'Handled larger bulk orders and multi-location projects',
      'Improved internal workflow between sales, design, and production',
      'Maintained consistent quality across all product types'
    ]
  },
  {
    year: '2023',
    title: 'Diversification',
    description:
      'Red Creatic expanded its portfolio by introducing a wider range of customized products and services. From awards and decorative pieces to more creative branding solutions, the company adapted to evolving client needs. This diversification allowed entry into new segments such as schools, councils, and institutions, while maintaining strong ties with corporate and resort clients. Creativity and flexibility became key strengths, enabling the company to deliver unique solutions tailored to different industries.',
    milestones: [
      'Introduced more customized products including awards and decor',
      'Expanded work with councils, schools, and institutions',
      'Improved design capabilities for complex client requirements'
    ]
  },
  {
    year: '2024',
    title: 'Technology Upgrade',
    description:
      'A significant step forward, 2024 marked a major investment in advanced production technology. The introduction of industrial canvas printing equipment elevated both quality and efficiency. This upgrade enabled Red Creatic to produce higher-end products with greater consistency and faster turnaround times. It also opened doors to more demanding projects and larger clients. This year reflected a commitment to continuous improvement and staying ahead in a competitive and evolving industry.',
    milestones: [
      'Upgraded to industrial canvas printing technology',
      'Improved print quality and consistency significantly',
      'Increased production speed for large volume orders'
    ]
  },
  {
    year: '2025',
    title: 'Scaling & Efficiency',
    description:
      'With improved systems and technology in place, Red Creatic focused on scaling its operations to meet growing demand. The company successfully handled high-volume projects across various sectors while maintaining efficiency and quality. Logistics and delivery processes were further optimized, ensuring smoother coordination across different locations. This year strengthened the company’s reputation as a reliable and capable partner for both small and large-scale projects.',
    milestones: [
      'Handled high-volume projects across multiple sectors',
      'Optimized logistics and delivery processes',
      'Strengthened brand presence across Maldives'
    ]
  },
  {
    year: '2026',
    title: 'Advanced Capabilities',
    description:
      'In 2026, Red Creatic entered a new phase of growth by expanding its capabilities with advanced machinery and services. The introduction of large flatbed printing allowed the company to take on bigger, more complex, and premium projects. This marked a shift toward becoming a full-service provider capable of delivering comprehensive branding and signage solutions. With stronger capacity and experience, the company positioned itself as a leading name in the Maldivian printing industry.',
    milestones: [
      'Introduced large flatbed printing capabilities',
      'Expanded into larger format and premium signage solutions',
      'Positioned Red Creatic as a leading printing partner in the Maldives'
    ]
  }
];

const Timeline = ({ className = '', items = fallbackTimelineData }: TimelineProps) => {
  const timelineData = items.length > 0 ? items : fallbackTimelineData;
  const [activeYear, setActiveYear] = useState(timelineData[0]?.year ?? '');
  const railRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);
  const activeIndex = Math.max(
    0,
    timelineData.findIndex((item) => item.year === activeYear)
  );
  const activeItem = timelineData[activeIndex] ?? timelineData[0];
  const milestonePoints = useMemo(() => activeItem.milestones, [activeItem.milestones]);

  useEffect(() => {
    if (!timelineData.some((item) => item.year === activeYear)) {
      setActiveYear(timelineData[0]?.year ?? '');
    }
  }, [activeYear, timelineData]);

  const setYearByIndex = (nextIndex: number) => {
    const clampedIndex = Math.min(timelineData.length - 1, Math.max(0, nextIndex));
    setActiveYear(timelineData[clampedIndex].year);
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const activeButton = rail.querySelector<HTMLButtonElement>(`button[data-year="${activeYear}"]`);
    activeButton?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }, [activeYear]);

  return (
    <section className={`py-16 bg-surface ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto w-full">
          <AnimatedSection animation="fade-up" className="text-center mb-8 sm:mb-10">
            <p className="text-sm uppercase tracking-[0.18em] text-primary/80 font-body mb-3">
              Our Journey
            </p>
            <h2 className="mb-2 text-xl font-semibold font-body text-foreground md:text-3xl">
              A simple look at how Red Creatic has grown
            </h2>
            <p className="mx-auto max-w-2xl text-xs text-muted-foreground font-body leading-6 md:text-base md:leading-7">
              Browse the years on the left to follow the milestones that shaped our production, services, and direction.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={100}>
            <div className="grid lg:grid-cols-[220px_minmax(0,1fr)] gap-6 lg:gap-10">
              <div className="relative min-w-0">
                <div className="absolute left-[1.45rem] top-0 bottom-0 hidden w-px bg-border/80 dark:bg-red-500/25 sm:block" />
                <button
                  type="button"
                  onClick={() => setYearByIndex(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  className="hidden sm:flex mb-3 mx-auto h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-card text-foreground transition hover:border-primary/35 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous year"
                >
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path d="M5 12.5 10 7.5l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  ref={railRef}
                  className="timeline-year-rail flex max-w-full gap-2 overflow-x-auto pb-3 pt-2 sm:mx-0 sm:block sm:max-h-[560px] sm:space-y-3 sm:overflow-y-auto sm:px-2 sm:pb-3 sm:pt-2"
                >
                  {timelineData.map((item, index) => {
                    const isActive = item.year === activeYear;

                    return (
                      <button
                        key={item.year}
                        data-year={item.year}
                        type="button"
                        onClick={() => setActiveYear(item.year)}
                        className={`relative w-[96px] shrink-0 text-left rounded-2xl border px-3 py-3 transition-all duration-200 sm:min-w-0 sm:w-full sm:px-4 sm:py-3.5 ${
                          isActive
                            ? 'border-red-500 bg-card text-foreground ring-2 ring-red-500/35 shadow-[0_0_0_1px_rgba(239,68,68,0.95),0_0_18px_rgba(239,68,68,0.24),0_0_34px_rgba(239,68,68,0.14)] dark:border-[3px] dark:border-red-500 dark:ring-red-500/35 dark:shadow-[0_0_0_1px_rgba(239,68,68,0.95),0_0_18px_rgba(239,68,68,0.24),0_0_34px_rgba(239,68,68,0.14)]'
                            : 'border-border/70 bg-card text-foreground hover:border-primary/35 hover:bg-card/80 dark:hover:border-red-500/45'
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span
                            className={`relative z-10 flex h-4 w-4 shrink-0 rounded-full border ${
                              isActive
                                ? 'border-neutral-950 bg-neutral-950 dark:border-white dark:bg-white'
                                : 'border-primary/35 bg-background'
                            }`}
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold font-body sm:text-base">
                              {item.year}
                            </div>
                            <div
                              className={`text-[11px] leading-4 mt-0.5 ${
                                isActive ? 'text-foreground/80' : 'text-muted-foreground'
                              }`}
                            >
                              {index === timelineData.length - 1 ? 'Current phase' : item.title}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setYearByIndex(activeIndex + 1)}
                  disabled={activeIndex === timelineData.length - 1}
                  className="hidden sm:flex mt-3 mx-auto h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-card text-foreground transition hover:border-primary/35 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next year"
                >
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div className="min-w-0 overflow-hidden rounded-[28px] border border-border/70 bg-card p-4 md:p-7 lg:p-8 shadow-card">
                <div key={activeItem.year} className="timeline-content-animate flex min-w-0 flex-col gap-4 md:gap-5">
                  <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-primary/80 font-body mb-2">
                        {activeItem.year}
                      </p>
                      <h3 className="text-lg md:text-2xl font-semibold font-body text-foreground leading-tight">
                        {activeItem.title}
                      </h3>
                    </div>

                      <div className="rounded-2xl border border-border/70 bg-background px-4 py-2.5 text-xs text-muted-foreground font-body dark:border-red-500/25 dark:bg-red-500/[0.06]">
                        Step {activeIndex + 1} of {timelineData.length}
                      </div>
                  </div>

                  <div className="rounded-[24px] border border-border/60 bg-background p-4 md:p-6 dark:border-red-500/20 dark:bg-red-500/[0.04]">
                    <p className="text-xs md:text-base text-foreground/80 font-body leading-6 md:leading-7">
                      {activeItem.description}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-red-500/15 bg-red-500/[0.05] p-4 md:p-6 dark:border-red-500/30 dark:bg-red-500/[0.08]">
                    <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-primary/80 font-body md:mb-3">
                      Milestones
                    </p>
                    <ul className="space-y-2">
                      {milestonePoints.map((point, index) => (
                        <li
                          key={point}
                          className="timeline-milestone-animate flex items-start gap-3"
                          style={{ animationDelay: `${120 + index * 55}ms` }}
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span className="text-xs md:text-base text-foreground font-body leading-6 md:leading-7">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      <style jsx>{`
        .timeline-year-rail {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .timeline-year-rail::-webkit-scrollbar {
          display: none;
        }

        .timeline-content-animate {
          animation: timelineFadeIn 900ms ease-out;
        }

        .timeline-milestone-animate {
          opacity: 0;
          animation: timelineFadeUp 760ms ease-out forwards;
        }

        @keyframes timelineFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes timelineFadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Timeline;
