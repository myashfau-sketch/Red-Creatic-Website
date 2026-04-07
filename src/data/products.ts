export interface Product {
  id: number;
  name: string;
  description: string;
  category?: string;
  mainImage: string;
  mainImageAlt: string;
  images: { src: string; alt: string }[];
}

export const fallbackProducts: Product[] = [
  {
    id: 1,
    name: 'Large Format Banner',
    description: 'High-quality large format banners perfect for outdoor advertising, events, and promotions. Vibrant colors with weather-resistant materials.',
    mainImage: 'https://img.rocket.new/generatedImages/rocket_gen_img_15cbb4785-1772723980281.png',
    mainImageAlt: 'Large format vinyl banner with bold colorful graphics displayed outdoors',
    images: [
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_15cbb4785-1772723980281.png', alt: 'Large format vinyl banner with bold colorful graphics displayed outdoors' },
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_197801a15-1773154848192.png', alt: 'Close-up of banner printing process showing vibrant ink colors' },
      { src: 'https://images.unsplash.com/photo-1535971457791-e8ef9767d1be', alt: 'Finished banner installed on building exterior' }
    ]
  },
  {
    id: 2,
    name: 'Custom Signage',
    description: 'Professionally crafted custom signs for businesses, retail stores, and offices. Available in various materials including acrylic, aluminum, and wood.',
    mainImage: 'https://images.unsplash.com/photo-1729215342347-2859bff5b3e3',
    mainImageAlt: 'Custom illuminated business sign mounted on a modern office building facade',
    images: [
      { src: 'https://images.unsplash.com/photo-1729215342347-2859bff5b3e3', alt: 'Custom illuminated business sign mounted on a modern office building facade' },
      { src: 'https://images.unsplash.com/photo-1734626317271-bdf2d1b2f27b', alt: 'Interior office signage with company logo on frosted glass wall' },
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1270c61ed-1767539988837.png', alt: 'Retail store entrance sign with custom lettering and brand colors' }
    ]
  },
  {
    id: 3,
    name: 'Vehicle Wrap',
    description: 'Full and partial vehicle wraps that transform your fleet into moving billboards. Durable vinyl with UV protection for long-lasting impact.',
    mainImage: 'https://img.rocket.new/generatedImages/rocket_gen_img_195a47ee1-1772221545458.png',
    mainImageAlt: 'White commercial van with full color brand wrap design on city street',
    images: [
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_195a47ee1-1772221545458.png', alt: 'White commercial van with full color brand wrap design on city street' },
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1b5280b50-1774849140769.png', alt: 'Close-up of vehicle wrap application process on car door panel' },
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_12072b33c-1774303292624.png', alt: 'Fleet of branded vehicles parked showing consistent wrap design' }
    ]
  },
  {
    id: 4,
    name: '3D Signage & Displays',
    description: 'Eye-catching 3D letters and displays that add depth and dimension to your brand. Ideal for reception areas, storefronts, and exhibitions.',
    mainImage: 'https://img.rocket.new/generatedImages/rocket_gen_img_15d8f7049-1766921324212.png',
    mainImageAlt: 'Three-dimensional metal letters spelling brand name mounted on white wall',
    images: [
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_15d8f7049-1766921324212.png', alt: 'Three-dimensional metal letters spelling brand name mounted on white wall' },
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1d27494d6-1774849145014.png', alt: 'Illuminated 3D acrylic sign in hotel lobby reception area' },
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_143e4ebe5-1774849138906.png', alt: 'Exhibition display with 3D branded elements and backlit panels' }
    ]
  },
  {
    id: 5,
    name: 'Menu Boards',
    description: 'Stylish and functional menu boards for restaurants, cafes, and food businesses. Available in digital-ready formats and traditional printed options.',
    mainImage: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e9fcaae8-1774007193397.png',
    mainImageAlt: 'Modern restaurant menu board with food photography and clean typography',
    images: [
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e9fcaae8-1774007193397.png', alt: 'Modern restaurant menu board with food photography and clean typography' },
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_15cf9ba40-1772058341525.png', alt: 'Cafe chalkboard style menu board with handwritten specials' },
      { src: 'https://images.unsplash.com/photo-1711695423021-60b655bd2bca', alt: 'Backlit menu board panel installed above restaurant counter' }
    ]
  },
  {
    id: 6,
    name: 'Brand Identity Design',
    description: 'Complete brand identity packages including logo design, color palettes, and brand guidelines. Build a consistent and memorable brand presence.',
    mainImage: 'https://img.rocket.new/generatedImages/rocket_gen_img_19ab3bc29-1773082716984.png',
    mainImageAlt: 'Brand identity design mockup showing logo on business cards and stationery',
    images: [
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_19ab3bc29-1773082716984.png', alt: 'Brand identity design mockup showing logo on business cards and stationery' },
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1b1f046b5-1773213748136.png', alt: 'Color palette and typography guide for brand identity system' },
      { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e7990c94-1774466494943.png', alt: 'Brand guidelines document spread showing visual identity elements' }
    ]
  }
];

export const allProducts = fallbackProducts;
