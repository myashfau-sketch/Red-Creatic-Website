'use client';

import { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../homepage/components/Footer';
import Image from 'next/image';
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

const ProductCard = ({ product }: { product: Product }) => {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.images[activeImage].src}
          alt={product.images[activeImage].alt}
          fill
          className="object-cover transition-all duration-500"
        />
      </div>

      {product.images.length > 1 && (
        <div className="flex gap-2 px-4 pt-3">
          {product.images.map((img, idx) => (
            <button
              key={`${product.id}-${idx}`}
              onClick={() => setActiveImage(idx)}
              className={`relative h-10 w-14 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all duration-200 ${
                activeImage === idx ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              aria-label={`View image ${idx + 1} of ${product.name}`}>
              <Image src={img.src} alt={img.alt} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="p-4 pt-3">
        <h3 className="mb-1 text-lg font-bold font-headline text-foreground">{product.name}</h3>
        <p className="text-sm font-body leading-relaxed text-foreground/70">{product.description}</p>
      </div>
    </div>
  );
};

export default function ProductsPageClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    setProducts(shuffleProducts(initialProducts));
  }, [initialProducts]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <PageHero
          title="Our Products"
          subtitle="Explore our range of premium printing and signage products crafted with precision and quality for every business need."
        />

        <section className="container mx-auto px-4 py-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, idx) => (
              <AnimatedSection key={`${product.id}-${isHydrated ? idx : 'initial'}`} animation="fade-up" delay={idx * 80}>
                <ProductCard product={product} />
              </AnimatedSection>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
