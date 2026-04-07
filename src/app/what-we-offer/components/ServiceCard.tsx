'use client';

import { useState } from 'react';
import Icon from '../../../components/ui/AppIcon';

interface ServiceCardProps {
  service: {
    id: number;
    title: string;
    description: string;
    icon: string;
    customIconSvg?: string;
    category: string;
    features: string[];
    technicalSpecs: {
      materials: string[];
      qualityStandards: string[];
    };
  };
  onOpenModal: (service: any) => void;
  popupEnabled?: boolean;
}

const ServiceCard = ({ service, onOpenModal, popupEnabled = true }: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-card rounded-lg shadow-card hover:shadow-interactive transition-all duration-300 overflow-hidden cursor-pointer group h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenModal(service)}
    >
      <div className="flex flex-grow flex-col items-center p-4 text-center sm:p-6">
        {/* Centered Icon */}
        <div className={`w-16 h-16 rounded-lg bg-surface flex items-center justify-center transition-all duration-300 mb-4 ${isHovered ? 'bg-primary' : ''}`}>
          <Icon 
            name={service.icon as any} 
            svgCode={service.customIconSvg}
            size={32} 
            className={`transition-colors duration-300 ${isHovered ? 'text-black dark:text-primary-foreground' : 'text-primary'}`}
          />
        </div>

        {/* Category Badge */}
        <span className="mb-3 rounded-full bg-surface px-3 py-1 text-[11px] font-medium font-body text-muted-foreground sm:mb-4 sm:text-xs">
          {service.category}
        </span>

        {/* Centered Title */}
        <h3 className="mb-2 text-[15px] font-bold font-headline text-foreground transition-colors duration-300 group-hover:text-primary sm:mb-3 sm:text-xl">
          {service.title}
        </h3>

        {/* Centered Description */}
        <p
          className="mb-3 flex-grow overflow-hidden text-xs leading-6 font-body text-muted-foreground sm:mb-4 sm:text-sm"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {service.description}
        </p>

        {/* Centered View Details */}
        <div className="flex items-center justify-center gap-2 mt-auto">
          <span className="text-sm font-medium font-body text-primary">
            {popupEnabled ? 'View Details' : 'Details Coming Soon'}
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
