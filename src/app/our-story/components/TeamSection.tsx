import AppImage from '../../../components/ui/AppImage';

interface TeamMember {
  name: string;
  role: string;
  expertise: string;
  image: string;
  alt: string;
}

interface TeamSectionProps {
  className?: string;
}

const TeamSection = ({ className = '' }: TeamSectionProps) => {
  const teamMembers: TeamMember[] = [
    {
      name: 'Ahmed Hassan',
      role: 'Founder & CEO',
      expertise: '15+ years in printing industry, specializing in large format and signage solutions',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      alt: 'Professional headshot of Middle Eastern man in navy blue suit with confident smile in modern office'
    },
    {
      name: 'Mariyam Ali',
      role: 'Creative Director',
      expertise: 'Award-winning designer with deep understanding of Maldivian aesthetic and resort branding',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
      alt: 'Professional portrait of South Asian woman with long dark hair in elegant black blazer smiling warmly'
    },
    {
      name: 'Ibrahim Rasheed',
      role: 'Production Manager',
      expertise: 'Technical expert in digital printing technology and quality control systems',
      image: 'https://images.pixabay.com/photo/2016/11/21/12/42/beard-1845166_1280.jpg',
      alt: 'Professional headshot of Middle Eastern man with beard in gray suit with friendly expression'
    },
    {
      name: 'Aishath Mohamed',
      role: 'Client Relations Manager',
      expertise: 'Specialist in resort industry needs and island logistics coordination',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
      alt: 'Professional portrait of South Asian woman in white blouse with warm smile in bright office setting'
    }
  ];

  return (
    <section className={`py-16 bg-surface ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground text-center mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-muted-foreground font-body text-center mb-12 max-w-2xl mx-auto">
            Experienced professionals dedicated to bringing your vision to life with local expertise and global quality
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-card rounded-lg shadow-card hover:shadow-interactive transition-all duration-300 overflow-hidden group">
                <div className="relative h-64 overflow-hidden">
                  <AppImage
                    src={member.image}
                    alt={member.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold font-headline text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-semibold font-body mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    {member.expertise}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;