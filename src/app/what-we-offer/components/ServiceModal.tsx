'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Icon from '../../../components/ui/AppIcon';

interface ServiceModalProps {
  service: {
    id: number;
    title: string;
    description: string;
    icon: string;
    category: string;
    features: string[];
    technicalSpecs: {
      materials: string[];
      qualityStandards: string[];
    };
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const galleryItems = [
  { title: 'Main service photo', caption: 'Primary showcase angle' },
  { title: 'Work in progress', caption: 'Production process' },
  { title: 'Close-up detail', caption: 'Finish and material look' },
  { title: 'Finished output', caption: 'Ready for delivery' },
  { title: 'Installed result', caption: 'Real-world application' }
];

const productIdeasByService: Record<string, string[]> = {
  'Laser Cutting & Engraving': ['Acrylic name boards', 'Desk plates', 'Award plaques', 'Custom gift items'],
  'Canvas Printing': ['Wall art', 'Reception feature pieces', 'Resort room decor', 'Framed promotional visuals'],
  'Digital Printing': ['Business cards', 'Brochures', 'Menus', 'Flyers and booklets'],
  'Vinyl Printing': ['Shopfront stickers', 'Window graphics', 'Promotional decals', 'Event branding panels'],
  Plotting: ['Architectural plans', 'Engineering drawings', 'Construction submissions', 'Presentation boards'],
  'CNC Cutting and Routing': ['3D sign letters', 'Decor panels', 'Wayfinding boards', 'Custom display structures'],
  '3D Printing': ['Scale models', 'Prototype parts', 'Display mockups', 'Custom branded pieces'],
  'UV Printing': ['Acrylic signs', 'Branded boards', 'Custom plaques', 'Direct-printed display panels'],
  'Vehicle Wrapping': ['Fleet branding', 'Delivery van wraps', 'Boat graphics', 'Campaign vehicle decals'],
  'Wood Working': ['Wooden signs', 'Retail fixtures', 'Display stands', 'Interior branding pieces'],
  'Metal Working': ['Metal sign frames', 'Fabricated lettering', 'Structural display supports', 'Outdoor branded fixtures']
};

const ServiceModal = ({ service, isOpen, onClose }: ServiceModalProps) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [pausedUntil, setPausedUntil] = useState<number | null>(null);
  const safeServiceTitle = service?.title ?? '';
  const productIdeas = productIdeasByService[safeServiceTitle] ?? [
    'Custom branded pieces',
    'Display items',
    'Signage applications',
    'Business-ready production outputs'
  ];
  const activePhoto = useMemo(() => galleryItems[activePhotoIndex] ?? galleryItems[0], [activePhotoIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    setActivePhotoIndex(0);
    setPausedUntil(null);
  }, [service?.id, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      if (pausedUntil && Date.now() < pausedUntil) {
        return;
      }

      setActivePhotoIndex((current) => (current + 1) % galleryItems.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, service?.id, pausedUntil]);

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 md:p-6 animate-fade-in">
      <div className="flex items-center justify-center min-h-full">
        <div className="bg-card rounded-[24px] shadow-modal max-w-6xl w-full h-[70vh] overflow-hidden animate-slide-up border border-border/60">
          <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-md border-b border-border/60 px-4 py-3.5 md:px-5 md:py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon name={service.icon as any} size={18} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.16em] text-primary/80 font-body mb-1">
                  {service.category}
                </p>
                <h2 className="text-base md:text-lg font-semibold font-body text-foreground truncate">
                  {service.title}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-surface rounded-full transition-colors duration-300"
              aria-label="Close modal"
            >
              <Icon name="XMarkIcon" size={22} className="text-foreground" />
            </button>
          </div>

          <div className="h-[calc(70vh-68px)] overflow-hidden p-4 md:p-4.5 lg:p-5">
            <div className="grid h-full min-h-0 xl:grid-cols-[0.88fr_1.12fr] gap-4 items-start">
              <div className="hidden xl:flex h-full min-h-0 flex-col">
                <div className="sticky top-0 flex flex-col">
                  <div className="relative overflow-hidden rounded-[22px] border border-border/60 bg-surface aspect-[1/0.9] w-full">
                    <Image
                      src="/assets/images/no_image.png"
                      alt={`${service.title} ${activePhoto.title}`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="grid grid-cols-5 gap-2 mt-3 w-full">
                    {galleryItems.map((item, index) => {
                      const isActive = index === activePhotoIndex;

                      return (
                        <button
                          key={item.title}
                          type="button"
                          onClick={() => {
                            setActivePhotoIndex(index);
                            setPausedUntil(Date.now() + 7000);
                          }}
                          className={`relative overflow-hidden rounded-[12px] border transition-all duration-200 aspect-square ${
                            isActive
                              ? 'border-primary ring-2 ring-primary/25'
                              : 'border-border/60 hover:border-primary/35'
                          }`}
                        >
                          <Image
                            src="/assets/images/no_image.png"
                            alt={`${service.title} ${item.title}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="h-full min-h-0 overflow-y-auto pr-1 md:pr-3">
                <div className="space-y-5">
                  <div className="rounded-[22px] border border-border/60 bg-surface p-4 md:p-5">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-primary/80 font-body mb-2">
                        Crafted Service
                      </p>
                      <h3 className="text-xl md:text-2xl font-semibold font-body text-foreground leading-tight">
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-sm font-body text-foreground/78 leading-6 mt-4">
                      {service.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {service.technicalSpecs.materials.map((material) => (
                        <span
                          key={material}
                          className="px-3 py-1.5 rounded-full bg-card border border-border/60 text-xs font-body text-foreground"
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-border/60 bg-surface p-4 md:p-5">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-primary/80 font-body">
                        Product Ideas
                      </p>
                    </div>
                    <div className="grid gap-3">
                      {productIdeas.map((idea, index) => (
                        <div
                          key={idea}
                          className="flex items-start gap-3 rounded-[18px] border border-border/60 bg-card px-3.5 py-3"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-semibold">
                            {index + 1}
                          </span>
                          <span className="text-sm font-body text-foreground leading-6">{idea}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-4">
                    <div className="rounded-[22px] border border-border/60 bg-surface p-4 md:p-5">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-primary/80 font-body mb-4">
                        Core Features
                      </p>
                      <div className="space-y-3">
                        {service.features.slice(0, 5).map((feature) => (
                          <div key={feature} className="flex items-start gap-3">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            <span className="text-sm font-body text-foreground leading-6">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-border/60 bg-surface p-4 md:p-5">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-primary/80 font-body mb-4">
                        Quality Standards
                      </p>
                      <div className="space-y-3">
                        {service.technicalSpecs.qualityStandards.map((standard) => (
                          <div
                            key={standard}
                            className="flex items-start gap-3 rounded-[18px] border border-border/60 bg-card px-3.5 py-3"
                          >
                            <Icon name="ShieldCheckIcon" size={16} className="text-primary shrink-0 mt-0.5" variant="solid" />
                            <span className="text-sm font-body text-foreground leading-6">{standard}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <a
                      href="/say-hello"
                      className="flex-1 px-4.5 py-2.5 bg-primary text-primary-foreground font-semibold font-body text-center rounded-full shadow-card hover:bg-hover hover:shadow-interactive transition-all duration-300"
                    >
                      Request Quote
                    </a>
                    <a
                      href="/portfolio"
                      className="flex-1 px-4.5 py-2.5 bg-surface text-foreground font-semibold font-body text-center rounded-full border border-border hover:bg-muted transition-all duration-300"
                    >
                      View Portfolio
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
