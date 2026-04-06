'use client';

import { useEffect, useState } from 'react';
import Icon from '../../../components/ui/AppIcon';

const LocationMap = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <div className="bg-card rounded-lg shadow-card overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
            <Icon name="MapPinIcon" size={24} className="text-primary" variant="solid" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-headline text-foreground">
              Visit Our Office
            </h2>
            <p className="text-muted-foreground font-body">Find us in the heart of Malé</p>
          </div>
        </div>
      </div>

      {/* Google Map Embed */}
      <div className="relative w-full" style={{ height: '450px' }}>
        {!isHydrated ? (
          <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
            <Icon name="MapPinIcon" size={48} className="text-muted-foreground" />
          </div>
        ) : (
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.0769804522465!2d73.53712469999999!3d4.2052109!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b3f7effa5b44b27%3A0x33b080151ec9b87b!2sRed%20Creatic!5e0!3m2!1sen!2smv!4v1774876624011!5m2!1sen!2smv"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Red Creatic Office Location"
          />
        )}
      </div>

      <div className="p-6 md:p-8 bg-surface">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <Icon name="MapPinIcon" size={20} className="text-primary mt-1" variant="solid" />
            <div>
              <h3 className="font-semibold font-headline text-foreground mb-1">Address</h3>
              <p className="text-muted-foreground font-body">Malé, Maldives</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="ClockIcon" size={20} className="text-primary mt-1" />
            <div>
              <h3 className="font-semibold font-headline text-foreground mb-1">Business Hours</h3>
              <p className="text-muted-foreground font-body">Sunday - Thursday: 9:00 AM - 5:00 PM</p>
              <p className="text-muted-foreground font-body">Saturday: 10:00 AM - 2:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;