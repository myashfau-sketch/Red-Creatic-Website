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
          <h2 className="mb-3 text-2xl md:text-4xl font-bold font-headline text-center">
            Our Commitment to Excellence
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-sm text-primary-foreground/80 font-body text-center md:mb-12 md:text-lg">
            Delivering exceptional results through unwavering dedication to quality, reliability, and client success
          </p>
          
          <div className="grid grid-cols-2 gap-3 md:gap-8">
            {commitments.map((commitment) => (
              <div key={commitment.title} className="rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-primary-foreground/15 sm:p-8">
                <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="text-lg font-bold font-headline sm:text-2xl">
                    {commitment.title}
                  </h3>
                  <div className="text-left sm:text-right">
                    <div className="text-2xl font-bold font-headline text-accent sm:text-3xl">
                      {commitment.stat}
                    </div>
                    <div className="text-xs font-body text-primary-foreground/80 sm:text-sm">
                      {commitment.statLabel}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-primary-foreground/90 font-body leading-relaxed sm:text-base">
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
