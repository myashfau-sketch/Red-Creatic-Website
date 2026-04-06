'use client';

import { useState, useEffect } from 'react';
import Icon from '../../../components/ui/AppIcon';

interface FilterBarProps {
  categories: string[];
  industries: string[];
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  category: string;
  industry: string;
  searchQuery: string;
}

const FilterBar = ({ categories, industries, onFilterChange }: FilterBarProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: 'All Services',
    industry: 'All Industries',
    searchQuery: '',
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      onFilterChange(filters);
    }
  }, [filters, isHydrated, onFilterChange]);

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handleIndustryChange = (industry: string) => {
    setFilters(prev => ({ ...prev, industry }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'All Services',
      industry: 'All Industries',
      searchQuery: '',
    });
  };

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg shadow-card p-6 mb-8">
        <div className="h-10 bg-surface rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-card p-6 mb-8 space-y-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold font-headline text-foreground mb-2">
            Search Services
          </label>
          <div className="relative">
            <Icon name="MagnifyingGlassIcon" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by service name or description..."
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body text-sm"
            />
          </div>
        </div>

        <div className="w-full lg:w-64">
          <label className="block text-sm font-semibold font-headline text-foreground mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body text-sm bg-background"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full lg:w-64">
          <label className="block text-sm font-semibold font-headline text-foreground mb-2">
            Industry
          </label>
          <select
            value={filters.industry}
            onChange={(e) => handleIndustryChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body text-sm bg-background"
          >
            {industries.map((industry, index) => (
              <option key={`${industry}-${index}`} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(filters.category !== 'All Services' || filters.industry !== 'All Industries' || filters.searchQuery) && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {filters.category !== 'All Services' && (
              <span className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-body rounded-full flex items-center space-x-2">
                <span>{filters.category}</span>
                <button onClick={() => handleCategoryChange('All Services')} className="hover:opacity-80">
                  <Icon name="XMarkIcon" size={14} />
                </button>
              </span>
            )}
            {filters.industry !== 'All Industries' && (
              <span className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-body rounded-full flex items-center space-x-2">
                <span>{filters.industry}</span>
                <button onClick={() => handleIndustryChange('All Industries')} className="hover:opacity-80">
                  <Icon name="XMarkIcon" size={14} />
                </button>
              </span>
            )}
            {filters.searchQuery && (
              <span className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-body rounded-full flex items-center space-x-2">
                <span>Search: {filters.searchQuery}</span>
                <button onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))} className="hover:opacity-80">
                  <Icon name="XMarkIcon" size={14} />
                </button>
              </span>
            )}
          </div>
          <button
            onClick={handleClearFilters}
            className="text-sm font-medium font-body text-primary hover:text-hover transition-colors duration-300"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;