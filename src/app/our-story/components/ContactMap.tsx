'use client';

import { useState, useEffect } from 'react';
import Icon from '../../../components/ui/AppIcon';

interface ContactInfo {
  icon: string;
  label: string;
  value: string;
  link?: string;
}

interface ContactMapProps {
  className?: string;
}

const ContactMap = ({ className = '' }: ContactMapProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const contactInfo: ContactInfo[] = [
    {
      icon: 'PhoneIcon',
      label: 'Phone',
      value: '+960 759-2222',
      link: 'tel:+9607592222'
    },
    {
      icon: 'EnvelopeIcon',
      label: 'Email',
      value: 'creatic@red.mv',
      link: 'mailto:creatic@red.mv'
    },
    {
      icon: 'MapPinIcon',
      label: 'Address',
      value: "Hulhumale', Maldives"
    },
    {
      icon: 'ClockIcon',
      label: 'Business Hours',
      value: 'Sunday - Thursday: 09:00 AM - 5:00 PM'
    }
  ];

  if (!isHydrated) {
    return (
      <section className={`py-16 bg-surface ${className}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground text-center mb-12">
              Get In Touch
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-lg shadow-card">
                <div className="space-y-6">
                  {contactInfo.map((info) => (
                    <div key={info.label} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <div className="w-6 h-6 bg-primary rounded"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold font-headline text-muted-foreground mb-1">
                          {info.label}
                        </p>
                        <div className="text-foreground font-body space-y-1">
                          <p>{info.value}</p>
                          {info.label === 'Business Hours' ? (
                            <>
                              <p>Saturday: 09:00 AM - 5:00 PM</p>
                              <p>Friday: Closed</p>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-lg shadow-card overflow-hidden h-96">
                <div className="w-full h-full bg-muted"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 bg-surface ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground text-center mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-muted-foreground font-body text-center mb-12 max-w-2xl mx-auto">
            Visit our office or reach out through your preferred communication channel
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-lg shadow-card">
              <h3 className="text-2xl font-bold font-headline text-foreground mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name={info.icon as any} size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold font-headline text-muted-foreground mb-1">
                        {info.label}
                      </p>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-foreground font-body hover:text-primary transition-colors duration-300"
                          target={info.link.startsWith('http') ? '_blank' : undefined}
                          rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {info.value}
                        </a>
                      ) : info.label === 'Business Hours' ? (
                        <div className="text-foreground font-body space-y-1">
                          <p>{info.value}</p>
                          <p>Saturday: 09:00 AM - 5:00 PM</p>
                          <p>Friday: Closed</p>
                        </div>
                      ) : (
                        <p className="text-foreground font-body">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <h4 className="text-lg font-bold font-headline text-foreground mb-4">
                  Connect With Us
                </h4>
                <div className="flex space-x-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    aria-label="Facebook"
                  >
                    <Icon name="ShareIcon" size={20} />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    aria-label="Instagram"
                  >
                    <Icon name="CameraIcon" size={20} />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    aria-label="LinkedIn"
                  >
                    <Icon name="BriefcaseIcon" size={20} />
                  </a>
                  <a
                    href="https://wa.me/9607592222"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center hover:bg-success hover:text-success-foreground transition-all duration-300"
                    aria-label="WhatsApp"
                  >
                    <Icon name="ChatBubbleLeftRightIcon" size={20} />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-card overflow-hidden h-96 lg:h-auto">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                title="Red Creatic Office Location"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.0769804522465!2d73.53712469999999!3d4.2052109!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b3f7effa5b44b27%3A0x33b080151ec9b87b!2sRed%20Creatic!5e0!3m2!1sen!2smv!4v1774876624011!5m2!1sen!2smv"
                className="border-0"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
