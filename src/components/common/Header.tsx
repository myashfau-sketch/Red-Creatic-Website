'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Icon from '../ui/AppIcon';
import { useTheme } from '../../context/ThemeContext';
import { createSupabaseBrowserClient } from '../../lib/supabase/client';

interface HeaderProps {
  className?: string;
}

const Header = ({ className = '' }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showActiveHighlight, setShowActiveHighlight] = useState(false);
  const [disabledPages, setDisabledPages] = useState<string[]>([]);
  const { isDark, toggleTheme } = useTheme();
  const pathname = usePathname();

  const navigationItems = [
    { label: 'Our Story', href: '/our-story' },
    { label: 'What We Offer', href: '/what-we-offer' },
    { label: 'Products', href: '/products' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Projects', href: '/projects' },
    { label: 'Partnerships', href: '/partnerships' },
    { label: 'Clients', href: '/clients' },
    { label: 'Say Hello', href: '/say-hello' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowActiveHighlight(window.scrollY > 140);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadHiddenPages = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase
          .from('site_page_settings')
          .select('slug')
          .eq('is_enabled', false);

        if (!error && isMounted) {
          setDisabledPages((data ?? []).map((item) => item.slug));
        }
      } catch {
        // Keep all navigation items visible if the settings table is unavailable.
      }
    };

    loadHiddenPages();

    return () => {
      isMounted = false;
    };
  }, []);

  const isActivePage = (href: string) => pathname === href;
  const visibleNavigationItems = navigationItems.filter(
    (item) => !disabledPages.includes(item.href.replace('/', ''))
  );

  return (
    <>
      <header
        className={`site-header fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-background shadow-md dark:border-white/10 lg:bg-card lg:dark:bg-card ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16" suppressHydrationWarning>
            {/* Logo */}
            <Link href="/homepage" className="flex items-center hover:opacity-80 transition-opacity duration-300">
              <Image
                src="/assets/images/RED_CREATIC_Landscape-1769080873477.png"
                alt="Red Creatic Logo"
                width={180}
                height={60}
                className="h-12 w-auto transition-transform duration-300 hover:scale-105"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 ml-auto">
              {visibleNavigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-medium font-body rounded-md transition-all duration-300 ${
                    showActiveHighlight && isActivePage(item.href)
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-foreground hover:text-primary hover:bg-surface'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Dark Mode Toggle + Mobile Menu Button */}
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={toggleTheme}
                className="p-2 text-foreground hover:text-primary hover:bg-surface rounded-md transition-all duration-300"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <Icon name="SunIcon" size={22} />
                ) : (
                  <Icon name="MoonIcon" size={22} />
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-foreground hover:text-primary hover:bg-surface rounded-md transition-all duration-300"
                aria-label="Toggle mobile menu"
              >
                <Icon name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div
            className="site-header-menu lg:hidden border-t border-border bg-background dark:border-white/10 animate-slide-up">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-2">
              {visibleNavigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-base font-medium font-body rounded-md transition-all duration-300 ${
                    showActiveHighlight && isActivePage(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:text-primary hover:bg-surface'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/9607592222"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-success text-success-foreground rounded-full shadow-interactive flex items-center justify-center hover:scale-110 hover:shadow-modal transition-all duration-300"
        aria-label="Contact us on WhatsApp"
      >
        <Icon name="ChatBubbleLeftRightIcon" size={28} variant="solid" />
      </a>
    </>
  );
};

export default Header;
