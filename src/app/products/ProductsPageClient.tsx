'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../homepage/components/Footer';
import Image from 'next/image';
import Icon from '../../components/ui/AppIcon';
import { PageHero, AnimatedSection } from '../../components/common/AnimatedSection';
import type { Product } from '../../data/products';

const shuffleProducts = (items: Product[]) => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
};

const normalizeCategory = (value?: string) =>
  value
    ?.toLowerCase()
    .replace(/\s+/g, ' ')
    .trim() ?? '';

const ProductCard = ({
  product,
  onClick,
  showCategory,
}: {
  product: Product;
  onClick: () => void;
  showCategory: boolean;
}) => {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [product.id]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full overflow-hidden rounded-2xl bg-card text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.images[activeImage].src}
          alt={product.images[activeImage].alt}
          fill
          className="object-cover transition-all duration-500"
        />
      </div>

      <div className="flex flex-col items-center p-3 pt-2.5 text-center sm:p-4 sm:pt-3">
        {showCategory && product.category ? (
          <span className="mb-2 inline-flex rounded-full bg-surface px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-primary sm:text-[11px]">
            {product.category}
          </span>
        ) : null}
        <h3 className="text-[13px] font-bold font-headline text-foreground sm:text-lg">{product.name}</h3>
      </div>
    </button>
  );
};

const ProductModal = ({ product, onClose }: { product: Product; onClose: () => void }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [manualPauseUntil, setManualPauseUntil] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [product.id]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (product.images.length <= 1) return;

    const interval = window.setInterval(() => {
      if (Date.now() < manualPauseUntil) return;
      setActiveImage((current) => (current + 1) % product.images.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, [manualPauseUntil, product.id, product.images.length]);

  const showPreviousImage = () => {
    setManualPauseUntil(Date.now() + 5000);
    setActiveImage((current) => (current - 1 + product.images.length) % product.images.length);
  };

  const showNextImage = () => {
    setManualPauseUntil(Date.now() + 5000);
    setActiveImage((current) => (current + 1) % product.images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm md:items-center"
      onClick={onClose}
    >
      <div
        className="relative mt-4 w-full max-w-4xl overflow-hidden rounded-[1.4rem] bg-card shadow-modal md:mt-0"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-red-300/70 bg-primary text-white shadow-[0_14px_34px_rgba(0,0,0,0.38)] transition-all duration-200 hover:scale-105 hover:bg-red-700"
          aria-label="Close modal"
        >
          <Icon name="XMarkIcon" size={24} />
        </button>

        <div className="p-4 md:p-5">
          <div className="relative overflow-hidden rounded-[1.25rem] border border-border/60 bg-surface">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={product.images[activeImage].src}
                alt={product.images[activeImage].alt}
                fill
                className="object-contain bg-surface p-3"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPreviousImage}
                    className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white backdrop-blur-sm transition-all duration-200 hover:border-primary hover:bg-primary"
                    aria-label="Previous image"
                  >
                    <Icon name="ChevronLeftIcon" size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={showNextImage}
                    className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white backdrop-blur-sm transition-all duration-200 hover:border-primary hover:bg-primary"
                    aria-label="Next image"
                  >
                    <Icon name="ChevronRightIcon" size={18} />
                  </button>

                  <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 backdrop-blur-sm">
                    {product.images.map((image, index) => (
                      <button
                        key={`${product.id}-dot-${index}`}
                        type="button"
                        onClick={() => {
                          setManualPauseUntil(Date.now() + 5000);
                          setActiveImage(index);
                        }}
                        className={`h-2.5 rounded-full transition-all duration-200 ${
                          index === activeImage ? 'w-6 bg-primary' : 'w-2.5 bg-white/65 hover:bg-white'
                        }`}
                        aria-label={`Show slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-5 rounded-[1.25rem] border border-border/60 bg-surface p-4 md:p-5">
            <div className="flex flex-wrap items-center gap-3">
              {product.category ? (
                <span className="inline-flex rounded-full bg-card px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
                  {product.category}
                </span>
              ) : null}
              <h3 className="text-xl font-semibold leading-tight text-foreground md:text-2xl">{product.name}</h3>
            </div>
            <p className="mt-4 text-sm leading-7 text-foreground/75">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProductsPageClient({
  initialProducts,
  popupEnabled = true,
}: {
  initialProducts: Product[];
  popupEnabled?: boolean;
}) {
  const normalizedCategoryMap = useMemo(() => {
    const nextMap = new Map<string, string>();
    initialProducts.forEach((product) => {
      if (!product.category) return;
      const normalized = normalizeCategory(product.category);
      if (normalized && !nextMap.has(normalized)) {
        nextMap.set(normalized, product.category.trim());
      }
    });
    return nextMap;
  }, [initialProducts]);

  const allCategories = [
    'All',
    ...Array.from(normalizedCategoryMap.values()),
  ];
  const [activeCategory, setActiveCategory] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const filteredProducts = useMemo(
    () =>
      activeCategory === 'All'
        ? initialProducts
        : initialProducts.filter((product) => {
            const productCategory = normalizeCategory(product.category);
            const selectedCategory = normalizeCategory(activeCategory);

            return (
              productCategory === selectedCategory ||
              productCategory.includes(selectedCategory) ||
              selectedCategory.includes(productCategory)
            );
          }),
    [activeCategory, initialProducts]
  );

  useEffect(() => {
    setIsHydrated(true);
    setProducts(shuffleProducts(filteredProducts));
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <PageHero
          title="Our Products"
          subtitle="Explore our range of premium printing and signage products crafted with precision and quality for every business need."
        />

        <section className="container mx-auto px-4 py-16">
          <AnimatedSection animation="fade-up" delay={80}>
            <div className="mb-10 flex justify-center">
              <div className="relative w-full max-w-5xl">
                <button
                  type="button"
                  onClick={() => setShowFilter((prev) => !prev)}
                  className="group flex h-12 w-full items-center justify-between rounded-full border border-border/60 bg-white/70 px-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:border-primary/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] dark:border-white/10 dark:bg-black dark:text-white dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                      <Icon name="FunnelIcon" size={16} />
                    </span>
                    <span className="text-sm font-semibold tracking-[0.01em] text-foreground">
                      {activeCategory === 'All' ? 'Filter Products' : activeCategory}
                    </span>
                  </span>

                  <span className={`text-foreground/50 transition-transform duration-300 ${showFilter ? 'rotate-180' : ''}`}>
                    <Icon name="ChevronDownIcon" size={16} />
                  </span>
                </button>

                {showFilter && (
                  <div className="absolute left-0 top-14 z-30 w-full rounded-[28px] border border-white/60 bg-white/80 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.14)] backdrop-blur-2xl dark:border-white/10 dark:bg-black dark:text-white dark:shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
                    <div className="mb-4 flex items-center justify-between px-1">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Choose Category</p>
                        <p className="text-xs text-foreground/50 dark:text-muted-foreground">Browse products by category</p>
                      </div>

                      {activeCategory !== 'All' && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCategory('All');
                            setShowFilter(false);
                          }}
                          className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/15"
                        >
                          Clear Filter
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                      {allCategories.map((category) => (
                        <button
                          type="button"
                          key={category}
                          onClick={() => {
                            setActiveCategory(category);
                            setShowFilter(false);
                          }}
                          className={`rounded-2xl border px-4 py-3 text-left text-sm transition-all duration-200 ${
                            activeCategory === category
                              ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                              : 'bg-white/70 border-border/50 text-foreground/70 hover:bg-primary/5 hover:text-primary hover:border-primary/20 dark:bg-neutral-950 dark:border-white/10 dark:text-white dark:hover:bg-red-500/10 dark:hover:text-red-400 dark:hover:border-red-500/30'
                          }`}
                        >
                          <span className="block font-medium leading-snug">{category}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 gap-3 sm:gap-3 lg:grid-cols-5">
            {products.map((product, idx) => (
              <AnimatedSection key={`${product.id}-${isHydrated ? idx : 'initial'}`} animation="fade-up" delay={idx * 80} className="h-full w-full">
                <ProductCard
                  product={product}
                  onClick={() => popupEnabled && setSelectedProduct(product)}
                  showCategory={activeCategory === 'All'}
                />
              </AnimatedSection>
            ))}
          </div>

          {products.length === 0 && (
            <div className="py-16 text-center">
              <h3 className="mb-2 text-xl font-semibold text-foreground">No products found</h3>
              <p className="text-sm text-muted-foreground">Try a different category.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />

      {popupEnabled && selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}
