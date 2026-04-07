'use client';

import { useEffect, useMemo, useState } from 'react';
import Icon from '../../../components/ui/AppIcon';

interface ServiceModalProps {
  service: {
    id: number;
    title: string;
    description: string;
    icon: string;
    customIconSvg?: string;
    category: string;
    mainImageUrl?: string;
    galleryImages?: string[];
    productIdeas?: string[];
    features: string[];
    technicalSpecs: {
      materials: string[];
      qualityStandards: string[];
    };
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const FALLBACK_SERVICE_IMAGE = '/assets/images/no_image.png';

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
  'Metal Working': ['Metal sign frames', 'Fabricated lettering', 'Structural display supports', 'Outdoor branded fixtures'],
};

const ServiceModal = ({ service, isOpen, onClose }: ServiceModalProps) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [pausedUntil, setPausedUntil] = useState<number | null>(null);
  const safeServiceTitle = service?.title ?? '';
  const productIdeas = service?.productIdeas?.filter(Boolean)?.length
    ? service.productIdeas.filter(Boolean)
    : productIdeasByService[safeServiceTitle] ?? [
    'Custom branded pieces',
    'Display items',
    'Signage applications',
    'Business-ready production outputs',
  ];

  const serviceImages = useMemo(() => {
    if (!service) return [FALLBACK_SERVICE_IMAGE];

    const images = Array.from(
      new Set([service.mainImageUrl, ...(service.galleryImages ?? [])].filter(Boolean))
    ) as string[];

    return images.length > 0 ? images : [FALLBACK_SERVICE_IMAGE];
  }, [service]);

  const activePhoto = serviceImages[activePhotoIndex] ?? serviceImages[0] ?? FALLBACK_SERVICE_IMAGE;

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
    if (!isOpen || serviceImages.length <= 1) return;

    const interval = setInterval(() => {
      if (pausedUntil && Date.now() < pausedUntil) {
        return;
      }

      setActivePhotoIndex((current) => (current + 1) % serviceImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, pausedUntil, serviceImages]);

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 p-2 backdrop-blur-sm animate-fade-in sm:p-4 md:p-6">
      <div className="flex min-h-full items-center justify-center">
        <div className="h-[88vh] w-full max-w-6xl overflow-hidden rounded-[20px] border border-border/60 bg-card shadow-modal animate-slide-up sm:h-[82vh] md:h-[70vh] md:rounded-[24px]">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-card/95 px-3 py-3 backdrop-blur-md sm:px-4 sm:py-3.5 md:px-5 md:py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Icon name={service.icon as never} svgCode={service.customIconSvg} size={18} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="mb-1 text-xs font-body uppercase tracking-[0.16em] text-primary/80">{service.category}</p>
                <h2 className="truncate text-base font-semibold text-foreground md:text-lg">{service.title}</h2>
              </div>
            </div>

            <button onClick={onClose} className="rounded-full p-2 transition-colors duration-300 hover:bg-surface" aria-label="Close modal">
              <Icon name="XMarkIcon" size={22} className="text-foreground" />
            </button>
          </div>

          <div className="h-[calc(88vh-60px)] overflow-hidden p-3 sm:h-[calc(82vh-68px)] sm:p-4 md:h-[calc(70vh-68px)] md:p-4.5 lg:p-5">
            <div className="grid h-full min-h-0 items-start gap-3 md:gap-4 xl:grid-cols-[0.88fr_1.12fr]">
              <div className="hidden h-full min-h-0 flex-col xl:flex">
                <div className="sticky top-0 flex flex-col">
                  <div className="relative aspect-[1/0.9] w-full overflow-hidden rounded-[22px] border border-border/60 bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={activePhoto} alt={`${service.title} preview`} className="h-full w-full object-cover" />
                  </div>

                  {serviceImages.length > 1 ? (
                    <div className="mt-3 grid w-full grid-cols-5 gap-2">
                      {serviceImages.map((image, index) => {
                        const isActive = index === activePhotoIndex;

                        return (
                          <button
                            key={`${image}-${index}`}
                            type="button"
                            onClick={() => {
                              setActivePhotoIndex(index);
                              setPausedUntil(Date.now() + 7000);
                            }}
                            className={`relative aspect-square overflow-hidden rounded-[12px] border transition-all duration-200 ${
                              isActive ? 'border-primary ring-2 ring-primary/25' : 'border-border/60 hover:border-primary/35'
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={image} alt={`${service.title} image ${index + 1}`} className="h-full w-full object-cover" />
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="h-full min-h-0 overflow-y-auto pr-1 md:pr-3">
                <div className="space-y-5">
                  <div className="overflow-hidden rounded-[20px] border border-border/60 bg-surface xl:hidden">
                    <div className="relative aspect-[16/10] w-full bg-card">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={activePhoto} alt={`${service.title} preview`} className="h-full w-full object-cover" />
                    </div>
                    {serviceImages.length > 1 ? (
                      <div className="grid grid-cols-4 gap-2 p-3 sm:grid-cols-5">
                        {serviceImages.map((image, index) => {
                          const isActive = index === activePhotoIndex;

                          return (
                            <button
                              key={`${image}-mobile-${index}`}
                              type="button"
                              onClick={() => {
                                setActivePhotoIndex(index);
                                setPausedUntil(Date.now() + 7000);
                              }}
                              className={`relative aspect-square overflow-hidden rounded-[12px] border transition-all duration-200 ${
                                isActive ? 'border-primary ring-2 ring-primary/25' : 'border-border/60 hover:border-primary/35'
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={image} alt={`${service.title} image ${index + 1}`} className="h-full w-full object-cover" />
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-[20px] border border-border/60 bg-surface p-4 md:rounded-[22px] md:p-5">
                    <div>
                      <p className="mb-2 text-[11px] font-body uppercase tracking-[0.18em] text-primary/80">Crafted Service</p>
                      <h3 className="text-xl font-semibold leading-tight text-foreground md:text-2xl">{service.title}</h3>
                    </div>

                    <p className="mt-4 text-sm font-body leading-6 text-foreground/78">{service.description}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {service.technicalSpecs.materials.map((material) => (
                        <span key={material} className="rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-body text-foreground">
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[20px] border border-border/60 bg-surface p-4 md:rounded-[22px] md:p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <p className="text-[11px] font-body uppercase tracking-[0.18em] text-primary/80">Product Ideas</p>
                    </div>
                    <div className="grid gap-3">
                      {productIdeas.map((idea, index) => (
                        <div key={idea} className="flex items-start gap-3 rounded-[18px] border border-border/60 bg-card px-3.5 py-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                            {index + 1}
                          </span>
                          <span className="text-sm font-body leading-6 text-foreground">{idea}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-[20px] border border-border/60 bg-surface p-4 md:rounded-[22px] md:p-5">
                      <p className="mb-4 text-[11px] font-body uppercase tracking-[0.18em] text-primary/80">Core Features</p>
                      <div className="space-y-3">
                        {service.features.slice(0, 5).map((feature) => (
                          <div key={feature} className="flex items-start gap-3">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span className="text-sm font-body leading-6 text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-border/60 bg-surface p-4 md:rounded-[22px] md:p-5">
                      <p className="mb-4 text-[11px] font-body uppercase tracking-[0.18em] text-primary/80">Quality Standards</p>
                      <div className="space-y-3">
                        {service.technicalSpecs.qualityStandards.map((standard) => (
                          <div key={standard} className="flex items-start gap-3 rounded-[18px] border border-border/60 bg-card px-3.5 py-3">
                            <Icon name="ShieldCheckIcon" size={16} className="mt-0.5 shrink-0 text-primary" variant="solid" />
                            <span className="text-sm font-body leading-6 text-foreground">{standard}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                    <a href="/say-hello" className="flex-1 rounded-full bg-primary px-4.5 py-2.5 text-center font-body font-semibold text-primary-foreground shadow-card transition-all duration-300 hover:bg-hover hover:shadow-interactive">
                      Request Quote
                    </a>
                    <a href="/portfolio" className="flex-1 rounded-full border border-border bg-surface px-4.5 py-2.5 text-center font-body font-semibold text-foreground transition-all duration-300 hover:bg-muted">
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
