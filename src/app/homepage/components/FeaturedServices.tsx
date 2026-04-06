'use client';

import { useState, useEffect } from 'react';
import Icon from '../../../components/ui/AppIcon';
import { AnimatedSection } from '../../../components/common/AnimatedSection';

interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  features: string[];
}

const allServices: Service[] = [
  {
    id: 1,
    icon: "PrinterIcon",
    title: "Large Format Printing",
    description: "High-quality banners, posters, and signage for resorts, restaurants, and retail spaces across the Maldives.",
    features: ["Weather-resistant materials", "Vibrant color accuracy", "Quick turnaround"]
  },
  {
    id: 2,
    icon: "PencilSquareIcon",
    title: "Custom Signage Solutions",
    description: "Bespoke indoor and outdoor signage designed specifically for Maldivian businesses and tropical environments.",
    features: ["UV-resistant finishes", "Custom dimensions", "Professional installation"]
  },
  {
    id: 3,
    icon: "SparklesIcon",
    title: "Brand Identity Design",
    description: "Complete branding packages including logo design, business cards, and marketing materials for local businesses.",
    features: ["Local market expertise", "Cultural sensitivity", "Consistent branding"]
  },
  {
    id: 4,
    icon: "CubeIcon",
    title: "3D Signage & Displays",
    description: "Eye-catching dimensional signage and displays that make your brand stand out in competitive resort areas.",
    features: ["Premium materials", "LED integration", "Architectural mounting"]
  },
  {
    id: 5,
    icon: "BoltIcon",
    title: "Laser Cutting & Engraving",
    description: "Precision laser cutting and engraving for acrylic, wood, and metal — perfect for custom signage and awards.",
    features: ["±0.1mm precision", "Multiple materials", "Fast turnaround"]
  },
  {
    id: 6,
    icon: "PhotoIcon",
    title: "Canvas Printing",
    description: "Museum-quality canvas prints for artwork, photography, and decorative displays in resorts and offices.",
    features: ["UV-resistant inks", "Gallery-wrapped frames", "Custom sizes"]
  },
  {
    id: 7,
    icon: "RectangleStackIcon",
    title: "Vinyl Printing",
    description: "Durable vinyl printing for outdoor signage, banners, vehicle graphics, and wall decals built for the tropics.",
    features: ["Waterproof & UV-resistant", "Contour cutting", "Large format up to 5m"]
  },
  {
    id: 8,
    icon: "TruckIcon",
    title: "Vehicle Wrapping",
    description: "Professional vehicle wrapping and graphics that transform your fleet into powerful mobile advertisements.",
    features: ["3M certified installation", "Marine-grade materials", "Full & partial wraps"]
  },
  {
    id: 9,
    icon: "CogIcon",
    title: "CNC Cutting & Routing",
    description: "Advanced CNC cutting for wood, acrylic, aluminum, and composite materials with exceptional precision.",
    features: ["±0.05mm precision", "Large bed 2.4m×1.2m", "3D relief cutting"]
  },
  {
    id: 10,
    icon: "WrenchScrewdriverIcon",
    title: "Wood Working",
    description: "Custom woodworking for signage, furniture, and displays combining skilled craftsmanship with modern fabrication.",
    features: ["Marine-grade finishes", "CNC routing", "Custom designs"]
  }
];

const FeaturedServices = () => {
  const [services, setServices] = useState<Service[]>(allServices.slice(0, 4));

  useEffect(() => {
    const shuffled = [...allServices].sort(() => Math.random() - 0.5);
    setServices(shuffled.slice(0, 4));
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-surface">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold font-headline text-sm mb-4">
            Our Expertise
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-headline text-foreground mb-4">
            Premium Printing & Signage 
          </h2>
          <p className="text-lg text-muted-foreground font-body">
            Specialized solutions for Maldivian businesses with local market understanding and technical precision
          </p>
        </AnimatedSection>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, idx) => (
            <AnimatedSection key={service.id} animation="fade-up" delay={idx * 100}>
              <div
                className="group bg-card rounded-xl p-6 lg:p-8 shadow-card hover:shadow-interactive hover:-translate-y-1 transition-all duration-300 border border-border hover:border-primary/50 h-full"
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Icon 
                    name={service.icon as any} 
                    size={28} 
                    className="text-primary group-hover:text-white transition-colors duration-300" 
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold font-headline text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground font-body">
                      <Icon name="CheckCircleIcon" size={16} className="text-success mt-0.5 flex-shrink-0" variant="solid" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Learn More Link */}
                <a
                  href="/what-we-offer"
                  className="inline-flex items-center gap-2 mt-6 text-primary font-semibold font-headline text-sm hover:gap-3 transition-all duration-300"
                >
                  Learn More
                  <Icon name="ArrowRightIcon" size={16} />
                </a>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection animation="fade-up" delay={200} className="text-center mt-12 lg:mt-16">
          <a
            href="/what-we-offer"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-semibold font-headline text-base rounded-lg shadow-card hover:bg-hover hover:shadow-interactive hover:-translate-y-0.5 transition-all duration-300"
          >
            View All Services
            <Icon name="ArrowRightIcon" size={20} className="ml-2" />
          </a>
          <p className="mt-4 text-sm text-muted-foreground font-body">
            Not sure what you need?{' '}
            <a href="/say-hello" className="text-primary font-semibold hover:underline">
              Talk to us — it's free
            </a>
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FeaturedServices;