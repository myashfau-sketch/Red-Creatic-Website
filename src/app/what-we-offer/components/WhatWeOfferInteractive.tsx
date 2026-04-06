'use client';

import { useCallback, useEffect, useState } from 'react';
import ServiceCard from './ServiceCard';
import ServiceModal from './ServiceModal';
import Icon from '../../../components/ui/AppIcon';
import { AnimatedSection, PageHero } from '../../../components/common/AnimatedSection';
import { fallbackServices, type Service } from '../../../data/services';

interface WhatWeOfferInteractiveProps {
  initialServices?: Service[];
}

const shuffleServices = (items: Service[]) => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
};

const WhatWeOfferInteractive = ({ initialServices = fallbackServices }: WhatWeOfferInteractiveProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState<Service[]>(() => shuffleServices(initialServices));

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    setServices(shuffleServices(initialServices));
  }, [initialServices]);

  const handleOpenModal = useCallback((service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 300);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div>
      <PageHero
        title="What We Offer"
        subtitle="Comprehensive printing, fabrication, and branding solutions tailored for your business needs. Browse the services here, then open any one for a richer visual popup."
      />

      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.18em] text-primary/80 font-body mb-3">
              Services
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold font-body text-foreground mb-3">
              Explore What We Can Produce
            </h2>
            <p className="text-sm md:text-base text-muted-foreground font-body max-w-2xl mx-auto leading-7">
              Open any service to view the more visual popup layout with details, materials, and room for service photos.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {services.map((service, idx) => (
              <AnimatedSection key={service.id} animation="fade-up" delay={idx * 50}>
                <ServiceCard service={service} onOpenModal={handleOpenModal} />
              </AnimatedSection>
            ))}
          </div>

          {services.length === 0 && (
            <div className="text-center py-16">
              <Icon name="MagnifyingGlassIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold font-headline text-foreground mb-2">No services found</h3>
              <p className="text-muted-foreground font-body">Try again after adding services.</p>
            </div>
          )}
        </div>
      </div>

      {selectedService && (
        <ServiceModal
          service={selectedService}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default WhatWeOfferInteractive;
