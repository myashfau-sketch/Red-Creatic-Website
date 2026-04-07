export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  customIconSvg?: string;
  category: string;
  mainImageUrl?: string;
  galleryImages?: string[];
  industries: string[];
  productIdeas?: string[];
  features: string[];
  technicalSpecs: {
    materials: string[];
    qualityStandards: string[];
  };
}

export const fallbackServices: Service[] = [
  {
    id: 1,
    title: 'Laser Cutting & Engraving',
    description:
      'Precision laser cutting and engraving services for acrylic, wood, metal, and more. Perfect for custom signage, awards, and intricate designs with exceptional detail and accuracy.',
    icon: 'BoltIcon',
    category: 'Fabrication',
    industries: ['All Industries', 'Signage', 'Awards'],
    features: [
      'High-precision laser cutting up to 25mm thickness',
      'Detailed engraving on multiple materials',
      'Custom designs and patterns',
      'Fast turnaround for urgent projects',
      'CAD file support for complex designs',
      'Professional finishing options'
    ],
    technicalSpecs: {
      materials: ['Acrylic', 'Wood', 'Metal', 'Leather', 'Glass', 'Fabric'],
      qualityStandards: [
        '+/-0.1mm cutting precision',
        'Clean edges with minimal post-processing',
        'Detailed engraving up to 1200 DPI',
        'Quality inspection on every piece'
      ]
    }
  },
  {
    id: 2,
    title: 'Canvas Printing',
    description:
      'Museum-quality canvas prints for artwork, photography, and decorative displays. Ideal for resorts, offices, and homes with gallery-wrapped finishing options.',
    icon: 'PhotoIcon',
    category: 'Printing Services',
    industries: ['Resorts', 'Offices', 'Retail'],
    features: [
      'High-resolution printing up to 1440 DPI',
      'Gallery-wrapped stretcher frames',
      'UV-resistant archival inks',
      'Custom sizes available',
      'Protective coating options',
      'Ready to hang with mounting hardware'
    ],
    technicalSpecs: {
      materials: ['Premium Canvas', 'Poly-Cotton Blend', '100% Cotton Canvas'],
      qualityStandards: [
        'Fade-resistant for 75+ years',
        'Water-resistant coating available',
        'Professional stretching and framing',
        'Color accuracy guarantee'
      ]
    }
  },
  {
    id: 3,
    title: 'Digital Printing',
    description:
      'High-quality digital printing for business cards, brochures, flyers, and marketing materials. Fast, affordable, and perfect for short to medium print runs.',
    icon: 'PrinterIcon',
    category: 'Printing Services',
    industries: ['All Industries', 'Marketing', 'Corporate'],
    features: [
      'Full-color digital printing',
      'Same-day service available',
      'Variable data printing capability',
      'Multiple paper stock options',
      'Professional finishing services',
      'Low minimum order quantities'
    ],
    technicalSpecs: {
      materials: ['Art Paper', 'Matte Paper', 'Glossy Paper', 'Textured Stock', 'Recycled Paper'],
      qualityStandards: [
        'High-resolution output up to 2400 DPI',
        'Color-matched to Pantone standards',
        'Professional trimming and finishing',
        'Quality control on every order'
      ]
    }
  },
  {
    id: 4,
    title: 'Vinyl Printing',
    description:
      'Durable vinyl printing for outdoor signage, banners, vehicle graphics, and wall decals. Weather-resistant materials perfect for the Maldivian climate.',
    icon: 'RectangleStackIcon',
    category: 'Printing Services',
    industries: ['Signage', 'Retail', 'Events'],
    features: [
      'Indoor and outdoor vinyl options',
      'UV-resistant and waterproof',
      'Contour cutting for custom shapes',
      'Large format printing up to 5 meters',
      'Removable and permanent adhesive options',
      'Professional application services'
    ],
    technicalSpecs: {
      materials: ['Cast Vinyl', 'Calendered Vinyl', 'Reflective Vinyl', 'Perforated Vinyl'],
      qualityStandards: [
        '3-7 year outdoor durability',
        'Salt-water resistant adhesives',
        'UV protection for vibrant colors',
        'Bubble-free application guarantee'
      ]
    }
  },
  {
    id: 5,
    title: 'Plotting',
    description:
      'Technical plotting services for architectural drawings, engineering plans, and large-format technical documents. Precision output for professional applications.',
    icon: 'PencilSquareIcon',
    category: 'Technical Services',
    industries: ['Architecture', 'Engineering', 'Construction'],
    features: [
      'Large format plotting up to A0 size',
      'CAD file support (DWG, DXF, PDF)',
      'Black & white and color plotting',
      'Multiple paper options available',
      'Mounting and lamination services',
      'Fast turnaround for urgent projects'
    ],
    technicalSpecs: {
      materials: ['Bond Paper', 'Vellum', 'Glossy Photo Paper', 'Matte Paper'],
      qualityStandards: [
        'Precise line accuracy',
        'High-resolution output up to 2400 DPI',
        'Professional trimming',
        'Scale accuracy guaranteed'
      ]
    }
  },
  {
    id: 6,
    title: 'CNC Cutting and Routing',
    description:
      'Advanced CNC cutting and routing for wood, acrylic, aluminum, and composite materials. Create custom signage, furniture components, and intricate designs with precision.',
    icon: 'CogIcon',
    category: 'Fabrication',
    industries: ['Signage', 'Furniture', 'Architecture'],
    features: [
      '3-axis CNC routing capability',
      'Custom shapes and designs',
      'V-carving and 3D relief cutting',
      'Large bed size up to 2.4m x 1.2m',
      'CAD/CAM design support',
      'Professional edge finishing'
    ],
    technicalSpecs: {
      materials: ['Wood', 'MDF', 'Acrylic', 'Aluminum', 'PVC', 'Composite Panels'],
      qualityStandards: [
        '+/-0.05mm cutting precision',
        'Smooth edge finishing',
        'Complex 3D shapes capability',
        'Quality control inspection'
      ]
    }
  },
  {
    id: 7,
    title: '3D Printing',
    description:
      'Professional 3D printing services for prototypes, custom parts, architectural models, and unique designs. Transform your digital concepts into physical reality.',
    icon: 'CubeIcon',
    category: 'Fabrication',
    industries: ['Product Design', 'Architecture', 'Education'],
    features: [
      'FDM and resin printing technologies',
      'Multiple material options',
      'High-resolution printing',
      'Custom color matching',
      'Post-processing and finishing',
      'Design consultation available'
    ],
    technicalSpecs: {
      materials: ['PLA', 'ABS', 'PETG', 'Resin', 'Flexible Filament'],
      qualityStandards: [
        'Layer resolution up to 0.05mm',
        'Dimensional accuracy +/-0.2mm',
        'Professional finishing available',
        'Functional prototypes and display models'
      ]
    }
  },
  {
    id: 8,
    title: 'UV Printing',
    description:
      'Direct-to-substrate UV printing on rigid materials like acrylic, wood, metal, and glass. Vibrant colors with instant curing for durable, high-quality results.',
    icon: 'SparklesIcon',
    category: 'Printing Services',
    industries: ['Signage', 'Awards', 'Retail'],
    features: [
      'Print directly on rigid materials',
      'Instant UV curing for durability',
      'White ink and varnish options',
      'Textured and embossed effects',
      'Scratch and fade resistant',
      'Indoor and outdoor applications'
    ],
    technicalSpecs: {
      materials: ['Acrylic', 'Wood', 'Metal', 'Glass', 'Ceramic', 'PVC Board'],
      qualityStandards: [
        'High-resolution printing up to 1440 DPI',
        'Scratch-resistant UV-cured inks',
        'Vibrant color reproduction',
        '5+ year outdoor durability'
      ]
    }
  },
  {
    id: 9,
    title: 'Vehicle Wrapping',
    description:
      'Professional vehicle wrapping and graphics for cars, boats, and commercial vehicles. Transform your fleet into mobile advertisements with premium vinyl wraps.',
    icon: 'TruckIcon',
    category: 'Branding',
    industries: ['Transportation', 'Marketing', 'Corporate'],
    features: [
      'Full and partial vehicle wraps',
      '3M certified installation',
      'Custom design services',
      'Paint protection benefits',
      'Removal and replacement services',
      'Marine-grade materials for boats'
    ],
    technicalSpecs: {
      materials: ['3M Vinyl Wrap', 'Cast Vinyl', 'Color Change Film', 'Textured Finishes'],
      qualityStandards: [
        '3M MCS Warranty certified',
        'Salt-water resistant for marine applications',
        '5-7 year outdoor durability',
        'Professional surface preparation'
      ]
    }
  },
  {
    id: 10,
    title: 'Wood Working',
    description:
      'Custom woodworking services for signage, furniture, displays, and architectural elements. Skilled craftsmanship combined with modern fabrication techniques.',
    icon: 'WrenchScrewdriverIcon',
    category: 'Fabrication',
    industries: ['Retail', 'Resorts', 'Architecture'],
    features: [
      'Custom furniture and displays',
      'Wooden signage and lettering',
      'CNC routing and carving',
      'Traditional joinery techniques',
      'Finishing and staining services',
      'Installation support available'
    ],
    technicalSpecs: {
      materials: ['Hardwood', 'Plywood', 'MDF', 'Teak', 'Mahogany', 'Pine'],
      qualityStandards: [
        'Skilled craftsmanship',
        'Marine-grade finishes available',
        'Structural integrity guaranteed',
        'Custom designs and specifications'
      ]
    }
  },
  {
    id: 11,
    title: 'Metal Working',
    description:
      'Professional metal fabrication for signage, structural elements, and custom metalwork. Durable solutions for indoor and outdoor applications with expert welding and finishing.',
    icon: 'WrenchIcon',
    category: 'Fabrication',
    industries: ['Signage', 'Construction', 'Architecture'],
    features: [
      'Custom metal fabrication',
      'Stainless steel and aluminum work',
      'Welding and assembly services',
      'Powder coating and finishing',
      'Structural signage frames',
      'Corrosion-resistant treatments'
    ],
    technicalSpecs: {
      materials: ['Stainless Steel', 'Aluminum', 'Mild Steel', 'Brass', 'Copper'],
      qualityStandards: [
        'Professional welding and fabrication',
        'Marine-grade stainless steel options',
        'Corrosion-resistant finishes',
        'Structural engineering support'
      ]
    }
  }
];

export const services = fallbackServices;
