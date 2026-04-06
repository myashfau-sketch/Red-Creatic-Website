import type { Metadata } from 'next';
import Header from '../../components/common/Header';
import PortfolioGrid from './components/PortfolioGrid';
import Footer from '../homepage/components/Footer';
import { PageHero } from '../../components/common/AnimatedSection';

export const metadata: Metadata = {
  title: 'Portfolio - Red Creatic Maldives',
  description: 'Explore our portfolio of professional printing and signage projects for Maldivian businesses including resorts, restaurants, and retail stores. View case studies, client success stories, and before/after transformations.'
};

interface Project {
  id: number;
  title: string;
  client: string;
  category: string;
  industry: string;
  image: string;
  alt: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  specifications: {
    materials: string;
    dimensions: string;
    process: string;
    turnaround: string;
  };
  beforeImage?: string;
  beforeAlt?: string;
  afterImage?: string;
  afterAlt?: string;
  testimonial?: {
    quote: string;
    author: string;
    position: string;
  };
}

export default function PortfolioPage() {
  const projects: Project[] = [
  {
    id: 1,
    title: "Luxury Resort Wayfinding System",
    client: "Paradise Island Resort & Spa",
    category: "Signage",
    industry: "Resorts",
    image: "https://images.unsplash.com/photo-1494339378762-75c1bff8a130",
    alt: "Modern wayfinding signage system with white lettering on dark wood panels at luxury resort entrance",
    description: "Comprehensive wayfinding and directional signage system for a 5-star resort spanning 15 acres with multiple facilities, restaurants, and guest areas.",
    challenge: "The resort needed a cohesive signage system that would guide guests seamlessly while maintaining the luxury aesthetic and withstanding harsh tropical weather conditions including salt air and intense UV exposure.",
    solution: "We designed and installed a complete wayfinding system using marine-grade aluminum with UV-resistant vinyl graphics and protective lamination. The design incorporated the resort's brand colors and tropical motifs while ensuring maximum visibility and durability.",
    results: [
    "Reduced guest inquiries to reception by 45% within first month",
    "Improved guest satisfaction scores related to navigation by 38%",
    "Zero maintenance required in first 18 months despite harsh weather",
    "Enhanced brand consistency across all resort touchpoints"],

    specifications: {
      materials: "Marine-grade aluminum, UV-resistant vinyl, protective lamination",
      dimensions: "Various sizes from 30cm x 40cm to 120cm x 180cm",
      process: "Digital printing, precision cutting, professional installation",
      turnaround: "3 weeks design + 2 weeks production + 1 week installation"
    },
    beforeImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1af1aa661-1767542865728.png",
    beforeAlt: "Plain resort pathway without directional signage showing confused guests",
    afterImage: "https://images.unsplash.com/photo-1701891221354-acfb5d221451",
    afterAlt: "Modern wayfinding signage system with clear directional signs at resort pathway",
    testimonial: {
      quote: "Red Creatic transformed our guest experience. The new signage system is not only beautiful but incredibly functional. Our guests can now navigate the resort effortlessly, and the signs have held up perfectly despite the challenging coastal environment.",
      author: "Ahmed Rasheed",
      position: "General Manager, Paradise Island Resort & Spa"
    }
  },
  {
    id: 2,
    title: "Restaurant Menu Board System",
    client: "Ocean Breeze Café",
    category: "Printing",
    industry: "Restaurants",
    image: "https://images.unsplash.com/photo-1567155769279-b1c37c90975c",
    alt: "Illuminated restaurant menu board with vibrant food photography and clear pricing displayed on wall",
    description: "Custom-designed illuminated menu boards featuring high-quality food photography and clear pricing structure for a popular beachfront café.",
    challenge: "The café needed menu boards that would be easily readable in varying light conditions, from bright midday sun to evening ambiance, while showcasing their dishes in an appetizing way that would drive sales.",
    solution: "We created backlit LED menu boards with high-resolution food photography, strategic layout design for easy scanning, and weather-resistant materials suitable for the semi-outdoor dining area. The modular design allows for easy menu updates.",
    results: [
    "Increased average order value by 23% through strategic item placement",
    "Reduced order time by 30% due to improved menu clarity",
    "Enhanced perceived quality of establishment",
    "Easy seasonal menu updates without full replacement"],

    specifications: {
      materials: "Aluminum frame, LED backlighting, weather-resistant acrylic panels",
      dimensions: "180cm x 120cm main boards, 60cm x 80cm supplementary boards",
      process: "Professional food photography, graphic design, large format printing",
      turnaround: "1 week photography + 1 week design + 5 days production"
    },
    testimonial: {
      quote: "The new menu boards have been a game-changer for our business. Customers can see exactly what they're ordering, and the professional presentation has elevated our brand image. Sales of featured items increased immediately after installation.",
      author: "Mariyam Hassan",
      position: "Owner, Ocean Breeze Café"
    }
  },
  {
    id: 3,
    title: "Retail Store Branding Package",
    client: "Island Fashion Boutique",
    category: "Branding",
    industry: "Retail Stores",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_18ee94cf0-1768855842453.png",
    alt: "Modern retail store interior with branded signage, window graphics, and promotional displays",
    description: "Complete branding package including storefront signage, window graphics, interior displays, and promotional materials for a fashion boutique launch.",
    challenge: "A new boutique needed to establish strong brand presence in a competitive retail area, create visual appeal to attract foot traffic, and maintain brand consistency across all customer touchpoints from storefront to shopping bags.",
    solution: "We developed a cohesive visual identity system featuring elegant storefront signage with dimensional lettering, frosted window graphics for privacy while maintaining light, interior wayfinding, and a complete suite of branded materials including shopping bags, tags, and promotional signage.",
    results: [
    "Achieved 40% higher foot traffic than projected in first month",
    "Strong brand recognition within local market in 6 weeks",
    "Increased social media engagement through Instagram-worthy store design",
    "Consistent brand experience across all customer touchpoints"],

    specifications: {
      materials: "3D acrylic letters, frosted vinyl, premium paper stock, fabric banners",
      dimensions: "Storefront sign 300cm x 60cm, various interior elements",
      process: "Brand development, 3D fabrication, vinyl application, offset printing",
      turnaround: "2 weeks design + 3 weeks production + 3 days installation"
    },
    beforeImage: "https://img.rocket.new/generatedImages/rocket_gen_img_11d1ee1c6-1766503741343.png",
    beforeAlt: "Plain retail storefront with minimal signage and no branding elements",
    afterImage: "https://img.rocket.new/generatedImages/rocket_gen_img_12be18c47-1769725864128.png",
    afterAlt: "Branded retail store with elegant signage, window graphics, and cohesive visual identity",
    testimonial: {
      quote: "Red Creatic didn't just create signs; they brought our brand vision to life. Every element works together perfectly, and customers constantly compliment the store's appearance. The investment has paid for itself through increased sales.",
      author: "Aishath Mohamed",
      position: "Founder, Island Fashion Boutique"
    }
  },
  {
    id: 4,
    title: "Corporate Office Interior Graphics",
    client: "Maldives Tech Solutions",
    category: "Signage",
    industry: "Corporate",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_14ac9ef5c-1768540885715.png",
    alt: "Modern office interior with branded wall graphics, motivational quotes, and company values displayed",
    description: "Interior branding and environmental graphics for a technology company's new office space, including wall murals, glass manifestations, and wayfinding elements.",
    challenge: "The company wanted to create an inspiring work environment that reflected their innovative culture, improved wayfinding in an open-plan office, and reinforced brand values for employees and visitors.",
    solution: "We designed and installed a comprehensive interior graphics system featuring large-scale wall murals with company values, frosted glass manifestations for meeting rooms with creative naming, directional floor graphics, and motivational typography throughout the space.",
    results: [
    "Improved employee satisfaction scores by 32%",
    "Enhanced company culture and brand alignment",
    "Reduced visitor confusion in open office layout",
    "Created Instagram-worthy spaces increasing social media presence"],

    specifications: {
      materials: "Wall vinyl, frosted glass film, floor graphics with anti-slip coating",
      dimensions: "Wall murals up to 400cm x 250cm, various smaller elements",
      process: "Custom illustration, large format printing, professional installation",
      turnaround: "2 weeks design + 1 week production + 2 days installation"
    }
  },
  {
    id: 5,
    title: "Event Branding & Signage",
    client: "Maldives Tourism Expo 2025",
    category: "Branding",
    industry: "Events",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_132f0189e-1767948794614.png",
    alt: "Large exhibition hall with branded banners, directional signage, and booth graphics for tourism expo",
    description: "Complete event branding package for a major tourism industry expo including entrance signage, directional wayfinding, booth graphics, and promotional materials.",
    challenge: "A large-scale event needed cohesive branding across a 5,000 square meter venue with multiple zones, clear wayfinding for 2,000+ attendees, and materials that could be set up quickly and withstand 3-day event duration.",
    solution: "We created a modular signage system with retractable banners, hanging directional signs, floor graphics, and booth branding that could be installed in 24 hours. The design used bold colors and clear typography for maximum visibility in crowded spaces.",
    results: [
    "Zero wayfinding complaints from attendees",
    "Setup completed 4 hours ahead of schedule",
    "Strong brand recognition throughout event",
    "Materials successfully reused for following year's event"],

    specifications: {
      materials: "Retractable banner stands, fabric printing, floor vinyl, foam board",
      dimensions: "Banners 200cm x 85cm, hanging signs 150cm x 100cm, various sizes",
      process: "Event branding design, large format printing, modular installation system",
      turnaround: "1 week design + 1 week production + 1 day installation"
    }
  },
  {
    id: 6,
    title: "Vehicle Fleet Branding",
    client: "Island Express Delivery",
    category: "Branding",
    industry: "Transportation",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1dc110937-1766503737898.png",
    alt: "White delivery van with vibrant company branding, logo, and contact information wrapped on exterior",
    description: "Full vehicle wrap design and installation for a delivery company's fleet of 8 vans, creating mobile advertising and professional brand presence.",
    challenge: "A growing delivery company needed to increase brand visibility across the islands, create professional appearance for customer trust, and maximize advertising impact from their vehicle fleet.",
    solution: "We designed eye-catching vehicle wraps featuring bold company branding, clear contact information, and service highlights. The design was optimized for visibility from distance and included reflective elements for night-time safety and visibility.",
    results: [
    "Estimated 50,000+ daily impressions across fleet",
    "Increased service inquiries by 28% attributed to vehicle visibility",
    "Enhanced professional image and customer trust",
    "Wraps maintained excellent condition after 18 months"],

    specifications: {
      materials: "Premium cast vinyl, reflective elements, protective lamination",
      dimensions: "Full vehicle wraps for standard cargo vans",
      process: "3D vehicle template design, precision printing, professional installation",
      turnaround: "1 week design + 3 days production per vehicle + 1 day installation per vehicle"
    }
  },
  {
    id: 7,
    title: "Hotel Room Signage System",
    client: "Coral Bay Hotel",
    category: "Signage",
    industry: "Resorts",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ccb4dbce-1774955222221.png",
    alt: "Elegant hotel room door with brushed metal room number plate and do not disturb sign",
    description: "Elegant room numbering system and in-room informational signage for a 120-room hotel, combining functionality with luxury aesthetics.",
    challenge: "The hotel needed a room signage system that would be easy for guests to navigate, match the luxury interior design, withstand constant use, and provide clear information without cluttering the elegant aesthetic.",
    solution: "We created a sophisticated signage system using brushed stainless steel room number plates with raised lettering, coordinating door hangers, and in-room informational signage with consistent design language. All materials were selected for durability and easy maintenance.",
    results: [
    "Reduced guest room-finding time by 40%",
    "Zero signage maintenance required in first year",
    "Enhanced perceived luxury and attention to detail",
    "Positive guest feedback on design aesthetics"],

    specifications: {
      materials: "Brushed stainless steel, laser engraving, premium cardstock",
      dimensions: "Room plates 15cm x 8cm, door hangers 20cm x 8cm",
      process: "Laser cutting, engraving, offset printing, quality finishing",
      turnaround: "1 week design + 2 weeks production + 3 days installation"
    }
  },
  {
    id: 8,
    title: "Restaurant Window Graphics",
    client: "Sunset Grill & Bar",
    category: "Printing",
    industry: "Restaurants",
    image: "https://images.unsplash.com/photo-1599723352789-9992d4675acd",
    alt: "Restaurant storefront with frosted window graphics showing menu highlights and operating hours",
    description: "Custom window graphics featuring menu highlights, operating hours, and promotional messaging for a beachfront restaurant with large glass frontage.",
    challenge: "The restaurant had extensive glass frontage that needed to provide some privacy for diners while maintaining ocean views, communicate key information to passersby, and create visual interest to attract customers.",
    solution: "We designed partial frosted window graphics that maintained 60% transparency for views while featuring elegant typography for menu highlights and operating information. The design incorporated tropical elements that complemented the beachfront location.",
    results: [
    "Increased walk-in customers by 35%",
    "Reduced glare and heat while maintaining views",
    "Clear communication of offerings to potential customers",
    "Enhanced street presence and brand visibility"],

    specifications: {
      materials: "Perforated window vinyl, frosted vinyl, UV-resistant inks",
      dimensions: "Total coverage 800cm x 250cm across multiple windows",
      process: "Custom design, large format printing, precision installation",
      turnaround: "5 days design + 3 days production + 1 day installation"
    }
  },
  {
    id: 9,
    title: "Retail Point of Sale Displays",
    client: "Island Souvenirs & Gifts",
    category: "Printing",
    industry: "Retail Stores",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_19c867d53-1764694897962.png",
    alt: "Colorful retail display stands with product information and promotional pricing at store checkout",
    description: "Custom point-of-sale displays and promotional signage for a souvenir shop, designed to maximize impulse purchases and highlight featured products.",
    challenge: "The store needed to increase impulse purchases at checkout, highlight seasonal promotions, and create organized product displays in limited counter space without appearing cluttered.",
    solution: "We designed a modular display system with tiered acrylic stands, hanging promotional signs, and counter cards that could be easily updated. The design used vibrant colors and clear pricing to encourage purchases while maintaining organized appearance.",
    results: [
    "Increased checkout area sales by 42%",
    "Improved product visibility and organization",
    "Easy seasonal updates without full replacement",
    "Enhanced professional appearance of retail space"],

    specifications: {
      materials: "Clear acrylic, foam board, premium cardstock",
      dimensions: "Various sizes from 10cm x 15cm cards to 40cm x 30cm displays",
      process: "Die-cutting, digital printing, acrylic fabrication",
      turnaround: "3 days design + 5 days production"
    }
  },
  {
    id: 10,
    title: "Marina Directional Signage",
    client: "Maldives Marina & Yacht Club",
    category: "Signage",
    industry: "Marine",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_16c46a915-1774955221810.png",
    alt: "Marine-grade directional signage posts with multiple arrows pointing to different marina facilities",
    description: "Comprehensive directional and informational signage system for a marina facility including berth numbers, facility locations, and safety information.",
    challenge: "The marina needed a signage system that would withstand constant saltwater exposure, provide clear navigation for boat owners and visitors, meet maritime safety requirements, and maintain visibility in all weather conditions.",
    solution: "We installed marine-grade aluminum signage with corrosion-resistant coatings, reflective elements for night visibility, and clear pictograms for international understanding. The system included berth markers, directional posts, and safety information boards.",
    results: [
    "Improved navigation efficiency for marina users",
    "Met all maritime safety signage requirements",
    "Zero corrosion or deterioration after 2 years",
    "Reduced staff time spent giving directions by 50%"],

    specifications: {
      materials: "Marine-grade aluminum, reflective vinyl, anti-corrosion coating",
      dimensions: "Directional posts 200cm height, berth markers 30cm x 20cm",
      process: "Marine-grade fabrication, reflective printing, professional installation",
      turnaround: "1 week design + 2 weeks production + 1 week installation"
    }
  },
  {
    id: 11,
    title: "Spa & Wellness Center Branding",
    client: "Serenity Spa Maldives",
    category: "Branding",
    industry: "Wellness",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_13dc3af92-1768230094419.png",
    alt: "Tranquil spa entrance with elegant signage, soft lighting, and branded welcome materials",
    description: "Complete branding package for a luxury spa including entrance signage, treatment room identification, menu boards, and branded materials creating a cohesive wellness experience.",
    challenge: "The spa needed branding that would create a tranquil, luxurious atmosphere, clearly identify different treatment areas, communicate services effectively, and maintain the peaceful ambiance essential to the wellness experience.",
    solution: "We developed a serene design language using natural materials, soft colors, and elegant typography. Signage included backlit entrance features, subtle room identification, treatment menu displays, and branded robes, slippers, and amenity packaging.",
    results: [
    "Enhanced guest experience and satisfaction scores",
    "Increased treatment bookings by 25%",
    "Strong brand recognition in competitive market",
    "Cohesive luxury experience across all touchpoints"],

    specifications: {
      materials: "Natural wood, frosted acrylic, premium paper, fabric printing",
      dimensions: "Entrance sign 150cm x 40cm, room signs 20cm x 10cm, various materials",
      process: "Brand development, natural material fabrication, premium printing",
      turnaround: "2 weeks design + 3 weeks production + 2 days installation"
    }
  },
  {
    id: 12,
    title: "School Campus Wayfinding",
    client: "International School of Maldives",
    category: "Signage",
    industry: "Education",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1983109e7-1765287001874.png",
    alt: "Colorful school wayfinding signage with icons and directional arrows in bright educational environment",
    description: "Child-friendly wayfinding and identification signage for a school campus including building identification, classroom numbers, and directional elements.",
    challenge: "The school needed a signage system that would help young students navigate independently, be visually engaging and educational, withstand active school environment, and meet safety and accessibility requirements.",
    solution: "We created a colorful, icon-based wayfinding system with large, clear typography and pictograms. The design incorporated educational elements like numbers and letters, used bright colors for different zones, and included tactile elements for accessibility.",
    results: [
    "Improved student independence in navigation",
    "Reduced staff time managing student directions",
    "Enhanced learning environment with educational design",
    "Durable materials withstanding active use"],

    specifications: {
      materials: "Impact-resistant acrylic, vinyl graphics, tactile elements",
      dimensions: "Building signs 100cm x 60cm, classroom signs 30cm x 20cm",
      process: "Child-friendly design, durable printing, secure installation",
      turnaround: "1 week design + 2 weeks production + 1 week installation"
    }
  }];


  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-16">
        <PageHero
          title="Our Portfolio"
          subtitle="Explore our collection of successful printing and signage projects across the Maldives. From luxury resorts to local businesses, see how we transform visions into reality." />
        
        <div className="container mx-auto px-4 py-16">
          {/* Portfolio Grid Component */}
          <PortfolioGrid projects={projects} />
        </div>
      </main>
      <Footer />
    </>);

}