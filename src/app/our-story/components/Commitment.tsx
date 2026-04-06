interface CommitmentItem {
  title: string;
  description: string;
  stat: string;
  statLabel: string;
}

interface CommitmentProps {
  className?: string;
}

const Commitment = ({ className = '' }: CommitmentProps) => {
  const commitments: CommitmentItem[] = [
    {
      title: 'Quality Guarantee',
      description: 'Every project undergoes rigorous quality control to ensure it meets our exacting standards and exceeds your expectations',
      stat: '98%',
      statLabel: 'Client Satisfaction'
    },
    {
      title: 'On-Time Delivery',
      description: 'We understand the importance of deadlines and coordinate logistics across all atolls to ensure timely project completion',
      stat: '95%',
      statLabel: 'On-Time Projects'
    },
    {
      title: 'Sustainable Practices',
      description: 'Committed to eco-friendly materials and zero-waste production processes that protect our beautiful island environment',
      stat: '100%',
      statLabel: 'Sustainable Materials'
    },
    {
      title: 'Local Partnership',
      description: 'Building long-term relationships with Maldivian businesses through personalized service and deep market understanding',
      stat: '200+',
      statLabel: 'Partnerships'
    }
  ];

  return (
    <section className={`py-16 bg-primary text-primary-foreground ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-4">
            Our Commitment to Excellence
          </h2>
          <p className="text-lg text-primary-foreground/80 font-body text-center mb-12 max-w-2xl mx-auto">
            Delivering exceptional results through unwavering dedication to quality, reliability, and client success
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {commitments.map((commitment) => (
              <div key={commitment.title} className="bg-primary-foreground/10 backdrop-blur-sm p-8 rounded-lg border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold font-headline">
                    {commitment.title}
                  </h3>
                  <div className="text-right">
                    <div className="text-3xl font-bold font-headline text-accent">
                      {commitment.stat}
                    </div>
                    <div className="text-sm font-body text-primary-foreground/80">
                      {commitment.statLabel}
                    </div>
                  </div>
                </div>
                <p className="text-primary-foreground/90 font-body leading-relaxed">
                  {commitment.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xl font-body text-primary-foreground/90 mb-6">
              Ready to experience the Red Creatic difference?
            </p>
            <a
              href="/say-hello"
              className="inline-block px-8 py-4 bg-accent text-accent-foreground font-bold font-headline text-lg rounded-lg shadow-interactive hover:bg-accent/90 hover:shadow-modal hover:-translate-y-1 transition-all duration-300"
            >
              Start Your Project Today
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Commitment;
