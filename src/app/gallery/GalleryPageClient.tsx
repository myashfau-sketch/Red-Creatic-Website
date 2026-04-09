'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../homepage/components/Footer';
import Icon from '../../components/ui/AppIcon';
import { PageHero, AnimatedSection } from '../../components/common/AnimatedSection';
interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  serviceTags: string[];
  productTags: string[];
}

interface DisplayGalleryItem extends GalleryItem {
  sizeVariant: string;
}

interface GalleryPageClientProps {
  initialGalleryItems: GalleryItem[];
  serviceOptions: string[];
  productOptions: string[];
}

const ITEMS_PER_PAGE = 12;
const PRELOAD_BATCHES = 2;
const SIZE_VARIANTS = [
  'aspect-[4/5]',
  'aspect-[3/4]',
  'aspect-square',
  'aspect-[4/3]',
  'aspect-[5/4]',
  'aspect-[3/5]'
];

const shuffleItems = (items: GalleryItem[]): DisplayGalleryItem[] =>
  [...items]
    .sort(() => Math.random() - 0.5)
    .map((item, index) => ({
      ...item,
      sizeVariant: SIZE_VARIANTS[(index + Math.floor(Math.random() * SIZE_VARIANTS.length)) % SIZE_VARIANTS.length]
    }));

const SIZE_WEIGHTS: Record<string, number> = {
  'aspect-[4/5]': 1.25,
  'aspect-[3/4]': 1.33,
  'aspect-square': 1,
  'aspect-[4/3]': 0.75,
  'aspect-[5/4]': 0.8,
  'aspect-[3/5]': 1.67,
};

function getGalleryThumbnailSrc(src: string) {
  if (src.includes('supabase.co/storage/v1/object/public/')) {
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}width=360&quality=45&resize=contain`;
  }

  return src;
}

export default function GalleryPageClient({
  initialGalleryItems,
  serviceOptions,
  productOptions,
}: GalleryPageClientProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(8);
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [shuffledItems, setShuffledItems] = useState<DisplayGalleryItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const gallerySectionRef = useRef<HTMLElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  const isSnappingRef = useRef(false);
  const lastSelectionAtRef = useRef(0);
  const previousPositionsRef = useRef<Map<string, DOMRect> | null>(null);

  const filteredItems = useMemo(() => {
    return initialGalleryItems.filter((item) => {
      const matchesServices =
        selectedServices.length === 0 ||
        selectedServices.some((tag) => item.serviceTags.includes(tag));
      const matchesProducts =
        selectedProducts.length === 0 ||
        selectedProducts.some((tag) => item.productTags.includes(tag));

      return matchesServices && matchesProducts;
    });
  }, [initialGalleryItems, selectedProducts, selectedServices]);

  const availableServices = useMemo(() => {
    const matchingItems =
      selectedProducts.length === 0
        ? initialGalleryItems
        : initialGalleryItems.filter((item) =>
            selectedProducts.some((tag) => item.productTags.includes(tag))
          );

    return new Set(matchingItems.flatMap((item) => item.serviceTags));
  }, [initialGalleryItems, selectedProducts]);

  const availableProducts = useMemo(() => {
    const matchingItems =
      selectedServices.length === 0
        ? initialGalleryItems
        : initialGalleryItems.filter((item) =>
            selectedServices.some((tag) => item.serviceTags.includes(tag))
          );

    return new Set(matchingItems.flatMap((item) => item.productTags));
  }, [initialGalleryItems, selectedServices]);

  const visibleItems = shuffledItems.slice(0, visibleCount);
  const preloadItems = shuffledItems.slice(visibleCount, visibleCount + ITEMS_PER_PAGE * PRELOAD_BATCHES);
  const hasMoreItems = visibleCount < shuffledItems.length;
  const selectedCount = selectedServices.length + selectedProducts.length;
  const currentColumnCount = useMemo(() => {
    if (viewportWidth < 640) return 4;
    if (viewportWidth < 1024) return Math.min(Math.max(zoomLevel - 2, 2), 4);
    if (viewportWidth < 1280) return Math.min(Math.max(zoomLevel - 1, 4), 6);
    return zoomLevel;
  }, [viewportWidth, zoomLevel]);
  const masonryColumns = useMemo(() => {
    const columns = Array.from({ length: currentColumnCount }, () => ({
      height: 0,
      items: [] as DisplayGalleryItem[],
    }));

    visibleItems.forEach((item) => {
      const targetColumn = columns.reduce((bestIndex, column, index, allColumns) =>
        column.height < allColumns[bestIndex].height ? index : bestIndex, 0);

      columns[targetColumn].items.push(item);
      columns[targetColumn].height += SIZE_WEIGHTS[item.sizeVariant] ?? 1;
    });

    return columns.map((column) => column.items);
  }, [currentColumnCount, visibleItems]);

  const toggleSelection = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + visibleItems.length) % visibleItems.length : null
    );
  const nextImage = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % visibleItems.length : null
    );

  useEffect(() => {
    previousPositionsRef.current = new Map(
      visibleItems.map((item) => {
        const element = itemRefs.current.get(item.id);
        return [item.id, element?.getBoundingClientRect() ?? new DOMRect()];
      })
    );

    setShuffledItems(shuffleItems(filteredItems));
    setVisibleCount(ITEMS_PER_PAGE);
    setLightboxIndex(null);
  }, [filteredItems, zoomLevel]);

  useEffect(() => {
    lastSelectionAtRef.current = Date.now();
  }, [selectedProducts, selectedServices]);

  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };

    updateViewportWidth();
    window.addEventListener('resize', updateViewportWidth);

    return () => window.removeEventListener('resize', updateViewportWidth);
  }, []);

  useEffect(() => {
    if (!gallerySectionRef.current) return;

    const headerOffset = isFullscreenMode ? 0 : 64;
    const galleryTop = gallerySectionRef.current.offsetTop - headerOffset;

    if (window.scrollY > galleryTop + 24) {
      window.scrollTo({ top: Math.max(galleryTop, 0), behavior: 'smooth' });
    }
  }, [selectedProducts, selectedServices, isFullscreenMode]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const headerOffset = isFullscreenMode ? 0 : 64;

    const snapToFilters = () => {
      if (!filterBarRef.current) return;
      isSnappingRef.current = true;
      const filterTop = filterBarRef.current.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(filterTop, 0), behavior: 'smooth' });

      window.setTimeout(() => {
        isSnappingRef.current = false;
      }, 500);
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY <= 0 || isSnappingRef.current || !filterBarRef.current) return;

      const triggerPoint = filterBarRef.current.offsetTop - headerOffset - 24;
      if (window.scrollY < triggerPoint) {
        event.preventDefault();
        snapToFilters();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isFullscreenMode]);

  useEffect(() => {
    const hasActiveFilters =
      selectedServices.length > 0 || selectedProducts.length > 0;

    if (!hasActiveFilters || !isFilterOpen) return;

    const collapseOnScrollIntent = (event: WheelEvent | TouchEvent) => {
      if (Date.now() - lastSelectionAtRef.current < 450) return;
      if (dropdownRef.current?.contains(event.target as Node)) return;
      setIsFilterOpen(false);
    };

    window.addEventListener('wheel', collapseOnScrollIntent, { passive: true });
    window.addEventListener('touchmove', collapseOnScrollIntent, { passive: true });

    return () => {
      window.removeEventListener('wheel', collapseOnScrollIntent);
      window.removeEventListener('touchmove', collapseOnScrollIntent);
    };
  }, [isFilterOpen, selectedProducts.length, selectedServices.length]);

  useLayoutEffect(() => {
    const previousPositions = previousPositionsRef.current;
    if (!previousPositions) return;

    visibleItems.forEach((item) => {
      const element = itemRefs.current.get(item.id);
      const previousRect = previousPositions.get(item.id);
      if (!element || !previousRect) return;

      const nextRect = element.getBoundingClientRect();
      const deltaX = previousRect.left - nextRect.left;
      const deltaY = previousRect.top - nextRect.top;

      element.animate(
        [
          {
            transform: `translate(${deltaX}px, ${deltaY}px) scale(0.98)`,
            opacity: 0.72
          },
          {
            transform: 'translate(0px, 0px) scale(1)',
            opacity: 1
          }
        ],
        {
          duration: isFullscreenMode ? 2200 : 1250,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
        }
      );
    });

    previousPositionsRef.current = null;
  }, [visibleItems, currentColumnCount, isFullscreenMode]);

  return (
    <div className="min-h-screen bg-background">
      {!isFullscreenMode && <Header />}
      <main className={isFullscreenMode ? 'pt-0' : 'pt-16'}>
        {!isFullscreenMode && (
          <PageHero
            title="Our Gallery"
            subtitle="A showcase of our finest work from large format prints to custom signage and vehicle wraps across the Maldives."
          />
        )}

        <section
          ref={gallerySectionRef}
          className={isFullscreenMode ? 'pt-4 pb-8' : 'pt-8 pb-16'}>
          <div
            ref={filterBarRef}
            className={`sticky z-30 border-b border-border/50 bg-background ${
              isFullscreenMode ? 'top-0' : 'top-16'
            }`}>
            <AnimatedSection
              animation="fade-up"
              className={isFullscreenMode ? 'px-4 py-4' : 'container mx-auto px-4 py-5'}>
              <div
                ref={dropdownRef}
                className={`mx-auto overflow-hidden rounded-[1.6rem] border border-border bg-card shadow-sm transition-all sm:rounded-[2rem] ${
                  isFullscreenMode ? 'max-w-none duration-700' : 'max-w-7xl duration-300'
                } ${isFilterOpen ? 'pb-4' : ''}`}>
                <div
                  className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-3 ${
                    isFullscreenMode ? 'min-h-12 px-4 py-2.5' : 'min-h-14 px-4 py-3 sm:px-5'
                  }`}>
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen((current) => !current)}
                    className="min-w-0 flex-1 text-left transition-colors hover:text-primary">
                    <p className={`${isFullscreenMode ? 'text-[10px]' : 'text-[11px]'} uppercase tracking-[0.24em] text-primary/70`}>
                      Filter Gallery
                    </p>
                    <p className={`${isFullscreenMode ? 'text-xs' : 'text-sm'} truncate text-foreground`}>
                      {selectedCount === 0
                        ? 'Choose services and products'
                        : `${selectedServices.length} service${selectedServices.length === 1 ? '' : 's'} and ${selectedProducts.length} product${selectedProducts.length === 1 ? '' : 's'} selected`}
                    </p>
                  </button>
                  <div className="ml-auto flex items-center gap-2 sm:gap-3">
                    {!isFullscreenMode && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setIsFullscreenMode(true);
                          setIsFilterOpen(false);
                        }}
                        className="hidden items-center gap-2 rounded-full border border-primary/35 bg-gradient-to-r from-primary to-secondary px-3 py-1.5 text-[11px] font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:inline-flex">
                        <Icon name="ArrowsPointingOutIcon" size={14} />
                        <span>Full Screen</span>
                      </button>
                    )}
                    {isFullscreenMode && (
                      <div className="hidden items-center gap-2 rounded-full border border-border bg-background px-2 py-1 sm:flex">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setZoomLevel((current) => Math.min(8, current + 1));
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface"
                          aria-label="Make gallery images smaller">
                          <Icon name="MinusIcon" size={16} />
                        </button>
                        <span className="min-w-10 text-center text-[11px] font-medium text-muted-foreground">
                          Zoom
                        </span>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setZoomLevel((current) => Math.max(3, current - 1));
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface"
                          aria-label="Make gallery images larger">
                          <Icon name="PlusIcon" size={16} />
                        </button>
                      </div>
                    )}
                    {selectedCount > 0 && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedServices([]);
                          setSelectedProducts([]);
                        }}
                        className="rounded-full border border-border px-2.5 py-1 text-[10px] font-medium text-foreground transition-colors hover:border-primary hover:text-primary sm:text-[11px]">
                        Clear All Filters
                      </button>
                    )}
                    {isFullscreenMode && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setIsFullscreenMode(false);
                          setIsFilterOpen(false);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
                        aria-label="Exit full screen gallery">
                        <Icon name="XMarkIcon" size={14} />
                      </button>
                    )}
                    <Icon
                      name="ChevronDownIcon"
                      size={18}
                      className={`text-muted-foreground transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>

                <div
                  className={`grid transition-all ${isFullscreenMode ? 'duration-700' : 'duration-300'} ease-out ${isFilterOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="p-4 md:p-5">
                      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-start">
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {serviceOptions
                              .filter((service) => availableServices.has(service) || selectedServices.includes(service))
                              .map((service) => {
                              const isActive = selectedServices.includes(service);
                              const isAvailable = availableServices.has(service);

                              return (
                                <button
                                  key={service}
                                  onClick={() => toggleSelection(service, setSelectedServices)}
                                  className={`rounded-full border px-3 py-2 text-sm transition-all ${
                                    isActive
                                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                      : isAvailable
                                        ? 'border-border bg-background text-foreground hover:border-primary/50 hover:text-primary'
                                        : 'border-border/70 bg-background text-muted-foreground opacity-45'
                                  }`}>
                                  {service}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="hidden h-full w-px bg-border/70 md:block" />

                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {productOptions
                              .filter((product) => availableProducts.has(product) || selectedProducts.includes(product))
                              .map((product) => {
                              const isActive = selectedProducts.includes(product);
                              const isAvailable = availableProducts.has(product);

                              return (
                                <button
                                  key={product}
                                  onClick={() => toggleSelection(product, setSelectedProducts)}
                                  className={`rounded-full border px-3 py-2 text-sm transition-all ${
                                    isActive
                                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                      : isAvailable
                                        ? 'border-border bg-background text-foreground hover:border-primary/50 hover:text-primary'
                                        : 'border-border/70 bg-background text-muted-foreground opacity-45'
                                  }`}>
                                  {product}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <div className={isFullscreenMode ? 'px-4 pt-4' : 'container mx-auto px-4 pt-8'}>
            {preloadItems.length > 0 && (
              <div aria-hidden="true" className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">
                {preloadItems.map((item) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={`preload-${item.id}`} src={getGalleryThumbnailSrc(item.src)} alt="" loading="eager" decoding="async" />
                ))}
              </div>
            )}
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${currentColumnCount}, minmax(0, 1fr))`,
              }}>
              {masonryColumns.map((column, columnIndex) => (
                <div key={`column-${columnIndex}`} className="space-y-4">
                  {column.map((item) => {
                    const idx = visibleItems.findIndex((entry) => entry.id === item.id);

                    return (
                      <div
                        key={`${item.id}-${item.sizeVariant}`}
                        ref={(node) => {
                          if (node) {
                            itemRefs.current.set(item.id, node);
                          } else {
                            itemRefs.current.delete(item.id);
                          }
                        }}
                        className="group cursor-pointer"
                        onClick={() => openLightbox(idx)}
                        style={{ opacity: 0, animation: `fadeInUp 0.5s ease forwards ${idx * 35}ms` }}>
                        <div className={`relative overflow-hidden rounded-[1.4rem] ${item.sizeVariant}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getGalleryThumbnailSrc(item.src)}
                            alt={item.alt}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {visibleItems.length === 0 && (
              <div className="py-16 text-center">
                <h3 className="mb-2 text-xl font-semibold text-foreground">No images found</h3>
                <p className="text-sm text-muted-foreground">Try a different combination of services and products.</p>
              </div>
            )}

            {hasMoreItems && (
              <div className="pt-10 text-center">
                <button
                  onClick={() => setVisibleCount((current) => current + ITEMS_PER_PAGE)}
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform duration-200 hover:-translate-y-0.5">
                  Load More
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {lightboxIndex !== null && visibleItems[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}>
          <button
            className="absolute top-4 right-4 text-white transition-colors hover:text-primary"
            onClick={closeLightbox}
            aria-label="Close lightbox">
            <Icon name="XMarkIcon" size={32} />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white transition-colors hover:text-primary"
            onClick={(event) => {
              event.stopPropagation();
              prevImage();
            }}
            aria-label="Previous image">
            <Icon name="ChevronLeftIcon" size={40} />
          </button>
          <div className="relative max-w-4xl max-h-[80vh] w-full" onClick={(event) => event.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={visibleItems[lightboxIndex].src}
              alt={visibleItems[lightboxIndex].alt}
              loading="eager"
              decoding="async"
              className="max-h-[80vh] w-full rounded-lg object-contain"
            />
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white transition-colors hover:text-primary"
            onClick={(event) => {
              event.stopPropagation();
              nextImage();
            }}
            aria-label="Next image">
            <Icon name="ChevronRightIcon" size={40} />
          </button>
        </div>
      )}

      {!isFullscreenMode && <Footer />}
    </div>
  );
}
