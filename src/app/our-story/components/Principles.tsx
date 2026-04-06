'use client';

import { AnimatedSection } from '../../../components/common/AnimatedSection';

interface Principle {
  icon: string;
  title: string;
  description: string;
  values: string[];
}

interface PrinciplesProps {
  className?: string;
}

const Principles = ({ className = '' }: PrinciplesProps) => {
  const principles: Principle[] = [
    {
      icon: 'star',
      title: 'Professional Excellence',
      description: 'We maintain the highest standards in every project, ensuring quality that exceeds expectations',
      values: ['Quality Assurance', 'Technical Expertise', 'Attention to Detail', 'Continuous Improvement']
    },
    {
      icon: 'lightbulb',
      title: 'Trusted Innovation',
      description: 'Combining cutting-edge technology with proven reliability to deliver innovative solutions',
      values: ['Modern Technology', 'Proven Methods', 'Client Confidence', 'Transparent Process']
    },
    {
      icon: 'heart',
      title: 'Client-Centric Approach',
      description: 'Deep commitment to understanding and fulfilling the unique needs of Maldivian businesses',
      values: ['Local Understanding', 'Personalized Service', 'Long-term Partnerships', 'Cultural Sensitivity']
    }
  ];

  const getIconPath = (icon: string) => {
    switch (icon) {
      case 'star':
        return 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z';
      case 'lightbulb':
        return 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z';
      case 'heart':
        return 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z';
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
              Our Core Principles
            </h2>
            <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
              The values that guide every decision and drive our commitment to excellence
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8">
            {principles.map((principle, idx) => (
              <AnimatedSection key={principle.title} animation="fade-up" delay={idx * 120}>
                <div className="bg-card p-8 rounded-lg shadow-card hover:shadow-interactive hover:-translate-y-1 transition-all duration-300 border-t-4 border-primary h-full">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                      <path d={getIconPath(principle.icon)} />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold font-headline text-foreground mb-3">
                    {principle.title}
                  </h3>
                  <p className="text-muted-foreground font-body mb-6 leading-relaxed">
                    {principle.description}
                  </p>
                  <ul className="space-y-2">
                    {principle.values.map((value) => (
                      <li key={value} className="flex items-start">
                        <svg className="w-5 h-5 text-success mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-foreground font-body">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Principles;