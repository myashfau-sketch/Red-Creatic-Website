export interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  image: string;
  alt: string;
  rating: number;
  testimonial: string;
  project: string;
}

export const allTestimonials: Testimonial[] = [
{
  id: 2,
  name: 'Mohamed Hammad',
  position: 'Partner',
  company: 'Art & Soul',
  image: "",
  alt: 'Mohamed Hammad testimonial',
  rating: 5,
  testimonial:
    'Working with Red Creatic was a smooth and professional experience. Their creativity, attention to detail, and timely support really helped improve our branding and overall presentation. Very happy with the outcome.',
  project: 'Branding & Presentation Materials'
},
{
  id: 3,
  name: 'Adam Ali',
  position: 'Purchasing Manager',
  company: 'Hilton Maldives',
  image: "",
  alt: 'Adam Ali testimonial',
  rating: 5,
  testimonial:
    'Red has been one of our best suppliers to work with, with quick responses, good pricing, and very flexible deliveries. They are highly reliable for custom requirements such as trophies and canvas printing, with great service and smooth coordination throughout.',
  project: 'Trophies & Canvas Printing'
},
{
  id: 4,
  name: 'Akman',
  position: '',
  company: 'FC Bandidhoo',
  image: "",
  alt: 'Akman testimonial',
  rating: 5,
  testimonial:
    'Working with Red Creatic was a great experience. Their attention to detail and quality of work truly elevated our tournament presentation. We look forward to collaborating again.',
  project: 'Tournament Branding Materials'
},
{
  id: 5,
  name: 'Ali Firag',
  position: 'Founder',
  company: 'Beardeyz Travels & Tours',
  image: "",
  alt: 'Ali Firag testimonial',
  rating: 5,
  testimonial:
    'We’ve had a great experience working with Red Creatic on various projects. Their service is prompt, reliable, and professional, with competitive pricing, flexible terms, and fast turnaround—consistently delivering high-quality, creative results.',
  project: 'Travel Branding & Print Projects'
},
{
  id: 6,
  name: 'Anwar',
  position: 'Secretariat',
  company: 'Rasdhoo Council',
  image: "",
  alt: 'Anwar testimonial',
  rating: 5,
  testimonial:
    'Working with Red Creatic was a smooth and impactful experience. Their creative approach and clear understanding of our needs helped us communicate more effectively with our audience. The results were timely, professional, and exceeded expectations.',
  project: 'Council Communication Materials'
},
{
  id: 7,
  name: 'Mohamed Jinan',
  position: 'Senior Manager',
  company: 'ADK Company',
  image: "",
  alt: 'Mohamed Jinan testimonial',
  rating: 5,
  testimonial:
    'Red Creatic delivers reliable, high-quality work with strong technical expertise and professionalism. They consistently meet deadlines and stand out as an underrated provider. Highly recommended for printing, branding, and signage in the Maldives.',
  project: 'Printing, Branding & Signage'
},
];
