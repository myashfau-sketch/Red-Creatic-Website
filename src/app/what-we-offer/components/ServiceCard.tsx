'use client';

import { useState } from 'react';
import Icon from '../../../components/ui/AppIcon';

interface ServiceCardProps {
  service: {
    id: number;
    title: string;
    description: string;
    icon: string;
    category: string;
    features: string[];
    technicalSpecs: {
      materials: string[];
      qualityStandards: string[];
    };
  };
  onOpenModal: (service: any) => void;
}

const ServiceCard = ({ service, onOpenModal }: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-card rounded-lg shadow-card hover:shadow-interactive transition-all duration-300 overflow-hidden cursor-pointer group h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenModal(service)}
    >
      <div className="p-6 flex flex-col items-center text-center flex-grow">
        {/* Centered Icon */}
        <div className={`w-16 h-16 rounded-lg bg-surface flex items-center justify-center transition-all duration-300 mb-4 ${isHovered ? 'bg-primary' : ''}`}>
          <Icon 
            name={service.icon as any} 
            size={32} 
            className={`transition-colors duration-300 ${isHovered ? 'text-primary-foreground' : 'text-primary'}`}
          />
        </div>

        {/* Category Badge */}
        <span className="text-xs font-medium font-body text-muted-foreground bg-surface px-3 py-1 rounded-full mb-4">
          {service.category}
        </span>

        {/* Centered Title */}
        <h3 className="text-xl font-bold font-headline text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
          {service.title}
        </h3>

        {/* Centered Description */}
        <p className="text-sm font-body text-muted-foreground mb-4 line-clamp-3 flex-grow">
          {service.description}
        </p>

        {/* Centered View Details */}
        <div className="flex items-center justify-center gap-2 mt-auto">
          <span className="text-sm font-medium font-body text-primary">
            View Details
          </span>
          <Icon 
            name="ArrowRightIcon" 
            size={20} 
            className={`text-primary transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
