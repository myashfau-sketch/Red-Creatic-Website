'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../homepage/components/Footer';
import Image from 'next/image';
import Icon from '../../components/ui/AppIcon';
import { PageHero, AnimatedSection } from '../../components/common/AnimatedSection';

export interface ProjectCardItem {
  id: string;
  title: string;
  description: string;
  detailHtmlUrl?: string | null;
  customer: {
    name: string;
    business: string;
    location: string;
  };
  works: string[];
  products: string[];
  images: { src: string; alt: string }[];
}

interface ProjectsPageClientProps {
  initialProjects: ProjectCardItem[];
  productOptions: string[];
  serviceOptions: string[];
  yearOptions: string[];
  popupEnabled?: boolean;
}

const shuffleProjects = (items: ProjectCardItem[]) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
};

const ProjectCard = ({ project, onClick }: { project: ProjectCardItem; onClick: () => void }) => {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [project.id]);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-2xl bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[16/10.5] overflow-hidden">
        <Image
          src={project.images[activeImage].src}
          alt={project.images[activeImage].alt}
          fill
          className="object-contain bg-surface transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      {project.images.length > 1 && (
        <div className="hidden gap-1.5 overflow-x-auto px-3 pt-2 sm:flex">
          {project.images.map((image, index) => (
            <button
              key={`${project.id}-thumb-${index}`}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setActiveImage(index);
              }}
              className={`relative h-9 w-12 flex-shrink-0 overflow-hidden rounded-md border transition-all duration-200 ${
                activeImage === index
                  ? 'border-primary shadow-sm'
                  : 'border-border/60 opacity-70 hover:opacity-100'
              }`}
              aria-label={`View project image ${index + 1}`}
            >
              <Image src={image.src} alt={image.alt} fill className="object-contain bg-surface" />
            </button>
          ))}
        </div>
      )}
      <div className="space-y-1.5 p-3 pt-2.5">
        <h3 className="text-[15px] font-bold font-headline leading-snug text-foreground transition-colors duration-200 group-hover:text-primary">
          {project.title}
        </h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-body text-foreground/60">
          <div className="flex min-w-0 items-center gap-1.5">
            <Icon name="UserIcon" size={12} className="text-primary flex-shrink-0" />
            <span className="truncate">{project.customer.name}</span>
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <Icon name="CalendarDaysIcon" size={12} className="text-primary flex-shrink-0" />
            <span className="truncate">{project.customer.business}</span>
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <Icon name="MapPinIcon" size={12} className="text-primary flex-shrink-0" />
            <span className="truncate">{project.customer.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectModal = ({ project, onClose }: { project: ProjectCardItem; onClose: () => void }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isLoadingHtml, setIsLoadingHtml] = useState(false);
  const [htmlError, setHtmlError] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const hasHtmlDetail = Boolean(project.detailHtmlUrl);

  useEffect(() => {
    let isCancelled = false;

    const loadHtml = async () => {
      if (!project.detailHtmlUrl) {
        setHtmlContent(null);
        setHtmlError(null);
        return;
      }

      setIsLoadingHtml(true);
      setHtmlError(null);

      try {
        const response = await fetch(project.detailHtmlUrl);
        if (!response.ok) {
          throw new Error(`Failed to load HTML page (${response.status})`);
        }

        const markup = await response.text();
        const parser = new DOMParser();
        const documentNode = parser.parseFromString(markup, 'text/html');
        const removableNode = documentNode.evaluate(
          '/html/body/table/tbody/tr/td/table[16]/tbody/tr/td/table',
          documentNode,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;

        if (removableNode?.parentNode) {
          removableNode.parentNode.removeChild(removableNode);
        }

        const baseElement = documentNode.createElement('base');
        baseElement.href = project.detailHtmlUrl;

        if (documentNode.head) {
          documentNode.head.prepend(baseElement);
        } else {
          const head = documentNode.createElement('head');
          head.appendChild(baseElement);
          documentNode.documentElement?.prepend(head);
        }

        const withBaseTag = `<!DOCTYPE html>\n${documentNode.documentElement.outerHTML}`;

        if (!isCancelled) {
          setHtmlContent(withBaseTag);
        }
      } catch (error) {
        if (!isCancelled) {
          setHtmlError(error instanceof Error ? error.message : 'Failed to load project HTML.');
          setHtmlContent(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingHtml(false);
        }
      }
    };

    void loadHtml();

    return () => {
      isCancelled = true;
    };
  }, [project.detailHtmlUrl]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain touch-pan-y bg-black/75 p-2 backdrop-blur-sm md:items-center md:p-3"
      onClick={onClose}
    >
      <div
        className={`relative flex flex-col overflow-y-auto md:overflow-hidden rounded-[1.2rem] bg-card shadow-modal ${
          hasHtmlDetail
            ? 'mt-3 h-[94vh] w-[98vw] max-w-[118rem] md:mt-0 md:h-[96vh]'
            : 'mt-3 max-h-[92vh] w-full max-w-6xl md:mt-0 md:h-[72vh]'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-red-300/70 bg-primary text-white shadow-[0_14px_34px_rgba(0,0,0,0.38)] transition-all duration-200 hover:scale-105 hover:bg-red-700"
          aria-label="Close modal"
        >
          <Icon name="XMarkIcon" size={24} />
        </button>

        {hasHtmlDetail ? (
          <div
            className="grid min-h-0 flex-1 gap-0"
            style={{
              gridTemplateColumns: isSidebarCollapsed ? '56px minmax(0,1fr)' : '320px minmax(0,1fr)',
            }}
          >
            <div className="relative overflow-hidden border-r border-border bg-card">
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed((current) => !current)}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/95 text-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label={isSidebarCollapsed ? 'Open project overview' : 'Collapse project overview'}
              >
                <Icon
                  name={isSidebarCollapsed ? 'ChevronRightIcon' : 'ChevronLeftIcon'}
                  size={16}
                />
              </button>

              {isSidebarCollapsed ? (
                <div className="flex h-full items-center justify-center px-2">
                  <div className="writing-mode-vertical text-center text-[11px] uppercase tracking-[0.24em] text-primary/75 [writing-mode:vertical-rl] [transform:rotate(180deg)]">
                    Project Overview
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-y-auto p-6">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-surface">
                    <Image
                      src={project.images[activeImage].src}
                      alt={project.images[activeImage].alt}
                      fill
                      className="object-contain bg-surface"
                    />
                  </div>
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {project.images.map((img, idx) => (
                      <button
                        key={`${project.id}-${idx}`}
                        onClick={() => setActiveImage(idx)}
                        className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                          activeImage === idx
                            ? 'border-primary'
                            : 'border-transparent opacity-65 hover:opacity-100'
                        }`}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <Image src={img.src} alt={img.alt} fill className="object-contain bg-surface" />
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 space-y-5">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold font-headline text-foreground">Overview</h4>
                      <p className="whitespace-pre-line text-sm leading-7 text-foreground/70">{project.description}</p>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-semibold font-headline text-foreground">Works Done</h4>
                      <ul className="space-y-2">
                        {project.works.map((work) => (
                          <li key={work} className="flex items-center gap-2 text-sm text-foreground/70">
                            <Icon name="CheckCircleIcon" size={14} className="text-success flex-shrink-0" variant="solid" />
                            {work}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl bg-surface p-4">
                      <h4 className="mb-2 text-sm font-semibold font-headline text-foreground">Client</h4>
                      <p className="text-sm font-medium text-foreground">{project.customer.name}</p>
                      <p className="text-sm text-foreground/70">{project.customer.business}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-foreground/50">
                        <Icon name="MapPinIcon" size={12} />
                        {project.customer.location}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-full bg-background">
              {isLoadingHtml ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Loading project page...
                </div>
              ) : htmlError ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                  <p className="text-sm text-red-600 dark:text-red-300">{htmlError}</p>
                  <a
                    href={project.detailHtmlUrl!}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    Open Uploaded HTML
                  </a>
                </div>
              ) : (
                <iframe
                  srcDoc={htmlContent ?? '<p>Project detail page is empty.</p>'}
                  title={`${project.title} detail page`}
                  className="block h-full w-full border-0 bg-white"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto md:overflow-hidden p-3 md:p-5">
            <div className="grid min-h-full items-start gap-4 xl:h-full xl:min-h-0 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="hidden xl:flex h-full min-h-0 flex-col">
                <div className="sticky top-0 flex flex-col">
                  <div className="relative aspect-[1/0.9] w-full overflow-hidden rounded-[22px] border border-border/60 bg-surface">
                    <Image
                      src={project.images[activeImage].src}
                      alt={project.images[activeImage].alt}
                      fill
                      className="object-contain bg-surface"
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-5 gap-2 w-full">
                    {project.images.map((img, idx) => {
                      const isActive = idx === activeImage;

                      return (
                        <button
                          key={`${project.id}-${idx}`}
                          type="button"
                          onClick={() => setActiveImage(idx)}
                          className={`relative aspect-square overflow-hidden rounded-[12px] border transition-all duration-200 ${
                            isActive
                              ? 'border-primary ring-2 ring-primary/25'
                              : 'border-border/60 hover:border-primary/35'
                          }`}
                          aria-label={`View image ${idx + 1}`}
                        >
                          <Image src={img.src} alt={img.alt} fill className="object-contain bg-surface" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="h-full min-h-0 overflow-y-auto pr-1 md:pr-3">
                <div className="space-y-5">
                  <div className="xl:hidden rounded-[20px] border border-border/60 bg-surface p-3 sm:p-4">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] border border-border/60 bg-surface">
                      <Image
                        src={project.images[activeImage].src}
                        alt={project.images[activeImage].alt}
                        fill
                        className="object-contain bg-surface"
                      />
                    </div>
                    {project.images.length > 1 && (
                      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                        {project.images.map((img, idx) => (
                          <button
                            key={`${project.id}-mobile-${idx}`}
                            type="button"
                            onClick={() => setActiveImage(idx)}
                            className={`relative aspect-square overflow-hidden rounded-[12px] border transition-all duration-200 ${
                              idx === activeImage
                                ? 'border-primary ring-2 ring-primary/25'
                                : 'border-border/60 hover:border-primary/35'
                            }`}
                            aria-label={`View image ${idx + 1}`}
                          >
                            <Image src={img.src} alt={img.alt} fill className="object-contain bg-surface" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-[22px] border border-border/60 bg-surface p-4 md:p-5">
                    <div>
                      <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-primary/80 font-body">
                        Completed Project
                      </p>
                      <h3 className="text-xl md:text-2xl font-semibold font-body text-foreground leading-tight">
                        {project.title}
                      </h3>
                    </div>

                    <p className="mt-4 whitespace-pre-line text-sm font-body leading-6 text-foreground/78">
                      {project.description}
                    </p>

                    {project.products.length > 0 && (
                      <div className="mt-4">
                        <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-primary/80 font-body">
                          Product Outputs
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.products.map((product) => (
                            <span
                              key={product}
                              className="rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-body text-foreground"
                            >
                              {product}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-[22px] border border-border/60 bg-surface p-4 md:p-5">
                    <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-primary/80 font-body">
                      Works Done
                    </p>
                    <div className="grid gap-3">
                      {project.works.map((work, index) => (
                        <div
                          key={work}
                          className="flex items-start gap-3 rounded-[18px] border border-border/60 bg-card px-3.5 py-3"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-semibold">
                            {index + 1}
                          </span>
                          <span className="text-sm font-body leading-6 text-foreground">{work}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-[22px] border border-border/60 bg-surface p-4 md:p-5">
                      <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-primary/80 font-body">
                        Client & Location
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Icon name="UserIcon" size={16} className="text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{project.customer.name}</p>
                            <p className="text-xs text-muted-foreground">Primary contact or client name</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Icon name="MapPinIcon" size={16} className="text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{project.customer.location}</p>
                            <p className="text-xs text-muted-foreground">Project location</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-border/60 bg-surface p-4 md:p-5">
                      <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-primary/80 font-body">
                        Year Completed
                      </p>
                      <div className="rounded-[18px] border border-border/60 bg-card px-3.5 py-3">
                        <div className="flex items-start gap-3">
                          <Icon name="CalendarDaysIcon" size={16} className="text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{project.customer.business}</p>
                            <p className="text-xs text-muted-foreground">Completion year</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ProjectsPageClient({
  initialProjects,
  productOptions,
  serviceOptions,
  yearOptions,
  popupEnabled = true,
}: ProjectsPageClientProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectCardItem | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [displayProjects, setDisplayProjects] = useState<ProjectCardItem[]>(initialProjects);

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchesProducts =
        selectedProducts.length === 0 ||
        selectedProducts.some((product) => project.products.includes(product));
      const matchesServices =
        selectedServices.length === 0 ||
        selectedServices.some((service) => project.works.includes(service));

      const matchesYears =
        selectedYears.length === 0 ||
        selectedYears.some((year) => project.customer.business === year);

      return matchesProducts && matchesServices && matchesYears;
    });
  }, [initialProjects, selectedProducts, selectedServices, selectedYears]);

  useEffect(() => {
    setDisplayProjects(shuffleProjects(filteredProjects));
  }, [filteredProjects]);

  const availableProducts = useMemo(() => {
    const matchingProjects = initialProjects.filter((project) => {
      const matchesServices =
        selectedServices.length === 0 ||
        selectedServices.some((service) => project.works.includes(service));
      const matchesYears =
        selectedYears.length === 0 ||
        selectedYears.includes(project.customer.business);

      return matchesServices && matchesYears;
    });

    return new Set(matchingProjects.flatMap((project) => project.products));
  }, [initialProjects, selectedServices, selectedYears]);

  const availableServices = useMemo(() => {
    const matchingProjects = initialProjects.filter((project) => {
      const matchesProducts =
        selectedProducts.length === 0 ||
        selectedProducts.some((product) => project.products.includes(product));
      const matchesYears =
        selectedYears.length === 0 ||
        selectedYears.includes(project.customer.business);

      return matchesProducts && matchesYears;
    });

    return new Set(matchingProjects.flatMap((project) => project.works));
  }, [initialProjects, selectedProducts, selectedYears]);

  const availableYears = useMemo(() => {
    const matchingProjects = initialProjects.filter((project) => {
      const matchesProducts =
        selectedProducts.length === 0 ||
        selectedProducts.some((product) => project.products.includes(product));
      const matchesServices =
        selectedServices.length === 0 ||
        selectedServices.some((service) => project.works.includes(service));

      return matchesProducts && matchesServices;
    });

    return new Set(
      matchingProjects
        .map((project) => project.customer.business)
        .filter((value) => /^\d{4}$/.test(value))
    );
  }, [initialProjects, selectedProducts, selectedServices]);

  const toggleSelection = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const selectedCount = selectedProducts.length + selectedServices.length + selectedYears.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <PageHero
          title="Our Projects"
          subtitle="Real work, real clients. Explore our completed projects and see how we bring brands to life across the Maldives."
        />

        <section className="pb-16 pt-8">
          <div className="sticky top-16 z-30 border-b border-border/50 bg-background">
            <AnimatedSection animation="fade-up" className="container mx-auto px-4 py-5">
                <div
                  className={`mx-auto max-w-7xl overflow-hidden rounded-[1.6rem] border border-border bg-card shadow-sm transition-all duration-300 sm:rounded-[2rem] ${
                    isFilterOpen ? 'pb-4' : ''
                  }`}
                >
                <div className="flex min-h-14 flex-wrap items-center justify-between gap-x-3 gap-y-3 px-4 py-3 sm:px-5">
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen((current) => !current)}
                    className="min-w-0 flex-1 text-left transition-colors hover:text-primary"
                  >
                    <p className="text-[11px] uppercase tracking-[0.24em] text-primary/70">
                      Filter Projects
                    </p>
                    <p className="truncate text-sm text-foreground">
                      {selectedCount === 0
                        ? 'Choose products, services, and years'
                        : `${selectedProducts.length} product${selectedProducts.length === 1 ? '' : 's'}, ${selectedServices.length} service${selectedServices.length === 1 ? '' : 's'}, and ${selectedYears.length} year${selectedYears.length === 1 ? '' : 's'} selected`}
                    </p>
                  </button>
                  <div className="ml-auto flex items-center gap-2 sm:gap-3">
                    {selectedCount > 0 && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedProducts([]);
                          setSelectedServices([]);
                          setSelectedYears([]);
                        }}
                        className="rounded-full border border-border px-2.5 py-1 text-[10px] font-medium text-foreground transition-colors hover:border-primary hover:text-primary sm:text-[11px]"
                      >
                        Clear All Filters
                      </button>
                    )}
                    <Icon
                      name="ChevronDownIcon"
                      size={18}
                      className={`text-muted-foreground transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isFilterOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-4 md:p-5">
                      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-start">
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {productOptions
                              .filter((product) => availableProducts.has(product) || selectedProducts.includes(product))
                              .map((product) => {
                              const isActive = selectedProducts.includes(product);
                              const isAvailable = availableProducts.has(product);

                              return (
                                <button
                                  key={product}
                                  onClick={() => toggleSelection(product, setSelectedProducts)}
                                  className={`rounded-full border px-3 py-2 text-sm transition-all ${
                                    isActive
                                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                      : isAvailable
                                        ? 'border-border bg-background text-foreground hover:border-primary/50 hover:text-primary'
                                        : 'border-border/70 bg-background text-muted-foreground opacity-45'
                                  }`}
                                >
                                  {product}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="hidden h-full w-px bg-border/70 lg:block" />

                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {serviceOptions
                              .filter((service) => availableServices.has(service) || selectedServices.includes(service))
                              .map((service) => {
                              const isActive = selectedServices.includes(service);
                              const isAvailable = availableServices.has(service);

                              return (
                                <button
                                  key={service}
                                  onClick={() => toggleSelection(service, setSelectedServices)}
                                  className={`rounded-full border px-3 py-2 text-sm transition-all ${
                                    isActive
                                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                      : isAvailable
                                        ? 'border-border bg-background text-foreground hover:border-primary/50 hover:text-primary'
                                        : 'border-border/70 bg-background text-muted-foreground opacity-45'
                                  }`}
                                >
                                  {service}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="hidden h-full w-px bg-border/70 lg:block" />

                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {yearOptions
                              .filter((year) => availableYears.has(year) || selectedYears.includes(year))
                              .map((year) => {
                              const isActive = selectedYears.includes(year);
                              const isAvailable = availableYears.has(year);

                              return (
                                <button
                                  key={year}
                                  onClick={() => toggleSelection(year, setSelectedYears)}
                                  className={`rounded-full border px-3 py-2 text-sm transition-all ${
                                    isActive
                                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                      : isAvailable
                                        ? 'border-border bg-background text-foreground hover:border-primary/50 hover:text-primary'
                                        : 'border-border/70 bg-background text-muted-foreground opacity-45'
                                  }`}
                                >
                                  {year}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <div className="container mx-auto px-4 pt-8">
            {displayProjects.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-4">
                {displayProjects.map((project, idx) => (
                  <AnimatedSection key={project.id} animation="fade-up" delay={idx * 80}>
                    <ProjectCard project={project} onClick={() => popupEnabled && setSelectedProject(project)} />
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <h3 className="mb-2 text-xl font-semibold text-foreground">No projects found</h3>
                <p className="text-sm text-muted-foreground">Try a different combination of services and years.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {popupEnabled && selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
