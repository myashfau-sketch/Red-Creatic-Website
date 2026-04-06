'use client';

import { useState, useEffect } from 'react';
import Icon from '../../../components/ui/AppIcon';
import Image from 'next/image';
import { createSupabaseBrowserClient } from '../../../lib/supabase/client';

type SocialPlatform = 'facebook' | 'instagram' | 'tiktok';

const SocialIcon = ({ platform }: { platform: SocialPlatform }) => {
  switch (platform) {
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5">
          <path d="M13.5 21v-7.2h2.4l.36-2.8H13.5V9.2c0-.81.22-1.36 1.38-1.36H16.5V5.33c-.28-.04-1.24-.12-2.36-.12-2.33 0-3.92 1.42-3.92 4.04V11H7.8v2.8h2.42V21h3.28Z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="w-5 h-5">
          <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5">
          <path d="M14.56 3c.28 2.28 1.56 3.95 3.95 4.12v2.42a6.84 6.84 0 0 1-3.56-1.06v5.22c0 3.12-1.9 5.64-5.53 5.64-3 0-5.42-2.23-5.42-5.3 0-3.45 2.74-5.6 6.18-5.18v2.55c-1.86-.26-3.46.76-3.46 2.63 0 1.59 1.2 2.59 2.56 2.59 1.83 0 2.58-1.34 2.58-3V3h2.7Z" />
        </svg>
      );
    default:
      return null;
  }
};

const Footer = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentYear, setCurrentYear] = useState('2026');
  const [disabledPages, setDisabledPages] = useState<string[]>([]);

  useEffect(() => {
    setIsHydrated(true);
    setCurrentYear(new Date().getFullYear().toString());
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
        // Leave footer links visible if the settings table is unavailable.
      }
    };

    loadHiddenPages();

    return () => {
      isMounted = false;
    };
  }, []);

  const quickLinks = [
    { label: 'Home', href: '/homepage' },
    { label: 'Our Story', href: '/our-story' },
    { label: 'What We Offer', href: '/what-we-offer' },
    { label: 'Products', href: '/products' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Projects', href: '/projects' },
    { label: 'Partnerships', href: '/partnerships' },
    { label: 'Say Hello', href: '/say-hello' }
  ];

  const services = [
    'Large Format Printing',
    'Custom Signage',
    'Brand Identity Design',
    '3D Signage & Displays',
    'Vehicle Wraps',
    'Menu Boards'
  ];

  const contactInfo = [
    { icon: 'PhoneIcon', text: '+960 759-2222', href: 'tel:+9607592222' },
    { icon: 'EnvelopeIcon', text: 'creatic@red.mv', href: 'mailto:creatic@red.mv' },
    { icon: 'MapPinIcon', text: "Hulhumale', Maldives", href: '/say-hello' }
  ];

  const socialLinks = [
    { icon: 'facebook' as const, label: 'Facebook', href: 'https://www.facebook.com/red.creatic' },
    { icon: 'instagram' as const, label: 'Instagram', href: 'https://www.instagram.com/redcreatic/' },
    { icon: 'tiktok' as const, label: 'TikTok', href: 'https://www.tiktok.com/@redcreatic' }
  ];

  const visibleQuickLinks = quickLinks.filter(
    (link) => !disabledPages.includes(link.href.replace('/', ''))
  );
  const isWhatWeOfferEnabled = !disabledPages.includes('what-we-offer');

  return (
    <footer className="border-t border-black/5 bg-secondary text-secondary-foreground shadow-[0_-18px_48px_rgba(0,0,0,0.04)] dark:border-red-500/30 dark:bg-[linear-gradient(180deg,#1b0608_0%,#23080b_55%,#120304_100%)] dark:shadow-[0_-24px_64px_rgba(0,0,0,0.45)]">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center space-x-2 md:justify-start">
              <Image
                src="/assets/images/RED_CREATIC_Landscape-1769080873477.png"
                alt="Red Creatic Logo"
                width={180}
                height={60}
                className="h-12 w-auto object-contain"
                priority
              />
            </div>
            <p className="mx-auto max-w-sm text-sm opacity-80 font-body leading-relaxed md:mx-0">
              Crafted in Maldives for brands that need clear, dependable, and locally produced visual solutions.
            </p>
            {/* Social Links */}
            <div className="flex justify-center gap-3 pt-2 md:justify-start">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SocialIcon platform={social.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="hidden md:block">
            <h3 className="text-lg font-bold font-headline mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {visibleQuickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-primary font-body transition-all duration-300 inline-flex items-center gap-2 group"
                  >
                    <Icon name="ChevronRightIcon" size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          {isWhatWeOfferEnabled && (
          <div className="hidden md:block">
            <h3 className="text-lg font-bold font-headline mb-4">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="/what-we-offer"
                    className="text-sm opacity-80 hover:opacity-100 hover:text-primary font-body transition-all duration-300 inline-flex items-center gap-2 group"
                  >
                    <Icon name="CheckCircleIcon" size={14} className="text-success" variant="solid" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          )}

          {/* Contact Info */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="mb-4 text-center text-lg font-bold font-headline md:text-left">Get In Touch</h3>
            <ul className="space-y-3">
              {contactInfo.map((info) => (
                <li key={info.text}>
                  <a
                    href={info.href}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-primary font-body transition-all duration-300 inline-flex items-start gap-3 group justify-center md:justify-start text-center md:text-left w-full md:w-auto"
                  >
                    <Icon name={info.icon as any} size={18} className="mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span>{info.text}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Business Hours */}
            <div className="mt-6 hidden rounded-lg bg-white/5 p-4 md:block">
              <div className="text-sm font-semibold font-headline mb-2">Business Hours</div>
              <div className="text-xs opacity-80 font-body space-y-1">
                <div>Sunday - Thursday: 09:00 AM - 5:00 PM</div>
                <div>Saturday: 09:00 AM - 5:00 PM</div>
                <div>Friday: Closed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black/10 dark:border-red-400/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-80 font-body">
            <div>
              {isHydrated ? (
                <span>&copy; {currentYear} Red Creatic Maldives. All rights reserved.</span>
              ) : (
                <span>&copy; 2026 Red Creatic Maldives. All rights reserved.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
