'use client';

import { useState, useEffect, useRef } from 'react';
import AppImage from '../../../components/ui/AppImage';
import Icon from '../../../components/ui/AppIcon';

interface FeaturedWork {
  id: number;
  title: string;
  category: string;
  image: string;
  alt: string;
  client: string;
}

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const HeroSection = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState<StatItem[]>([
  { value: 0, suffix: '+', label: 'Projects Delivered' },
  { value: 0, suffix: '+', label: 'Happy Clients' },
  { value: 0, suffix: '%', label: 'Satisfaction Rate' },
  { value: 0, suffix: '+', label: 'Years Experience' }]
  );
  const hasAnimated = useRef(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Count-up animation effect
  useEffect(() => {
    if (!isHydrated || hasAnimated.current) return;

    hasAnimated.current = true;
    const targetValues = [5000, 200, 97, 11];
    const duration = 3000; // 3 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setStats([
      { value: Math.floor(targetValues[0] * progress), suffix: '+', label: 'Projects Delivered' },
      { value: Math.floor(targetValues[1] * progress), suffix: '+', label: 'Happy Clients' },
      { value: Math.floor(targetValues[2] * progress), suffix: '%', label: 'Satisfaction Rate' },
      { value: Math.floor(targetValues[3] * progress), suffix: '+', label: 'Years Experience' }]
      );

      if (currentStep >= steps) {
        clearInterval(timer);
        setStats([
        { value: targetValues[0], suffix: '+', label: 'Projects Delivered' },
        { value: targetValues[1], suffix: '+', label: 'Happy Clients' },
        { value: targetValues[2], suffix: '%', label: 'Satisfaction Rate' },
        { value: targetValues[3], suffix: '+', label: 'Years Experience' }]
        );
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isHydrated]);

  const featuredWorks: FeaturedWork[] = [
  {
    id: 1,
    title: "Luxury Resort Signage",
    category: "Outdoor Signage",
    image: "https://images.unsplash.com/photo-1544133829-d16ca03e2eb0",
    alt: "Modern illuminated resort entrance sign with gold lettering on dark background at sunset",
    client: "Paradise Island Resort"
  },
  {
    id: 2,
    title: "Restaurant Menu Boards",
    category: "Indoor Signage",
    image: "https://images.unsplash.com/photo-1713286660613-805e4ea2f707",
    alt: "Elegant wooden menu board with white text displaying restaurant offerings in modern cafe setting",
    client: "Ocean View Restaurant"
  },
  {
    id: 3,
    title: "Retail Store Branding",
    category: "Large Format Printing",
    image: "https://images.unsplash.com/photo-1730736862882-3fa2245281ad",
    alt: "Colorful retail store window display with vibrant promotional banners and product showcases",
    client: "Maldives Fashion Hub"
  }];


  const handlePrevSlide = () => {
    if (!isHydrated) return;
    setCurrentSlide((prev) => prev === 0 ? featuredWorks.length - 1 : prev - 1);
  };

  const handleNextSlide = () => {
    if (!isHydrated) return;
    setCurrentSlide((prev) => prev === featuredWorks.length - 1 ? 0 : prev + 1);
  };

  const handleDotClick = (index: number) => {
    if (!isHydrated) return;
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!isHydrated) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev === featuredWorks.length - 1 ? 0 : prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHydrated, featuredWorks.length]);

  return (
    <section className="relative bg-gradient-to-br from-primary/5 to-accent/5 pt-16">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-4">
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full text-success font-semibold font-headline text-sm">
                <Icon name="CheckBadgeIcon" size={16} variant="solid" />
                Trusted by 200+ Maldivian Businesses
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold font-headline text-foreground leading-tight">
                Your Vision,{' '}
                <span className="text-primary">Our Precision</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground font-body leading-relaxed">
                Maldives' premier printing and signage specialists. We transform your brand ideas into stunning visual reality with local expertise and global quality standards.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/say-hello"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold font-body text-base hover:opacity-90 transition-opacity duration-200 shadow-lg">
                
                <Icon name="ChatBubbleLeftRightIcon" size={20} />
                Get a Free Quote
              </a>
              <a
                href="/projects"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold font-body text-base hover:bg-primary/5 transition-colors duration-200">
                
                <Icon name="EyeIcon" size={20} />
                See Our Work
              </a>
            </div>

            {/* Guarantee badges */}
            <div className="flex flex-wrap gap-4 pt-2">
              {[
              { icon: 'ShieldCheckIcon', label: 'Quality Guaranteed' },
              { icon: 'ClockIcon', label: 'On-Time Delivery' },
              { icon: 'CurrencyDollarIcon', label: 'Free Quotes' }].
              map((badge) =>
              <div key={badge.label} className="flex items-center gap-2 text-sm font-body text-foreground/70">
                  <Icon name={badge.icon as any} size={16} className="text-success" variant="solid" />
                  <span>{badge.label}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border">
              {stats.map((stat, index) =>
              <div key={index} className="space-y-1">
                  <div className="text-3xl lg:text-4xl font-bold font-headline text-primary">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-muted-foreground font-body">{stat.label}</div>
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Carousel */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-interactive">
              {featuredWorks.map((work, index) =>
              <div
                key={work.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'}`
                }>
                
                  <AppImage
                  src={work.image}
                  alt={work.alt}
                  className="w-full h-full object-cover" />
                
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white">
                    <div className="inline-block px-3 py-1 bg-primary/90 rounded-md text-xs font-semibold font-headline mb-2">
                      {work.category}
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold font-headline mb-1">
                      {work.title}
                    </h3>
                    <p className="text-sm text-white/80 font-body">{work.client}</p>
                  </div>
                </div>
              )}

              {/* Navigation Arrows */}
              <button
                onClick={handlePrevSlide}
                disabled={!isHydrated}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-card flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50"
                aria-label="Previous slide">
                
                <Icon name="ChevronLeftIcon" size={24} className="text-foreground" />
              </button>
              <button
                onClick={handleNextSlide}
                disabled={!isHydrated}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-card flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50"
                aria-label="Next slide">
                
                <Icon name="ChevronRightIcon" size={24} className="text-foreground" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {featuredWorks.map((_, index) =>
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  disabled={!isHydrated}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ?
                  'bg-white w-8' : 'bg-white/50 hover:bg-white/75'}`
                  }
                  aria-label={`Go to slide ${index + 1}`} />

                )}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-8 -right-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -z-10 -bottom-8 -left-8 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>);

};

export default HeroSection;