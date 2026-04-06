


interface Product {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  alt: string;
  applications: string[];
}

const FeaturedProducts = () => {
  const products: Product[] = [
    {
      id: 1,
      title: "Outdoor Banners",
      category: "Large Format",
      description: "Weather-resistant vinyl banners perfect for resort promotions, event announcements, and outdoor advertising in tropical conditions.",
      image: "https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg",
      alt: "Large colorful outdoor banner with promotional text hanging on building facade in bright sunlight",
      applications: ["Resort promotions", "Event signage", "Retail advertising"]
    },
    {
      id: 2,
      title: "Menu Boards",
      category: "Restaurant Solutions",
      description: "Elegant menu displays with easy-update systems, designed for restaurants and cafes throughout the Maldives.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      alt: "Modern restaurant interior with illuminated menu board displaying food items on dark wall",
      applications: ["Restaurant menus", "Cafe displays", "Bar signage"]
    },
    {
      id: 3,
      title: "Window Graphics",
      category: "Retail Branding",
      description: "Eye-catching window decals and graphics that transform storefronts and attract customers in high-traffic areas.",
      image: "https://images.pixabay.com/photo/2017/08/06/22/01/architecture-2596690_1280.jpg",
      alt: "Modern retail storefront with large window graphics displaying brand logo and promotional designs",
      applications: ["Store branding", "Privacy films", "Promotional displays"]
    },
    {
      id: 4,
      title: "Business Cards",
      category: "Corporate Printing",
      description: "Premium business cards with various finishes and materials that make lasting impressions for Maldivian professionals.",
      image: "https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg",
      alt: "Stack of elegant business cards with embossed logo on textured paper with gold foil accents",
      applications: ["Corporate identity", "Networking tools", "Professional branding"]
    },
    {
      id: 5,
      title: "Directional Signage",
      category: "Wayfinding",
      description: "Clear, professional directional signs for resorts, hotels, and commercial complexes with multilingual options.",
      image: "https://images.unsplash.com/photo-1555992336-fb0d29498b13",
      alt: "Modern directional signage post with multiple arrows pointing to different resort facilities on tropical beach",
      applications: ["Resort navigation", "Hotel wayfinding", "Complex directories"]
    },
    {
      id: 6,
      title: "Vehicle Wraps",
      category: "Mobile Advertising",
      description: "Full and partial vehicle wraps that turn your fleet into mobile billboards across Male and the islands.",
      image: "https://images.pixabay.com/photo/2016/11/29/03/36/auto-1867107_1280.jpg",
      alt: "White delivery van with colorful full vehicle wrap displaying company branding and contact information",
      applications: ["Fleet branding", "Mobile marketing", "Delivery vehicles"]
    }
  ];

  return (
    <></>
  );
};

export default FeaturedProducts;