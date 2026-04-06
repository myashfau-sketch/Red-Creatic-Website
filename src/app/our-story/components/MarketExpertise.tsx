'use client';

import { AnimatedSection } from '../../../components/common/AnimatedSection';

interface ExpertiseArea {
  title: string;
  description: string;
  icon: string;
}

interface MarketExpertiseProps {
  className?: string;
}

const MarketExpertise = ({ className = '' }: MarketExpertiseProps) => {
  const expertiseAreas: ExpertiseArea[] = [
    {
      title: 'Resort Industry Specialists',
      description: 'Deep understanding of luxury resort branding, signage requirements, and guest experience enhancement through visual communication',
      icon: 'building'
    },
    {
      title: 'Island Logistics Mastery',
      description: 'Expert coordination of materials and delivery across all atolls, ensuring timely project completion despite geographical challenges',
      icon: 'truck'
    },
    {
      title: 'Cultural Sensitivity',
      description: 'Respectful integration of local business practices and cultural considerations in every design and communication strategy',
      icon: 'users'
    },
    {
      title: 'Local Business Registration',
      description: 'Fully licensed and certified Maldivian business with comprehensive understanding of local regulations and quality standards',
      icon: 'certificate'
    },
    {
      title: 'Multilingual Capabilities',
      description: 'Fluent in Dhivehi and English, ensuring clear communication and culturally appropriate content for diverse audiences',
      icon: 'language'
    },
    {
      title: 'Sustainable Practices',
      description: 'Committed to eco-friendly materials and processes that align with Maldives environmental protection goals',
      icon: 'leaf'
    }
  ];

  const getIconPath = (icon: string) => {
    switch (icon) {
      case 'building':
        return 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4';
      case 'truck':
        return 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0';
      case 'users':
        return 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z';
      case 'certificate':
        return 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z';
      case 'language':
        return 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129';
      case 'leaf':
        return 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z';
      default:
        return '';
    }
  };

  return (
    <section className={`py-16 bg-background ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground mb-4">
              Maldivian Market Expertise
            </h2>
            <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
              Specialized understanding of the unique Maldivian business landscape and local market dynamics
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertiseAreas.map((area, idx) => (
              <AnimatedSection key={area.title} animation="fade-up" delay={idx * 80}>
                <div className="bg-card p-6 rounded-lg shadow-card hover:shadow-interactive hover:-translate-y-1 transition-all duration-300 border-l-4 border-accent h-full">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-accent-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d={getIconPath(area.icon)} />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold font-headline text-foreground mb-2">
                        {area.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-body leading-relaxed">
                        {area.description}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection animation="zoom-in" delay={200} className="mt-12 bg-primary/5 border-2 border-primary rounded-lg p-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold font-headline text-foreground mb-3">
                  Established & Trusted
                </h3>
                <p className="text-muted-foreground font-body leading-relaxed mb-4">
                  Red Creatic is a fully licensed Maldivian business built on dependable service, careful workmanship, and strong local understanding. We focus on clear communication, consistent quality, and practical solutions that fit the needs of businesses across the Maldives.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-primary/10 text-primary font-semibold font-body text-sm rounded-full">
                    Licensed Business
                  </span>
                  <span className="px-4 py-2 bg-accent/10 text-accent font-semibold font-body text-sm rounded-full">
                    Locally Experienced
                  </span>
                  <span className="px-4 py-2 bg-success/10 text-success font-semibold font-body text-sm rounded-full">
                    Quality Focused
                  </span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default MarketExpertise;
