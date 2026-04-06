'use client';

import Icon from '../../../components/ui/AppIcon';
import FAQSection from './FAQSection';
import { useState, useEffect } from 'react';
import { PageHero } from '../../../components/common/AnimatedSection';

const SayHelloInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const contactMethods = [
    {
      icon: 'PhoneIcon',
      label: 'Phone',
      value: '+960 759-2222',
      href: 'tel:+9607592222',
      description: 'Call us during business hours'
    },
    {
      icon: 'EnvelopeIcon',
      label: 'Email',
      value: 'creatic@red.mv',
      href: 'mailto:creatic@red.mv',
      description: 'Send us an email anytime'
    },
    {
      icon: 'ChatBubbleLeftRightIcon',
      label: 'Viber / WhatsApp',
      value: '+960 759-2222',
      href: 'https://wa.me/9607592222',
      description: 'Quick response via messaging'
    },
    {
      icon: 'MapPinIcon',
      label: 'Visit Us',
      value: "Hulhumale', Maldives",
      href: '#map',
      description: 'Come visit our office'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="Let's Create Something Amazing Together"
        subtitle="Get in touch with Red Creatic - your trusted partner for printing and signage solutions in Maldives."
      />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method) => (
              <a
                key={method.label}
                href={method.href}
                className="bg-card rounded-lg shadow-card p-6 hover:shadow-interactive hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Icon
                    name={method.icon as any}
                    size={28}
                    className="text-primary group-hover:text-primary-foreground transition-colors duration-300"
                  />
                </div>
                <h3 className="font-bold font-headline text-foreground text-lg mb-2">
                  {method.label}
                </h3>
                <p className="text-primary font-body font-semibold mb-1">{method.value}</p>
                <p className="text-sm text-muted-foreground font-body">{method.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-10 gap-8">
            <div id="map" className="lg:col-span-7 bg-card rounded-lg shadow-card overflow-hidden">
              {!isHydrated ? (
                <div className="w-full h-full min-h-[450px] bg-muted animate-pulse flex items-center justify-center">
                  <Icon name="MapPinIcon" size={48} className="text-muted-foreground" />
                </div>
              ) : (
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.0769804522465!2d73.53712469999999!3d4.2052109!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b3f7effa5b44b27%3A0x33b080151ec9b87b!2sRed%20Creatic!5e0!3m2!1sen!2smv!4v1769078675868!5m2!1sen!2smv"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '450px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Red Creatic Office Location"
                />
              )}
            </div>

            <div className="lg:col-span-3 bg-card rounded-lg shadow-card p-6 flex flex-col justify-center">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="ClockIcon" size={20} className="text-primary" />
                </div>
                <h2 className="text-xl font-bold font-headline text-foreground">
                  Opening Hours
                </h2>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex flex-col py-2 border-b border-border">
                  <span className="font-semibold font-body text-foreground text-sm">Sunday - Thursday</span>
                  <span className="text-muted-foreground font-body text-sm">09:00 AM - 5:00 PM</span>
                </div>
                <div className="flex flex-col py-2 border-b border-border">
                  <span className="font-semibold font-body text-foreground text-sm">Saturday</span>
                  <span className="text-muted-foreground font-body text-sm">09:00 AM - 5:00 PM</span>
                </div>
                <div className="flex flex-col py-2">
                  <span className="font-semibold font-body text-foreground text-sm">Friday</span>
                  <span className="text-error font-body font-medium text-sm">Closed</span>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/dir//Red+Creatic,+Maldives/@4.2052109,73.5371247,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-primary-foreground font-bold font-headline text-sm rounded-lg shadow-card hover:bg-hover hover:shadow-interactive hover:-translate-y-0.5 transition-all duration-300"
              >
                <Icon name="MapIcon" size={20} />
                <span>Get Directions</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <FAQSection />
        </div>
      </section>
    </div>
  );
};

export default SayHelloInteractive;
