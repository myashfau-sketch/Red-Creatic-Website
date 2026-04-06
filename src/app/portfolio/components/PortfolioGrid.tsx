'use client';

import { useState, useEffect } from 'react';
import AppImage from '../../../components/ui/AppImage';
import Icon from '../../../components/ui/AppIcon';

interface Project {
  id: number;
  title: string;
  client: string;
  category: string;
  industry: string;
  image: string;
  alt: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  specifications: {
    materials: string;
    dimensions: string;
    process: string;
    turnaround: string;
  };
  beforeImage?: string;
  beforeAlt?: string;
  afterImage?: string;
  afterAlt?: string;
  testimonial?: {
    quote: string;
    author: string;
    position: string;
  };
}

interface PortfolioGridProps {
  projects: Project[];
}

const PortfolioGrid = ({ projects }: PortfolioGridProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-surface rounded-lg h-80 animate-pulse" />
        ))}
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  const industries = ['All', ...Array.from(new Set(projects.map(p => p.industry)))];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesIndustry = selectedIndustry === 'All' || project.industry === selectedIndustry;
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesIndustry && matchesSearch;
  });

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setShowBeforeAfter(false);
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    setShowBeforeAfter(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      {/* Filters Section */}
      <div className="bg-card rounded-lg shadow-card p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="lg:col-span-1">
            <label htmlFor="search" className="block text-sm font-medium font-body text-foreground mb-2">
              Search Projects
            </label>
            <div className="relative">
              <Icon 
                name="MagnifyingGlassIcon" 
                size={20} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, client, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-body text-sm"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium font-body text-foreground mb-2">
              Project Type
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-body text-sm bg-background"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Industry Filter */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium font-body text-foreground mb-2">
              Industry
            </label>
            <select
              id="industry"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-4 py-2.5 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-body text-sm bg-background"
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedCategory !== 'All' || selectedIndustry !== 'All' || searchQuery !== '') && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm font-medium font-body text-muted-foreground">Active Filters:</span>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-body hover:bg-primary/20 transition-colors duration-300"
              >
                {selectedCategory}
                <Icon name="XMarkIcon" size={14} />
              </button>
            )}
            {selectedIndustry !== 'All' && (
              <button
                onClick={() => setSelectedIndustry('All')}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-body hover:bg-primary/20 transition-colors duration-300"
              >
                {selectedIndustry}
                <Icon name="XMarkIcon" size={14} />
              </button>
            )}
            {searchQuery !== '' && (
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-body hover:bg-primary/20 transition-colors duration-300"
              >
                "{searchQuery}"
                <Icon name="XMarkIcon" size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm font-body text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredProjects.length}</span> of <span className="font-semibold text-foreground">{projects.length}</span> projects
        </p>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => openProjectModal(project)}
              className="group bg-card rounded-lg shadow-card overflow-hidden cursor-pointer hover:shadow-interactive hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <AppImage
                  src={project.image}
                  alt={project.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold font-body rounded-full">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold font-headline text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-sm font-body text-muted-foreground mb-3">
                  Client: <span className="text-foreground font-medium">{project.client}</span>
                </p>
                <p className="text-sm font-body text-foreground line-clamp-2 mb-4">
                  {project.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-body text-muted-foreground px-2 py-1 bg-surface rounded">
                    {project.industry}
                  </span>
                  <span className="text-sm font-semibold font-body text-primary group-hover:gap-2 inline-flex items-center gap-1 transition-all duration-300">
                    View Details
                    <Icon name="ArrowRightIcon" size={16} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Icon name="FolderOpenIcon" size={64} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold font-headline text-foreground mb-2">No Projects Found</h3>
          <p className="text-sm font-body text-muted-foreground mb-6">
            Try adjusting your filters or search query to find what you're looking for.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedIndustry('All');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold font-headline text-sm rounded-md shadow-card hover:bg-hover hover:shadow-interactive transition-all duration-300"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-fade-in"
          onClick={closeProjectModal}
        >
          <div 
            className="bg-card rounded-lg shadow-modal max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold font-headline text-foreground mb-1">
                  {selectedProject.title}
                </h2>
                <p className="text-sm font-body text-muted-foreground">
                  {selectedProject.client} • {selectedProject.industry}
                </p>
              </div>
              <button
                onClick={closeProjectModal}
                className="p-2 hover:bg-surface rounded-full transition-colors duration-300"
                aria-label="Close modal"
              >
                <Icon name="XMarkIcon" size={24} className="text-foreground" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Before/After Toggle */}
              {selectedProject.beforeImage && selectedProject.afterImage && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold font-headline text-foreground">
                      Transformation Showcase
                    </h3>
                    <button
                      onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                      className="px-4 py-2 bg-primary text-primary-foreground font-semibold font-body text-sm rounded-md hover:bg-hover transition-colors duration-300"
                    >
                      {showBeforeAfter ? 'Hide' : 'Show'} Before & After
                    </button>
                  </div>
                  {showBeforeAfter && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold font-body text-muted-foreground mb-2">Before</p>
                        <div className="relative h-64 rounded-lg overflow-hidden">
                          <AppImage
                            src={selectedProject.beforeImage}
                            alt={selectedProject.beforeAlt || 'Before transformation'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold font-body text-muted-foreground mb-2">After</p>
                        <div className="relative h-64 rounded-lg overflow-hidden">
                          <AppImage
                            src={selectedProject.afterImage}
                            alt={selectedProject.afterAlt || 'After transformation'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Main Project Image */}
              <div className="relative h-96 rounded-lg overflow-hidden mb-6">
                <AppImage
                  src={selectedProject.image}
                  alt={selectedProject.alt}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Project Details */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-bold font-headline text-foreground mb-3">
                    Project Overview
                  </h3>
                  <p className="text-base font-body text-foreground leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Challenge */}
                <div>
                  <h3 className="text-lg font-bold font-headline text-foreground mb-3">
                    The Challenge
                  </h3>
                  <p className="text-base font-body text-foreground leading-relaxed">
                    {selectedProject.challenge}
                  </p>
                </div>

                {/* Solution */}
                <div>
                  <h3 className="text-lg font-bold font-headline text-foreground mb-3">
                    Our Solution
                  </h3>
                  <p className="text-base font-body text-foreground leading-relaxed">
                    {selectedProject.solution}
                  </p>
                </div>

                {/* Results */}
                <div>
                  <h3 className="text-lg font-bold font-headline text-foreground mb-3">
                    Measurable Results
                  </h3>
                  <ul className="space-y-2">
                    {selectedProject.results.map((result, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Icon name="CheckCircleIcon" size={20} className="text-success mt-0.5 flex-shrink-0" variant="solid" />
                        <span className="text-base font-body text-foreground">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical Specifications */}
                <div>
                  <h3 className="text-lg font-bold font-headline text-foreground mb-3">
                    Technical Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-surface rounded-lg p-4">
                      <p className="text-sm font-semibold font-body text-muted-foreground mb-1">Materials</p>
                      <p className="text-base font-body text-foreground">{selectedProject.specifications.materials}</p>
                    </div>
                    <div className="bg-surface rounded-lg p-4">
                      <p className="text-sm font-semibold font-body text-muted-foreground mb-1">Dimensions</p>
                      <p className="text-base font-body text-foreground">{selectedProject.specifications.dimensions}</p>
                    </div>
                    <div className="bg-surface rounded-lg p-4">
                      <p className="text-sm font-semibold font-body text-muted-foreground mb-1">Process</p>
                      <p className="text-base font-body text-foreground">{selectedProject.specifications.process}</p>
                    </div>
                    <div className="bg-surface rounded-lg p-4">
                      <p className="text-sm font-semibold font-body text-muted-foreground mb-1">Turnaround Time</p>
                      <p className="text-base font-body text-foreground">{selectedProject.specifications.turnaround}</p>
                    </div>
                  </div>
                </div>

                {/* Client Testimonial */}
                {selectedProject.testimonial && (
                  <div className="bg-primary/5 border-l-4 border-primary rounded-lg p-6">
                    <Icon name="ChatBubbleLeftRightIcon" size={32} className="text-primary mb-4" variant="solid" />
                    <p className="text-base font-body text-foreground italic mb-4">
                      "{selectedProject.testimonial.quote}"
                    </p>
                    <div>
                      <p className="text-sm font-semibold font-body text-foreground">
                        {selectedProject.testimonial.author}
                      </p>
                      <p className="text-sm font-body text-muted-foreground">
                        {selectedProject.testimonial.position}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-card border-t border-border p-6">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={closeProjectModal}
                  className="px-6 py-2.5 border border-input text-foreground font-semibold font-body text-sm rounded-md hover:bg-surface transition-colors duration-300"
                >
                  Close
                </button>
                <a
                  href="/say-hello"
                  className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold font-headline text-sm rounded-md text-center shadow-card hover:bg-hover hover:shadow-interactive transition-all duration-300"
                >
                  Start Similar Project
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioGrid;